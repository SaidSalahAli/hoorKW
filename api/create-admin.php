#!/usr/bin/env php
<?php
// =============================================================
// سكريبت إنشاء المدير الأول أو تغيير كلمة المرور
// الاستخدام: php create-admin.php
// =============================================================
declare(strict_types=1);

// تحميل متغيرات البيئة
$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $_ENV[trim($k)] = trim($v);
    }
}

$config = require __DIR__ . '/config/app.php';

// إنشاء اتصال PDO
$dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
    $config['database']['host'], $config['database']['port'], $config['database']['name']);

try {
    $pdo = new PDO($dsn, $config['database']['user'], $config['database']['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    echo "❌ فشل الاتصال بقاعدة البيانات: " . $e->getMessage() . "\n";
    exit(1);
}

echo "=================================================\n";
echo " أداة إنشاء مدير النظام - HoorKW CMS\n";
echo "=================================================\n\n";

$name     = readline("الاسم: ");
$email    = readline("البريد الإلكتروني: ");
$password = readline("كلمة المرور (لن تظهر): ");

if (empty($name) || empty($email) || empty($password)) {
    echo "❌ يجب ملء جميع الحقول\n";
    exit(1);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo "❌ البريد الإلكتروني غير صحيح\n";
    exit(1);
}

if (strlen($password) < 8) {
    echo "❌ كلمة المرور يجب أن تكون 8 أحرف على الأقل\n";
    exit(1);
}

$hashed = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

// التحقق من وجود المستخدم
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
$existing = $stmt->fetch();

if ($existing) {
    $stmt = $pdo->prepare("UPDATE users SET name = ?, password = ?, role = 'admin', status = 'active', updated_at = NOW() WHERE email = ?");
    $stmt->execute([$name, $hashed, $email]);
    echo "\n✅ تم تحديث بيانات المستخدم الموجود بنجاح!\n";
} else {
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'admin', 'active')");
    $stmt->execute([$name, $email, $hashed]);
    echo "\n✅ تم إنشاء المدير بنجاح! ID: " . $pdo->lastInsertId() . "\n";
}

echo "\n📧 البريد: $email\n";
echo "🔑 كلمة المرور: محفوظة بأمان (Bcrypt)\n\n";
