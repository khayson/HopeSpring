<?php

namespace Database\Factories;

use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Event>
 */
class EventFactory extends Factory
{
    public function definition(): array
    {
        $title = fake()->sentence(4);
        $startsAt = fake()->dateTimeBetween('-3 months', '+6 months');
        $locations = ['Accra International Conference Centre', 'Kumasi Cultural Centre', 'University of Ghana, Legon', 'Tamale Stadium', 'Cape Coast Castle Grounds'];

        return [
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->randomNumber(4),
            'description' => fake()->paragraph(),
            'long_description' => fake()->paragraphs(3, true),
            'location' => fake()->randomElement($locations),
            'photo' => null,
            'starts_at' => $startsAt,
            'ends_at' => fake()->optional(0.7)->dateTimeBetween($startsAt, (clone $startsAt)->modify('+3 days')),
            'is_featured' => fake()->boolean(25),
        ];
    }

    public function upcoming(): static
    {
        return $this->state(fn () => [
            'starts_at' => fake()->dateTimeBetween('+1 day', '+6 months'),
        ]);
    }
}
