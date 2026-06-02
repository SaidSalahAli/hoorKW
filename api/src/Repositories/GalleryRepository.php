<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Core\{Database, Paginator};

/** GalleryRepository — بيانات المعرض */
final class GalleryRepository
{
    public function paginate(array $filters, int $page, int $perPage): array
    {
        $where  = [];
        $params = [];
        if (!empty($filters['search'])) {
            $where[]  = 'title LIKE ?';
            $params[] = "%{$filters['search']}%";
        }
        return Paginator::paginate('gallery', [
            'select'   => 'id, title, image, sort_order, created_at',
            'where'    => implode(' AND ', $where),
            'params'   => $params,
            'page'     => $page,
            'per_page' => $perPage,
            'order'    => 'sort_order ASC, created_at DESC',
        ]);
    }

    public function findById(int $id): ?array
    {
        return Database::first("SELECT * FROM gallery WHERE id = ?", [$id]);
    }

    public function create(array $data): array
    {
        $id = Database::insert('gallery', $data);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return Database::delete('gallery', 'id = ?', [$id]) > 0;
    }

    public function deleteMany(array $ids): int
    {
        if (empty($ids)) return 0;
        $ph = implode(',', array_fill(0, count($ids), '?'));
        return Database::delete('gallery', "id IN ($ph)", $ids);
    }

    public function getImages(array $ids): array
    {
        if (empty($ids)) return [];
        $ph = implode(',', array_fill(0, count($ids), '?'));
        return Database::all("SELECT image FROM gallery WHERE id IN ($ph)", $ids);
    }

    public function getAll(int $limit = 12): array
    {
        return Database::all(
            "SELECT id, title, image FROM gallery ORDER BY sort_order ASC LIMIT ?",
            [$limit]
        );
    }
}
