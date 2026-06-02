<?php
declare(strict_types=1);
namespace App\Controllers\Public;

use App\Core\{BaseController, Response};
use App\Repositories\ServiceRepository;

/** ServicesPublicController — جلب الخدمات المتاحة للجمهور */
final class ServicesPublicController extends BaseController
{
    private ServiceRepository $services;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->services = new ServiceRepository();
    }

    /** GET /public/services أو /api/services */
    public function index(): void
    {
        $limit = $this->request->integer('limit', 12, 'query');
        $services = $this->services->getActive($limit);
        Response::success($services, 'تم جلب الخدمات بنجاح');
    }

    /** GET /public/services/{slug} أو /api/services/slug/{slug} */
    public function show(): void
    {
        $slug = $this->slug();
        $service = $this->services->findBySlug($slug, true);

        if (!$service) {
            Response::notFound('الخدمة المطلوبة غير متوفرة');
        }

        Response::success($service, 'تم جلب الخدمة بنجاح');
    }
}
