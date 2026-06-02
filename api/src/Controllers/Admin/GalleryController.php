<?php
declare(strict_types=1);
namespace App\Controllers\Admin;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\GalleryRepository;

/** GalleryController — إدارة الصور المعروضة من أعمال الشركة */
final class GalleryController extends BaseController
{
    private GalleryRepository $gallery;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->gallery = new GalleryRepository();
    }

    /** GET /admin/gallery */
    public function index(): void
    {
        $filters = [
            'search' => $this->request->string('search', '', 'query'),
        ];

        $result = $this->gallery->paginate($filters, $this->page(), $this->perPage());
        Response::paginated($result['items'], $result['meta']);
    }

    /** POST /admin/gallery */
    public function store(): void
    {
        $title     = $this->request->string('title');
        $sortOrder = $this->request->integer('sort_order', 0, 'body');

        Validator::validate(
            ['title' => $title],
            ['title' => 'required|min:2|max:150']
        );

        if (!$this->request->hasFile('image')) {
            Response::error('يجب رفع ملف الصورة مع هذا الطلب', 422);
        }

        $imagePath = $this->storage('gallery')->upload($this->request->file('image'));

        $image = $this->gallery->create([
            'title'      => $title,
            'image'      => $imagePath,
            'sort_order' => $sortOrder,
        ]);

        Response::created($image, 'تمت إضافة الصورة إلى المعرض بنجاح');
    }

    /** DELETE /admin/gallery/{id} */
    public function destroy(): void
    {
        $id    = $this->id();
        $image = $this->gallery->findById($id);
        if (!$image) Response::notFound('الصورة المطلوبة غير موجودة');

        $this->storage('gallery')->delete($image['image']);
        $this->gallery->delete($id);

        Response::success(null, 'تم حذف الصورة من المعرض بنجاح');
    }

    /** POST /admin/gallery/bulk-delete */
    public function bulkDestroy(): void
    {
        $ids = $this->request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            Response::error('يجب تحديد الصور المراد حذفها', 422);
        }

        $ids = array_filter(array_map('intval', $ids));
        if (empty($ids)) Response::error('معرفات غير صالحة', 422);

        $images = $this->gallery->getImages($ids);
        foreach ($images as $row) {
            if (!empty($row['image'])) {
                $this->storage('gallery')->delete($row['image']);
            }
        }

        $count = $this->gallery->deleteMany($ids);
        Response::success(null, "تم حذف $count صور من المعرض بنجاح");
    }
}
