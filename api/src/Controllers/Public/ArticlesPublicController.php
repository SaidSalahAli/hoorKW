<?php
declare(strict_types=1);
namespace App\Controllers\Public;

use App\Core\{BaseController, Response, Paginator};
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

        // دعم ترقيم الصفحات
        $page    = $this->page();
        $perPage = $this->perPage();
        $search  = $this->request->string('search', '', 'query');

        $where  = ["status = 'published'"];
        $params = [];

        if (!empty($search)) {
            $where[]  = '(title LIKE ? OR excerpt LIKE ?)';
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }

        $result = Paginator::paginate('articles', [
            'select'   => 'id, title, slug, image, excerpt, views, published_at, created_at',
            'where'    => implode(' AND ', $where),
            'params'   => $params,
            'page'     => $page,
            'per_page' => $perPage,
            'order'    => 'published_at DESC',
        ]);

        Response::paginated($result['items'], $result['meta'], 'تم جلب المقالات بنجاح');
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
