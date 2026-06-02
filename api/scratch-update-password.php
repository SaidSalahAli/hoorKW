<?php
declare(strict_types=1);

define('BASE_PATH', __DIR__);

$envFile = __DIR__ . '/.env';
if (file_exists($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (str_starts_with(trim($line), '#') || !str_contains($line, '=')) continue;
        [$k, $v] = explode('=', $line, 2);
        $_ENV[trim($k)] = trim($v);
    }
}

$config = require __DIR__ . '/config/app.php';

$dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
    $config['database']['host'], $config['database']['port'], $config['database']['name']);

try {
    $pdo = new PDO($dsn, $config['database']['user'], $config['database']['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
    exit(1);
}

$email = 'admin@hoorkw.com';
$password = 'password';
$hashed = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);

$stmt = $pdo->prepare("UPDATE users SET password = ?, status = 'active' WHERE email = ?");
$stmt->execute([$hashed, $email]);

echo "Successfully updated password for admin@hoorkw.com to 'password'\n";
