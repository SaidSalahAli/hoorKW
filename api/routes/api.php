<?php
// =============================================================
// routes/api.php — تعريف جميع مسارات الـ API
// منظم حسب المجموعات والصلاحيات
// =============================================================
declare(strict_types=1);

use App\Middleware\AuthMiddleware;

// ── Health Check ──────────────────────────────────────────────
$router->get('/health', fn() => \App\Core\Response::success([
    'status'  => 'ok',
    'version' => '1.0.0',
    'time'    => date('Y-m-d H:i:s'),
    'env'     => $_ENV['APP_ENV'] ?? 'production',
], 'API is running'));

// ════════════════════════════════════════════════════════════
// AUTH ROUTES
// ════════════════════════════════════════════════════════════
$router->group('/auth', function () use ($router) {
    $router->post('/login',  'Auth\AuthController@login');
    $router->post('/logout', 'Auth\AuthController@logout',   [AuthMiddleware::class]);
    $router->get ('/me',     'Auth\AuthController@me',       [AuthMiddleware::class]);
    $router->post('/refresh','Auth\AuthController@refresh',  [AuthMiddleware::class]);
});

// ════════════════════════════════════════════════════════════
// PUBLIC ROUTES (لا تتطلب توثيق)
// ════════════════════════════════════════════════════════════
$router->group('/public', function () use ($router) {

    // الخدمات
    $router->get('/services',          'Public\ServicesPublicController@index');
    $router->get('/services/{slug}',   'Public\ServicesPublicController@show');

    // المقالات
    $router->get('/articles',          'Public\ArticlesPublicController@index');
    $router->get('/articles/{slug}',   'Public\ArticlesPublicController@show');

    // المعرض
    $router->get('/gallery',           'Public\GalleryPublicController@index');

    // الشهادات
    $router->get('/testimonials',      'Public\TestimonialsPublicController@index');

    // الإعدادات
    $router->get('/settings',          'Public\SettingsPublicController@show');

    // إرسال طلب خدمة
    $router->post('/request',          'Public\RequestsPublicController@store');
});

// ════════════════════════════════════════════════════════════
// ADMIN ROUTES (تتطلب JWT)
// ════════════════════════════════════════════════════════════
$adminMiddleware = [AuthMiddleware::class];

$router->group('/admin', function () use ($router, $adminMiddleware) {

    // ── Dashboard ──────────────────────────────────────────
    $router->get('/dashboard', 'Admin\DashboardController@index', $adminMiddleware);

    // ── Services ───────────────────────────────────────────
    $router->group('/services', function () use ($router, $adminMiddleware) {
        $router->get   ('/',           'Admin\ServicesController@index',       $adminMiddleware);
        $router->get   ('/{id}',       'Admin\ServicesController@show',        $adminMiddleware);
        $router->post  ('/',           'Admin\ServicesController@store',       $adminMiddleware);
        $router->post  ('/{id}',       'Admin\ServicesController@update',      $adminMiddleware);
        $router->delete('/{id}',       'Admin\ServicesController@destroy',     $adminMiddleware);
        $router->post  ('/bulk-delete','Admin\ServicesController@bulkDestroy', $adminMiddleware);
    });

    // ── Articles ───────────────────────────────────────────
    $router->group('/articles', function () use ($router, $adminMiddleware) {
        $router->get   ('/',           'Admin\ArticlesController@index',       $adminMiddleware);
        $router->get   ('/{id}',       'Admin\ArticlesController@show',        $adminMiddleware);
        $router->post  ('/',           'Admin\ArticlesController@store',       $adminMiddleware);
        $router->post  ('/{id}',       'Admin\ArticlesController@update',      $adminMiddleware);
        $router->delete('/{id}',       'Admin\ArticlesController@destroy',     $adminMiddleware);
        $router->post  ('/bulk-delete','Admin\ArticlesController@bulkDestroy', $adminMiddleware);
    });

    // ── Gallery ────────────────────────────────────────────
    $router->group('/gallery', function () use ($router, $adminMiddleware) {
        $router->get   ('/',           'Admin\GalleryController@index',       $adminMiddleware);
        $router->post  ('/',           'Admin\GalleryController@store',       $adminMiddleware);
        $router->delete('/{id}',       'Admin\GalleryController@destroy',     $adminMiddleware);
        $router->post  ('/bulk-delete','Admin\GalleryController@bulkDestroy', $adminMiddleware);
    });

    // ── Testimonials ───────────────────────────────────────
    $router->group('/testimonials', function () use ($router, $adminMiddleware) {
        $router->get   ('/',           'Admin\TestimonialsController@index',       $adminMiddleware);
        $router->get   ('/{id}',       'Admin\TestimonialsController@show',        $adminMiddleware);
        $router->post  ('/',           'Admin\TestimonialsController@store',       $adminMiddleware);
        $router->post  ('/{id}',       'Admin\TestimonialsController@update',      $adminMiddleware);
        $router->delete('/{id}',       'Admin\TestimonialsController@destroy',     $adminMiddleware);
        $router->post  ('/bulk-delete','Admin\TestimonialsController@bulkDestroy', $adminMiddleware);
    });

    // ── Requests ───────────────────────────────────────────
    $router->group('/requests', function () use ($router, $adminMiddleware) {
        $router->get   ('/',             'Admin\RequestsController@index',        $adminMiddleware);
        $router->get   ('/{id}',         'Admin\RequestsController@show',         $adminMiddleware);
        $router->patch ('/{id}/status',  'Admin\RequestsController@updateStatus', $adminMiddleware);
        $router->delete('/{id}',         'Admin\RequestsController@destroy',      $adminMiddleware);
    });

    // ── Settings ───────────────────────────────────────────
    $router->get ('/settings', 'Admin\SettingsController@show',   $adminMiddleware);
    $router->post('/settings', 'Admin\SettingsController@update', $adminMiddleware);

    // ── Users ──────────────────────────────────────────────
    $router->group('/users', function () use ($router, $adminMiddleware) {
        $router->get   ('/',     'Admin\UsersController@index',   $adminMiddleware);
        $router->get   ('/{id}', 'Admin\UsersController@show',    $adminMiddleware);
        $router->post  ('/',     'Admin\UsersController@store',   $adminMiddleware);
        $router->post  ('/{id}', 'Admin\UsersController@update',  $adminMiddleware);
        $router->delete('/{id}', 'Admin\UsersController@destroy', $adminMiddleware);
    });
});

