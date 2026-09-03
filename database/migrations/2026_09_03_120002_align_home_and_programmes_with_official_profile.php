<?php

use App\Models\Programme;
use App\Models\SiteSetting;
use App\Support\AboutPageSettings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Align home copy and programme labels with the official HopeSpring profile.
     */
    public function up(): void
    {
        $homeUpdates = [
            'home_hero_title_prefix' => 'HopeSpring Foundation',
            'home_hero_title_highlight' => 'Transforming Lives',
            'home_about_title' => 'Who We Are',
            'home_about_body' => "HopeSpring Foundation is a nonprofit organization committed to improving the lives of vulnerable children, women, youth, and underserved communities. We believe that every individual deserves access to opportunities that promote dignity, well-being, and sustainable development.\n\nThrough strategic partnerships and community-driven initiatives, we work to address immediate needs while creating long-term solutions that empower people to thrive.",
            'home_programmes_eyebrow' => 'Our Programs',
            'home_programmes_title' => 'Our Program Areas',
            'home_programmes_intro' => 'We work across education, children’s welfare, women’s empowerment, youth development, healthcare, and community support — addressing immediate needs while building long-term opportunity.',
        ];

        foreach ($homeUpdates as $key => $value) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $key],
                [
                    'value' => $value,
                    'group' => 'home',
                ],
            );
        }

        SiteSetting::query()->updateOrCreate(
            ['key' => 'about_mission'],
            [
                'value' => AboutPageSettings::mission(),
                'group' => 'about',
            ],
        );

        Programme::query()->where('slug', 'education-for-all')->update([
            'title' => 'Education',
            'description' => 'School support, learning materials, and educational advocacy for children who need a path to learn and grow.',
            'icon' => 'GraduationCap',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Programme::query()->updateOrCreate(
            ['slug' => 'childrens-welfare'],
            [
                'title' => "Children's Welfare",
                'description' => 'Child protection, essential needs support, and well-being initiatives for vulnerable children.',
                'long_description' => 'Children carry the heaviest cost of poverty — missed school, unsafe care, and unmet basic needs. Our children’s welfare work focuses on protection, dignity, and the essentials that help a child feel safe enough to learn and grow.',
                'icon' => 'Baby',
                'photo' => '/images/home-programme-education.jpg',
                'sort_order' => 2,
                'is_active' => true,
            ],
        );

        $women = Programme::query()
            ->whereIn('slug', ['youth-women-empowerment', 'womens-empowerment'])
            ->orderByRaw("CASE WHEN slug = 'youth-women-empowerment' THEN 0 ELSE 1 END")
            ->first();

        if ($women !== null) {
            $women->fill([
                'title' => "Women's Empowerment",
                'slug' => 'womens-empowerment',
                'description' => 'Skills development, employment opportunities, and entrepreneurship support for women.',
                'long_description' => 'Women often carry the heaviest unpaid work yet have the least access to credit, mentoring, and fair work. We open pathways through training, mentorship, and support for small enterprises so women can earn, lead, and support their families.',
                'icon' => 'Venus',
                'sort_order' => 3,
                'is_active' => true,
            ])->save();
        } else {
            Programme::query()->create([
                'title' => "Women's Empowerment",
                'slug' => 'womens-empowerment',
                'description' => 'Skills development, employment opportunities, and entrepreneurship support for women.',
                'long_description' => 'Women often carry the heaviest unpaid work yet have the least access to credit, mentoring, and fair work. We open pathways through training, mentorship, and support for small enterprises so women can earn, lead, and support their families.',
                'icon' => 'Venus',
                'photo' => '/images/home-programme-community.jpg',
                'sort_order' => 3,
                'is_active' => true,
            ]);
        }

        Programme::query()->updateOrCreate(
            ['slug' => 'youth-development'],
            [
                'title' => 'Youth Development',
                'description' => 'Leadership development, mentorship, and vocational and life-skills training for young people.',
                'long_description' => 'Young people need more than encouragement — they need skills, mentors, and a first real opportunity. Our youth work builds leadership, vocational ability, and confidence so the next generation can shape their own future.',
                'icon' => 'Sparkles',
                'photo' => '/images/home-programme-community.jpg',
                'sort_order' => 4,
                'is_active' => true,
            ],
        );

        Programme::query()->where('slug', 'healthcare-outreach')->update([
            'title' => 'Healthcare',
            'description' => 'Health education, community outreach, and access to basic healthcare support.',
            'icon' => 'HeartPulse',
            'sort_order' => 5,
            'is_active' => true,
        ]);

        Programme::query()->where('slug', 'community-development')->update([
            'title' => 'Community & Humanitarian Support',
            'description' => 'Relief initiatives, partnerships, and community development projects that help people recover and thrive.',
            'icon' => 'Handshake',
            'sort_order' => 6,
            'is_active' => true,
        ]);

        Programme::query()->where('slug', 'clean-water-initiative')->update([
            'title' => 'Clean Water',
            'sort_order' => 7,
            'is_active' => true,
        ]);

        Programme::query()->where('slug', 'emergency-relief')->update([
            'is_active' => false,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'home_about_title'],
            ['value' => 'Our Story, Our Why', 'group' => 'home'],
        );
        SiteSetting::query()->updateOrCreate(
            ['key' => 'home_about_body'],
            ['value' => 'HopeSpring Foundation was born out of a simple act of compassion that revealed a deep need. What started with one child\'s joy has grown into a mission to bring lasting change to many lives.', 'group' => 'home'],
        );
        SiteSetting::query()->updateOrCreate(
            ['key' => 'home_programmes_title'],
            ['value' => 'Areas We Focus On', 'group' => 'home'],
        );
        SiteSetting::query()->updateOrCreate(
            ['key' => 'home_hero_title_prefix'],
            ['value' => 'We exist to', 'group' => 'home'],
        );

        $women = Programme::query()->where('slug', 'womens-empowerment')->first();

        if ($women !== null) {
            $women->fill([
                'title' => 'Youth & Women Empowerment',
                'slug' => 'youth-women-empowerment',
                'description' => 'Equipping youth and women with skills and opportunities.',
                'is_active' => true,
                'sort_order' => 5,
            ])->save();
        }

        Programme::query()->whereIn('slug', ['childrens-welfare', 'youth-development'])->delete();
        Programme::query()->where('slug', 'emergency-relief')->update(['is_active' => true]);
        Programme::query()->where('slug', 'education-for-all')->update([
            'title' => 'Education Support',
            'sort_order' => 2,
        ]);
        Programme::query()->where('slug', 'healthcare-outreach')->update([
            'title' => 'Healthcare Outreach',
            'sort_order' => 3,
        ]);
        Programme::query()->where('slug', 'community-development')->update([
            'title' => 'Community Development',
            'icon' => 'Users',
            'sort_order' => 4,
        ]);
        Programme::query()->where('slug', 'clean-water-initiative')->update([
            'sort_order' => 1,
            'is_active' => true,
        ]);
    }
};
