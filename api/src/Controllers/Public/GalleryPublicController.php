<?php
declare(strict_types=1);
namespace App\Controllers\Public;

use App\Core\{BaseController, Response};
use App\Repositories\GalleryRepository;

/** GalleryPublicController — معرض الصور العام للموقع */
final class GalleryPublicController extends BaseController
{
    private GalleryRepository $gallery;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->gallery = new GalleryRepository();
    }

    /** GET /public/gallery أو /api/gallery */
    public function index(): void
    {
        $limit = $this->request->integer('limit', 24, 'query');
        $images = $this->gallery->getAll($limit);
        Response::success($images, 'تم جلب معرض الصور بنجاح');
    }
}
