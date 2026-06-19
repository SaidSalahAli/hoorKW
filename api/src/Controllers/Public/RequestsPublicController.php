<?php
declare(strict_types=1);
namespace App\Controllers\Public;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\{RequestRepository, ServiceRepository};
use App\Services\MailService;

/** RequestsPublicController — تقديم طلبات خدمة جديدة من زوار الموقع */
final class RequestsPublicController extends BaseController
{
    private RequestRepository $requests;
    private ServiceRepository $services;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->requests = new RequestRepository();
        $this->services = new ServiceRepository();
    }

    /** POST /public/request أو /api/requests */
    public function store(): void
    {
        $name      = $this->request->string('name');
        $phone     = $this->request->string('phone');
        $serviceId = $this->request->integer('service_id', 0, 'body');
        $message   = $this->request->string('message');

        Validator::validate(
            [
                'name'    => $name,
                'phone'   => $phone,
                'message' => $message,
            ],
            [
                'name'    => 'required|min:2|max:100',
                'phone'   => 'required|phone',
                'message' => 'required|min:10|max:1000',
            ]
        );

        $validServiceId = null;
        $serviceName = 'طلب عام (عفش وأثاث)';
        if ($serviceId > 0) {
            $service = $this->services->findById($serviceId);
            if ($service && $service['status'] === 'active') {
                $validServiceId = $serviceId;
                $serviceName = $service['title'];
            }
        }

        $requestData = [
            'name'       => $name,
            'phone'      => $phone,
            'service_id' => $validServiceId,
            'message'    => $message,
            'status'     => 'new',
        ];

        $request = $this->requests->create($requestData);

        // إرسال تنبيه بالبريد الإلكتروني للإدارة
        MailService::sendNotification($name, $phone, $serviceName, $message);

        Response::created($request, 'تم إرسال طلب الخدمة بنجاح، سنتواصل معك قريباً');
    }
}
