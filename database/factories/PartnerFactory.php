<?php

namespace Database\Factories;

use App\Models\Partner;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Partner>
 */
class PartnerFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'logo' => null,
            'url' => fake()->optional(0.7)->url(),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
