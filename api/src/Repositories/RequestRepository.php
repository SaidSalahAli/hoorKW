<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Core\{Database, Paginator};

/** RequestRepository — بيانات طلبات الخدمة */
final class RequestRepository
{
    public function paginate(array $filters, int $page, int $perPage): array
    {
        $where  = ['1=1'];
        $params = [];

        if (!empty($filters['search'])) {
            $where[]  = '(r.name LIKE ? OR r.phone LIKE ? OR r.message LIKE ?)';
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
        }
        if (!empty($filters['status'])) {
            $where[]  = 'r.status = ?';
            $params[] = $filters['status'];
        }

        $whereStr  = implode(' AND ', $where);
        $countSql  = "SELECT COUNT(*) FROM service_requests r WHERE $whereStr";
        $dataSql   = "
            SELECT
                r.id, r.name, r.phone, r.message, r.status, r.notes, r.created_at,
                s.id AS service_id, s.title AS service_title, s.slug AS service_slug
            FROM service_requests r
            LEFT JOIN services s ON r.service_id = s.id
            WHERE $whereStr
            ORDER BY FIELD(r.status,'new','contacted','completed','cancelled'), r.created_at DESC
        ";

        $result = Paginator::paginateRaw($countSql, $dataSql, $params, $page, $perPage);
        $result['items'] = array_map([$this, 'format'], $result['items']);
        return $result;
    }

    public function findById(int $id): ?array
    {
        $row = Database::first("
            SELECT r.*, s.title AS service_title, s.slug AS service_slug
            FROM service_requests r
            LEFT JOIN services s ON r.service_id = s.id
            WHERE r.id = ?
        ", [$id]);

        return $row ? $this->format($row) : null;
    }

    public function create(array $data): array
    {
        $id = Database::insert('service_requests', $data);
        return $this->findById($id);
    }

    public function updateStatus(int $id, string $status, ?string $notes): bool
    {
        return Database::update('service_requests', [
            'status' => $status,
            'notes'  => $notes,
        ], 'id = ?', [$id]) > 0;
    }

    public function delete(int $id): bool
    {
        return Database::delete('service_requests', 'id = ?', [$id]) > 0;
    }

    private function format(array $row): array
    {
        $service = $row['service_id'] ? [
            'id'    => (int)$row['service_id'],
            'title' => $row['service_title'],
            'slug'  => $row['service_slug'],
        ] : null;

        unset($row['service_title'], $row['service_slug']);
        $row['service']    = $service;
        $row['service_id'] = $row['service_id'] ? (int)$row['service_id'] : null;
        return $row;
    }
}
