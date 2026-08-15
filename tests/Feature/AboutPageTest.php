<?php

use App\Models\ImpactStat;
use App\Models\Milestone;
use App\Models\Partner;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Support\AboutPageSettings;
use App\Support\HomePageSettings;

test('about page shows empty partners section with editable copy', function () {
    foreach ([...AboutPageSettings::defaults(), ...HomePageSettings::defaults()] as $setting) {
        SiteSetting::query()->updateOrCreate(
            ['key' => $setting['key']],
            ['value' => $setting['value'], 'group' => $setting['group']],
        );
    }

    SiteSetting::query()->updateOrCreate(
        ['key' => 'about_mission'],
        ['value' => 'Mission statement.', 'group' => 'about'],
    );

    SiteSetting::query()->updateOrCreate(
        ['key' => 'about_vision'],
        ['value' => 'Vision statement.', 'group' => 'about'],
    );

    ImpactStat::factory()->create([
        'label' => 'Communities Reached',
        'value' => 42,
        'suffix' => '+',
        'sort_order' => 1,
    ]);

    Milestone::factory()->create([
        'year' => '2024',
        'title' => 'Milestone title',
        'description' => 'Milestone description',
        'sort_order' => 1,
    ]);

    TeamMember::factory()->create([
        'name' => 'Akosua Partner',
        'role' => 'Executive Director',
        'type' => 'leadership',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/about')
            ->where('partners', [])
            ->where('settings.about_partners_heading', 'Building partnerships that last')
            ->where('settings.about_partners_empty_title', 'Partnerships in progress')
            ->where('settings.home_value_1_title', 'Compassion')
            ->where('settings.home_value_3_title', 'Empowerment')
            ->where('settings.home_value_4_title', 'Sustainability')
            ->where('settings.home_value_5_title', 'Excellence')
            ->where('settings.about_who_we_are', 'A purpose-driven organization committed to empowering individuals and transforming communities through sustainable, people-centered solutions.')
            ->where('settings.home_about_body', 'HopeSpring Foundation was born from a moment that could not be ignored. One day, Melina Diamond encountered a woman and her three children on her way back from town. Moved by compassion, she offered them a ride to school. During the ride, she noticed the youngest child holding a torn rubber bag tightly to his chest. Inside were his books. Despite its condition, he held it with pride and said, "This is my school bag." That moment revealed resilience, dignity, and need in its purest form. The next day, Melina returned with a proper school bag. The joy and gratitude the child expressed became a defining moment. It was then she realized: even the smallest act of kindness can transform a life. From that moment, HopeSpring Foundation was born.'));
});

test('about page includes active partners with logos and urls', function () {
    foreach (AboutPageSettings::defaults() as $setting) {
        SiteSetting::query()->updateOrCreate(
            ['key' => $setting['key']],
            ['value' => $setting['value'], 'group' => $setting['group']],
        );
    }

    SiteSetting::query()->updateOrCreate(
        ['key' => 'about_mission'],
        ['value' => 'Mission statement.', 'group' => 'about'],
    );

    SiteSetting::query()->updateOrCreate(
        ['key' => 'about_vision'],
        ['value' => 'Vision statement.', 'group' => 'about'],
    );

    $partner = Partner::factory()->create([
        'name' => 'WaterAid',
        'logo' => '/storage/partners/wateraid.jpg',
        'url' => 'https://www.wateraid.org',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    Partner::factory()->create([
        'name' => 'Hidden Partner',
        'logo' => '/storage/partners/hidden.jpg',
        'url' => 'https://example.com/hidden',
        'is_active' => false,
        'sort_order' => 2,
    ]);

    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/about')
            ->where('partners.0.id', $partner->id)
            ->where('partners.0.name', $partner->name)
            ->where('partners.0.logo', $partner->logo)
            ->where('partners.0.url', $partner->url)
            ->missing('partners.1'));
});
