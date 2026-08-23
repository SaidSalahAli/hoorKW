<?php
define('BASE_PATH', __DIR__);
define('SRC_PATH', BASE_PATH . '/src');

require_once SRC_PATH . '/Core/EnvLoader.php';
\App\Core\EnvLoader::load(BASE_PATH . '/.env');

require_once SRC_PATH . '/Core/Autoloader.php';
Autoloader::register(SRC_PATH);

$smtpHost = $_ENV['SMTP_HOST'] ?? 'ssl://smtp.hostinger.com';
$smtpPort = (int)($_ENV['SMTP_PORT'] ?? 465);
$smtpUser = $_ENV['SMTP_USER'] ?? 'info@elhoormoving.com';
$smtpPass = $_ENV['SMTP_PASS'] ?? 'Shady@2201';

echo "Testing SMTP Connection to $smtpHost:$smtpPort with user $smtpUser...\n";

$socket = @fsockopen($smtpHost, $smtpPort, $errno, $errstr, 15);
if (!$socket) {
    echo "ERROR: Failed to connect to $smtpHost:$smtpPort - $errstr ($errno)\n";
    exit(1);
}

function readResp($socket) {
    $data = '';
    while ($str = fgets($socket, 512)) {
        $data .= $str;
        if (substr($str, 3, 1) === ' ') {
            break;
        }
    }
    return $data;
}

function writeCmd($socket, $cmd) {
    echo "> $cmd\n";
    fwrite($socket, $cmd . "\r\n");
    $resp = readResp($socket);
    echo "< $resp";
    return $resp;
}

$resp = readResp($socket);
echo "< $resp";

writeCmd($socket, "EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
writeCmd($socket, "AUTH LOGIN");
writeCmd($socket, base64_encode($smtpUser));
$authResp = writeCmd($socket, base64_encode($smtpPass));

if (strpos($authResp, '235') === 0) {
    echo "\n>>> SMTP AUTHENTICATION SUCCESSFUL! <<<\n\n";
} else {
    echo "\n>>> SMTP AUTHENTICATION FAILED! Check password. <<<\n\n";
    fclose($socket);
    exit(1);
}

writeCmd($socket, "MAIL FROM: <$smtpUser>");
writeCmd($socket, "RCPT TO: <info@elhoormoving.com>");
writeCmd($socket, "DATA");

$subject = '=?UTF-8?B?' . base64_encode('اختبار إرسال البريد - الحور لنقل الأثاث') . '?=';
$body = "From: Hoor Moving Website <$smtpUser>\r\n";
$body .= "To: <info@elhoormoving.com>\r\n";
$body .= "Subject: $subject\r\n";
$body .= "MIME-Version: 1.0\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "X-Mailer: PHP/" . phpversion() . "\r\n\r\n";
$body .= "<h2>تجربة إرسال عبر SMTP مباشرة</h2><p>هذا إيميل تجريبي للتأكد من وصول الرسائل إلى صندوق الوارد (Inbox).</p>\r\n.\r\n";

fwrite($socket, $body);
$dataResp = readResp($socket);
echo "< $dataResp";

writeCmd($socket, "QUIT");
fclose($socket);

if (strpos($dataResp, '250') === 0) {
    echo "\n>>> SUCCESS: EMAIL DISPATCHED VIA HOSTINGER SMTP! <<<\n";
} else {
    echo "\n>>> FAIL: Could not send email content. <<<\n";
}
