import { Head, Link } from '@inertiajs/react';
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

type AboutProps = {
    team: TeamMember[];
    milestones: Milestone[];
    stats: Stat[];
    partners: Partner[];
    settings: Record<string, string | null | undefined>;
};

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
    const story =
        settings.home_about_body?.trim() ||
        'HopeSpring Foundation was born from a moment that could not be ignored. One day, Melina Diamond encountered a woman and her three children on her way back from town. Moved by compassion, she offered them a ride to school. During the ride, she noticed the youngest child holding a torn rubber bag tightly to his chest. Inside were his books. Despite its condition, he held it with pride and said, "This is my school bag." That moment revealed resilience, dignity, and need in its purest form. The next day, Melina returned with a proper school bag. The joy and gratitude the child expressed became a defining moment. It was then she realized: even the smallest act of kindness can transform a life. From that moment, HopeSpring Foundation was born.';
    const whoWeAre =
        settings.about_who_we_are?.trim() ||
        'A purpose-driven organization committed to empowering individuals and transforming communities through sustainable, people-centered solutions.';
    const values = [1, 2, 3, 4, 5]
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
            description:
                'We lead with empathy and genuine care for every person we serve.',
            icon: getIcon('Heart'),
        },
        {
            title: 'Integrity',
            description:
                'We uphold honesty, transparency, and accountability in all we do.',
            icon: getIcon('Shield'),
        },
        {
            title: 'Empowerment',
            description:
                'We equip individuals and communities to shape their own futures.',
            icon: getIcon('Sparkles'),
        },
        {
            title: 'Sustainability',
            description:
                'We build lasting, people-centered solutions communities can sustain.',
            icon: getIcon('Leaf'),
        },
        {
            title: 'Excellence',
            description:
                'We are committed to quality and continuous improvement.',
            icon: getIcon('Award'),
        },
    ];
    const displayedValues = values.length > 0 ? values : fallbackValues;

    return (
        <PublicLayout currentPath="/about">
            <Head title="About Us — HopeSpring Foundation" />

            <PageHero
                title="About Us"
                subtitle="Impacting Lives Globally"
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
                    <h2 className="mt-3 font-serif text-3xl font-bold text-navy">
                        Founder&apos;s Story
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                        {story}
                    </p>
                </div>
            </section>

            <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="font-serif text-3xl font-bold text-navy">
                        Who We Are
                    </h2>
                    <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                        {whoWeAre}
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-navy">
                            Vision
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            {settings.about_vision ||
                                'To create a world where access to opportunity is available to all.'}
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-navy">
                            Mission
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            {settings.about_mission ||
                                'To impact lives globally through empowerment, support, and sustainable development.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-10 text-center font-serif text-3xl font-bold text-navy">
                        Core Values
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
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
                    <h2 className="mb-10 text-center font-serif text-3xl font-bold text-navy">
                        Areas of Focus
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {(
                            [
                                {
                                    title: 'Community Outreach',
                                    href: '/programmes/clean-water-initiative',
                                    icon: getIcon('Users'),
                                },
                                {
                                    title: 'Youth Empowerment',
                                    href: '/programmes/community-development',
                                    icon: getIcon('Sparkles'),
                                },
                                {
                                    title: 'Health & Wellness',
                                    href: '/programmes/healthcare-outreach',
                                    icon: getIcon('HeartPulse'),
                                },
                                {
                                    title: 'Education & Development',
                                    href: '/programmes/education-for-all',
                                    icon: getIcon('GraduationCap'),
                                },
                            ] as const
                        ).map((area, i) => (
                            <ScrollReveal key={area.title} delay={i * 50}>
                                <Link
                                    href={area.href}
                                    className="flex flex-col items-center rounded-xl border border-border bg-white p-6 text-center transition-shadow hover:shadow-lg"
                                >
                                    <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-green/10">
                                        <area.icon className="size-6 text-brand-green" />
                                    </div>
                                    <h3 className="font-serif text-base font-semibold text-navy">
                                        {area.title}
                                    </h3>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story / Timeline */}
            {milestones.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                    <h2 className="mb-10 text-center font-serif text-3xl font-bold text-navy">
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

            {/* Leadership */}
            {leadership.length > 0 && (
                <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-10 text-center font-serif text-3xl font-bold text-navy">
                            Leadership Team
                        </h2>
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

            {/* Staff */}
            {staff.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
                    <h2 className="mb-10 text-center font-serif text-2xl font-bold text-navy">
                        Our Team
                    </h2>
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
                </section>
            )}

            {/* Board */}
            {board.length > 0 && (
                <section className="bg-secondary/50 px-4 py-12 md:px-6">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-10 text-center font-serif text-2xl font-bold text-navy">
                            Board of Directors
                        </h2>
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
