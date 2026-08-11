<?php

namespace Database\Factories;

use App\Models\Programme;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Programme>
 */
class ProgrammeFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->unique()->randomElement([
            'Clean Water Initiative',
            'Education for All',
            'Healthcare Outreach',
            'Community Development',
            'Women Empowerment',
            'Youth Skills Training',
        ]);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'description' => fake()->paragraph(),
            'long_description' => fake()->paragraphs(3, true),
            'icon' => fake()->randomElement(['Droplets', 'GraduationCap', 'HeartPulse', 'Users', 'Sparkles', 'Wrench']),
            'photo' => null,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
