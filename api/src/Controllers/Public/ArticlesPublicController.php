<?php
declare(strict_types=1);
namespace App\Controllers\Public;

use App\Core\{BaseController, Response, Database};
use App\Repositories\ArticleRepository;

/** ArticlesPublicController — مقالات المدونة العامة للموقع */
final class ArticlesPublicController extends BaseController
{
    private ArticleRepository $articles;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->articles = new ArticleRepository();
    }

    public function index(): void
    {
        $token = $this->request->bearerToken();
        if ($token) {
            $jwt = new \App\Services\JwtService($this->config['jwt']);
            if ($jwt->verify($token)) {
                $adminController = new \App\Controllers\Admin\ArticlesController($this->request, $this->config);
                $adminController->index();
                return;
            }
        }

        // جلب جميع المقالات المنشورة مع دعم البحث
        $search = $this->request->string('search', '', 'query');

        $sql    = "SELECT id, title, slug, image, excerpt, views, published_at, created_at
                   FROM articles WHERE status = 'published'";
        $params = [];

        if (!empty($search)) {
            $sql   .= " AND (title LIKE ? OR excerpt LIKE ?)";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }

        $sql .= " ORDER BY published_at DESC";

        $articles = Database::all($sql, $params);
        Response::success($articles, 'تم جلب المقالات بنجاح');
    }

    /** GET /public/articles/{slug} أو /api/articles/slug/{slug} */
    public function show(): void
    {
        $slug = $this->slug();
        $article = $this->articles->findBySlug($slug, true);

        if (!$article) {
            Response::notFound('المقال المطلوب غير متوفر أو غير منشور');
        }

        // زيادة عداد المشاهدات تلقائياً عند القراءة
        $this->articles->incrementViews((int)$article['id']);
        $article['views']++;

        // جلب المقالات ذات الصلة (أكثر مشاهدة)
        $related = $this->articles->getRelated((int)$article['id'], 3);
        $article['related'] = $related;

        Response::success($article, 'تم جلب المقال بنجاح');
    }
}
