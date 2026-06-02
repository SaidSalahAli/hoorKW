<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Core\{Database, Paginator};

/** UserRepository — إدارة بيانات المستخدمين والمديرين */
final class UserRepository
{
    public function paginate(array $filters, int $page, int $perPage): array
    {
        $where  = [];
        $params = [];

        if (!empty($filters['search'])) {
            $where[]  = '(name LIKE ? OR email LIKE ?)';
            $params[] = "%{$filters['search']}%";
            $params[] = "%{$filters['search']}%";
        }
        if (!empty($filters['role'])) {
            $where[]  = 'role = ?';
            $params[] = $filters['role'];
        }

        return Paginator::paginate('users', [
            'select'   => 'id, name, email, role, status, created_at',
            'where'    => implode(' AND ', $where),
            'params'   => $params,
            'page'     => $page,
            'per_page' => $perPage,
            'order'    => 'created_at DESC',
        ]);
    }

    public function findById(int $id): ?array
    {
        return Database::first("SELECT id, name, email, role, status, created_at, updated_at FROM users WHERE id = ?", [$id]);
    }

    public function findByEmail(string $email): ?array
    {
        return Database::first("SELECT * FROM users WHERE email = ?", [$email]);
    }

    public function emailExists(string $email, ?int $excludeId = null): bool
    {
        return $excludeId
            ? Database::exists('users', 'email = ? AND id != ?', [$email, $excludeId])
            : Database::exists('users', 'email = ?', [$email]);
    }

    public function create(array $data): array
    {
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        }
        $id = Database::insert('users', $data);
        return $this->findById($id);
    }

    public function update(int $id, array $data): array
    {
        if (isset($data['password']) && $data['password'] !== '') {
            $data['password'] = password_hash($data['password'], PASSWORD_BCRYPT, ['cost' => 12]);
        } else {
            unset($data['password']);
        }
        Database::update('users', $data, 'id = ?', [$id]);
        return $this->findById($id);
    }

    public function delete(int $id): bool
    {
        return Database::delete('users', 'id = ?', [$id]) > 0;
    }
}
