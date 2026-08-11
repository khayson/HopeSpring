import { Head } from '@inertiajs/react';
import { Eye, Heart, Shield, Users } from 'lucide-react';
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
    settings: Record<string, string>;
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

    return (
        <PublicLayout currentPath="/about">
            <Head title="About Us — HopeSpring Foundation" />

            <PageHero
                title="About Us"
                subtitle="Born from a simple act of compassion — a torn school bag held with pride."
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

            {/* Mission & Vision */}
            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="grid gap-12 md:grid-cols-2">
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-navy">
                            Our Mission
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            {settings.about_mission ||
                                'To empower underserved communities in Ghana through sustainable clean water, education, healthcare, and community development programmes.'}
                        </p>
                    </div>
                    <div>
                        <h2 className="font-serif text-3xl font-bold text-navy">
                            Our Vision
                        </h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                            {settings.about_vision ||
                                'A Ghana where every community has access to clean water, quality education, and essential healthcare.'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-7xl">
                    <h2 className="mb-10 text-center font-serif text-3xl font-bold text-navy">
                        Our Core Values
                    </h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {(
                            [
                                {
                                    icon: Heart,
                                    title: 'Compassion',
                                    description:
                                        'We lead with empathy and genuine care for every individual and community we serve.',
                                },
                                {
                                    icon: Shield,
                                    title: 'Integrity',
                                    description:
                                        'We uphold the highest standards of transparency and accountability in all our work.',
                                },
                                {
                                    icon: Users,
                                    title: 'Community',
                                    description:
                                        'We believe in the power of communities to drive their own sustainable development.',
                                },
                                {
                                    icon: Eye,
                                    title: 'Impact',
                                    description:
                                        "We measure our success by the lasting, positive change we create in people's lives.",
                                },
                            ] as const
                        ).map((v, i) => (
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
