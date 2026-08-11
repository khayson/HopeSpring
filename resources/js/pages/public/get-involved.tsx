import { Head, Link } from '@inertiajs/react';
import { Calendar, HandHeart, Heart, MapPin, Megaphone, Users } from 'lucide-react';
import { DonationBand } from '@/components/public/donation-band';
import { EngagementCard } from '@/components/public/engagement-card';
import { PageHero } from '@/components/public/page-hero';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';

type Event = {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    starts_at: string;
};

type Props = {
    upcomingEvents: Event[];
};

export default function GetInvolved({ upcomingEvents }: Props) {
    return (
        <PublicLayout currentPath="/get-involved">
            <Head title="Get Involved — HopeSpring Foundation" />

            <PageHero
                title="Get Involved"
                subtitle="There are many ways you can support our mission and help transform lives."
                image={pageHeroes.getInvolved}
            />

            {/* Ways to Help */}
            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="mb-10 text-center">
                    <h2 className="font-serif text-3xl font-bold text-navy">Ways to Make a Difference</h2>
                    <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                        There are many ways you can support our mission and help transform lives in Ghana.
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <EngagementCard
                        icon={Heart}
                        title="Donate"
                        description="Support our programmes with a one-time or recurring donation. Every cedi makes a difference."
                        href="/donate"
                        buttonLabel="Donate Now"
                    />
                    <EngagementCard
                        icon={HandHeart}
                        title="Volunteer"
                        description="Join our team of dedicated volunteers and directly impact the communities we serve."
                        href="/get-involved/volunteer"
                        buttonLabel="Sign Up"
                    />
                    <EngagementCard
                        icon={Users}
                        title="Partner"
                        description="Collaborate with us as a corporate or institutional partner to multiply our impact."
                        href="/get-involved/partner"
                        buttonLabel="Partner With Us"
                    />
                    <EngagementCard
                        icon={Megaphone}
                        title="Spread the Word"
                        description="Follow us on social media and share our stories to raise awareness about our work."
                        href="/news"
                        buttonLabel="Read Stories"
                    />
                </div>
            </section>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
                <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-8 text-center font-serif text-3xl font-bold text-navy">Upcoming Events</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {upcomingEvents.map((event) => (
                                <Link key={event.id} href={`/events/${event.slug}`} className="group rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-xl dark:bg-card">
                                    <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="size-3.5 text-brand-green" />
                                            {new Date(event.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="size-3.5 text-brand-green" />
                                            {event.location}
                                        </span>
                                    </div>
                                    <h3 className="font-serif text-base font-semibold text-navy">{event.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <DonationBand />
        </PublicLayout>
    );
}
