<?php
declare(strict_types=1);

/**
 * Autoloader — PSR-4 style autoloader بدون Composer
 * يحوّل App\Controllers\Admin\ServicesController
 * إلى /src/Controllers/Admin/ServicesController.php
 */
final class Autoloader
{
    private static string $baseDir = '';

    public static function register(string $srcPath): void
    {
        self::$baseDir = rtrim($srcPath, '/');
        spl_autoload_register([self::class, 'load']);
    }

    public static function load(string $class): void
    {
        // إزالة namespace prefix "App\"
        $relative = str_replace('App\\', '', $class);

        // تحويل namespace separators إلى directory separators
        $file = self::$baseDir . '/' . str_replace('\\', '/', $relative) . '.php';

        if (file_exists($file)) {
            require_once $file;
        }
    }
}
