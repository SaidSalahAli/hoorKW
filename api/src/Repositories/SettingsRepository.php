<?php
declare(strict_types=1);
namespace App\Repositories;

use App\Core\Database;

/** SettingsRepository — إعدادات الموقع */
final class SettingsRepository
{
    public function get(): ?array
    {
        return Database::first("SELECT * FROM settings LIMIT 1");
    }

    public function createDefault(): array
    {
        Database::insert('settings', [
            'site_name' => 'الحور لنقل العفش',
            'phone'     => '66091322',
            'whatsapp'  => '96566091322',
        ]);
        return $this->get();
    }

    public function update(int $id, array $data): array
    {
        Database::update('settings', $data, 'id = ?', [$id]);
        return $this->get();
    }
}
