<?php

namespace App\Models;

use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $programme_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string|null $long_description
 * @property string $location
 * @property string|null $photo
 * @property string $status
 * @property Carbon|null $start_date
 * @property Carbon|null $end_date
 * @property bool $is_featured
 */
#[Fillable(['programme_id', 'title', 'slug', 'description', 'long_description', 'location', 'photo', 'status', 'start_date', 'end_date', 'is_featured'])]
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_featured' => 'boolean',
        ];
    }

    /** @return BelongsTo<Programme, $this> */
    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }
}
