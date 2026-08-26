<?php

use App\Models\Programme;
use App\Models\SiteSetting;
use App\Support\AboutPageSettings;
use App\Support\HomePageSettings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Align public copy with the HopeSpring homepage mockup.
     */
    public function up(): void
    {
        $settings = [
            'site_tagline' => 'Transforming Lives',
            'about_mission' => 'To empower communities through sustainable solutions in education, health, clean water and humanitarian support.',
            'about_vision' => 'We bring hope, restore dignity, and create opportunities for a better tomorrow.',
            'contact_address' => 'East Legon, Accra Ghana',
        ];

        foreach ([...HomePageSettings::defaults(), ...AboutPageSettings::defaults()] as $setting) {
            $settings[$setting['key']] = $setting['value'];
        }

        foreach ($settings as $key => $value) {
            $group = match (true) {
                str_starts_with($key, 'home_') => 'home',
                str_starts_with($key, 'about_') => 'about',
                str_starts_with($key, 'contact_') => 'contact',
                default => 'general',
            };

            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'group' => $group],
            );
        }

        SiteSetting::query()
            ->whereIn('key', [
                'home_value_5_title',
                'home_value_5_description',
                'home_value_5_icon',
            ])
            ->delete();

        $programmes = [
            'clean-water-initiative' => [
                'title' => 'Clean Water',
                'description' => 'Providing clean and safe water to underserved communities.',
                'long_description' => 'Providing clean and safe water to underserved communities.',
                'icon' => 'Droplets',
                'sort_order' => 1,
            ],
            'education-for-all' => [
                'title' => 'Education Support',
                'description' => 'Empowering children through access to quality education.',
                'long_description' => 'Empowering children through access to quality education.',
                'icon' => 'GraduationCap',
                'sort_order' => 2,
            ],
            'healthcare-outreach' => [
                'title' => 'Healthcare Outreach',
                'description' => 'Improving health and well-being through medical support.',
                'long_description' => 'Improving health and well-being through medical support.',
                'icon' => 'HeartPulse',
                'sort_order' => 3,
            ],
            'community-development' => [
                'title' => 'Community Development',
                'description' => 'Building stronger communities through sustainable projects.',
                'long_description' => 'Building stronger communities through sustainable projects.',
                'icon' => 'Users',
                'sort_order' => 4,
            ],
        ];

        foreach ($programmes as $slug => $attributes) {
            Programme::query()->where('slug', $slug)->update($attributes);
        }

        if (Programme::query()->exists()) {
            Programme::query()->updateOrCreate(
                ['slug' => 'youth-women-empowerment'],
                [
                    'title' => 'Youth & Women Empowerment',
                    'description' => 'Equipping youth and women with skills and opportunities.',
                    'long_description' => 'Equipping youth and women with skills and opportunities.',
                    'icon' => 'Venus',
                    'photo' => '/images/home-programme-community.jpg',
                    'is_active' => true,
                    'sort_order' => 5,
                ],
            );

            Programme::query()->updateOrCreate(
                ['slug' => 'emergency-relief'],
                [
                    'title' => 'Emergency Relief',
                    'description' => 'Providing urgent support in times of crisis and disasters.',
                    'long_description' => 'Providing urgent support in times of crisis and disasters.',
                    'icon' => 'Package',
                    'photo' => '/images/home-programme-healthcare.jpg',
                    'is_active' => true,
                    'sort_order' => 6,
                ],
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left blank: prior wording lived across multiple migrations.
    }
};
