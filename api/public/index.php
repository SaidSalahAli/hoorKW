<?php
// =============================================================
// HoorKW CMS API — نقطة الدخول الرئيسية
// PHP 8.3 | Clean Architecture | No external dependencies
// =============================================================
declare(strict_types=1);

// ── تحديد المسار الجذري ──────────────────────────────────────
define('BASE_PATH', dirname(__DIR__));
define('SRC_PATH',  BASE_PATH . '/src');
define('APP_START', microtime(true));

// ── تحميل البيئة ─────────────────────────────────────────────
require_once SRC_PATH . '/Core/EnvLoader.php';
\App\Core\EnvLoader::load(BASE_PATH . '/.env');

// ── تحميل الإعدادات ──────────────────────────────────────────
$config = require BASE_PATH . '/config/app.php';

// ── Autoloader ───────────────────────────────────────────────
require_once SRC_PATH . '/Core/Autoloader.php';
Autoloader::register(SRC_PATH);

// ── CORS (أول شيء يُعالج) ────────────────────────────────────
\App\Middleware\CorsMiddleware::handle($config['cors']);

// ── إعدادات PHP ──────────────────────────────────────────────
error_reporting($config['app']['debug'] ? E_ALL : 0);
ini_set('display_errors', '0');
date_default_timezone_set('Asia/Kuwait');
set_exception_handler([\App\Core\ErrorHandler::class, 'handle']);
set_error_handler([\App\Core\ErrorHandler::class, 'handleError']);

// ── تهيئة قاعدة البيانات ─────────────────────────────────────
\App\Core\Database::boot($config['database']);

// ── معالجة الطلب ─────────────────────────────────────────────
$request  = \App\Core\Request::capture();
$router   = new \App\Core\Router($request, $config);

// ── تسجيل المسارات ───────────────────────────────────────────
require_once BASE_PATH . '/routes/api.php';

// ── تنفيذ الطلب ──────────────────────────────────────────────
$router->dispatch();
