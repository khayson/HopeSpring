import { DonationBand } from '@/components/public/donation-band';
import { PageHero } from '@/components/public/page-hero';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';

type Event = {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    photo: string | null;
    starts_at: string;
    ends_at?: string | null;
};

type Props = {
    upcomingEvents: Event[];
    pastEvents: Event[];
};

function EventCard({ event, isPast = false }: { event: Event; isPast?: boolean }) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <Link href={`/events/${event.slug}`} className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-md transition-shadow hover:shadow-xl dark:bg-card">
            {event.photo && (
                <div className="overflow-hidden">
                    <img src={event.photo} alt={event.title} className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
                </div>
            )}
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-brand-green" />
                        {formatDate(event.starts_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-brand-green" />
                        {event.location}
                    </span>
                </div>
                <h3 className="font-serif text-base font-semibold text-navy">{event.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{event.description}</p>
                {!isPast && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-green-dark">
                        Learn More <ArrowRight className="size-3.5" />
                    </span>
                )}
            </div>
        </Link>
    );
}

export default function EventsIndex({ upcomingEvents, pastEvents }: Props) {
    return (
        <PublicLayout currentPath="/get-involved">
            <Head title="Events — HopeSpring Foundation" />

            <PageHero
                title="Events"
                subtitle="Join us and be part of the change happening across Ghana."
                image={pageHeroes.events}
            />

            {/* Upcoming */}
            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <h2 className="mb-8 font-serif text-3xl font-bold text-navy">Upcoming Events</h2>
                {upcomingEvents.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {upcomingEvents.map((e) => (
                            <EventCard key={e.id} event={e} />
                        ))}
                    </div>
                ) : (
                    <p className="py-8 text-center text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
                )}
            </section>

            {/* Past */}
            {pastEvents.length > 0 && (
                <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-8 font-serif text-3xl font-bold text-navy">Past Events</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {pastEvents.map((e) => (
                                <EventCard key={e.id} event={e} isPast />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <DonationBand />
        </PublicLayout>
    );
}
