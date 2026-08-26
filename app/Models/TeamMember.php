<?php

namespace App\Models;

use App\Enums\TeamMemberType;
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
 * @property TeamMemberType $type
 * @property int $sort_order
 * @property bool $is_active
 */
#[Fillable(['name', 'role', 'photo', 'bio', 'email', 'linkedin', 'type', 'sort_order', 'is_active'])]
class TeamMember extends Model
{
    /** @use HasFactory<TeamMemberFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'type' => 'staff',
        'sort_order' => 0,
        'is_active' => true,
    ];

    protected function casts(): array
    {
        return [
            'type' => TeamMemberType::class,
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
