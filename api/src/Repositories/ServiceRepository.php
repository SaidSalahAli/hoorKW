<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Core\{Database, Paginator};

/**
 * ServiceRepository — طبقة الوصول لبيانات الخدمات
 */
final class ServiceRepository
{
    public function paginate(array $filters, int $page, int $perPage): array
    {
        $where  = [];
        $params = [];

        if (!empty($filters['search'])) {
            $where[]  = '(title LIKE ? OR short_description LIKE ?)';
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
        }

        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }

        return Paginator::paginate('services', [
            'select'   => 'id, title, slug, image, short_description, description, meta_title, meta_description, status, sort_order, created_at',
            'where'    => implode(' AND ', $where),
            'params'   => $params,
            'page'     => $page,
            'per_page' => $perPage,
            'order'    => 'sort_order ASC, created_at DESC',
        ]);
    }

    public function findById(int $id): ?array
    {
        return Database::first("SELECT * FROM services WHERE id = ?", [$id]);
    }

    public function findBySlug(string $slug, bool $activeOnly = true): ?array
    {
        $statusCondition = $activeOnly ? "AND status = 'active'" : '';
        return Database::first("SELECT * FROM services WHERE slug = ? $statusCondition", [$slug]);
    }

    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        if ($excludeId) {
            return Database::exists('services', 'slug = ? AND id != ?', [$slug, $excludeId]);
        }
        return Database::exists('services', 'slug = ?', [$slug]);
    }

    public function create(array $data): array
    {
        $id = Database::insert('services', $data);
        return $this->findById($id);
    }

    public function update(int $id, array $data): array
    {
        Database::update('services', $data, 'id = ?', [$id]);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return Database::delete('services', 'id = ?', [$id]) > 0;
    }

    public function deleteMany(array $ids): int
    {
        if (empty($ids)) return 0;
        $ph = implode(',', array_fill(0, count($ids), '?'));
        return Database::delete('services', "id IN ($ph)", $ids);
    }

    public function getImages(array $ids): array
    {
        if (empty($ids)) return [];
        $ph = implode(',', array_fill(0, count($ids), '?'));
        return Database::all("SELECT image FROM services WHERE id IN ($ph)", $ids);
    }

    /** للصفحة الرئيسية العامة */
    public function getActive(int $limit = 6): array
    {
        return Database::all(
            "SELECT id, title, slug, image, short_description FROM services WHERE status = 'active' ORDER BY sort_order ASC LIMIT ?",
            [$limit]
        );
    }
}
