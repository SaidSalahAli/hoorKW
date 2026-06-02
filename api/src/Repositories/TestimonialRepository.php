<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Core\{Database, Paginator};

/** TestimonialRepository — بيانات الشهادات */
final class TestimonialRepository
{
    public function paginate(array $filters, int $page, int $perPage): array
    {
        $where  = [];
        $params = [];

        if (!empty($filters['search'])) {
            $where[]  = '(name LIKE ? OR comment LIKE ? OR job_title LIKE ?)';
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
        }
        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }

        return Paginator::paginate('testimonials', [
            'select'   => 'id, name, image, job_title, comment, rating, status, created_at',
            'where'    => implode(' AND ', $where),
            'params'   => $params,
            'page'     => $page,
            'per_page' => $perPage,
            'order'    => 'created_at DESC',
        ]);
    }

    public function findById(int $id): ?array
    {
        return Database::first("SELECT * FROM testimonials WHERE id = ?", [$id]);
    }

    public function create(array $data): array
    {
        $id = Database::insert('testimonials', $data);
        return $this->findById($id);
    }

    public function update(int $id, array $data): array
    {
        Database::update('testimonials', $data, 'id = ?', [$id]);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return Database::delete('testimonials', 'id = ?', [$id]) > 0;
    }

    public function deleteMany(array $ids): int
    {
        if (empty($ids)) return 0;
        $ph = implode(',', array_fill(0, count($ids), '?'));
        return Database::delete('testimonials', "id IN ($ph)", $ids);
    }

    public function getImages(array $ids): array
    {
        if (empty($ids)) return [];
        $ph = implode(',', array_fill(0, count($ids), '?'));
        return Database::all("SELECT image FROM testimonials WHERE id IN ($ph)", $ids);
    }

    public function getActive(int $limit = 6): array
    {
        return Database::all(
            "SELECT id, name, image, job_title, comment, rating FROM testimonials
             WHERE status = 'active' ORDER BY rating DESC LIMIT ?",
            [$limit]
        );
    }
}
