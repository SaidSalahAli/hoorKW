<?php
declare(strict_types=1);
namespace App\Core;

/**
 * Request — يلتقط ويعالج الطلب الوارد
 */
final class Request
{
    private string $method;
    private string $uri;
    private array  $routeParams = [];
    private array  $queryParams;
    private array  $body;
    private array  $files;
    private array  $headers;
    private ?array $user = null;

    private function __construct()
    {
        $this->method      = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
        $this->queryParams = $_GET;
        $this->files       = $_FILES;
        $this->headers     = $this->parseHeaders();
        $this->body        = $this->parseBody();
        $this->uri         = $this->resolveUri();
    }

    public static function capture(): self
    {
        return new self();
    }

    // ── URI Parsing ──────────────────────────────────────────

    private function resolveUri(): string
    {
        $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
        
        // إزالة مسار المجلد الفرعي الذي يعمل فيه السكريبت (مثل /HoorKW/api/public)
        $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? ''));
        if ($scriptDir !== '/' && $scriptDir !== '') {
            if (str_starts_with($uri, $scriptDir)) {
                $uri = substr($uri, strlen($scriptDir));
            }
        }

        // إزالة /api prefix إن وجد
        $uri = preg_replace('#^/api#', '', $uri) ?? $uri;
        return rtrim($uri, '/') ?: '/';
    }

    // ── Body Parsing ─────────────────────────────────────────

    private function parseBody(): array
    {
        $contentType = $this->header('Content-Type', '');

        if (str_contains($contentType, 'application/json')) {
            $raw = file_get_contents('php://input');
            return json_decode($raw ?: '{}', true) ?? [];
        }

        if (str_contains($contentType, 'multipart/form-data')) {
            return $_POST;
        }

        $raw = file_get_contents('php://input');
        if (!$raw) return $_POST;

        $decoded = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE) return $decoded ?? [];

        parse_str($raw, $parsed);
        return $parsed ?: $_POST;
    }

    // ── Headers ──────────────────────────────────────────────

    private function parseHeaders(): array
    {
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name           = str_replace('_', '-', substr($key, 5));
                $headers[$name] = $value;
            }
        }
        if (isset($_SERVER['CONTENT_TYPE']))   $headers['CONTENT-TYPE']   = $_SERVER['CONTENT_TYPE'];
        if (isset($_SERVER['CONTENT_LENGTH'])) $headers['CONTENT-LENGTH'] = $_SERVER['CONTENT_LENGTH'];
        return $headers;
    }

    // ── Public Getters ────────────────────────────────────────

    public function method(): string    { return $this->method; }
    public function uri(): string       { return $this->uri; }
    public function user(): ?array      { return $this->user; }
    public function files(): array      { return $this->files; }

    public function setUser(array $user): void   { $this->user = $user; }
    public function setRouteParams(array $p): void { $this->routeParams = $p; }

    /** Route param: /services/{id} → param('id') */
    public function param(string $key, mixed $default = null): mixed
    {
        return $this->routeParams[$key] ?? $default;
    }

    /** Query string: ?page=2 → query('page') */
    public function query(string $key, mixed $default = null): mixed
    {
        return $this->queryParams[$key] ?? $default;
    }

    /** Request body field */
    public function input(string $key, mixed $default = null): mixed
    {
        return $this->body[$key] ?? $default;
    }

    /** All body inputs */
    public function all(): array { return $this->body; }

    /** Specific header */
    public function header(string $name, mixed $default = null): mixed
    {
        return $this->headers[strtoupper($name)] ?? $default;
    }

    /** Bearer token from Authorization header */
    public function bearerToken(): ?string
    {
        $auth = $this->header('Authorization', '');
        if (preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
            return trim($m[1]);
        }
        return null;
    }

    /** Uploaded file */
    public function file(string $key): ?array
    {
        return $this->files[$key] ?? null;
    }

    public function hasFile(string $key): bool
    {
        return isset($this->files[$key])
            && is_array($this->files[$key])
            && ($this->files[$key]['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_OK;
    }

    /** Typed helpers */
    public function integer(string $key, int $default = 0, string $source = 'query'): int
    {
        $val = $source === 'body' ? $this->input($key) : $this->query($key);
        return $val !== null ? (int)$val : $default;
    }

    public function string(string $key, string $default = '', string $source = 'body'): string
    {
        $val = $source === 'query' ? $this->query($key) : $this->input($key);
        return trim((string)($val ?? $default));
    }

    public function boolean(string $key, bool $default = false): bool
    {
        return filter_var($this->input($key) ?? $default, FILTER_VALIDATE_BOOLEAN);
    }

    public function ip(): string
    {
        return $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
}
