<?php

use App\Models\Programme;

test('programme show page includes a distinct long description for clean water', function () {
    $programme = Programme::factory()->create([
        'slug' => 'clean-water-initiative',
        'title' => 'Clean Water',
        'description' => 'Providing clean and safe water to underserved communities.',
        'long_description' => 'Across the communities we serve, families often walk long distances each day to collect water from streams and open sources — water that is frequently shared with livestock and unsafe to drink. Women and children spend hours carrying heavy buckets home instead of being in school or at work. Our clean water work brings safe, reliable sources closer to where people live.',
    ]);

    $this->get(route('programmes.show', $programme))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/programmes/show')
            ->where('programme.description', 'Providing clean and safe water to underserved communities.')
            ->where(
                'programme.long_description',
                fn (string $value) => str_contains($value, 'walk long distances')
                    && str_contains($value, 'streams')
            ));
});
