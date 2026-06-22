<?php
declare(strict_types=1);
namespace App\Services;

/**
 * MailService — معالجة إرسال رسائل البريد الإلكتروني للتنبيهات (دعم SMTP و Mail)
 */
final class MailService
{
    /**
     * تسجيل الأخطاء الخاصة بالبريد الإلكتروني في ملف منفصل للتسهيل
     */
    private static function logError(string $message): void
    {
        $logPath = BASE_PATH . '/storage/logs/';
        if (!is_dir($logPath)) {
            mkdir($logPath, 0755, true);
        }
        $file = $logPath . 'mail-' . date('Y-m-d') . '.log';
        $line = sprintf("[%s] %s\n", date('Y-m-d H:i:s'), $message);
        file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
    }

    /**
     * إرسال تنبيه بالبريد الإلكتروني عند طلب عرض سعر أو رسالة جديدة
     */
    public static function sendNotification(string $name, string $phone, string $serviceName, string $message): bool
    {
        $to = 'info@elhoormoving.com';
        $subject = 'طلب عرض سعر / رسالة جديدة من الموقع - ' . $name;
        
        // ترميز العنوان لدعم اللغة العربية بشكل صحيح وتجنب المشاكل في خوادم البريد
        $subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

        // تصميم قالب البريد الإلكتروني المتوافق مع الموبايل بشكل كامل
        $htmlContent = '<!DOCTYPE html>
<html lang="ar" dir="rtl" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>طلب جديد - الحور لنقل الأثاث</title>
    <style type="text/css">
        /* Reset */
        body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        body { margin: 0 !important; padding: 0 !important; }

        /* Mobile responsive */
        @media screen and (max-width: 600px) {
            .email-wrapper { width: 100% !important; padding: 10px !important; }
            .email-container { width: 100% !important; max-width: 100% !important; border-radius: 8px !important; }
            .header-td { padding: 20px 16px !important; }
            .header-td h1 { font-size: 20px !important; }
            .body-td { padding: 20px 16px !important; }
            .intro-text { font-size: 14px !important; }
            .data-label { font-size: 12px !important; padding: 10px 8px !important; width: 35% !important; }
            .data-value { font-size: 13px !important; padding: 10px 8px !important; }
            .phone-value { font-size: 15px !important; }
            .message-box { padding: 14px !important; }
            .footer-td { padding: 16px !important; font-size: 11px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">

    <!-- Wrapper -->
    <table role="presentation" class="email-wrapper" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f1f5f9; padding: 24px 12px;">
        <tr>
            <td align="center">

                <!-- Container -->
                <table role="presentation" class="email-container" cellspacing="0" cellpadding="0" border="0"
                    style="width: 100%; max-width: 580px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.07);">

                    <!-- ═══ HEADER ═══ -->
                    <tr>
                        <td class="header-td" style="background-color: #0f172a; padding: 28px 24px; text-align: center; border-bottom: 4px solid #eab308;">
                            <h1 style="color: #ffffff; margin: 0 0 6px 0; font-size: 22px; font-weight: bold; line-height: 1.3;">الحور لنقل الأثاث</h1>
                            <p style="color: #eab308; margin: 0; font-size: 13px; font-weight: bold;">📩 طلب عرض سعر / رسالة جديدة من الموقع</p>
                        </td>
                    </tr>

                    <!-- ═══ BODY ═══ -->
                    <tr>
                        <td class="body-td" style="padding: 28px 24px; background-color: #ffffff;">

                            <p class="intro-text" style="color: #334155; font-size: 15px; line-height: 1.7; margin: 0 0 22px 0; text-align: right;">
                                مرحباً،<br>
                                تم استلام طلب جديد من خلال نموذج الموقع الإلكتروني. إليك التفاصيل الكاملة:
                            </p>

                            <!-- Details Table -->
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"
                                style="margin-bottom: 22px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">

                                <!-- Name Row -->
                                <tr style="background-color: #f8fafc;">
                                    <td class="data-label" width="35%" style="padding: 13px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: bold; white-space: nowrap;">
                                        👤 اسم العميل
                                    </td>
                                    <td class="data-value" style="padding: 13px 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; font-weight: bold; border-right: 1px solid #e2e8f0; word-break: break-word;">
                                        ' . htmlspecialchars($name) . '
                                    </td>
                                </tr>

                                <!-- Phone Row -->
                                <tr style="background-color: #ffffff;">
                                    <td class="data-label" width="35%" style="padding: 13px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: bold; white-space: nowrap;">
                                        📞 رقم الهاتف
                                    </td>
                                    <td class="data-value" style="padding: 13px 12px; border-bottom: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0;">
                                        <a class="phone-value" href="tel:' . htmlspecialchars($phone) . '"
                                            style="color: #eab308; font-size: 17px; font-weight: bold; text-decoration: none; direction: ltr; display: inline-block; letter-spacing: 0.5px;">
                                            ' . htmlspecialchars($phone) . '
                                        </a>
                                    </td>
                                </tr>

                                <!-- Service Row -->
                                <tr style="background-color: #f8fafc;">
                                    <td class="data-label" width="35%" style="padding: 13px 12px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: bold; white-space: nowrap;">
                                        🚛 الخدمة
                                    </td>
                                    <td class="data-value" style="padding: 13px 12px; border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; border-right: 1px solid #e2e8f0; word-break: break-word;">
                                        ' . htmlspecialchars($serviceName) . '
                                    </td>
                                </tr>

                                <!-- Date Row -->
                                <tr style="background-color: #ffffff;">
                                    <td class="data-label" width="35%" style="padding: 13px 12px; color: #64748b; font-size: 13px; font-weight: bold; white-space: nowrap;">
                                        🕐 التاريخ
                                    </td>
                                    <td class="data-value" style="padding: 13px 12px; color: #64748b; font-size: 13px; border-right: 1px solid #e2e8f0; direction: ltr; text-align: right;">
                                        ' . date('Y-m-d H:i:s') . '
                                    </td>
                                </tr>
                            </table>

                            <!-- Message Box -->
                            <div class="message-box" style="background-color: #fffbeb; border: 1px solid #fde68a; border-right: 4px solid #eab308; padding: 18px; border-radius: 8px; text-align: right;">
                                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 13px; font-weight: bold;">💬 تفاصيل الرسالة / متطلبات النقل:</p>
                                <p style="margin: 0; color: #374151; font-size: 14px; line-height: 1.8; word-break: break-word; white-space: pre-wrap;">' . nl2br(htmlspecialchars($message)) . '</p>
                            </div>

                        </td>
                    </tr>

                    <!-- ═══ FOOTER ═══ -->
                    <tr>
                        <td class="footer-td" style="background-color: #f8fafc; padding: 18px 24px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; line-height: 1.6;">
                            هذه الرسالة تم إنشاؤها تلقائياً من موقع الحور لنقل الأثاث<br>
                            &copy; ' . date('Y') . ' الحور لنقل الأثاث &nbsp;|&nbsp; جميع الحقوق محفوظة
                        </td>
                    </tr>

                </table>
                <!-- /Container -->

            </td>
        </tr>
    </table>
    <!-- /Wrapper -->

</body>
</html>';

        // تحديد البريد المرسل وعنوان الرد
        $smtpUser = $_ENV['SMTP_USER'] ?? 'info@elhoormoving.com';

        // Headers
        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=UTF-8';
        $headers[] = 'From: Hoor Moving Website <' . $smtpUser . '>';
        $headers[] = 'Reply-To: ' . $smtpUser;
        $headers[] = 'X-Mailer: PHP/' . phpversion();

        // 1. إذا تم توفير كلمة مرور SMTP في ملف البيئة، يتم الإرسال عبر SMTP مباشرة لضمان صندوق الوارد
        if (!empty($_ENV['SMTP_PASS'])) {
            $smtpSuccess = self::sendViaSMTP($to, $subject, $htmlContent, $headers);
            if ($smtpSuccess) {
                return true;
            }
            // إذا فشل الإرسال عبر SMTP لأي سبب، يتم تسجيل الخطأ والمحاولة عبر دالة mail() الافتراضية كخيار بديل
            self::logError("SMTP dispatch failed. Falling back to local mail().");
        }

        // 2. البديل الافتراضي: الإرسال عبر دالة mail() الخاصة بـ PHP
        $headersString = implode("\r\n", $headers);

        try {
            $success = mail($to, $subject, $htmlContent, $headersString);
            if (!$success) {
                self::logError("Failed to send email to $to. PHP mail() returned false.");
                return false;
            }
            return true;
        } catch (\Throwable $e) {
            self::logError("Failed to send email to $to. Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * إرسال البريد الإلكتروني عبر الاتصال المباشر بخادم SMTP (بدون مكتبات خارجية)
     */
    private static function sendViaSMTP(string $to, string $subject, string $htmlContent, array $headers): bool
    {
        $smtpHost = $_ENV['SMTP_HOST'] ?? 'ssl://smtp.hostinger.com';
        $smtpPort = (int)($_ENV['SMTP_PORT'] ?? 465);
        $smtpUser = $_ENV['SMTP_USER'] ?? 'info@elhoormoving.com';
        $smtpPass = $_ENV['SMTP_PASS'] ?? 'Shady@2201';

        $socket = @fsockopen($smtpHost, $smtpPort, $errno, $errstr, 15);
        if (!$socket) {
            self::logError("SMTP Connection failed: $errstr ($errno)");
            return false;
        }

        $read = function($socket) {
            $data = '';
            while ($str = fgets($socket, 512)) {
                $data .= $str;
                if (substr($str, 3, 1) === ' ') {
                    break;
                }
            }
            return $data;
        };

        $write = function($socket, $cmd) use ($read) {
            fwrite($socket, $cmd . "\r\n");
            return $read($socket);
        };

        $response = $read($socket);
        if (strpos($response, '220') !== 0) {
            self::logError("SMTP Welcome failed: " . $response);
            fclose($socket);
            return false;
        }

        $response = $write($socket, "EHLO " . ($_SERVER['SERVER_NAME'] ?? 'localhost'));
        if (strpos($response, '250') !== 0) {
            self::logError("SMTP EHLO failed: " . $response);
            fclose($socket);
            return false;
        }

        $response = $write($socket, "AUTH LOGIN");
        if (strpos($response, '334') !== 0) {
            self::logError("SMTP AUTH LOGIN failed: " . $response);
            fclose($socket);
            return false;
        }

        $response = $write($socket, base64_encode($smtpUser));
        if (strpos($response, '334') !== 0) {
            self::logError("SMTP Username failed: " . $response);
            fclose($socket);
            return false;
        }

        $response = $write($socket, base64_encode($smtpPass));
        if (strpos($response, '235') !== 0) {
            self::logError("SMTP Password authentication failed (Check SMTP_PASS in .env): " . $response);
            fclose($socket);
            return false;
        }

        $response = $write($socket, "MAIL FROM: <" . $smtpUser . ">");
        if (strpos($response, '250') !== 0) {
            self::logError("SMTP MAIL FROM failed: " . $response);
            fclose($socket);
            return false;
        }

        $response = $write($socket, "RCPT TO: <" . $to . ">");
        if (strpos($response, '250') !== 0) {
            self::logError("SMTP RCPT TO failed: " . $response);
            fclose($socket);
            return false;
        }

        $response = $write($socket, "DATA");
        if (strpos($response, '354') !== 0) {
            self::logError("SMTP DATA command failed: " . $response);
            fclose($socket);
            return false;
        }

        // بناء جسم الرسالة والترويسات
        $emailData = '';
        foreach ($headers as $header) {
            $emailData .= $header . "\r\n";
        }
        $emailData .= "Subject: " . $subject . "\r\n";
        $emailData .= "To: <" . $to . ">\r\n";
        $emailData .= "\r\n"; // نهاية الترويسات وبداية المحتوى
        $emailData .= $htmlContent;
        $emailData .= "\r\n.\r\n";

        fwrite($socket, $emailData);
        $response = $read($socket);
        if (strpos($response, '250') !== 0) {
            self::logError("SMTP sending DATA failed: " . $response);
            fclose($socket);
            return false;
        }

        $write($socket, "QUIT");
        fclose($socket);
        return true;
    }
}
