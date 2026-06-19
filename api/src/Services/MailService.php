<?php
declare(strict_types=1);
namespace App\Services;

/**
 * MailService — معالجة إرسال رسائل البريد الإلكتروني للتنبيهات
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

        // تصميم قالب البريد الإلكتروني بشكل احترافي ومتوافق مع الهوية البصرية (كحلي وذهبي)
        $htmlContent = '
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>طلب جديد</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: Tahoma, Arial, sans-serif; direction: rtl; text-align: right;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 20px 0;">
                <tr>
                    <td align="center">
                        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;">
                            <!-- Header -->
                            <tr>
                                <td style="background-color: #0f172a; padding: 30px; text-align: center; border-bottom: 4px solid #eab308;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">الهور لنقل الأثاث</h1>
                                    <p style="color: #eab308; margin: 5px 0 0 0; font-size: 14px; letter-spacing: 1px;">إشعار بطلب عرض سعر / رسالة جديدة</p>
                                </td>
                            </tr>
                            
                            <!-- Body -->
                            <tr>
                                <td style="padding: 45px 30px; background-color: #ffffff;">
                                    <p style="color: #334155; font-size: 16px; line-height: 1.6; margin-top: 0; margin-bottom: 25px; text-align: right;">
                                        مرحباً، لقد تم استلام طلب عرض سعر أو رسالة جديدة من خلال النموذج الموجود على موقع الويب. إليك تفاصيل الطلب الكاملة:
                                    </p>
                                    
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 30px; text-align: right;">
                                        <!-- Name -->
                                        <tr>
                                            <td width="30%" style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; font-weight: bold;">اسم العميل:</td>
                                            <td width="70%" style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 15px; font-weight: bold;">' . htmlspecialchars($name) . '</td>
                                        </tr>
                                        <!-- Phone -->
                                        <tr>
                                            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; font-weight: bold;">رقم الهاتف:</td>
                                            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #eab308; font-size: 16px; font-weight: bold; direction: ltr; text-align: right;">
                                                <a href="tel:' . htmlspecialchars($phone) . '" style="color: #eab308; text-decoration: none;">' . htmlspecialchars($phone) . '</a>
                                            </td>
                                        </tr>
                                        <!-- Service -->
                                        <tr>
                                            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; font-weight: bold;">الخدمة المطلوبة:</td>
                                            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 15px;">' . htmlspecialchars($serviceName) . '</td>
                                        </tr>
                                        <!-- Date -->
                                        <tr>
                                            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; font-weight: bold;">تاريخ الطلب:</td>
                                            <td style="padding: 12px 10px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px;">' . date('Y-m-d H:i:s') . '</td>
                                        </tr>
                                    </table>
                                    
                                    <!-- Message section -->
                                    <div style="background-color: #f8fafc; border-right: 4px solid #eab308; padding: 20px; border-radius: 6px; margin-bottom: 35px; text-align: right;">
                                        <h3 style="margin-top: 0; margin-bottom: 12px; color: #0f172a; font-size: 15px; font-weight: bold;">تفاصيل الرسالة / متطلبات النقل:</h3>
                                        <p style="margin: 0; color: #475569; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">' . nl2br(htmlspecialchars($message)) . '</p>
                                    </div>
                                    
                                    <!-- Call to Action -->
                                    <div style="text-align: center; margin-top: 15px;">
                                        <a href="https://wa.me/' . preg_replace('/[^0-9]/', '', $phone) . '" target="_blank" style="background-color: #25d366; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 15px; font-weight: bold; display: inline-block; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);">تواصل مع العميل عبر واتساب مباشرة</a>
                                    </div>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f1f5f9; padding: 20px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0;">
                                    هذه الرسالة تم إنشاؤها تلقائياً من موقع الهور لنقل الأثاث.<br>
                                    &copy; ' . date('Y') . ' الهور لنقل الأثاث. جميع الحقوق محفوظة.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        ';

        // Headers
        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=UTF-8';
        $headers[] = 'From: Hoor Moving Website <noreply@elhoormoving.com>';
        $headers[] = 'Reply-To: noreply@elhoormoving.com';
        $headers[] = 'X-Mailer: PHP/' . phpversion();

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
}
