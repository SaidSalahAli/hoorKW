<?php
declare(strict_types=1);
namespace App\Core;

/**
 * EnvLoader — تحميل ملف .env بدون مكتبات خارجية
 */
final class EnvLoader
{
    public static function load(string $path): void
    {
        if (!file_exists($path)) return;

        foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) continue;
            if (!str_contains($line, '=')) continue;

            [$key, $value] = array_map('trim', explode('=', $line, 2));

            // إزالة الاقتباسات إن وجدت
            $value = trim($value, '"\'');

            if (!isset($_ENV[$key]) && !getenv($key)) {
                $_ENV[$key] = $value;
                putenv("$key=$value");
            }
        }
    }
}
