<?php
declare(strict_types=1);
namespace App\Core;

/**
 * Validator — التحقق من البيانات الواردة مع رسائل عربية
 */
final class Validator
{
    private array $errors = [];

    private function __construct(
        private readonly array $data,
        private readonly array $rules
    ) {}

    public static function make(array $data, array $rules): self
    {
        $instance = new self($data, $rules);
        $instance->run();
        return $instance;
    }

    private function run(): void
    {
        foreach ($this->rules as $field => $ruleStr) {
            $value = $this->data[$field] ?? null;
            $rules = array_filter(array_map('trim', explode('|', $ruleStr)));

            // فحص nullable أولاً
            $nullable = in_array('nullable', $rules, true);
            if ($nullable && ($value === null || $value === '')) continue;

            foreach ($rules as $rule) {
                if ($rule === 'nullable') continue;

                [$name, $param] = str_contains($rule, ':')
                    ? explode(':', $rule, 2)
                    : [$rule, ''];

                $error = $this->check($field, $value, $name, $param);
                if ($error !== null) {
                    $this->errors[$field][] = $error;
                    break; // أول خطأ يكفي
                }
            }
        }
    }

    private function check(string $field, mixed $value, string $rule, string $param): ?string
    {
        $label = $this->label($field);

        return match ($rule) {
            'required' => (empty($value) && $value !== '0' && $value !== 0)
                ? "حقل $label مطلوب"
                : null,

            'min' => strlen((string)$value) < (int)$param
                ? "حقل $label يجب أن يكون $param حرف على الأقل"
                : null,

            'max' => strlen((string)$value) > (int)$param
                ? "حقل $label يجب أن لا يتجاوز $param حرف"
                : null,

            'min_val' => (float)$value < (float)$param
                ? "قيمة $label يجب أن تكون $param أو أكثر"
                : null,

            'max_val' => (float)$value > (float)$param
                ? "قيمة $label يجب أن تكون $param أو أقل"
                : null,

            'email' => !filter_var($value, FILTER_VALIDATE_EMAIL)
                ? "حقل $label يجب أن يكون بريداً إلكترونياً صحيحاً"
                : null,

            'numeric' => !is_numeric($value)
                ? "حقل $label يجب أن يكون رقماً"
                : null,

            'integer' => filter_var($value, FILTER_VALIDATE_INT) === false
                ? "حقل $label يجب أن يكون عدداً صحيحاً"
                : null,

            'in' => !in_array($value, explode(',', $param), true)
                ? "قيمة $label غير مسموح بها. المقبول: $param"
                : null,

            'slug' => !preg_match('/^[a-z0-9\-\x{0600}-\x{06FF}]+$/u', (string)$value)
                ? "حقل $label يجب أن يحتوي على أحرف وأرقام وشرطات فقط"
                : null,

            'url' => !filter_var($value, FILTER_VALIDATE_URL)
                ? "حقل $label يجب أن يكون رابطاً صحيحاً (يبدأ بـ http أو https)"
                : null,

            'phone' => !preg_match('/^[\d\+\-\s]{8,20}$/', (string)$value)
                ? "حقل $label يجب أن يكون رقم هاتف صحيح"
                : null,

            'confirmed' => ($value !== ($this->data[$field . '_confirmation'] ?? null))
                ? "حقل $label لا يتطابق مع حقل التأكيد"
                : null,

            default => null,
        };
    }

    private function label(string $field): string
    {
        return match($field) {
            'title'             => 'العنوان',
            'slug'              => 'الرابط',
            'name'              => 'الاسم',
            'email'             => 'البريد الإلكتروني',
            'password'          => 'كلمة المرور',
            'phone'             => 'رقم الهاتف',
            'whatsapp'          => 'رقم الواتساب',
            'message'           => 'الرسالة',
            'comment'           => 'التعليق',
            'description'       => 'الوصف',
            'short_description' => 'الوصف المختصر',
            'content'           => 'المحتوى',
            'excerpt'           => 'المقتطف',
            'status'            => 'الحالة',
            'rating'            => 'التقييم',
            'site_name'         => 'اسم الموقع',
            'job_title'         => 'المسمى الوظيفي',
            default             => $field,
        };
    }

    public function fails(): bool   { return !empty($this->errors); }
    public function passes(): bool  { return empty($this->errors); }
    public function errors(): array { return $this->errors; }

    public function firstError(): string
    {
        return array_values($this->errors)[0][0] ?? 'خطأ في التحقق من البيانات';
    }

    /** استخدام مباشر يرمي استثناء إذا فشل التحقق */
    public static function validate(array $data, array $rules): array
    {
        $v = self::make($data, $rules);
        if ($v->fails()) {
            Response::validationError($v->errors());
        }
        return $data;
    }
}
