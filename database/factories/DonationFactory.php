<?php

namespace Database\Factories;

use App\Models\Donation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Donation>
 */
class DonationFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => null,
            'donor_name' => fake()->name(),
            'donor_email' => fake()->safeEmail(),
            'donor_phone' => '+233'.fake()->numerify('## ### ####'),
            'amount' => fake()->randomElement([50, 100, 200, 500, 1000, 2500, 5000]) * 100,
            'currency' => 'GHS',
            'reference' => 'HS-'.Str::upper(Str::random(10)),
            'method' => fake()->randomElement(['card', 'momo']),
            'status' => fake()->randomElement(['pending', 'success', 'success', 'success', 'failed']),
            'paystack_reference' => 'PSK_'.Str::random(16),
            'is_recurring' => fake()->boolean(15),
            'programme' => fake()->optional(0.6)->randomElement(['Clean Water Initiative', 'Education for All', 'Healthcare Outreach']),
            'message' => fake()->optional(0.3)->sentence(),
            'is_anonymous' => fake()->boolean(20),
        ];
    }

    public function successful(): static
    {
        return $this->state(fn () => ['status' => 'success']);
    }

    public function momo(): static
    {
        return $this->state(fn () => ['method' => 'momo']);
    }
}
