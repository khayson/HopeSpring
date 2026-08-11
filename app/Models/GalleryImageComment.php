<?php

namespace App\Models;

use Database\Factories\GalleryImageCommentFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $gallery_image_id
 * @property string $name
 * @property string $body
 */
#[Fillable(['gallery_image_id', 'name', 'body'])]
class GalleryImageComment extends Model
{
    /** @use HasFactory<GalleryImageCommentFactory> */
    use HasFactory;

    public function galleryImage(): BelongsTo
    {
        return $this->belongsTo(GalleryImage::class);
    }
}
