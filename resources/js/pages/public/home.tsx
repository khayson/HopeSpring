import { ScrollReveal } from '@/components/public/scroll-reveal';
import { StatCounter } from '@/components/public/stat-counter';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { getIcon } from '@/lib/icon-map';
import { pageHeroes } from '@/lib/page-heroes';
import { Head, Link } from '@inertiajs/react';
import { Droplets, GraduationCap, HandHeart, Heart, MapPin, Users } from 'lucide-react';

type Programme = {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon: string;
    photo: string | null;
};

type Stat = { label: string; value: number; suffix: string | null };

type HomeProps = {
    programmes: Programme[];
    stats: Stat[];
    settings: Record<string, string | null | undefined>;
};

const statIcons = [Users, Droplets, GraduationCap, MapPin];

function setting(settings: HomeProps['settings'], key: string, fallback = ''): string {
    return settings[key]?.trim() || fallback;
}

export default function Home({ programmes, stats, settings }: HomeProps) {
    const mission = setting(
        settings,
        'about_mission',
        'To empower underserved communities in Ghana through sustainable clean water, education, healthcare, and community development programmes.',
    );

    const values = [1, 2, 3, 4]
        .map((index) => ({
            title: setting(settings, `home_value_${index}_title`),
            description: setting(settings, `home_value_${index}_description`),
            icon: getIcon(setting(settings, `home_value_${index}_icon`, 'Heart')),
        }))
        .filter((value) => value.title !== '');

    const heroImage = setting(settings, 'home_hero_image', pageHeroes.home);
    const aboutImage = setting(settings, 'home_about_image', pageHeroes.homeAbout);
    const bannerImage = setting(settings, 'home_banner_image', '/images/home-banner.jpg');

    return (
        <PublicLayout currentPath="/">
            <Head title="Home — HopeSpring Foundation" />

            <section className="relative overflow-hidden bg-navy-dark">
                <img
                    src={heroImage}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                    width={1920}
                    height={1080}
                />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(115deg, oklch(0.18 0.05 258 / 0.88) 0%, oklch(0.22 0.06 258 / 0.72) 50%, oklch(0.24 0.06 258 / 0.45) 100%)',
                    }}
                />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: 'linear-gradient(to top, oklch(0.18 0.05 258 / 0.85) 0%, transparent 45%)',
                    }}
                />

                <div className="relative z-10 mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-center px-4 pb-16 pt-28 md:min-h-[78vh] md:px-6 md:pb-20 md:pt-32">
                    <p className="text-sm font-extrabold tracking-[0.18em] text-brand-green-light uppercase animate-in fade-in-0 duration-700">
                        {setting(settings, 'home_hero_eyebrow', 'Welcome to HopeSpring Foundation')}
                    </p>
                    <h1 className="mt-4 max-w-3xl font-serif text-4xl font-bold leading-[1.08] text-white md:text-5xl lg:text-6xl animate-in fade-in-0 slide-in-from-bottom-3 duration-700">
                        {setting(settings, 'home_hero_title_prefix', 'We exist to')}{' '}
                        <span className="text-brand-green-light">
                            {setting(settings, 'home_hero_title_highlight', 'transform lives')}
                        </span>
                    </h1>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75 md:text-lg animate-in fade-in-0 slide-in-from-bottom-2 duration-1000">
                        {setting(
                            settings,
                            'home_hero_subtitle',
                            'We bring hope, restore dignity, and create opportunities for a better tomorrow.',
                        )}
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap animate-in fade-in-0 duration-1000">
                        <Button asChild size="lg" className="bg-brand-green font-bold hover:bg-brand-green-dark">
                            <Link href="/donate">
                                <Heart className="size-4" fill="currentColor" />
                                {setting(settings, 'home_cta_donate_label', 'Donate Now')}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/40 font-bold text-white hover:bg-white/10 hover:text-white"
                        >
                            <Link href="/get-involved/volunteer">
                                <HandHeart className="size-4" />
                                {setting(settings, 'home_cta_volunteer_label', 'Become a Volunteer')}
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/40 font-bold text-white hover:bg-white/10 hover:text-white"
                        >
                            <Link href="/get-involved/partner">
                                {setting(settings, 'home_cta_partner_label', 'Partner With Us')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {stats.length > 0 && (
                <div className="relative z-20 -mt-10 px-4 md:-mt-14 md:px-6">
                    <div className="mx-auto max-w-6xl bg-white px-4 py-6 shadow-xl md:px-8 md:py-8">
                        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
                            {stats.map((stat, index) => {
                                const Icon = statIcons[index] ?? Users;

                                return (
                                    <div key={stat.label} className="flex flex-col items-center text-center">
                                        <Icon className="mb-2 size-5 text-brand-green" />
                                        <StatCounter
                                            value={stat.value}
                                            suffix={stat.suffix ?? '+'}
                                            label={stat.label}
                                            className="text-navy"
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <section className={`bg-background px-4 md:px-6 ${stats.length > 0 ? 'pt-12 pb-16 md:pt-16 md:pb-24' : 'py-16 md:py-24'}`}>
                <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
                    <ScrollReveal>
                        <div className="relative">
                            <img
                                src={aboutImage}
                                alt=""
                                className="aspect-[4/5] w-full object-cover md:aspect-[4/4.5]"
                                width={800}
                                height={900}
                            />
                            <div className="absolute right-4 bottom-4 left-4 bg-white p-5 shadow-xl md:right-auto md:bottom-8 md:left-8 md:max-w-xs md:p-6">
                                <p className="text-xs font-bold tracking-[0.16em] text-brand-green uppercase">
                                    {setting(settings, 'home_about_mission_label', 'Our Mission')}
                                </p>
                                <p className="mt-2 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{mission}</p>
                                <Link
                                    href="/about"
                                    className="mt-3 inline-flex text-sm font-bold text-brand-green-dark hover:text-brand-green"
                                >
                                    {setting(settings, 'home_about_mission_link_label', 'Read More')}
                                </Link>
                            </div>
                        </div>
                    </ScrollReveal>

                    <ScrollReveal delay={80}>
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">
                                {setting(settings, 'home_about_eyebrow', 'About Us')}
                            </p>
                            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">
                                {setting(settings, 'home_about_title', 'Our Story, Our Why')}
                            </h2>
                            <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                                {setting(
                                    settings,
                                    'home_about_body',
                                    'HopeSpring began with a simple act of compassion — and grew into a movement for clean water, education, healthcare, and stronger communities across Ghana.',
                                )}
                            </p>

                            {values.length > 0 && (
                                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                                    {values.map((value) => {
                                        const Icon = value.icon;

                                        return (
                                            <div key={value.title} className="flex gap-3">
                                                <div className="flex size-10 shrink-0 items-center justify-center bg-brand-green/10 text-brand-green">
                                                    <Icon className="size-5" />
                                                </div>
                                                <div>
                                                    <h3 className="font-serif text-base font-semibold text-navy">{value.title}</h3>
                                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                        {value.description}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            <Button asChild size="lg" className="mt-8 bg-brand-green font-bold hover:bg-brand-green-dark">
                                <Link href="/about">{setting(settings, 'home_about_cta_label', 'Learn More About Us')}</Link>
                            </Button>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="bg-navy px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 text-center">
                        <p className="text-xs font-bold tracking-[0.18em] text-brand-green-light uppercase">
                            {setting(settings, 'home_programmes_eyebrow', 'Our Programs')}
                        </p>
                        <h2 className="mt-3 font-serif text-3xl font-bold text-white md:text-4xl">
                            {setting(settings, 'home_programmes_title', 'Areas We Focus On')}
                        </h2>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {programmes.map((programme, index) => {
                            const Icon = getIcon(programme.icon);
                            const image = programme.photo || pageHeroes.programmes;

                            return (
                                <ScrollReveal key={programme.id} delay={index * 60}>
                                    <Link
                                        href={`/programmes/${programme.slug}`}
                                        className="group flex h-full flex-col overflow-hidden bg-white transition-transform duration-300 hover:-translate-y-1"
                                    >
                                        <div className="overflow-hidden">
                                            <img
                                                src={image}
                                                alt={programme.title}
                                                className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                width={480}
                                                height={360}
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col p-5">
                                            <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-brand-green">
                                                <Icon className="size-5 text-white" />
                                            </div>
                                            <h3 className="font-serif text-lg font-semibold text-navy">{programme.title}</h3>
                                            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                                {programme.description}
                                            </p>
                                        </div>
                                    </Link>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    <div className="mt-10 text-center">
                        <Button
                            asChild
                            variant="outline"
                            size="lg"
                            className="border-white/40 font-bold text-white hover:bg-white/10 hover:text-white"
                        >
                            <Link href="/programmes">
                                {setting(settings, 'home_programmes_cta_label', 'View All Programs')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="relative overflow-hidden px-4 py-14 md:px-6 md:py-16">
                <img
                    src={bannerImage}
                    alt=""
                    className="absolute inset-0 size-full object-cover"
                    width={1920}
                    height={640}
                />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(90deg, oklch(0.45 0.13 145 / 0.92) 0%, oklch(0.56 0.15 145 / 0.88) 55%, oklch(0.56 0.15 145 / 0.8) 100%)',
                    }}
                />
                <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 text-center md:flex-row md:text-left">
                    <p className="flex-1 font-serif text-2xl font-bold leading-snug text-white md:text-3xl">
                        {setting(
                            settings,
                            'home_banner_text',
                            "Be the reason someone's life changes today. Your support brings hope, restores dignity, and creates brighter futures.",
                        )}
                    </p>
                    <Button asChild size="lg" className="shrink-0 bg-white font-bold text-brand-green hover:bg-white/90">
                        <Link href="/donate">
                            <Heart className="size-4" fill="currentColor" />
                            {setting(settings, 'home_banner_cta_label', 'Donate Now')}
                        </Link>
                    </Button>
                </div>
            </section>
        </PublicLayout>
    );
}
