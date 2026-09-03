import { Head } from '@inertiajs/react';
import { BrushEdge } from '@/components/public/brush-edge';
import { DonationBand } from '@/components/public/donation-band';
import { PageHero } from '@/components/public/page-hero';
import { PartnerShowcase } from '@/components/public/partner-showcase';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import { StatsBar } from '@/components/public/stats-bar';
import { TeamCard } from '@/components/public/team-card';
import { TimelineItem } from '@/components/public/timeline-item';
import { ValueCard } from '@/components/public/value-card';
import PublicLayout from '@/layouts/public/public-layout';
import { getIcon } from '@/lib/icon-map';
import { pageHeroes } from '@/lib/page-heroes';

type TeamMember = {
    id: number;
    name: string;
    role: string;
    photo: string | null;
    bio: string | null;
    type: string;
};

type Milestone = { year: string; title: string; description: string };
type Stat = { label: string; value: number; suffix: string | null };
type Partner = {
    id: number;
    name: string;
    logo: string | null;
    url: string | null;
};

type FocusArea = {
    title: string;
    icon: string;
    items: string[];
};

type AboutProps = {
    team: TeamMember[];
    milestones: Milestone[];
    stats: Stat[];
    partners: Partner[];
    settings: Record<string, string | null | undefined>;
};

const defaultFocusAreas: FocusArea[] = [
    {
        title: 'Education',
        icon: 'GraduationCap',
        items: ['School support', 'Learning materials', 'Educational advocacy'],
    },
    {
        title: "Children's Welfare",
        icon: 'Baby',
        items: [
            'Child protection',
            'Essential needs support',
            'Well-being initiatives',
        ],
    },
    {
        title: "Women's Empowerment",
        icon: 'Venus',
        items: [
            'Skills development',
            'Employment opportunities',
            'Entrepreneurship support',
        ],
    },
    {
        title: 'Youth Development',
        icon: 'Sparkles',
        items: [
            'Leadership development',
            'Mentorship',
            'Vocational and life-skills training',
        ],
    },
    {
        title: 'Healthcare',
        icon: 'HeartPulse',
        items: [
            'Health education',
            'Community outreach',
            'Access to basic healthcare support',
        ],
    },
    {
        title: 'Community & Humanitarian Support',
        icon: 'Handshake',
        items: [
            'Relief initiatives',
            'Partnerships',
            'Community development projects',
        ],
    },
];

function paragraphs(text: string): string[] {
    return text
        .split(/\n\n+/)
        .map((part) => part.trim())
        .filter(Boolean);
}

function lines(text: string): string[] {
    return text
        .split('\n')
        .map((part) => part.trim())
        .filter(Boolean);
}

function parseFocusAreas(raw: string | null | undefined): FocusArea[] {
    if (!raw?.trim()) {
        return defaultFocusAreas;
    }

    try {
        const parsed = JSON.parse(raw) as FocusArea[];

        if (!Array.isArray(parsed) || parsed.length === 0) {
            return defaultFocusAreas;
        }

        return parsed;
    } catch {
        return defaultFocusAreas;
    }
}

