<?php

use App\Models\Milestone;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Support\AboutPageSettings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Restore PDF founder identity and About copy that is not on the homepage mockup.
     */
    public function up(): void
    {
        $founderBio = 'Melina Diamond founded HopeSpring Foundation after a defining encounter with a woman and her three children, one of whom proudly carried a torn rubber bag as a school bag. That moment of compassion revealed resilience, dignity, and need, and inspired a mission to impact lives globally through empowerment, support, and sustainable development.';
        $milestoneDescription = 'Melina Diamond founded HopeSpring Foundation from a simple act of compassion: replacing a child\'s torn rubber school bag and realizing that even the smallest act of kindness can transform a life. The organisation was established to impact lives globally through empowerment, support, and sustainable development.';

        $settings = [
            'about_vision' => 'To create a world where access to opportunity is available to all.',
        ];

        foreach (AboutPageSettings::defaults() as $setting) {
            $settings[$setting['key']] = $setting['value'];
        }

        foreach ($settings as $key => $value) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                ['value' => $value, 'group' => 'about'],
            );
        }

        TeamMember::query()
            ->where('name', 'Melina Diamond')
            ->update(['bio' => $founderBio]);

        TeamMember::query()
            ->where('name', 'Kwame Asante')
            ->where('role', 'Founder & Executive Director')
            ->update([
                'name' => 'Melina Diamond',
                'bio' => $founderBio,
                'email' => 'melina@hopespringfoundation.org',
            ]);

        Milestone::query()
            ->where('year', '2015')
            ->where('title', 'Foundation Established')
            ->update(['description' => $milestoneDescription]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left blank: this restores prior PDF founder copy.
    }
};
