<?php
declare(strict_types=1);
namespace App\Controllers\Admin;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\ArticleRepository;

/** ArticlesController — إدارة مقالات المدونة للمشرفين */
final class ArticlesController extends BaseController
{
    private ArticleRepository $articles;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->articles = new ArticleRepository();
    }

    /** GET /admin/articles */
    public function index(): void
    {
        $filters = [
            'search' => $this->request->string('search', '', 'query'),
            'status' => $this->request->string('status', '', 'query'),
        ];

        $result = $this->articles->paginate($filters, $this->page(), $this->perPage());
        Response::paginated($result['items'], $result['meta']);
    }

    /** GET /admin/articles/{id} */
    public function show(): void
    {
        $article = $this->articles->findById($this->id());
        if (!$article) Response::notFound('المقال المطلوب غير موجود');
        Response::success($article);
    }

    /** POST /admin/articles */
    public function store(): void
    {
        $data = $this->validateInput();

        if ($this->articles->slugExists($data['slug'])) {
            Response::error('الرابط المميز (Slug) مستخدم بالفعل، يرجى اختيار رابط آخر', 422);
        }

        if ($this->request->hasFile('image')) {
            $data['image'] = $this->storage('articles')->upload($this->request->file('image'));
        } else {
            $data['image'] = null;
        }

        $data['published_at'] = $data['status'] === 'published' ? date('Y-m-d H:i:s') : null;

        $article = $this->articles->create($data);
        Response::created($article, 'تم نشر المقال بنجاح');
    }

    /** POST /admin/articles/{id} (يحاكي PUT للـ FormData) */
    public function update(): void
    {
        $id      = $this->id();
        $article = $this->articles->findById($id);
        if (!$article) Response::notFound('المقال المطلوب غير موجود');

        $data = $this->validateInput((string)$id);

        if ($this->articles->slugExists($data['slug'], $id)) {
            Response::error('الرابط المميز (Slug) مستخدم بالفعل لمقال آخر', 422);
        }

        if ($this->request->hasFile('image')) {
            $data['image'] = $this->storage('articles')->replace($article['image'], $this->request->file('image'));
        } else {
            $data['image'] = $article['image'];
        }

        // تحديث تاريخ النشر إذا تغيرت الحالة إلى منشور
        if ($data['status'] === 'published' && !$article['published_at']) {
            $data['published_at'] = date('Y-m-d H:i:s');
        } elseif ($data['status'] !== 'published') {
            $data['published_at'] = null;
        } else {
            $data['published_at'] = $article['published_at'];
        }

        $updated = $this->articles->update($id, $data);
        Response::success($updated, 'تم تحديث المقال بنجاح');
    }

    /** DELETE /admin/articles/{id} */
    public function destroy(): void
    {
        $id      = $this->id();
        $article = $this->articles->findById($id);
        if (!$article) Response::notFound('المقال المطلوب غير موجود');

        if ($article['image']) {
            $this->storage('articles')->delete($article['image']);
        }

        $this->articles->delete($id);
        Response::success(null, 'تم حذف المقال بنجاح');
    }

    /** POST /admin/articles/bulk-delete */
    public function bulkDestroy(): void
    {
        $ids = $this->request->input('ids');
        if (!is_array($ids) || empty($ids)) {
            Response::error('يجب إرسال قائمة المعرفات لحذفها', 422);
        }

        $ids = array_filter(array_map('intval', $ids));
        if (empty($ids)) Response::error('معرفات غير صالحة', 422);

        $images = $this->articles->getImages($ids);
        foreach ($images as $row) {
            if (!empty($row['image'])) {
                $this->storage('articles')->delete($row['image']);
            }
        }

        $count = $this->articles->deleteMany($ids);
        Response::success(null, "تم حذف $count مقالات بنجاح");
    }

    private function validateInput(?string $excludeId = null): array
    {
        $input = [
            'title'            => $this->request->string('title'),
            'slug'             => $this->request->string('slug'),
            'excerpt'          => $this->request->string('excerpt'),
            'content'          => $this->request->string('content'),
            'meta_title'       => $this->request->string('meta_title'),
            'meta_description' => $this->request->string('meta_description'),
            'status'           => $this->request->string('status', 'published'),
        ];

        Validator::validate($input, [
            'title'   => 'required|min:3|max:200',
            'slug'    => 'required|min:2|max:200|slug',
            'excerpt' => 'required|min:10|max:300',
            'content' => 'required|min:20',
            'status'  => 'required|in:published,draft,inactive',
        ]);

        return $input;
    }
}
