<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Inquiry>
 */
class InquiryFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->randomElement(['volunteer', 'partner']);

        return [
            'type' => $type,
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional()->phoneNumber(),
            'organisation' => $type === 'partner' ? fake()->company() : null,
            'message' => fake()->paragraphs(2, true),
            'status' => fake()->randomElement(['new', 'reviewed', 'converted']),
        ];
    }

    public function volunteer(): static
    {
        return $this->state(['type' => 'volunteer', 'organisation' => null]);
    }

    public function partner(): static
    {
        return $this->state(['type' => 'partner', 'organisation' => fake()->company()]);
    }
}
