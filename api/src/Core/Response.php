<?php
declare(strict_types=1);
namespace App\Core;

/**
 * Response — إرسال استجابات JSON موحدة وقياسية
 */
final class Response
{
    public static function json(array $data, int $status = 200): never
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        header('X-Content-Type-Options: nosniff');
        header('X-Response-Time: ' . round((microtime(true) - APP_START) * 1000, 2) . 'ms');

        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        exit;
    }

    // ── Success Responses ─────────────────────────────────────

    public static function success(mixed $data, string $message = 'تمت العملية بنجاح', int $status = 200): never
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    public static function created(mixed $data, string $message = 'تم الإنشاء بنجاح'): never
    {
        self::success($data, $message, 201);
    }

    public static function noContent(): never
    {
        http_response_code(204);
        exit;
    }

    public static function paginated(
        array  $items,
        array  $meta,
        string $message = 'تم جلب البيانات بنجاح'
    ): never {
        self::json([
            'success' => true,
            'message' => $message,
            'data'    => $items,
            'meta'    => $meta,
        ]);
    }

    // ── Error Responses ───────────────────────────────────────

    public static function error(
        string $message,
        int    $status  = 400,
        array  $errors  = [],
        mixed  $context = null
    ): never {
        $body = [
            'success' => false,
            'message' => $message,
        ];
        if (!empty($errors))   $body['errors']  = $errors;
        if ($context !== null) $body['context'] = $context;

        self::json($body, $status);
    }

    public static function validationError(array $errors, string $message = 'خطأ في التحقق من البيانات'): never
    {
        self::error($message, 422, $errors);
    }

    public static function notFound(string $message = 'العنصر غير موجود'): never
    {
        self::error($message, 404);
    }

    public static function unauthorized(string $message = 'يجب تسجيل الدخول أولاً'): never
    {
        self::error($message, 401);
    }

    public static function forbidden(string $message = 'ليس لديك صلاحية هذه العملية'): never
    {
        self::error($message, 403);
    }

    public static function conflict(string $message = 'تعارض في البيانات'): never
    {
        self::error($message, 409);
    }

    public static function tooManyRequests(int $retryAfter = 60): never
    {
        header("Retry-After: $retryAfter");
        self::error('تجاوزت الحد المسموح من الطلبات، يرجى الانتظار.', 429);
    }

    public static function serverError(string $message = 'خطأ داخلي في الخادم'): never
    {
        self::error($message, 500);
    }
}
