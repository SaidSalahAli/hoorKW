<?php
declare(strict_types=1);
namespace App\Core;

/**
 * Paginator — ترقيم الصفحات الاحترافي
 */
final class Paginator
{
    /**
     * paginate استعلام بسيط من جدول واحد
     */
    public static function paginate(
        string $table,
        array  $options = []
    ): array {
        $select  = $options['select']  ?? '*';
        $where   = $options['where']   ?? '';
        $params  = $options['params']  ?? [];
        $orderBy = $options['order']   ?? 'created_at DESC';
        $page    = max(1, (int)($options['page']     ?? 1));
        $perPage = min(max(1, (int)($options['per_page'] ?? 10)), 100);
        $offset  = ($page - 1) * $perPage;

        $whereClause = $where ? "WHERE $where" : '';

        $total    = (int)(Database::scalar("SELECT COUNT(*) FROM `$table` $whereClause", $params) ?? 0);
        $lastPage = max(1, (int)ceil($total / $perPage));
        $items    = Database::all(
            "SELECT $select FROM `$table` $whereClause ORDER BY $orderBy LIMIT $perPage OFFSET $offset",
            $params
        );

        return self::wrap($items, $page, $perPage, $total, $lastPage, $offset);
    }

    /**
     * paginate استعلام مخصص (JOINs, subqueries, etc.)
     */
    public static function paginateRaw(
        string $countSql,
        string $dataSql,
        array  $params   = [],
        int    $page     = 1,
        int    $perPage  = 10
    ): array {
        $page    = max(1, $page);
        $perPage = min(max(1, $perPage), 100);
        $offset  = ($page - 1) * $perPage;

        $total    = (int)(Database::scalar($countSql, $params) ?? 0);
        $lastPage = max(1, (int)ceil($total / $perPage));
        $items    = Database::all("$dataSql LIMIT $perPage OFFSET $offset", $params);

        return self::wrap($items, $page, $perPage, $total, $lastPage, $offset);
    }

    private static function wrap(
        array $items,
        int   $page,
        int   $perPage,
        int   $total,
        int   $lastPage,
        int   $offset
    ): array {
        return [
            'items' => $items,
            'meta'  => [
                'current_page' => $page,
                'last_page'    => $lastPage,
                'per_page'     => $perPage,
                'total'        => $total,
                'from'         => $total > 0 ? $offset + 1 : 0,
                'to'           => min($offset + $perPage, $total),
            ],
        ];
    }
}
