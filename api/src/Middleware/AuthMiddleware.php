<?php
declare(strict_types=1);
namespace App\Middleware;

use App\Core\{Request, Response, Database};
use App\Services\JwtService;

/**
 * AuthMiddleware — يتحقق من JWT ويضع بيانات المستخدم في الـ Request
 */
final class AuthMiddleware
{
    public function __construct(private readonly array $config) {}

    public function handle(Request $request, callable $next): void
    {
        $token = $request->bearerToken();

        if (!$token) {
            Response::unauthorized('يجب إرسال توكن المصادقة في الـ Authorization header');
        }

        $jwt     = new JwtService($this->config['jwt']);
        $payload = $jwt->verify($token);

        if (!$payload) {
            Response::unauthorized('التوكن غير صالح أو منتهي الصلاحية');
        }

        // التحقق من وجود المستخدم في قاعدة البيانات
        $user = Database::first(
            "SELECT id, name, email, role, status FROM users WHERE id = ? AND status = 'active' LIMIT 1",
            [$payload['sub']]
        );

        if (!$user) {
            Response::unauthorized('المستخدم غير موجود أو حسابه معلق');
        }

        $request->setUser($user);
        $next();
    }
}
