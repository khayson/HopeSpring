<?php

namespace Database\Factories;

use App\Models\TeamMember;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TeamMember>
 */
class TeamMemberFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'role' => fake()->jobTitle(),
            'photo' => null,
            'bio' => fake()->paragraph(),
            'email' => fake()->unique()->safeEmail(),
            'linkedin' => null,
            'type' => fake()->randomElement(['leadership', 'staff', 'board']),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }

    public function leadership(): static
    {
        return $this->state(fn () => ['type' => 'leadership']);
    }

    public function board(): static
    {
        return $this->state(fn () => ['type' => 'board']);
    }
}
