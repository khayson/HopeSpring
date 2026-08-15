<?php

namespace App\Support;

class HomePageSettings
{
    /**
     * Default home page settings editable via Admin → Settings.
     *
     * @return list<array{key: string, value: string, group: string}>
     */
    public static function defaults(): array
    {
        return [
            ['key' => 'home_hero_eyebrow', 'value' => 'Welcome to HopeSpring Foundation', 'group' => 'home'],
            ['key' => 'home_hero_title_prefix', 'value' => 'We exist to', 'group' => 'home'],
            ['key' => 'home_hero_title_highlight', 'value' => 'impact lives globally', 'group' => 'home'],
            ['key' => 'home_hero_subtitle', 'value' => 'Impacting Lives Globally', 'group' => 'home'],
            ['key' => 'home_hero_image', 'value' => '/images/home-hero.jpg', 'group' => 'home'],
            ['key' => 'home_cta_donate_label', 'value' => 'Donate Now', 'group' => 'home'],
            ['key' => 'home_cta_volunteer_label', 'value' => 'Become a Volunteer', 'group' => 'home'],
            ['key' => 'home_cta_partner_label', 'value' => 'Partner With Us', 'group' => 'home'],
            ['key' => 'home_about_eyebrow', 'value' => 'About Us', 'group' => 'home'],
            ['key' => 'home_about_title', 'value' => 'Founder\'s Story', 'group' => 'home'],
            ['key' => 'home_about_body', 'value' => 'HopeSpring Foundation was born from a moment that could not be ignored. One day, Melina Diamond encountered a woman and her three children on her way back from town. Moved by compassion, she offered them a ride to school. During the ride, she noticed the youngest child holding a torn rubber bag tightly to his chest. Inside were his books. Despite its condition, he held it with pride and said, "This is my school bag." That moment revealed resilience, dignity, and need in its purest form. The next day, Melina returned with a proper school bag. The joy and gratitude the child expressed became a defining moment. It was then she realized: even the smallest act of kindness can transform a life. From that moment, HopeSpring Foundation was born.', 'group' => 'home'],
            ['key' => 'home_about_image', 'value' => '/images/home-about.jpg', 'group' => 'home'],
            ['key' => 'home_about_mission_label', 'value' => 'Our Mission', 'group' => 'home'],
            ['key' => 'home_about_mission_link_label', 'value' => 'Read More', 'group' => 'home'],
            ['key' => 'home_about_cta_label', 'value' => 'Learn More About Us', 'group' => 'home'],
            ['key' => 'home_value_1_title', 'value' => 'Compassion', 'group' => 'home'],
            ['key' => 'home_value_1_description', 'value' => 'We lead with empathy and genuine care for every person we serve.', 'group' => 'home'],
            ['key' => 'home_value_1_icon', 'value' => 'Heart', 'group' => 'home'],
            ['key' => 'home_value_2_title', 'value' => 'Integrity', 'group' => 'home'],
            ['key' => 'home_value_2_description', 'value' => 'We uphold honesty, transparency, and accountability in all we do.', 'group' => 'home'],
            ['key' => 'home_value_2_icon', 'value' => 'Shield', 'group' => 'home'],
            ['key' => 'home_value_3_title', 'value' => 'Empowerment', 'group' => 'home'],
            ['key' => 'home_value_3_description', 'value' => 'We equip individuals and communities to shape their own futures.', 'group' => 'home'],
            ['key' => 'home_value_3_icon', 'value' => 'Sparkles', 'group' => 'home'],
            ['key' => 'home_value_4_title', 'value' => 'Sustainability', 'group' => 'home'],
            ['key' => 'home_value_4_description', 'value' => 'We build lasting, people-centered solutions communities can sustain.', 'group' => 'home'],
            ['key' => 'home_value_4_icon', 'value' => 'Leaf', 'group' => 'home'],
            ['key' => 'home_value_5_title', 'value' => 'Excellence', 'group' => 'home'],
            ['key' => 'home_value_5_description', 'value' => 'We are committed to quality and continuous improvement.', 'group' => 'home'],
            ['key' => 'home_value_5_icon', 'value' => 'Award', 'group' => 'home'],
            ['key' => 'home_programmes_eyebrow', 'value' => 'Focus Areas', 'group' => 'home'],
            ['key' => 'home_programmes_title', 'value' => 'Areas of Focus', 'group' => 'home'],
            ['key' => 'home_programmes_cta_label', 'value' => 'View All Programmes', 'group' => 'home'],
            ['key' => 'home_banner_text', 'value' => 'Join us in impacting lives globally. Partner with us, support the mission, and help transform lives.', 'group' => 'home'],
            ['key' => 'home_banner_cta_label', 'value' => 'Donate Now', 'group' => 'home'],
            ['key' => 'home_banner_image', 'value' => '/images/home-banner.jpg', 'group' => 'home'],
        ];
    }
}
