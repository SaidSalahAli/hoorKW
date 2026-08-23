<?php
define('BASE_PATH', __DIR__);
define('SRC_PATH', BASE_PATH . '/src');

require_once SRC_PATH . '/Core/EnvLoader.php';
\App\Core\EnvLoader::load(BASE_PATH . '/.env');

require_once SRC_PATH . '/Core/Autoloader.php';
Autoloader::register(SRC_PATH);

echo "Sending test notification via MailService...\n";

$result = \App\Services\MailService::sendNotification(
    'محمد علي (اختبار الموقع)',
    '0551234567',
    'نقل عفش دوانية وشقة كاملة',
    'طلب معاينة ونقل عفش مع التغليف والتركيب.'
);

if ($result) {
    echo "SUCCESS: Email sent successfully via Hostinger SMTP!\n";
} else {
    echo "FAILED: Email sending failed. Check storage/logs/\n";
}
