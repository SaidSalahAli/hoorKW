<?php
declare(strict_types=1);
namespace App\Services;

/**
 * StorageService — إدارة ملفات الصور بشكل موحد واحترافي
 */
final class StorageService
{
    private string $baseDir;
    private string $baseUrl;
    private array  $config;

    public function __construct(array $uploadConfig, string $subfolder = '')
    {
        $this->config  = $uploadConfig;
        $sub           = $subfolder ? trim($subfolder, '/') . '/' : '';
        $this->baseDir = rtrim($uploadConfig['dir'], '/') . '/' . $sub;
        $this->baseUrl = rtrim($uploadConfig['url'], '/') . '/' . $sub;

        if (!is_dir($this->baseDir)) {
            mkdir($this->baseDir, 0755, true);
        }
    }

    // ── Upload ───────────────────────────────────────────────

    /**
     * رفع صورة وإرجاع الـ URL العام
     * @throws \RuntimeException
     */
    public function upload(array $file): string
    {
        $this->validateFile($file);

        $ext      = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $yearMonth = date('Y/m/');
        $filename  = uniqid('', true) . '.' . $ext;
        $dir       = $this->baseDir . $yearMonth;
        $fullPath  = $dir . $filename;

        if (!is_dir($dir)) mkdir($dir, 0755, true);

        if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
            throw new \RuntimeException('فشل نقل الملف إلى التخزين');
        }

        return $this->baseUrl . $yearMonth . $filename;
    }

    /**
     * حذف ملف بالـ URL الكامل
     */
    public function delete(string $url): bool
    {
        if (!$url) return false;

        $path = str_replace(
            rtrim($this->config['url'], '/'),
            rtrim($this->config['dir'], '/'),
            $url
        );

        return file_exists($path) && unlink($path);
    }

    /**
     * استبدال ملف قديم برفع جديد
     */
    public function replace(?string $oldUrl, array $newFile): string
    {
        if ($oldUrl) $this->delete($oldUrl);
        return $this->upload($newFile);
    }

    // ── Validation ───────────────────────────────────────────

    private function validateFile(array $file): void
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
            throw new \RuntimeException($this->uploadErrorMsg($file['error'] ?? -1));
        }

        if ($file['size'] > $this->config['max_size']) {
            $mb = round($this->config['max_size'] / 1024 / 1024, 1);
            throw new \RuntimeException("حجم الملف يتجاوز الحد المسموح ({$mb} ميغابايت)");
        }

        $mime = mime_content_type($file['tmp_name']);
        if (!in_array($mime, $this->config['allowed_mimes'], true)) {
            throw new \RuntimeException('نوع الملف غير مدعوم. الأنواع المسموحة: ' . implode(', ', $this->config['allowed_exts']));
        }
    }

    private function uploadErrorMsg(int $code): string
    {
        return match($code) {
            UPLOAD_ERR_INI_SIZE   => 'الملف أكبر من الحد المسموح في إعدادات PHP',
            UPLOAD_ERR_FORM_SIZE  => 'الملف أكبر من الحد المحدد في النموذج',
            UPLOAD_ERR_PARTIAL    => 'تم رفع جزء من الملف فقط، حاول مجدداً',
            UPLOAD_ERR_NO_FILE    => 'لم يتم اختيار أي ملف',
            UPLOAD_ERR_NO_TMP_DIR => 'مجلد الملفات المؤقتة غير موجود في الخادم',
            UPLOAD_ERR_CANT_WRITE => 'فشل الكتابة على القرص، تحقق من صلاحيات المجلد',
            default               => 'خطأ غير معروف أثناء رفع الملف',
        };
    }
}
