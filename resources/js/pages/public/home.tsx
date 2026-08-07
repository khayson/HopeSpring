import { BrushEdge } from '@/components/public/brush-edge';
import { DonationBand } from '@/components/public/donation-band';
import { NewsCard } from '@/components/public/news-card';
import { ProgrammeCard } from '@/components/public/programme-card';
import { ProjectCard } from '@/components/public/project-card';
import { StatsBar } from '@/components/public/stats-bar';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { getIcon } from '@/lib/icon-map';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, Heart, MapPin } from 'lucide-react';

type Programme = {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon: string;
    photo: string | null;
};

type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    photo: string | null;
    programme: { id: number; title: string } | null;
};

type Stat = { label: string; value: number; suffix: string | null };

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    category: 'education' | 'healthcare' | 'community' | 'relief';
    published_at: string;
};

type Event = {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    starts_at: string;
};

type Partner = { name: string; logo: string | null; url: string | null };

type HomeProps = {
    programmes: Programme[];
    featuredProjects: Project[];
    stats: Stat[];
    latestPosts: Post[];
    upcomingEvents: Event[];
    partners: Partner[];
    settings: Record<string, string>;
};

export default function Home({ programmes, featuredProjects, stats, latestPosts, upcomingEvents, partners, settings }: HomeProps) {
    return (
        <PublicLayout currentPath="/">
            <Head title="Home — HopeSpring Foundation" />

            {/* Hero */}
            <section className="relative flex min-h-[520px] items-center overflow-hidden bg-navy-dark md:min-h-[600px]">
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(120deg, oklch(0.24 0.06 258) 0%, oklch(0.24 0.06 258 / 0.85) 55%, oklch(0.60 0.14 240 / 0.35) 100%)',
                    }}
                />
                <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 md:px-6">
                    <div className="max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-green-light/40 bg-brand-green-light/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-brand-green-light">
                            <Heart className="size-3" fill="currentColor" />
                            HopeSpring Foundation
                        </div>
                        <h1 className="font-serif text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                            {settings.site_tagline || 'Transforming Lives, Building Futures'}
                        </h1>
                        <p className="mt-6 max-w-lg text-base leading-relaxed text-white/75 md:text-lg">
                            {settings.about_mission || 'Empowering communities in Ghana through sustainable clean water, education, healthcare, and development programmes.'}
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button asChild size="lg" className="bg-brand-green font-bold hover:bg-brand-green-dark">
                                <Link href="/donate">
                                    <Heart className="size-4" />
                                    Donate Now
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="border-white/30 font-bold text-white hover:bg-white/10 hover:text-white">
                                <Link href="/about">
                                    Learn More
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Brush Edge + Stats */}
            <BrushEdge className="h-8 text-background md:h-12" />
            {stats.length > 0 && (
                <StatsBar stats={stats.map((s) => ({ value: s.value, suffix: s.suffix ?? undefined, label: s.label }))} />
            )}

            {/* Programmes */}
            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="mb-10 text-center">
                    <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">Our Programmes</h2>
                    <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                        We focus on four key areas to create lasting, sustainable change in communities across Ghana.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {programmes.map((p) => (
                        <ProgrammeCard
                            key={p.id}
                            title={p.title}
                            description={p.description}
                            icon={getIcon(p.icon)}
                            image={p.photo ?? undefined}
                            href={`/programmes/${p.slug}`}
                        />
                    ))}
                </div>
            </section>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
                <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10 flex items-end justify-between">
                            <div>
                                <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">Featured Projects</h2>
                                <p className="mt-3 text-muted-foreground">See the impact of your support on the ground.</p>
                            </div>
                            <Button asChild variant="outline" className="hidden border-navy font-semibold text-navy hover:bg-navy hover:text-white sm:inline-flex">
                                <Link href="/projects">
                                    View All
                                    <ArrowRight className="size-4" />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {featuredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    title={project.title}
                                    description={project.description}
                                    location={project.location}
                                    image={project.photo ?? undefined}
                                    href={`/projects/${project.slug}`}
                                />
                            ))}
                        </div>
                        <div className="mt-8 text-center sm:hidden">
                            <Button asChild variant="outline" className="border-navy font-semibold text-navy hover:bg-navy hover:text-white">
                                <Link href="/projects">View All Projects</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Latest News */}
            {latestPosts.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h2 className="font-serif text-3xl font-bold text-navy md:text-4xl">Latest News & Stories</h2>
                            <p className="mt-3 text-muted-foreground">Updates from the field and our community.</p>
                        </div>
                        <Button asChild variant="ghost" className="hidden font-semibold text-brand-green-dark sm:inline-flex">
                            <Link href="/news">
                                All Stories
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {latestPosts.map((post) => (
                            <NewsCard
                                key={post.id}
                                title={post.title}
                                excerpt={post.excerpt}
                                date={new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                category={post.category}
                                image={post.featured_image ?? undefined}
                                href={`/news/${post.slug}`}
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <section className="bg-navy-dark px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-10 text-center">
                            <h2 className="font-serif text-3xl font-bold text-white md:text-4xl">Upcoming Events</h2>
                            <p className="mx-auto mt-3 max-w-xl text-white/60">Join us and be part of the change.</p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2">
                            {upcomingEvents.map((event) => (
                                <Link key={event.id} href={`/events/${event.slug}`} className="group rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10">
                                    <div className="mb-3 flex items-center gap-4 text-sm text-white/50">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="size-3.5 text-brand-green-light" />
                                            {new Date(event.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="size-3.5 text-brand-green-light" />
                                            {event.location}
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-lg font-semibold text-white">{event.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-white/60">{event.description}</p>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Button asChild variant="outline" className="border-white/30 font-semibold text-white hover:bg-white/10 hover:text-white">
                                <Link href="/events">View All Events</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}

            {/* Partners */}
            {partners.length > 0 && (
                <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
                    <h2 className="mb-8 text-center font-serif text-2xl font-bold text-navy">Our Partners</h2>
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {partners.map((partner) => (
                            <div key={partner.name} className="text-lg font-bold text-muted-foreground/50">
                                {partner.name}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Donation Band */}
            <DonationBand />
        </PublicLayout>
    );
}
