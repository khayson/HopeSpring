<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Align home About story and core values with the approved mockup wording.
     */
    public function up(): void
    {
        $updates = [
            'home_about_body' => 'HopeSpring Foundation was born out of a simple act of compassion that revealed a deep need. What started with one child\'s joy has grown into a mission to bring lasting change to many lives.',
            'home_value_1_description' => 'We serve with love and empathy for every person.',
            'home_value_2_description' => 'We uphold transparency, honesty and accountability.',
            'home_value_3_description' => 'We equip people to build better and sustainable lives.',
            'home_value_4_description' => 'We are committed to quality and continuous improvement.',
            'about_mission' => 'To empower communities through sustainable solutions in education, health, clean water and humanitarian support.',
        ];

        foreach ($updates as $key => $value) {
            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $previous = [
            'home_about_body' => 'HopeSpring began with a simple act of compassion — and grew into a movement for clean water, education, healthcare, and stronger communities across Ghana. Every project is built with local partners so change lasts long after we leave.',
            'home_value_1_description' => 'We lead with empathy and genuine care for every community we serve.',
            'home_value_2_description' => 'We uphold transparency and accountability in everything we do.',
            'home_value_3_description' => 'We equip people with tools and opportunities to shape their own future.',
            'home_value_4_description' => 'We pursue lasting quality in every borehole, classroom, and clinic.',
            'about_mission' => 'To empower underserved communities in Ghana through sustainable clean water, education, healthcare, and community development programmes.',
        ];

        foreach ($previous as $key => $value) {
            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }
    }
};
