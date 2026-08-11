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
            ['key' => 'about_partners_eyebrow', 'value' => 'Our Partners', 'group' => 'about'],
            ['key' => 'about_partners_heading', 'value' => 'Building partnerships that last', 'group' => 'about'],
            ['key' => 'about_partners_intro', 'value' => 'HopeSpring works best alongside institutions, foundations, and mission-aligned organisations that share our commitment to community-led change across Ghana.', 'group' => 'about'],
            ['key' => 'about_partners_empty_title', 'value' => 'Partnerships in progress', 'group' => 'about'],
            ['key' => 'about_partners_empty_message', 'value' => 'We do not have formal partner listings yet. We are building relationships with organisations that align with our work in clean water, education, healthcare, and community development.', 'group' => 'about'],
            ['key' => 'about_partners_cta_label', 'value' => 'Explore Partnership Opportunities', 'group' => 'about'],
        ];
    }
}
