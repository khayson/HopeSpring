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
            ['key' => 'home_hero_title_prefix', 'value' => 'HopeSpring Foundation', 'group' => 'home'],
            ['key' => 'home_hero_title_highlight', 'value' => 'Transforming Lives', 'group' => 'home'],
            ['key' => 'home_hero_subtitle', 'value' => 'We bring hope, restore dignity, and create opportunities for a better tomorrow.', 'group' => 'home'],
            ['key' => 'home_hero_image', 'value' => '/images/home-hero.jpg', 'group' => 'home'],
            ['key' => 'home_cta_donate_label', 'value' => 'Donate Now', 'group' => 'home'],
            ['key' => 'home_cta_volunteer_label', 'value' => 'Become a Volunteer', 'group' => 'home'],
            ['key' => 'home_cta_partner_label', 'value' => 'Partner With Us', 'group' => 'home'],
            ['key' => 'home_about_eyebrow', 'value' => 'About Us', 'group' => 'home'],
            ['key' => 'home_about_title', 'value' => 'Who We Are', 'group' => 'home'],
            ['key' => 'home_about_body', 'value' => "HopeSpring Foundation is a nonprofit organization committed to improving the lives of vulnerable children, women, youth, and underserved communities. We believe that every individual deserves access to opportunities that promote dignity, well-being, and sustainable development.\n\nThrough strategic partnerships and community-driven initiatives, we work to address immediate needs while creating long-term solutions that empower people to thrive.", 'group' => 'home'],
            ['key' => 'home_about_image', 'value' => '/images/home-about.jpg', 'group' => 'home'],
            ['key' => 'home_about_mission_label', 'value' => 'Our Mission', 'group' => 'home'],
            ['key' => 'home_about_mission_link_label', 'value' => 'Read More', 'group' => 'home'],
            ['key' => 'home_about_cta_label', 'value' => 'Learn More About Us', 'group' => 'home'],
            ['key' => 'home_value_1_title', 'value' => 'Compassion', 'group' => 'home'],
            ['key' => 'home_value_1_description', 'value' => 'We serve with love and empathy for every person.', 'group' => 'home'],
            ['key' => 'home_value_1_icon', 'value' => 'Heart', 'group' => 'home'],
            ['key' => 'home_value_2_title', 'value' => 'Integrity', 'group' => 'home'],
            ['key' => 'home_value_2_description', 'value' => 'We uphold transparency, honesty and accountability.', 'group' => 'home'],
            ['key' => 'home_value_2_icon', 'value' => 'Shield', 'group' => 'home'],
            ['key' => 'home_value_3_title', 'value' => 'Empowerment', 'group' => 'home'],
            ['key' => 'home_value_3_description', 'value' => 'We equip people to build better and sustainable lives.', 'group' => 'home'],
            ['key' => 'home_value_3_icon', 'value' => 'Users', 'group' => 'home'],
            ['key' => 'home_value_4_title', 'value' => 'Excellence', 'group' => 'home'],
            ['key' => 'home_value_4_description', 'value' => 'We are committed to quality and continuous improvement.', 'group' => 'home'],
            ['key' => 'home_value_4_icon', 'value' => 'Star', 'group' => 'home'],
            ['key' => 'home_programmes_eyebrow', 'value' => 'Our Programs', 'group' => 'home'],
            ['key' => 'home_programmes_title', 'value' => 'Our Program Areas', 'group' => 'home'],
            ['key' => 'home_programmes_intro', 'value' => 'We work across education, children’s welfare, women’s empowerment, youth development, healthcare, and community support — addressing immediate needs while building long-term opportunity.', 'group' => 'home'],
            ['key' => 'home_programmes_cta_label', 'value' => 'View All Programs', 'group' => 'home'],
            ['key' => 'home_banner_headline', 'value' => "Be the reason someone's life changes today.", 'group' => 'home'],
            ['key' => 'home_banner_text', 'value' => 'Your support brings hope, restores dignity, and creates brighter futures.', 'group' => 'home'],
            ['key' => 'home_banner_cta_label', 'value' => 'Donate Now', 'group' => 'home'],
            ['key' => 'home_banner_image', 'value' => '/images/home-banner.jpg', 'group' => 'home'],
        ];
    }
}
