<?php
declare(strict_types=1);
namespace App\Middleware;

use App\Core\{Request, Response};

/**
 * CorsMiddleware — معالجة طلبات CORS
 */
final class CorsMiddleware
{
    public static function handle(array $config): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        $allowed = in_array($origin, $config['origins'], true)
                || in_array('*', $config['origins'], true);

        if ($allowed) {
            header("Access-Control-Allow-Origin: $origin");
        }

        header('Access-Control-Allow-Methods: ' . implode(', ', $config['methods']));
        header('Access-Control-Allow-Headers: ' . implode(', ', $config['headers']));
        header('Access-Control-Max-Age: ' . $config['max_age']);

        if ($config['credentials']) {
            header('Access-Control-Allow-Credentials: true');
        }

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}
