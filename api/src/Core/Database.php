<?php
declare(strict_types=1);
namespace App\Core;

/**
 * Database — PDO Singleton مع Query Builder بسيط وآمن
 */
final class Database
{
    private static ?PDO $pdo   = null;
    private static int  $queries = 0;

    public static function boot(array $config): void
    {
        if (self::$pdo !== null) return;

        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=%s',
            $config['host'],
            $config['port'],
            $config['name'],
            $config['charset']
        );

        try {
            self::$pdo = new \PDO($dsn, $config['user'], $config['pass'], $config['options']);
        } catch (\PDOException $e) {
            Response::serverError('فشل الاتصال بقاعدة البيانات');
        }
    }

    public static function pdo(): \PDO
    {
        if (self::$pdo === null) {
            throw new \RuntimeException('Database not initialized');
        }
        return self::$pdo;
    }

    public static function queryCount(): int { return self::$queries; }

    // ── Query Execution ──────────────────────────────────────

    /** تنفيذ استعلام وإرجاع جميع الصفوف */
    public static function all(string $sql, array $params = []): array
    {
        return self::run($sql, $params)->fetchAll();
    }

    /** تنفيذ استعلام وإرجاع صف واحد أو null */
    public static function first(string $sql, array $params = []): ?array
    {
        $result = self::run($sql, $params)->fetch();
        return $result ?: null;
    }

    /** تنفيذ استعلام وإرجاع قيمة واحدة (scalar) */
    public static function scalar(string $sql, array $params = []): mixed
    {
        return self::run($sql, $params)->fetchColumn();
    }

    /** INSERT وإرجاع الـ ID الجديد */
    public static function insert(string $table, array $data): int
    {
        if (empty($data)) throw new \InvalidArgumentException("لا يمكن الإدراج ببيانات فارغة");

        $cols   = implode(', ', array_map(fn($k) => "`$k`", array_keys($data)));
        $places = implode(', ', array_fill(0, count($data), '?'));

        self::run("INSERT INTO `$table` ($cols) VALUES ($places)", array_values($data));
        return (int)self::pdo()->lastInsertId();
    }

    /** UPDATE بناءً على شرط */
    public static function update(string $table, array $data, string $where, array $whereParams = []): int
    {
        if (empty($data)) return 0;

        $set  = implode(', ', array_map(fn($k) => "`$k` = ?", array_keys($data)));
        $stmt = self::run("UPDATE `$table` SET $set, `updated_at` = NOW() WHERE $where",
            [...array_values($data), ...$whereParams]);

        return $stmt->rowCount();
    }

    /** DELETE */
    public static function delete(string $table, string $where, array $params = []): int
    {
        return self::run("DELETE FROM `$table` WHERE $where", $params)->rowCount();
    }

    /** EXISTS بطريقة فعّالة */
    public static function exists(string $table, string $where, array $params = []): bool
    {
        $count = self::scalar("SELECT 1 FROM `$table` WHERE $where LIMIT 1", $params);
        return $count !== false && $count !== null;
    }

    /** COUNT */
    public static function count(string $table, string $where = '', array $params = []): int
    {
        $whereClause = $where ? "WHERE $where" : '';
        return (int)(self::scalar("SELECT COUNT(*) FROM `$table` $whereClause", $params) ?? 0);
    }

    /** Raw execute (للـ bulk operations) */
    public static function statement(string $sql, array $params = []): \PDOStatement
    {
        return self::run($sql, $params);
    }

    // ── Transactions ─────────────────────────────────────────

    public static function transaction(callable $callback): mixed
    {
        self::pdo()->beginTransaction();
        try {
            $result = $callback();
            self::pdo()->commit();
            return $result;
        } catch (\Throwable $e) {
            self::pdo()->rollBack();
            throw $e;
        }
    }

    // ── Internal ─────────────────────────────────────────────

    private static function run(string $sql, array $params = []): \PDOStatement
    {
        self::$queries++;
        $stmt = self::pdo()->prepare($sql);
        $stmt->execute($params);
        return $stmt;
    }
}
