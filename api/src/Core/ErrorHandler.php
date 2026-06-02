<?php
declare(strict_types=1);
namespace App\Core;

/**
 * ErrorHandler — معالجة مركزية لجميع الأخطاء والاستثناءات
 * يتأكد من أن كل استجابة تكون JSON حتى عند الأخطاء الحرجة
 */
final class ErrorHandler
{
    public static function handle(\Throwable $e): void
    {
        $debug = filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN);

        // تسجيل الخطأ
        self::log($e);

        $status  = self::resolveStatus($e);
        $message = self::resolveMessage($e, $debug);

        $body = [
            'success' => false,
            'message' => $message,
        ];

        if ($debug) {
            $body['debug'] = [
                'exception' => get_class($e),
                'file'      => $e->getFile(),
                'line'      => $e->getLine(),
                'trace'     => array_slice($e->getTrace(), 0, 5),
            ];
        }

        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function handleError(
        int    $errno,
        string $errstr,
        string $errfile,
        int    $errline
    ): bool {
        if (!(error_reporting() & $errno)) return false;

        throw new \ErrorException($errstr, 0, $errno, $errfile, $errline);
    }

    private static function resolveStatus(\Throwable $e): int
    {
        return match(true) {
            $e instanceof \InvalidArgumentException   => 422,
            $e instanceof \RuntimeException           => 400,
            $e instanceof \PDOException               => 500,
            default                                   => 500,
        };
    }

    private static function resolveMessage(\Throwable $e, bool $debug): string
    {
        if ($debug) return $e->getMessage();

        return match(true) {
            $e instanceof \PDOException => 'خطأ في قاعدة البيانات',
            default                     => 'حدث خطأ غير متوقع في الخادم',
        };
    }

    private static function log(\Throwable $e): void
    {
        $logPath = BASE_PATH . '/storage/logs/';
        if (!is_dir($logPath)) mkdir($logPath, 0755, true);

        $file = $logPath . 'error-' . date('Y-m-d') . '.log';
        $line = sprintf(
            "[%s] %s: %s in %s:%d\n",
            date('Y-m-d H:i:s'),
            get_class($e),
            $e->getMessage(),
            $e->getFile(),
            $e->getLine()
        );

        file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
    }
}
