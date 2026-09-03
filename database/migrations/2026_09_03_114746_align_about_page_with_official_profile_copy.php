<?php

use App\Models\SiteSetting;
use App\Support\AboutPageSettings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Align About page copy with the official HopeSpring Foundation profile.
     */
    public function up(): void
    {
        foreach (AboutPageSettings::defaults() as $setting) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'group' => $setting['group'],
                ],
            );
        }

        SiteSetting::query()->updateOrCreate(
            ['key' => 'about_vision'],
            [
                'value' => AboutPageSettings::vision(),
                'group' => 'about',
            ],
        );

        SiteSetting::query()->updateOrCreate(
            ['key' => 'about_mission'],
            [
                'value' => AboutPageSettings::mission(),
                'group' => 'about',
            ],
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'about_who_we_are'],
            [
                'value' => 'A purpose-driven organization committed to empowering individuals and transforming communities through sustainable, people-centered solutions.',
                'group' => 'about',
            ],
        );

        SiteSetting::query()->updateOrCreate(
            ['key' => 'about_founder_story'],
            [
                'value' => 'HopeSpring Foundation was born from a moment that could not be ignored. One day, Melina Diamond encountered a woman and her three children on her way back from town. Moved by compassion, she offered them a ride to school. During the ride, she noticed the youngest child holding a torn rubber bag tightly to his chest. Inside were his books. Despite its condition, he held it with pride and said, "This is my school bag." That moment revealed resilience, dignity, and need in its purest form. The next day, Melina returned with a proper school bag. The joy and gratitude the child expressed became a defining moment. It was then she realized: even the smallest act of kindness can transform a life. From that moment, HopeSpring Foundation was born.',
                'group' => 'about',
            ],
        );

        SiteSetting::query()->updateOrCreate(
            ['key' => 'about_vision'],
            [
                'value' => 'To create a world where access to opportunity is available to all.',
                'group' => 'about',
            ],
        );

        SiteSetting::query()->updateOrCreate(
            ['key' => 'about_mission'],
            [
                'value' => 'To empower communities through sustainable solutions in education, health, clean water and humanitarian support.',
                'group' => 'about',
            ],
        );

        SiteSetting::query()
            ->whereIn('key', [
                'about_founder_attribution',
                'about_community_intro',
                'about_community_list',
                'about_focus_areas',
                'about_partners_points',
                'about_partners_quote',
            ])
            ->delete();
    }
};
