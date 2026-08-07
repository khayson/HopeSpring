<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Editor = 'editor';
    case Finance = 'finance';
    case Volunteer = 'volunteer';
    case Partner = 'partner';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admin',
            self::Editor => 'Editor',
            self::Finance => 'Finance',
            self::Volunteer => 'Volunteer',
            self::Partner => 'Partner',
        };
    }

    public function isStaff(): bool
    {
        return in_array($this, [self::Admin, self::Editor, self::Finance], true);
    }

    /**
     * @return array<int, self>
     */
    public static function staff(): array
    {
        return [self::Admin, self::Editor, self::Finance];
    }

    /**
     * @return array<int, self>
     */
    public static function external(): array
    {
        return [self::Volunteer, self::Partner];
    }
}