export default function About({
    team,
    milestones,
    stats,
    partners,
    settings,
}: AboutProps) {
    const leadership = team.filter((m) => m.type === 'leadership');
    const staff = team.filter((m) => m.type === 'staff');
    const board = team.filter((m) => m.type === 'board');
    const founderStory =
        settings.about_founder_story?.trim() ||
        'HopeSpring Foundation was not born in a boardroom or from strategy, it was born from a moment.\n\nAnd from that moment, HopeSpring Foundation was born.';
    const founderAttribution =
        settings.about_founder_attribution?.trim() || 'By Melina Diamond';
    const whoWeAre =
        settings.about_who_we_are?.trim() ||
        'HopeSpring Foundation is a nonprofit organization committed to improving the lives of vulnerable children, women, youth, and underserved communities.';
    const communityIntro =
        settings.about_community_intro?.trim() ||
        'HopeSpring Foundation has begun engaging with underserved communities to identify pressing needs and build relationships with local leaders.';
    const communityList = lines(
        settings.about_community_list ??
            'Anweem community in the Komenda District\nBonponsu Community in the Ashanti Akyem District',
    );
    const focusAreas = parseFocusAreas(settings.about_focus_areas);
    const values = [1, 2, 3, 4]
        .map((index) => ({
            title: settings[`home_value_${index}_title`]?.trim() ?? '',
            description:
                settings[`home_value_${index}_description`]?.trim() ?? '',
            icon: getIcon(settings[`home_value_${index}_icon`]),
        }))
        .filter((value) => value.title !== '');
    const fallbackValues = [
        {
            title: 'Compassion',
            description: 'We serve with love and empathy for every person.',
            icon: getIcon('Heart'),
        },
        {
            title: 'Integrity',
            description: 'We uphold transparency, honesty and accountability.',
            icon: getIcon('Shield'),
        },
        {
            title: 'Empowerment',
            description:
                'We equip people to build better and sustainable lives.',
            icon: getIcon('Users'),
        },
        {
            title: 'Excellence',
            description:
                'We are committed to quality and continuous improvement.',
            icon: getIcon('Star'),
        },
    ];
    const displayedValues = values.length > 0 ? values : fallbackValues;

    return (
        <PublicLayout currentPath="/about">
            <Head title="About Us — HopeSpring Foundation" />

            <PageHero
                title="About Us"
                subtitle="Transforming Lives"
                image={pageHeroes.about}
            />
            <BrushEdge className="h-8 text-background md:h-12" />
            {stats.length > 0 && (
                <StatsBar
                    stats={stats.map((s) => ({
                        value: s.value,
                        suffix: s.suffix ?? undefined,
                        label: s.label,
                    }))}
                />
            )}

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                        About Us
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-foreground">
                        The Founder&apos;s Story
                    </h2>
                    <p className="mt-2 text-sm font-medium text-brand-green">
                        {founderAttribution}
                    </p>
                    <div className="mt-5 space-y-4 text-left text-base leading-relaxed text-muted-foreground md:text-center">
                        {paragraphs(founderStory).map((part) => (
                            <p key={part.slice(0, 48)}>{part}</p>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-card px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                        About Us
                    </p>
                    <h2 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-foreground">
                        Who We Are
                    </h2>
                    <div className="mt-5 space-y-4 text-base leading-relaxed text-muted-foreground">
                        {paragraphs(whoWeAre).map((part) => (
                            <p key={part.slice(0, 48)}>{part}</p>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-navy dark:text-foreground">
                            Our Vision
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            {settings.about_vision ||
                                'A society where every child, woman, and young person has equal opportunities to learn, grow, and live with dignity.'}
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-navy dark:text-foreground">
                            Our Mission
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            {settings.about_mission ||
                                'To improve lives by providing access to education, healthcare, economic empowerment, humanitarian support, and community development through collaboration, innovation, and compassion.'}
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-card px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 text-center">
                        <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                            What Guides Us
                        </p>
                        <h2 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-foreground">
                            Core Values
                        </h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {displayedValues.map((v, i) => (
                            <ScrollReveal key={v.title} delay={i * 50}>
                                <ValueCard
                                    icon={v.icon}
                                    title={v.title}
                                    description={v.description}
                                />
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 text-center">
                        <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                            What We Do
                        </p>
                        <h2 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-foreground">
                            Our Program Areas
                        </h2>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {focusAreas.map((area, i) => {
                            const Icon = getIcon(area.icon);

                            return (
                                <ScrollReveal key={area.title} delay={i * 50}>
                                    <div className="flex h-full flex-col rounded-xl border border-border bg-card p-6">
                                        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-green/10">
                                            <Icon className="size-6 text-brand-green" />
                                        </div>
                                        <h3 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                                            {area.title}
                                        </h3>
                                        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                                            {area.items.map((item) => (
                                                <li
                                                    key={item}
                                                    className="flex gap-2"
                                                >
                                                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-green" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className="bg-card px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-3xl">
                    <div className="text-center">
                        <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                            On the Ground
                        </p>
                        <h2 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-foreground">
                            Community Engagement
                        </h2>
                        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                            {communityIntro}
                        </p>
                    </div>
                    {communityList.length > 0 && (
                        <div className="mt-8">
                            <p className="text-sm font-semibold text-navy dark:text-foreground">
                                Communities identified include:
                            </p>
                            <ul className="mt-4 space-y-3">
                                {communityList.map((community) => (
                                    <li
                                        key={community}
                                        className="flex gap-3 text-sm leading-relaxed text-muted-foreground"
                                    >
                                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-green" />
                                        <span>{community}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </section>

            {milestones.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                    <h2 className="mb-10 text-center font-serif text-3xl font-bold text-navy dark:text-foreground">
                        Our Journey
                    </h2>
                    <div className="mx-auto max-w-2xl">
                        {milestones.map((m, i) => (
                            <TimelineItem
                                key={m.year + m.title}
                                year={m.year}
                                title={m.title}
                                description={m.description}
                                isLast={i === milestones.length - 1}
                            />
                        ))}
                    </div>
                </section>
            )}

            {leadership.length > 0 && (
                <section className="bg-card px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10 text-center">
                            <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                                Our People
                            </p>
                            <h2 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-foreground">
                                Leadership Team
                            </h2>
                        </div>
                        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                            {leadership.map((member, i) => (
                                <ScrollReveal key={member.id} delay={i * 50}>
                                    <div className="text-center">
                                        <TeamCard
                                            name={member.name}
                                            role={member.role}
                                            image={member.photo ?? undefined}
                                        />
                                        {member.bio && (
                                            <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                                                {member.bio}
                                            </p>
                                        )}
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {staff.length > 0 && (
                <section className="bg-card px-4 py-16 md:px-6">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10 text-center">
                            <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                                Our People
                            </p>
                            <h2 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-foreground">
                                Our Team
                            </h2>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
                            {staff.map((member) => (
                                <TeamCard
                                    key={member.id}
                                    name={member.name}
                                    role={member.role}
                                    image={member.photo ?? undefined}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {board.length > 0 && (
                <section className="bg-card px-4 py-12 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10 text-center">
                            <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                                Governance
                            </p>
                            <h2 className="mt-3 font-serif text-3xl font-bold text-navy dark:text-foreground">
                                Board of Directors
                            </h2>
                        </div>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            {board.map((member) => (
                                <TeamCard
                                    key={member.id}
                                    name={member.name}
                                    role={member.role}
                                    image={member.photo ?? undefined}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <PartnerShowcase partners={partners} settings={settings} />

            <DonationBand />
        </PublicLayout>
    );
}
