<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Core\{Database, Paginator};

/** ArticleRepository — بيانات المقالات */
final class ArticleRepository
{
    public function paginate(array $filters, int $page, int $perPage): array
    {
        $where  = [];
        $params = [];

        if (!empty($filters['search'])) {
            $where[]  = '(title LIKE ? OR excerpt LIKE ?)';
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
        }
        if (!empty($filters['status'])) {
            $where[]  = 'status = ?';
            $params[] = $filters['status'];
        }

        return Paginator::paginate('articles', [
            'select'   => 'id, title, slug, image, excerpt, content, views, status, published_at, created_at',
            'where'    => implode(' AND ', $where),
            'params'   => $params,
            'page'     => $page,
            'per_page' => $perPage,
            'order'    => 'created_at DESC',
        ]);
    }

    public function findById(int $id): ?array
    {
        return Database::first("SELECT * FROM articles WHERE id = ?", [$id]);
    }

    public function findBySlug(string $slug, bool $publishedOnly = true): ?array
    {
        $cond = $publishedOnly ? "AND status = 'published'" : '';
        return Database::first("SELECT * FROM articles WHERE slug = ? $cond", [$slug]);
    }

    public function incrementViews(int $id): void
    {
        Database::statement("UPDATE articles SET views = views + 1 WHERE id = ?", [$id]);
    }

    public function getRelated(int $excludeId, int $limit = 3): array
    {
        return Database::all(
            "SELECT id, title, slug, image, excerpt, views, published_at FROM articles
             WHERE status = 'published' AND id != ? ORDER BY views DESC LIMIT ?",
            [$excludeId, $limit]
        );
    }

    public function slugExists(string $slug, ?int $excludeId = null): bool
    {
        return $excludeId
            ? Database::exists('articles', 'slug = ? AND id != ?', [$slug, $excludeId])
            : Database::exists('articles', 'slug = ?', [$slug]);
    }

    public function create(array $data): array
    {
        $id = Database::insert('articles', $data);
        return $this->findById($id);
    }

    public function update(int $id, array $data): array
    {
        Database::update('articles', $data, 'id = ?', [$id]);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return Database::delete('articles', 'id = ?', [$id]) > 0;
    }

    public function deleteMany(array $ids): int
    {
        if (empty($ids)) return 0;
        $ph = implode(',', array_fill(0, count($ids), '?'));
        return Database::delete('articles', "id IN ($ph)", $ids);
    }

    public function getImages(array $ids): array
    {
        if (empty($ids)) return [];
        $ph = implode(',', array_fill(0, count($ids), '?'));
        return Database::all("SELECT image FROM articles WHERE id IN ($ph)", $ids);
    }

    public function getLatest(int $limit = 3): array
    {
        return Database::all(
            "SELECT id, title, slug, image, excerpt, views, published_at
             FROM articles WHERE status = 'published' ORDER BY published_at DESC LIMIT ?",
            [$limit]
        );
    }
}
