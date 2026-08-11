<?php
declare(strict_types=1);
namespace App\Middleware;

/**
 * CorsMiddleware — معالجة طلبات CORS
 */
final class CorsMiddleware
{
    public static function handle(array $config): void
    {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        $allowedOrigins = $config['origins'] ?? [];
        $isAllowed = empty($origin) 
            || in_array('*', $allowedOrigins, true) 
            || in_array($origin, $allowedOrigins, true);

        if (!empty($origin) && $isAllowed) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
        } else {
            header("Access-Control-Allow-Origin: *");
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
        header('Access-Control-Max-Age: 86400');

        if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit(0);
        }
    }
}

