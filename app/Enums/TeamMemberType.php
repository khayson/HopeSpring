<?php

namespace App\Enums;

enum TeamMemberType: string
{
    case Leadership = 'leadership';
    case Staff = 'staff';
    case Board = 'board';

    public function label(): string
    {
        return match ($this) {
            self::Leadership => 'Leadership Team',
            self::Staff => 'Our Team',
            self::Board => 'Board of Directors',
        };
    }
}
