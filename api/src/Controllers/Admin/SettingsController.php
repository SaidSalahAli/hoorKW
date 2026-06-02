<?php
declare(strict_types=1);
namespace App\Controllers\Admin;

use App\Core\{BaseController, Response, Validator};
use App\Repositories\SettingsRepository;

/** SettingsController — إدارة إعدادات ومعلومات الشركة من لوحة التحكم */
final class SettingsController extends BaseController
{
    private SettingsRepository $settings;

    public function __construct($request, $config)
    {
        parent::__construct($request, $config);
        $this->settings = new SettingsRepository();
    }

    /** GET /admin/settings */
    public function show(): void
    {
        $settings = $this->settings->get();
        if (!$settings) {
            $settings = $this->settings->createDefault();
        }
        Response::success($settings);
    }

    /** POST /admin/settings */
    public function update(): void
    {
        $settings = $this->settings->get();
        if (!$settings) {
            $settings = $this->settings->createDefault();
        }

        $data = [
            'site_name'       => $this->request->string('site_name'),
            'phone'           => $this->request->string('phone'),
            'whatsapp'        => $this->request->string('whatsapp'),
            'email'           => $this->request->string('email'),
            'address'         => $this->request->string('address'),
            'seo_title'       => $this->request->string('seo_title'),
            'seo_description' => $this->request->string('seo_description'),
            'facebook'        => $this->request->string('facebook'),
            'instagram'       => $this->request->string('instagram'),
            'twitter'         => $this->request->string('twitter'),
            'youtube'         => $this->request->string('youtube'),
        ];

        Validator::validate($data, [
            'site_name' => 'required|min:2|max:100',
            'phone'     => 'required|phone',
            'whatsapp'  => 'required|phone',
            'email'     => 'nullable|email',
            'facebook'  => 'nullable|url',
            'instagram' => 'nullable|url',
            'twitter'   => 'nullable|url',
            'youtube'   => 'nullable|url',
        ]);

        $storage = $this->storage('settings');

        // رفع الشعار (Logo)
        if ($this->request->hasFile('logo')) {
            $data['logo'] = $storage->replace($settings['logo'], $this->request->file('logo'));
        } else {
            $data['logo'] = $settings['logo'];
        }

        // رفع أيقونة المتصفح (Favicon)
        if ($this->request->hasFile('favicon')) {
            $data['favicon'] = $storage->replace($settings['favicon'], $this->request->file('favicon'));
        } else {
            $data['favicon'] = $settings['favicon'];
        }

        $updated = $this->settings->update((int)$settings['id'], $data);
        Response::success($updated, 'تم حفظ الإعدادات بنجاح');
    }
}
