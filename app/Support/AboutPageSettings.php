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
            [
                'key' => 'about_who_we_are',
                'value' => "HopeSpring Foundation is a nonprofit organization committed to improving the lives of vulnerable children, women, youth, and underserved communities. We believe that every individual deserves access to opportunities that promote dignity, well-being, and sustainable development.\n\nThrough strategic partnerships and community-driven initiatives, we work to address immediate needs while creating long-term solutions that empower people to thrive.",
                'group' => 'about',
            ],
            [
                'key' => 'about_founder_story',
                'value' => self::founderStory(),
                'group' => 'about',
            ],
            [
                'key' => 'about_founder_attribution',
                'value' => 'By Melina Diamond',
                'group' => 'about',
            ],
            [
                'key' => 'about_community_intro',
                'value' => 'HopeSpring Foundation has begun engaging with underserved communities to identify pressing needs and build relationships with local leaders. These engagements help us understand where support is most needed and guide the development of sustainable programs.',
                'group' => 'about',
            ],
            [
                'key' => 'about_community_list',
                'value' => "Anweem community in the Komenda District\nBonponsu Community in the Ashanti Akyem District",
                'group' => 'about',
            ],
            [
                'key' => 'about_focus_areas',
                'value' => json_encode(self::focusAreas(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
                'group' => 'about',
            ],
            [
                'key' => 'about_partners_eyebrow',
                'value' => 'Partnership',
                'group' => 'about',
            ],
            [
                'key' => 'about_partners_heading',
                'value' => 'Why Partner With Us?',
                'group' => 'about',
            ],
            [
                'key' => 'about_partners_intro',
                'value' => 'We believe meaningful change happens through collaboration. By partnering with HopeSpring Foundation, organizations can:',
                'group' => 'about',
            ],
            [
                'key' => 'about_partners_points',
                'value' => "Reach underserved communities through trusted local engagement.\nSupport initiatives that address real, identified community needs.\nContribute to transparent, accountable, and sustainable impact.\nJoin a shared commitment to improving lives and creating opportunities.",
                'group' => 'about',
            ],
            [
                'key' => 'about_partners_quote',
                'value' => 'Together, we can bring hope where it is needed most.',
                'group' => 'about',
            ],
            [
                'key' => 'about_partners_empty_title',
                'value' => 'Partnerships in progress',
                'group' => 'about',
            ],
            [
                'key' => 'about_partners_empty_message',
                'value' => 'We are building relationships with organisations that share our commitment to improving lives through education, healthcare, empowerment, and community support.',
                'group' => 'about',
            ],
            [
                'key' => 'about_partners_cta_label',
                'value' => 'Partner With Us',
                'group' => 'about',
            ],
        ];
    }

    public static function vision(): string
    {
        return 'A society where every child, woman, and young person has equal opportunities to learn, grow, and live with dignity.';
    }

    public static function mission(): string
    {
        return 'To improve lives by providing access to education, healthcare, economic empowerment, humanitarian support, and community development through collaboration, innovation, and compassion.';
    }

    public static function founderStory(): string
    {
        return <<<'STORY'
HopeSpring Foundation was not born in a boardroom or from strategy, it was born from a moment.

A moment that could not be ignored.

On an ordinary day, while leaving home to work, Melina Diamond noticed a woman and her three children walking along the roadside. It became a quiet routine seeing them each morning, navigating life with visible strength despite their circumstances.

One day, she decided to stop and offer them a ride to school.

What seemed like a simple act of kindness turned into a life changing encounter.

As the children settled into the car, something unexpected happened. Water began to spill slightly, and when Melina turned to check, her eyes met a moment she would never forget.

The youngest boy, no older than six, was clutching a torn rubber bag tightly to his chest. Inside were his books, his only school materials. Despite the condition of the bag, his focus was not on himself, but on protecting the car seat from getting wet.

In that moment, he said something simple yet profound:

"This is my school bag."

That was all it took.

What he held onto with pride was something most would overlook. But in his eyes, it was everything.

Melina broke down in tears.

Because in that moment, she didn't just see a child, she saw resilience, dignity, and the silent struggles so many face every day.

Right there, a decision was made.

The next day, she returned with a proper school bag for him. When she handed it over, the way he received it…holding it close to his chest with pure joy and gratitude was unforgettable.

That was the moment everything changed.

Not because of the bag, but because of what it represented.

The Impact.

It became clear that even the smallest act, when done with intention, could transform a life.

And from that moment, HopeSpring Foundation was born.
STORY;
    }

    /**
     * @return list<array{title: string, icon: string, items: list<string>}>
     */
    public static function focusAreas(): array
    {
        return [
            [
                'title' => 'Education',
                'icon' => 'GraduationCap',
                'items' => [
                    'School support',
                    'Learning materials',
                    'Educational advocacy',
                ],
            ],
            [
                'title' => "Children's Welfare",
                'icon' => 'Baby',
                'items' => [
                    'Child protection',
                    'Essential needs support',
                    'Well-being initiatives',
                ],
            ],
            [
                'title' => "Women's Empowerment",
                'icon' => 'Venus',
                'items' => [
                    'Skills development',
                    'Employment opportunities',
                    'Entrepreneurship support',
                ],
            ],
            [
                'title' => 'Youth Development',
                'icon' => 'Sparkles',
                'items' => [
                    'Leadership development',
                    'Mentorship',
                    'Vocational and life-skills training',
                ],
            ],
            [
                'title' => 'Healthcare',
                'icon' => 'HeartPulse',
                'items' => [
                    'Health education',
                    'Community outreach',
                    'Access to basic healthcare support',
                ],
            ],
            [
                'title' => 'Community & Humanitarian Support',
                'icon' => 'Handshake',
                'items' => [
                    'Relief initiatives',
                    'Partnerships',
                    'Community development projects',
                ],
            ],
        ];
    }
}
