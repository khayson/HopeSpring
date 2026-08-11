<?php

namespace Database\Factories;

use App\Models\Milestone;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Milestone>
 */
class MilestoneFactory extends Factory
{
    public function definition(): array
    {
        return [
            'year' => (string) fake()->numberBetween(2015, 2026),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'sort_order' => 0,
        ];
    }
}
