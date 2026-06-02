<?php
declare(strict_types=1);
namespace App\Core;

/**
 * Router — نظام توجيه احترافي مع دعم:
 * - Route Groups مع prefix
 * - Middleware stacks
 * - Named parameters {id}, {slug}
 * - HTTP methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
 */
final class Router
{
    private array   $routes  = [];
    private array   $config;
    private Request $request;
    private string  $groupPrefix = '';
    private array   $groupMiddleware = [];

    public function __construct(Request $request, array $config)
    {
        $this->request = $request;
        $this->config  = $config;
    }

    // ── HTTP Methods ─────────────────────────────────────────

    public function get(string $path, mixed $handler, array $middleware = []): void
    {
        $this->addRoute('GET', $path, $handler, $middleware);
    }

    public function post(string $path, mixed $handler, array $middleware = []): void
    {
        $this->addRoute('POST', $path, $handler, $middleware);
    }

    public function put(string $path, mixed $handler, array $middleware = []): void
    {
        $this->addRoute('PUT', $path, $handler, $middleware);
    }

    public function patch(string $path, mixed $handler, array $middleware = []): void
    {
        $this->addRoute('PATCH', $path, $handler, $middleware);
    }

    public function delete(string $path, mixed $handler, array $middleware = []): void
    {
        $this->addRoute('DELETE', $path, $handler, $middleware);
    }

    // ── Group ────────────────────────────────────────────────

    public function group(string $prefix, callable $callback, array $middleware = []): void
    {
        $previousPrefix     = $this->groupPrefix;
        $previousMiddleware = $this->groupMiddleware;

        $this->groupPrefix     = $previousPrefix . $prefix;
        $this->groupMiddleware = array_merge($previousMiddleware, $middleware);

        $callback();

        $this->groupPrefix     = $previousPrefix;
        $this->groupMiddleware = $previousMiddleware;
    }

    // ── Core ─────────────────────────────────────────────────

    private function addRoute(string $method, string $path, mixed $handler, array $middleware): void
    {
        $fullPath = $this->groupPrefix . ($path === '/' ? '' : $path);
        $fullPath = $fullPath ?: '/';

        $this->routes[] = [
            'method'     => $method,
            'path'       => $fullPath,
            'pattern'    => $this->toPattern($fullPath),
            'handler'    => $handler,
            'middleware' => array_merge($this->groupMiddleware, $middleware),
        ];
    }

    private function toPattern(string $path): string
    {
        $pattern = preg_replace('/\{([a-zA-Z_]+)\}/', '(?P<$1>[^/]+)', $path);
        return '#^' . $pattern . '$#u';
    }

    // ── Dispatch ─────────────────────────────────────────────

    public function dispatch(): void
    {
        $method = $this->request->method();
        $uri    = $this->request->uri();

        // CORS preflight
        if ($method === 'OPTIONS') {
            http_response_code(200);
            exit;
        }

        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) continue;

            if (!preg_match($route['pattern'], $uri, $matches)) continue;

            // استخراج route params
            $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
            $this->request->setRouteParams($params);

            // تشغيل Middleware stack
            $this->runMiddleware($route['middleware'], function () use ($route) {
                $this->callHandler($route['handler']);
            });

            return;
        }

        Response::notFound("المسار غير موجود: {$method} {$uri}");
    }

    private function runMiddleware(array $middlewares, callable $next): void
    {
        if (empty($middlewares)) {
            $next();
            return;
        }

        $middleware = array_shift($middlewares);
        $instance   = new $middleware($this->config);
        $instance->handle($this->request, function () use ($middlewares, $next) {
            $this->runMiddleware($middlewares, $next);
        });
    }

    private function callHandler(mixed $handler): void
    {
        // Closure handler
        if (is_callable($handler)) {
            $handler($this->request);
            return;
        }

        // 'Namespace\ControllerClass@method'
        [$classShort, $action] = explode('@', $handler, 2);
        $class = "App\\Controllers\\{$classShort}";

        $controller = new $class($this->request, $this->config);

        if (!method_exists($controller, $action)) {
            Response::notFound("الـ action غير موجود: {$action}");
            return;
        }

        $controller->$action();
    }
}
