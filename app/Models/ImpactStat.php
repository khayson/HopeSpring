<?php

namespace App\Models;

use Database\Factories\ImpactStatFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $label
 * @property int $value
 * @property string|null $suffix
 * @property int $sort_order
 */
#[Fillable(['label', 'value', 'suffix', 'sort_order'])]
class ImpactStat extends Model
{
    /** @use HasFactory<ImpactStatFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'value' => 'integer',
            'sort_order' => 'integer',
        ];
    }
}
