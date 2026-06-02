<?php
declare(strict_types=1);
namespace App\Services;

use App\Core\Database;

/**
 * JwtService — توليد والتحقق من JWT بدون مكتبات خارجية
 */
final class JwtService
{
    public function __construct(private readonly array $config) {}

    public function generate(array $payload): string
    {
        $header = $this->encode(['typ' => 'JWT', 'alg' => 'HS256']);

        $payload['iat'] = time();
        $payload['exp'] = time() + $this->config['ttl'];
        $payload['jti'] = bin2hex(random_bytes(16));
        $payload['iss'] = $this->config['issuer'] ?? 'hoorkw';

        $encodedPayload = $this->encode($payload);
        $signature      = $this->sign("$header.$encodedPayload");

        return "$header.$encodedPayload.$signature";
    }

    public function verify(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        [$header, $payload, $sig] = $parts;

        // التحقق من التوقيع
        if (!hash_equals($this->sign("$header.$payload"), $sig)) return null;

        // فك الـ payload
        $data = json_decode($this->decode($payload), true);
        if (!is_array($data)) return null;

        // التحقق من الصلاحية
        if (isset($data['exp']) && $data['exp'] < time()) return null;

        return $data;
    }

    private function sign(string $data): string
    {
        return $this->encode(hash_hmac('sha256', $data, $this->config['secret'], true));
    }

    private function encode(string|array $data): string
    {
        if (is_array($data)) $data = json_encode($data);
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private function decode(string $data): string
    {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 3 - (3 + strlen($data)) % 4));
    }
}
