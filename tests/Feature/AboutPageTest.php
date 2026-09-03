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
        ['value' => AboutPageSettings::mission(), 'group' => 'about'],
    );

    SiteSetting::query()->updateOrCreate(
        ['key' => 'about_vision'],
        ['value' => AboutPageSettings::vision(), 'group' => 'about'],
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
            ->where('settings.about_partners_heading', 'Why Partner With Us?')
            ->where('settings.about_partners_empty_title', 'Partnerships in progress')
            ->where('settings.about_founder_attribution', 'By Melina Diamond')
            ->where('settings.home_value_1_title', 'Compassion')
            ->where('settings.home_value_3_title', 'Empowerment')
            ->where('settings.home_value_4_title', 'Excellence')
            ->where(
                'settings.about_who_we_are',
                fn (string $value) => str_contains($value, 'vulnerable children, women, youth')
                    && str_contains($value, 'strategic partnerships'),
            )
            ->where(
                'settings.about_founder_story',
                fn (string $value) => str_contains($value, 'not born in a boardroom')
                    && str_contains($value, 'This is my school bag.')
                    && str_contains($value, 'HopeSpring Foundation was born.'),
            )
            ->where('settings.about_mission', AboutPageSettings::mission())
            ->where('settings.about_vision', AboutPageSettings::vision())
            ->where(
                'settings.about_community_list',
                fn (string $value) => str_contains($value, 'Anweem')
                    && str_contains($value, 'Bonponsu'),
            )
            ->where(
                'settings.home_about_body',
                fn (string $value) => str_contains($value, 'vulnerable children, women, youth')
                    && str_contains($value, 'strategic partnerships'),
            ));
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
