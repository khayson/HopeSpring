<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(6);

        return [
            'author_id' => User::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->randomNumber(4),
            'excerpt' => fake()->paragraph(),
            'body' => fake()->paragraphs(6, true),
            'featured_image' => null,
            'category' => fake()->randomElement(['education', 'healthcare', 'community', 'relief']),
            'is_featured' => fake()->boolean(20),
            'published_at' => fake()->optional(0.8)->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => ['published_at' => fake()->dateTimeBetween('-1 year', 'now')]);
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true, 'published_at' => now()]);
    }

    public function draft(): static
    {
        return $this->state(fn () => ['published_at' => null]);
    }
}
