<?php

namespace App\Support;

class AboutPageSettings
{
    /**
     * Default about-page settings editable via Admin → Settings.
     *
     * @return list<array{key: string, value: string, group: string}>
     */
    public static function defaults(): array
    {
        return [
            ['key' => 'about_who_we_are', 'value' => 'A purpose-driven organization committed to empowering individuals and transforming communities through sustainable, people-centered solutions.', 'group' => 'about'],
            ['key' => 'about_founder_story', 'value' => 'HopeSpring Foundation was born from a moment that could not be ignored. One day, Melina Diamond encountered a woman and her three children on her way back from town. Moved by compassion, she offered them a ride to school. During the ride, she noticed the youngest child holding a torn rubber bag tightly to his chest. Inside were his books. Despite its condition, he held it with pride and said, "This is my school bag." That moment revealed resilience, dignity, and need in its purest form. The next day, Melina returned with a proper school bag. The joy and gratitude the child expressed became a defining moment. It was then she realized: even the smallest act of kindness can transform a life. From that moment, HopeSpring Foundation was born.', 'group' => 'about'],
            ['key' => 'about_partners_eyebrow', 'value' => 'Our Partners', 'group' => 'about'],
            ['key' => 'about_partners_heading', 'value' => 'Building partnerships that last', 'group' => 'about'],
            ['key' => 'about_partners_intro', 'value' => 'HopeSpring works best alongside institutions, foundations, and mission-aligned organisations that share our commitment to empowering individuals and transforming communities.', 'group' => 'about'],
            ['key' => 'about_partners_empty_title', 'value' => 'Partnerships in progress', 'group' => 'about'],
            ['key' => 'about_partners_empty_message', 'value' => 'We do not have formal partner listings yet. We are building relationships with organisations that align with our work in clean water, education, healthcare, and community development.', 'group' => 'about'],
            ['key' => 'about_partners_cta_label', 'value' => 'Partner With Us', 'group' => 'about'],
        ];
    }
}
