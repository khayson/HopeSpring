<?php

namespace Database\Factories;

use App\Models\GalleryImage;
use App\Models\GalleryImageComment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GalleryImageComment>
 */
class GalleryImageCommentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'gallery_image_id' => GalleryImage::factory(),
            'name' => fake()->firstName(),
            'body' => fake()->sentence(12),
        ];
    }
}
