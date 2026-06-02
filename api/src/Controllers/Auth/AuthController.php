<?php
declare(strict_types=1);
namespace App\Controllers\Auth;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\UserRepository;
use App\Services\JwtService;

/**
 * AuthController — عمليات تسجيل الدخول والتوثيق للمشرفين
 */
final class AuthController extends BaseController
{
    private UserRepository $users;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->users = new UserRepository();
    }

    /**
     * POST /auth/login
     */
    public function login(): void
    {
        $email    = $this->request->string('email');
        $password = $this->request->string('password');

        Validator::validate(
            ['email' => $email, 'password' => $password],
            ['email' => 'required|email', 'password' => 'required|min:6']
        );

        $user = $this->users->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            Response::error('بيانات الاعتماد المدخلة غير صحيحة', 401);
        }

        if ($user['status'] !== 'active') {
            Response::error('هذا الحساب معطل حالياً', 403);
        }

        $jwt    = new JwtService($this->config['jwt']);
        $token  = $jwt->generate([
            'sub'   => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'],
            'name'  => $user['name']
        ]);

        Response::success([
            'token'      => $token,
            'expires_in' => $this->config['jwt']['ttl'],
            'user'       => [
                'id'    => $user['id'],
                'name'  => $user['name'],
                'email' => $user['email'],
                'role'  => $user['role'],
            ]
        ], 'تم تسجيل الدخول بنجاح');
    }

    /**
     * GET /auth/me
     */
    public function me(): void
    {
        $user = $this->user();
        if (empty($user)) {
            Response::unauthorized();
        }

        Response::success([
            'id'    => $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ], 'بيانات المستخدم الحالي');
    }

    /**
     * POST /auth/logout
     */
    public function logout(): void
    {
        // بمجرد إتلاف التوكن في الواجهة الأمامية يتم الخروج.
        // يمكن تسجيل خروج التوكن بخادم عن طريق إضافة jti لجدول revoked_tokens إن وجد
        Response::success(null, 'تم تسجيل الخروج بنجاح');
    }

    /**
     * POST /auth/refresh
     */
    public function refresh(): void
    {
        $user = $this->user();
        $jwt    = new JwtService($this->config['jwt']);
        $token  = $jwt->generate([
            'sub'   => $user['id'],
            'email' => $user['email'],
            'role'  => $user['role'],
            'name'  => $user['name']
        ]);

        Response::success([
            'token'      => $token,
            'expires_in' => $this->config['jwt']['ttl'],
        ], 'تم تجديد التوكن بنجاح');
    }
}