// ════════════════════════════════════════════════════════════
// COMPATIBILITY ALIASES (للتوافق مع الفرونت اند الحالي)
// ════════════════════════════════════════════════════════════
// الفرونت اند يستخدم /api/services بدلاً من /api/public/services
$router->get('/services',                    'Public\ServicesPublicController@index');
$router->get('/services/slug/{slug}',        'Public\ServicesPublicController@show');
$router->get('/articles',                    'Public\ArticlesPublicController@index');
$router->get('/articles/slug/{slug}',        'Public\ArticlesPublicController@show');
$router->get('/gallery',                     'Public\GalleryPublicController@index');
$router->get('/testimonials',                'Public\TestimonialsPublicController@index');
$router->get('/settings',                    'Public\SettingsPublicController@show');
$router->post('/requests',                   'Public\RequestsPublicController@store');

// Admin aliases
$router->post('/auth/login',                 'Auth\AuthController@login');
$router->get('/dashboard/stats',             'Admin\DashboardController@index',          [AuthMiddleware::class]);
$router->post('/services',                   'Admin\ServicesController@store',            [AuthMiddleware::class]);
$router->get('/services/{id}',                'Admin\ServicesController@show',             [AuthMiddleware::class]);
$router->post('/services/bulk-delete',       'Admin\ServicesController@bulkDestroy',      [AuthMiddleware::class]);
$router->post('/services/{id}',              'Admin\ServicesController@update',           [AuthMiddleware::class]);
$router->delete('/services/{id}',            'Admin\ServicesController@destroy',          [AuthMiddleware::class]);
$router->post('/articles',                   'Admin\ArticlesController@store',            [AuthMiddleware::class]);
$router->get('/articles/{id}',                'Admin\ArticlesController@show',             [AuthMiddleware::class]);
$router->post('/articles/bulk-delete',       'Admin\ArticlesController@bulkDestroy',      [AuthMiddleware::class]);
$router->post('/articles/{id}',              'Admin\ArticlesController@update',           [AuthMiddleware::class]);
$router->delete('/articles/{id}',            'Admin\ArticlesController@destroy',          [AuthMiddleware::class]);
$router->post('/gallery',                    'Admin\GalleryController@store',             [AuthMiddleware::class]);
$router->post('/gallery/bulk-delete',        'Admin\GalleryController@bulkDestroy',       [AuthMiddleware::class]);
$router->delete('/gallery/{id}',             'Admin\GalleryController@destroy',           [AuthMiddleware::class]);
$router->post('/testimonials',               'Admin\TestimonialsController@store',        [AuthMiddleware::class]);
$router->get('/testimonials/{id}',            'Admin\TestimonialsController@show',         [AuthMiddleware::class]);
$router->post('/testimonials/bulk-delete',   'Admin\TestimonialsController@bulkDestroy',  [AuthMiddleware::class]);
$router->post('/testimonials/{id}',          'Admin\TestimonialsController@update',       [AuthMiddleware::class]);
$router->delete('/testimonials/{id}',        'Admin\TestimonialsController@destroy',      [AuthMiddleware::class]);
$router->get('/requests',                    'Admin\RequestsController@index',            [AuthMiddleware::class]);
$router->get('/requests/{id}',               'Admin\RequestsController@show',             [AuthMiddleware::class]);
$router->patch('/requests/{id}/status',      'Admin\RequestsController@updateStatus',     [AuthMiddleware::class]);
$router->delete('/requests/{id}',            'Admin\RequestsController@destroy',          [AuthMiddleware::class]);
$router->post('/settings',                   'Admin\SettingsController@update',           [AuthMiddleware::class]);
