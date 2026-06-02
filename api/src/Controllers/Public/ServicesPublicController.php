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

    public function index(): void
    {
        $token = $this->request->bearerToken();
        if ($token) {
            $jwt = new \App\Services\JwtService($this->config['jwt']);
            if ($jwt->verify($token)) {
                $adminController = new \App\Controllers\Admin\ServicesController($this->request, $this->config);
                $adminController->index();
                return;
            }
        }

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
