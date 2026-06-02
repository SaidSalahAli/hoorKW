<?php
declare(strict_types=1);
namespace App\Controllers\Admin;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\UserRepository;

/** UsersController — إدارة المستخدمين للمشرفين */
final class UsersController extends BaseController
{
    private UserRepository $users;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->users = new UserRepository();
    }

    /** GET /admin/users */
    public function index(): void
    {
        $this->requireAdmin();

        $filters = [
            'search' => $this->request->string('search', '', 'query'),
            'role'   => $this->request->string('role', '', 'query'),
        ];

        $result = $this->users->paginate($filters, $this->page(), $this->perPage());
        Response::paginated($result['items'], $result['meta']);
    }

    /** GET /admin/users/{id} */
    public function show(): void
    {
        $this->requireAdmin();

        $user = $this->users->findById($this->id());
        if (!$user) Response::notFound('المستخدم المطلوب غير موجود');
        Response::success($user);
    }

    /** POST /admin/users */
    public function store(): void
    {
        $this->requireAdmin();

        $data = [
            'name'     => $this->request->string('name'),
            'email'    => $this->request->string('email'),
            'password' => $this->request->string('password'),
            'role'     => $this->request->string('role', 'editor'),
            'status'   => $this->request->string('status', 'active'),
        ];

        Validator::validate($data, [
            'name'     => 'required|min:3|max:100',
            'email'    => 'required|email',
            'password' => 'required|min:8',
            'role'     => 'required|in:admin,editor',
            'status'   => 'required|in:active,inactive',
        ]);

        if ($this->users->emailExists($data['email'])) {
            Response::error('هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر', 422);
        }

        $user = $this->users->create($data);
        Response::created($user, 'تم إنشاء المستخدم بنجاح');
    }

    /** POST /admin/users/{id} (يحاكي PUT للـ FormData/POST) */
    public function update(): void
    {
        $this->requireAdmin();
        $id   = $this->id();
        $user = $this->users->findById($id);
        if (!$user) Response::notFound('المستخدم المطلوب غير موجود');

        $data = [
            'name'     => $this->request->string('name'),
            'email'    => $this->request->string('email'),
            'password' => $this->request->string('password'), // قد يكون فارغاً
            'role'     => $this->request->string('role', $user['role']),
            'status'   => $this->request->string('status', $user['status']),
        ];

        Validator::validate($data, [
            'name'     => 'required|min:3|max:100',
            'email'    => 'required|email',
            'password' => 'nullable|min:8',
            'role'     => 'required|in:admin,editor',
            'status'   => 'required|in:active,inactive',
        ]);

        if ($this->users->emailExists($data['email'], $id)) {
            Response::error('هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر', 422);
        }

        $updated = $this->users->update($id, $data);
        Response::success($updated, 'تم تحديث بيانات المستخدم بنجاح');
    }

    /** DELETE /admin/users/{id} */
    public function destroy(): void
    {
        $this->requireAdmin();
        $id = $this->id();

        if ($id === $this->userId()) {
            Response::error('لا يمكنك حذف حسابك الشخصي الذي تستخدمه لتسجيل الدخول حالياً', 400);
        }

        if (!$this->users->findById($id)) {
            Response::notFound('المستخدم المطلوب غير موجود');
        }

        $this->users->delete($id);
        Response::success(null, 'تم حذف حساب المستخدم بنجاح');
    }
}
