<?php

namespace App\Models;

use App\Enums\GalleryMediaType;
use Database\Factories\GalleryImageFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $src
 * @property GalleryMediaType $media_type
 * @property string $alt
 * @property string|null $caption
 * @property string|null $category
 * @property int $sort_order
 */
#[Fillable(['src', 'media_type', 'alt', 'caption', 'category', 'sort_order'])]
class GalleryImage extends Model
{
    /** @use HasFactory<GalleryImageFactory> */
    use HasFactory;

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'media_type' => 'image',
        'sort_order' => 0,
    ];

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

    /**
     * @return array<string, mixed>
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'src' => $this->src,
            'media_type' => $this->media_type->value,
            'alt' => $this->alt,
            'caption' => $this->caption,
            'category' => $this->category,
        ];
    }

    protected function casts(): array
    {
        return [
            'media_type' => GalleryMediaType::class,
            'sort_order' => 'integer',
        ];
    }
}
