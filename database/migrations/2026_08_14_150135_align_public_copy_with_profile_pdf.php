<?php

use App\Models\Programme;
use App\Models\SiteSetting;
use App\Support\AboutPageSettings;
use App\Support\HomePageSettings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Align public profile copy with the Global Impact Initiative PDF
     * under the HopeSpring Foundation brand name.
     */
    public function up(): void
    {
        $settings = [
            'site_tagline' => 'Impacting Lives Globally',
            'about_mission' => 'To impact lives globally through empowerment, support, and sustainable development.',
            'about_vision' => 'To create a world where access to opportunity is available to all.',
        ];

        foreach ([...HomePageSettings::defaults(), ...AboutPageSettings::defaults()] as $setting) {
            $settings[$setting['key']] = $setting['value'];
        }

        foreach ($settings as $key => $value) {
            $group = match (true) {
                str_starts_with($key, 'home_') => 'home',
                str_starts_with($key, 'about_') => 'about',
                default => 'general',
            };

            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'group' => $group],
            );
        }

        $programmes = [
            'clean-water-initiative' => [
                'title' => 'Community Outreach',
                'description' => 'Engaging communities with people-centered support that meets real needs where they are.',
                'icon' => 'Users',
            ],
            'education-for-all' => [
                'title' => 'Education & Development',
                'description' => 'Expanding access to learning and development so opportunity is available to all.',
                'icon' => 'GraduationCap',
            ],
            'healthcare-outreach' => [
                'title' => 'Health & Wellness',
                'description' => 'Promoting wellbeing through accessible health support and wellness initiatives.',
                'icon' => 'HeartPulse',
            ],
            'community-development' => [
                'title' => 'Youth Empowerment',
                'description' => 'Equipping young people with skills, confidence, and opportunity to shape their futures.',
                'icon' => 'Sparkles',
            ],
        ];

        foreach ($programmes as $slug => $attributes) {
            Programme::query()->where('slug', $slug)->update($attributes);
        }

        Programme::query()->where('slug', 'clean-water-initiative')->update(['sort_order' => 1]);
        Programme::query()->where('slug', 'community-development')->update(['sort_order' => 2]);
        Programme::query()->where('slug', 'healthcare-outreach')->update(['sort_order' => 3]);
        Programme::query()->where('slug', 'education-for-all')->update(['sort_order' => 4]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left blank: prior wording lived across multiple migrations.
    }
};
