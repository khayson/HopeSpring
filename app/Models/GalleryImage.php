<?php

namespace App\Models;

use Database\Factories\GalleryImageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $src
 * @property string $alt
 * @property string|null $caption
 * @property string|null $category
 * @property int $sort_order
 */
#[Fillable(['src', 'alt', 'caption', 'category', 'sort_order'])]
class GalleryImage extends Model
{
    /** @use HasFactory<GalleryImageFactory> */
    use HasFactory;

    /** @return HasMany<GalleryImageLike, $this> */
    public function likes(): HasMany
    {
        return $this->hasMany(GalleryImageLike::class);
    }

    /** @return HasMany<GalleryImageComment, $this> */
    public function comments(): HasMany
    {
        return $this->hasMany(GalleryImageComment::class)->latest();
    }

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }
}
