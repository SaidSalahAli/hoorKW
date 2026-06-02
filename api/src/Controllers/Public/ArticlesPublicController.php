<?php
declare(strict_types=1);
namespace App\Controllers\Public;

use App\Core\{BaseController, Response};
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

    /** GET /public/articles أو /api/articles */
    public function index(): void
    {
        $limit = $this->request->integer('limit', 6, 'query');
        $latest = $this->articles->getLatest($limit);
        Response::success($latest, 'تم جلب المقالات بنجاح');
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
