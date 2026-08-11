<?php

namespace Database\Factories;

use App\Models\GalleryImage;
use App\Models\GalleryImageLike;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GalleryImageLike>
 */
class GalleryImageLikeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'gallery_image_id' => GalleryImage::factory(),
            'visitor_token' => (string) Str::uuid(),
        ];
    }
}
