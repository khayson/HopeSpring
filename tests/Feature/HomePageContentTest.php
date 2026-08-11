<?php

use App\Enums\UserRole;
use App\Models\ImpactStat;
use App\Models\Programme;
use App\Models\SiteSetting;
use App\Models\User;
use App\Support\HomePageSettings;

test('home page content comes from site settings and programmes', function () {
    foreach (HomePageSettings::defaults() as $setting) {
        SiteSetting::query()->updateOrCreate(
            ['key' => $setting['key']],
            ['value' => $setting['value'], 'group' => $setting['group']],
        );
    }

    SiteSetting::query()->updateOrCreate(
        ['key' => 'about_mission'],
        ['value' => 'Mission from database.', 'group' => 'about'],
    );

    SiteSetting::query()->where('key', 'home_hero_eyebrow')->update([
        'value' => 'Custom Welcome Line',
    ]);

    $programme = Programme::factory()->create([
        'title' => 'Clean Water Initiative',
        'slug' => 'clean-water-initiative',
        'description' => 'Water for communities.',
        'photo' => '/images/home-programme-water.jpg',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    ImpactStat::factory()->create([
        'label' => 'Lives Impacted',
        'value' => 25000,
        'suffix' => '+',
        'sort_order' => 1,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/home')
            ->where('settings.home_hero_eyebrow', 'Custom Welcome Line')
            ->where('settings.about_mission', 'Mission from database.')
            ->where('programmes.0.id', $programme->id)
            ->where('programmes.0.photo', '/images/home-programme-water.jpg')
            ->where('stats.0.label', 'Lives Impacted')
            ->where('stats.0.value', 25000));
});

test('admin can update home settings and impact stats', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    foreach (HomePageSettings::defaults() as $setting) {
        SiteSetting::query()->updateOrCreate(
            ['key' => $setting['key']],
            ['value' => $setting['value'], 'group' => $setting['group']],
        );
    }

    $stat = ImpactStat::factory()->create([
        'label' => 'Lives Impacted',
        'value' => 1000,
        'suffix' => '+',
        'sort_order' => 1,
    ]);

    $settings = SiteSetting::query()->pluck('value', 'key')->all();
    $settings['home_hero_eyebrow'] = 'Edited From Admin';

    $this->actingAs($admin)
        ->put(route('admin.settings.update'), [
            'settings' => $settings,
            'impact_stats' => [
                [
                    'id' => $stat->id,
                    'label' => 'People Reached',
                    'value' => 42000,
                    'suffix' => '+',
                ],
            ],
        ])
        ->assertRedirect(route('admin.settings.edit'));

    expect(SiteSetting::query()->where('key', 'home_hero_eyebrow')->value('value'))->toBe('Edited From Admin')
        ->and($stat->fresh()->label)->toBe('People Reached')
        ->and($stat->fresh()->value)->toBe(42000);
});
