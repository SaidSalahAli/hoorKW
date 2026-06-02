<?php
declare(strict_types=1);
namespace App\Controllers\Admin;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\ServiceRepository;

/** ServicesController — إدارة الخدمات من قبل المشرفين */
final class ServicesController extends BaseController
{
    private ServiceRepository $services;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->services = new ServiceRepository();
    }

    /** GET /admin/services */
    public function index(): void
    {
        $filters = [
            'search' => $this->request->string('search', '', 'query'),
            'status' => $this->request->string('status', '', 'query'),
        ];

        $result = $this->services->paginate($filters, $this->page(), $this->perPage());
        Response::paginated($result['items'], $result['meta']);
    }

    /** GET /admin/services/{id} */
    public function show(): void
    {
        $service = $this->services->findById($this->id());
        if (!$service) Response::notFound('الخدمة المطلوبة غير موجودة');
        Response::success($service);
    }

    /** POST /admin/services */
    public function store(): void
    {
        $data = $this->validateInput();

        if ($this->services->slugExists($data['slug'])) {
            Response::error('الرابط المميز (Slug) مستخدم بالفعل، يرجى كتابة رابط آخر', 422);
        }

        if ($this->request->hasFile('image')) {
            $data['image'] = $this->storage('services')->upload($this->request->file('image'));
        } else {
            $data['image'] = null;
        }

        $service = $this->services->create($data);
        Response::created($service, 'تمت إضافة الخدمة بنجاح');
    }

    /** POST /admin/services/{id} (يحاكي PUT للـ FormData) */
    public function update(): void
    {
        $id      = $this->id();
        $service = $this->services->findById($id);
        if (!$service) Response::notFound('الخدمة المطلوبة غير موجودة');

        $data = $this->validateInput((string)$id);

        if ($this->services->slugExists($data['slug'], $id)) {
            Response::error('الرابط المميز (Slug) مستخدم بالفعل لخدمة أخرى', 422);
        }

        if ($this->request->hasFile('image')) {
            $data['image'] = $this->storage('services')->replace($service['image'], $this->request->file('image'));
        } else {
            $data['image'] = $service['image']; // الاحتفاظ بالصورة القديمة
        }

        $updated = $this->services->update($id, $data);
        Response::success($updated, 'تم تحديث الخدمة بنجاح');
    }

    /** DELETE /admin/services/{id} */
    public function destroy(): void
    {
        $id      = $this->id();
        $service = $this->services->findById($id);
        if (!$service) Response::notFound('الخدمة المطلوبة غير موجودة');

        if ($service['image']) {
            $this->storage('services')->delete($service['image']);
        }

        $this->services->delete($id);
        Response::success(null, 'تم حذف الخدمة بنجاح');
    }

    /** POST /admin/services/bulk-delete */
    public function bulkDestroy(): void
    {
        $ids = $this->request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            Response::error('يجب إرسال قائمة المعرفات (ids) لحذفها', 422);
        }

        $ids = array_filter(array_map('intval', $ids));
        if (empty($ids)) Response::error('معرفات غير صالحة', 422);

        // حذف الصور المرتبطة أولاً
        $images = $this->services->getImages($ids);
        foreach ($images as $row) {
            if (!empty($row['image'])) {
                $this->storage('services')->delete($row['image']);
            }
        }

        $count = $this->services->deleteMany($ids);
        Response::success(null, "تم حذف $count خدمات بنجاح");
    }

    private function validateInput(?string $excludeId = null): array
    {
        $input = [
            'title'             => $this->request->string('title'),
            'slug'              => $this->request->string('slug'),
            'short_description' => $this->request->string('short_description'),
            'description'       => $this->request->string('description'),
            'meta_title'        => $this->request->string('meta_title'),
            'meta_description'  => $this->request->string('meta_description'),
            'status'            => $this->request->string('status', 'active'),
            'sort_order'        => $this->request->integer('sort_order', 0, 'body'),
        ];

        Validator::validate($input, [
            'title'             => 'required|min:3|max:150',
            'slug'              => 'required|min:2|max:150|slug',
            'short_description' => 'required|min:10|max:250',
            'description'       => 'required|min:20',
            'status'            => 'required|in:active,inactive,draft',
        ]);

        return $input;
    }
}
