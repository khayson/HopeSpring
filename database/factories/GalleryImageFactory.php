<?php

namespace Database\Factories;

use App\Enums\GalleryMediaType;
use App\Models\GalleryImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<GalleryImage>
 */
class GalleryImageFactory extends Factory
{
    public function definition(): array
    {
        $categories = ['water', 'education', 'healthcare', 'community', 'events'];

        return [
            'src' => 'https://picsum.photos/seed/'.fake()->unique()->randomNumber(5).'/600/400',
            'media_type' => GalleryMediaType::Image,
            'alt' => fake()->sentence(4),
            'caption' => fake()->optional(0.7)->sentence(),
            'category' => fake()->randomElement($categories),
            'sort_order' => 0,
        ];
    }

    public function video(): static
    {
        return $this->state(fn (): array => [
            'src' => '/storage/gallery/'.fake()->unique()->uuid().'.mp4',
            'media_type' => GalleryMediaType::Video,
        ]);
    }
}
