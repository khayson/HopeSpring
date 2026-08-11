<?php

namespace Database\Factories;

use App\Models\ImpactStat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ImpactStat>
 */
class ImpactStatFactory extends Factory
{
    public function definition(): array
    {
        return [
            'label' => fake()->words(2, true),
            'value' => fake()->numberBetween(10, 50000),
            'suffix' => fake()->optional(0.3)->randomElement(['+', '%', 'K']),
            'sort_order' => 0,
        ];
    }
}
