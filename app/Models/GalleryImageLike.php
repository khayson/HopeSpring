<?php

namespace App\Models;

use Database\Factories\GalleryImageLikeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $gallery_image_id
 * @property string $visitor_token
 */
#[Fillable(['gallery_image_id', 'visitor_token'])]
class GalleryImageLike extends Model
{
    /** @use HasFactory<GalleryImageLikeFactory> */
    use HasFactory;

    /** @return BelongsTo<GalleryImage, $this> */
    public function galleryImage(): BelongsTo
    {
        return $this->belongsTo(GalleryImage::class);
    }
}
