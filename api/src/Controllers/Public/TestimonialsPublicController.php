<?php
declare(strict_types=1);
namespace App\Controllers\Public;

use App\Core\{BaseController, Response};
use App\Repositories\TestimonialRepository;

/** TestimonialsPublicController — آراء العملاء العامة للموقع */
final class TestimonialsPublicController extends BaseController
{
    private TestimonialRepository $testimonials;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->testimonials = new TestimonialRepository();
    }

    /** GET /public/testimonials أو /api/testimonials */
    public function index(): void
    {
        $limit = $this->request->integer('limit', 6, 'query');
        $testimonials = $this->testimonials->getActive($limit);
        Response::success($testimonials, 'تم جلب آراء العملاء بنجاح');
    }
}
