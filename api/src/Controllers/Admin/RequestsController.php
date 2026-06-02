<?php
declare(strict_types=1);
namespace App\Controllers\Admin;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\RequestRepository;

/** RequestsController — إدارة ومتابعة طلبات الخدمات */
final class RequestsController extends BaseController
{
    private RequestRepository $requests;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->requests = new RequestRepository();
    }

    /** GET /admin/requests */
    public function index(): void
    {
        $filters = [
            'search' => $this->request->string('search', '', 'query'),
            'status' => $this->request->string('status', '', 'query'),
        ];

        $result = $this->requests->paginate($filters, $this->page(), $this->perPage());
        Response::paginated($result['items'], $result['meta']);
    }

    /** GET /admin/requests/{id} */
    public function show(): void
    {
        $request = $this->requests->findById($this->id());
        if (!$request) Response::notFound('طلب النقل المطلوب غير موجود');
        Response::success($request);
    }

    /** PATCH /admin/requests/{id}/status */
    public function updateStatus(): void
    {
        $id     = $this->id();
        $status = $this->request->string('status');
        $notes  = $this->request->string('notes');

        Validator::validate(
            ['status' => $status],
            ['status' => 'required|in:new,contacted,completed,cancelled']
        );

        $request = $this->requests->findById($id);
        if (!$request) Response::notFound('طلب النقل المطلوب غير موجود');

        $this->requests->updateStatus($id, $status, $notes ? $notes : null);

        $updated = $this->requests->findById($id);
        Response::success($updated, 'تم تحديث حالة طلب الخدمة بنجاح');
    }

    /** DELETE /admin/requests/{id} */
    public function destroy(): void
    {
        $id = $this->id();
        if (!$this->requests->findById($id)) {
            Response::notFound('الطلب غير موجود');
        }

        $this->requests->delete($id);
        Response::success(null, 'تم حذف طلب الخدمة بنجاح');
    }
}
