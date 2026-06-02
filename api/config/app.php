<?php
declare(strict_types=1);

return [

    // ── Application ──────────────────────────────────────────
    'app' => [
        'name'    => $_ENV['APP_NAME']  ?? 'HoorKW CMS',
        'env'     => $_ENV['APP_ENV']   ?? 'production',
        'debug'   => filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN),
        'version' => '1.0.0',
        'timezone'=> 'Asia/Kuwait',
        'locale'  => 'ar',
    ],

    // ── Database ─────────────────────────────────────────────
    'database' => [
        'host'    => $_ENV['DB_HOST']    ?? 'localhost',
        'port'    => (int)($_ENV['DB_PORT'] ?? 3306),
        'name'    => $_ENV['DB_NAME']    ?? 'hoorkw',
        'user'    => $_ENV['DB_USER']    ?? 'root',
        'pass'    => $_ENV['DB_PASS']    ?? '',
        'charset' => 'utf8mb4',
        'options' => [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci",
        ],
    ],

    // ── JWT ──────────────────────────────────────────────────
    'jwt' => [
        'secret'    => $_ENV['JWT_SECRET']       ?? 'CHANGE_THIS_IMMEDIATELY',
        'ttl'       => (int)($_ENV['JWT_TTL']    ?? 86400),
        'algorithm' => 'HS256',
        'issuer'    => $_ENV['APP_URL']           ?? 'http://localhost:8080',
    ],

    // ── File Upload ──────────────────────────────────────────
    'upload' => [
        'disk'          => $_ENV['UPLOAD_DISK']   ?? 'local',
        'dir'           => rtrim($_ENV['UPLOAD_DIR'] ?? BASE_PATH . '/storage/uploads', '/') . '/',
        'url'           => rtrim($_ENV['UPLOAD_URL'] ?? '/storage/uploads', '/') . '/',
        'max_size'      => (int)($_ENV['UPLOAD_MAX_SIZE'] ?? 5) * 1024 * 1024,
        'allowed_mimes' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        'allowed_exts'  => ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    ],

    // ── CORS ─────────────────────────────────────────────────
    'cors' => [
        'origins' => array_map('trim', explode(',', $_ENV['CORS_ORIGINS'] ?? 'http://localhost:3000')),
        'methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
        'max_age' => 86400,
        'credentials' => true,
    ],

    // ── Pagination ───────────────────────────────────────────
    'pagination' => [
        'default' => 10,
        'max'     => 100,
    ],

    // ── Logging ──────────────────────────────────────────────
    'logging' => [
        'enabled' => filter_var($_ENV['LOG_ENABLED'] ?? true, FILTER_VALIDATE_BOOLEAN),
        'path'    => BASE_PATH . '/storage/logs/',
        'level'   => $_ENV['LOG_LEVEL'] ?? 'error',  // error|warning|info|debug
    ],

    // ── Rate Limiting ────────────────────────────────────────
    'rate_limit' => [
        'enabled'  => true,
        'max'      => (int)($_ENV['RATE_LIMIT_MAX']    ?? 60),   // طلب في النافذة
        'window'   => (int)($_ENV['RATE_LIMIT_WINDOW'] ?? 60),   // ثانية
        'login_max'=> 5,   // محاولات تسجيل دخول
        'login_window' => 300, // 5 دقائق
    ],

];
