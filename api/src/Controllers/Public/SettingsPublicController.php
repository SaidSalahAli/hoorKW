<?php
declare(strict_types=1);
namespace App\Controllers\Public;

use App\Core\{BaseController, Response};
use App\Repositories\SettingsRepository;

/** SettingsPublicController — إعدادات ومعلومات الاتصال بالموقع */
final class SettingsPublicController extends BaseController
{
    private SettingsRepository $settings;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->settings = new SettingsRepository();
    }

    /** GET /public/settings أو /api/settings */
    public function show(): void
    {
        $settings = $this->settings->get();
        if (!$settings) {
            $settings = $this->settings->createDefault();
        }

        // إخفاء الحقول الحساسة أو غير الضرورية إن وجدت
        unset($settings['created_at'], $settings['updated_at']);

        Response::success($settings, 'تم جلب إعدادات الموقع بنجاح');
    }
}
