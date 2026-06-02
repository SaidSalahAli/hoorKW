<?php
declare(strict_types=1);
namespace App\Controllers\Admin;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\TestimonialRepository;

/** TestimonialsController — إدارة آراء وتقييمات العملاء */
final class TestimonialsController extends BaseController
{
    private TestimonialRepository $testimonials;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->testimonials = new TestimonialRepository();
    }

    /** GET /admin/testimonials */
    public function index(): void
    {
        $filters = [
            'search' => $this->request->string('search', '', 'query'),
            'status' => $this->request->string('status', '', 'query'),
        ];

        $result = $this->testimonials->paginate($filters, $this->page(), $this->perPage());
        Response::paginated($result['items'], $result['meta']);
    }

    /** GET /admin/testimonials/{id} */
    public function show(): void
    {
        $t = $this->testimonials->findById($this->id());
        if (!$t) Response::notFound('التقييم المطلوب غير موجود');
        Response::success($t);
    }

    /** POST /admin/testimonials */
    public function store(): void
    {
        $data = $this->validateInput();

        if ($this->request->hasFile('image')) {
            $data['image'] = $this->storage('testimonials')->upload($this->request->file('image'));
        } else {
            $data['image'] = null;
        }

        $t = $this->testimonials->create($data);
        Response::created($t, 'تمت إضافة التقييم بنجاح');
    }

    /** POST /admin/testimonials/{id} (يحاكي PUT للـ FormData) */
    public function update(): void
    {
        $id = $this->id();
        $t  = $this->testimonials->findById($id);
        if (!$t) Response::notFound('التقييم المطلوب غير موجود');

        $data = $this->validateInput();

        if ($this->request->hasFile('image')) {
            $data['image'] = $this->storage('testimonials')->replace($t['image'], $this->request->file('image'));
        } else {
            $data['image'] = $t['image'];
        }

        $updated = $this->testimonials->update($id, $data);
        Response::success($updated, 'تم تحديث التقييم بنجاح');
    }

    /** DELETE /admin/testimonials/{id} */
    public function destroy(): void
    {
        $id = $this->id();
        $t  = $this->testimonials->findById($id);
        if (!$t) Response::notFound('التقييم المطلوب غير موجود');

        if ($t['image']) {
            $this->storage('testimonials')->delete($t['image']);
        }

        $this->testimonials->delete($id);
        Response::success(null, 'تم حذف التقييم بنجاح');
    }

    /** POST /admin/testimonials/bulk-delete */
    public function bulkDestroy(): void
    {
        $ids = $this->request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            Response::error('يجب إرسال قائمة المعرفات لحذفها', 422);
        }

        $ids = array_filter(array_map('intval', $ids));
        if (empty($ids)) Response::error('معرفات غير صالحة', 422);

        $images = $this->testimonials->getImages($ids);
        foreach ($images as $row) {
            if (!empty($row['image'])) {
                $this->storage('testimonials')->delete($row['image']);
            }
        }

        $count = $this->testimonials->deleteMany($ids);
        Response::success(null, "تم حذف $count آراء عملاء بنجاح");
    }

    private function validateInput(): array
    {
        $input = [
            'name'      => $this->request->string('name'),
            'job_title' => $this->request->string('job_title'),
            'comment'   => $this->request->string('comment'),
            'rating'    => $this->request->integer('rating', 5, 'body'),
            'status'    => $this->request->string('status', 'active'),
        ];

        Validator::validate($input, [
            'name'      => 'required|min:2|max:100',
            'job_title' => 'required|min:2|max:100',
            'comment'   => 'required|min:5',
            'rating'    => 'required|integer|min_val:1|max_val:5',
            'status'    => 'required|in:active,inactive',
        ]);

        return $input;
    }
}
