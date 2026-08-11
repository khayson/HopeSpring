<?php

namespace Database\Factories;

use App\Models\Programme;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(4);
        $locations = ['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Takoradi', 'Ho', 'Sunyani', 'Koforidua', 'Bolgatanga', 'Wa'];

        return [
            'programme_id' => Programme::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->randomNumber(4),
            'description' => fake()->paragraph(),
            'long_description' => fake()->paragraphs(3, true),
            'location' => fake()->randomElement($locations).', Ghana',
            'photo' => null,
            'status' => fake()->randomElement(['ongoing', 'completed', 'upcoming']),
            'start_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'end_date' => fake()->optional(0.5)->dateTimeBetween('now', '+1 year'),
            'is_featured' => fake()->boolean(30),
        ];
    }

    public function featured(): static
    {
        return $this->state(fn () => ['is_featured' => true]);
    }
}
