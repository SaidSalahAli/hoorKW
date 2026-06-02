<?php
declare(strict_types=1);
namespace App\Controllers\Admin;

use App\Core\{BaseController, Response, Database};

/** DashboardController — إحصائيات وتقارير لوحة التحكم */
final class DashboardController extends BaseController
{
    public function index(): void
    {
        $this->requireAdmin();

        // 1. الإحصائيات العامة
        $totalRequests     = Database::count('service_requests');
        $totalServices     = Database::count('services');
        $totalArticles     = Database::count('articles');
        $totalTestimonials = Database::count('testimonials');
        $newRequests       = Database::count('service_requests', "status = 'new'");
        $totalGallery      = Database::count('gallery');

        // 2. طلبات آخر 6 أشهر
        $monthlyRequests = Database::all("
            SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
            FROM service_requests
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at, '%Y-%m')
            ORDER BY month ASC
        ");

        // 3. أداء الخدمات (الأكثر طلباً)
        $servicesPerformance = Database::all("
            SELECT s.title AS service, COUNT(r.id) AS requests
            FROM services s
            LEFT JOIN service_requests r ON r.service_id = s.id
            WHERE s.status = 'active'
            GROUP BY s.id, s.title
            ORDER BY requests DESC
            LIMIT 8
        ");

        // 4. آخر 10 طلبات
        $latestRequestsRaw = Database::all("
            SELECT r.id, r.name, r.phone, r.status, r.created_at, s.title AS service_title
            FROM service_requests r
            LEFT JOIN services s ON r.service_id = s.id
            ORDER BY r.created_at DESC
            LIMIT 10
        ");

        $latestRequests = array_map(function ($row) {
            $serviceTitle = $row['service_title'];
            unset($row['service_title']);
            $row['service'] = $serviceTitle ? ['title' => $serviceTitle] : null;
            return $row;
        }, $latestRequestsRaw);

        // 5. توزيع الطلبات حسب الحالة
        $requestsByStatus = Database::all("
            SELECT status, COUNT(*) AS count
            FROM service_requests
            GROUP BY status
        ");

        Response::success([
            'total_requests'       => $totalRequests,
            'total_services'       => $totalServices,
            'total_articles'       => $totalArticles,
            'total_testimonials'   => $totalTestimonials,
            'total_gallery'        => $totalGallery,
            'new_requests'         => $newRequests,
            'monthly_requests'     => $monthlyRequests,
            'services_performance' => $servicesPerformance,
            'latest_requests'      => $latestRequests,
            'requests_by_status'   => $requestsByStatus,
        ], 'إحصائيات لوحة التحكم بنجاح');
    }
}
