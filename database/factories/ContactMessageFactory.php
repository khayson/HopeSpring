<?php

namespace Database\Factories;

use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ContactMessage>
 */
class ContactMessageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'subject' => fake()->randomElement([
                'Volunteer Inquiry',
                'Partnership Opportunity',
                'Donation Question',
                'Event Information',
                'General Inquiry',
                'Media Request',
            ]),
            'message' => fake()->paragraphs(2, true),
            'is_read' => fake()->boolean(40),
            'replied_at' => fake()->optional(0.3)->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
