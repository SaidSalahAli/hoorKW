<?php
declare(strict_types=1);
namespace App\Core;

/**
 * BaseController — الـ Controller الأساسي الذي ترث منه كل الـ Controllers
 */
abstract class BaseController
{
    public function __construct(
        protected readonly Request $request,
        protected readonly array   $config
    ) {}

    // ── Pagination Helpers ───────────────────────────────────

    protected function page(): int
    {
        return max(1, $this->request->integer('page', 1, 'query'));
    }

    protected function perPage(): int
    {
        $default = $this->config['pagination']['default'] ?? 10;
        $max     = $this->config['pagination']['max']     ?? 100;
        return min(max(1, $this->request->integer('per_page', $default, 'query')), $max);
    }

    // ── Upload ───────────────────────────────────────────────

    protected function storage(string $subfolder = ''): \App\Services\StorageService
    {
        return new \App\Services\StorageService($this->config['upload'], $subfolder);
    }

    // ── Auth Helpers ─────────────────────────────────────────

    protected function user(): array
    {
        return $this->request->user() ?? [];
    }

    protected function userId(): int
    {
        return (int)($this->request->user()['id'] ?? 0);
    }

    protected function isAdmin(): bool
    {
        return ($this->request->user()['role'] ?? '') === 'admin';
    }

    protected function requireAdmin(): void
    {
        if (!$this->isAdmin()) {
            Response::forbidden('هذه العملية مخصصة للمديرين فقط');
        }
    }

    // ── Search Builder ───────────────────────────────────────

    /**
     * بناء شرط LIKE لحقول متعددة
     * @return [string $whereCondition, array $params]
     */
    protected function buildSearch(string $term, array $columns): array
    {
        if (empty($term)) return ['', []];

        $conditions = array_map(fn($col) => "$col LIKE ?", $columns);
        $params     = array_fill(0, count($columns), "%$term%");

        return ['(' . implode(' OR ', $conditions) . ')', $params];
    }

    // ── Common param extractors ───────────────────────────────

    protected function id(): int
    {
        $id = (int)$this->request->param('id');
        if ($id <= 0) Response::error('المعرف يجب أن يكون رقماً موجباً', 422);
        return $id;
    }

    protected function slug(): string
    {
        $slug = $this->request->param('slug', '');
        if (!$slug) Response::error('الرابط مطلوب', 422);
        return $slug;
    }
}
