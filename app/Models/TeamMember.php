<?php

namespace App\Models;

use Database\Factories\TeamMemberFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property string $role
 * @property string|null $photo
 * @property string|null $bio
 * @property string|null $email
 * @property string|null $linkedin
 * @property string $type
 * @property int $sort_order
 * @property bool $is_active
 */
#[Fillable(['name', 'role', 'photo', 'bio', 'email', 'linkedin', 'type', 'sort_order', 'is_active'])]
class TeamMember extends Model
{
    /** @use HasFactory<TeamMemberFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
