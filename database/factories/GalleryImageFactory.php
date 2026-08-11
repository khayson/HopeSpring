<?php

namespace Database\Factories;

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
            'alt' => fake()->sentence(4),
            'caption' => fake()->optional(0.7)->sentence(),
            'category' => fake()->randomElement($categories),
            'sort_order' => 0,
        ];
    }
}
