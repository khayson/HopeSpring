<?php

namespace App\Models;

use Database\Factories\ProgrammeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string|null $long_description
 * @property string|null $icon
 * @property string|null $photo
 * @property bool $is_active
 * @property int $sort_order
 */
#[Fillable(['title', 'slug', 'description', 'long_description', 'icon', 'photo', 'is_active', 'sort_order'])]
class Programme extends Model
{
    /** @use HasFactory<ProgrammeFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /** @return HasMany<Project, $this> */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    /** @return HasMany<Donation, $this> */
    public function donations(): HasMany
    {
        return $this->hasMany(Donation::class);
    }
}
