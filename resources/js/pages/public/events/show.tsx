import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { BrushEdge } from '@/components/public/brush-edge';
import { DonationBand } from '@/components/public/donation-band';
import { PageHero } from '@/components/public/page-hero';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';
import { donate } from '@/routes';

type Event = {
    id: number;
    title: string;
    slug: string;
    description: string;
    long_description: string | null;
    location: string;
    photo: string | null;
    starts_at: string;
    ends_at: string | null;
};

type Props = {
    event: Event;
};

export default function EventShow({ event }: Props) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const formatTime = (date: string) =>
        new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

    const donateHref = donate.url({ query: { event: event.slug } });

    return (
        <PublicLayout currentPath="/get-involved">
            <Head title={`${event.title} — HopeSpring Foundation`} />

            <PageHero
                title={event.title}
                image={pageHeroes.events}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Events', href: '/events' }, { label: event.title }]}
            />
            <BrushEdge className="h-8 text-background md:h-12" />

            <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
                <div className="mb-8 flex flex-wrap gap-4 rounded-xl border border-border bg-secondary/50 p-6">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="size-4 text-brand-green" />
                        <span className="font-semibold text-navy">{formatDate(event.starts_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock className="size-4 text-brand-green" />
                        <span className="text-muted-foreground">
                            {formatTime(event.starts_at)}
                            {event.ends_at && ` — ${formatTime(event.ends_at)}`}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <MapPin className="size-4 text-brand-green" />
                        <span className="text-muted-foreground">{event.location}</span>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="text-lg leading-relaxed">{event.description}</p>
                    {event.long_description && (
                        <div className="mt-6">{event.long_description}</div>
                    )}
                </div>

                <div className="mt-12 flex flex-wrap gap-3">
                    <Button asChild className="bg-brand-green font-bold hover:bg-brand-green-dark">
                        <Link href={donateHref}>Support this event</Link>
                    </Button>
                    <Button asChild variant="outline" className="border-navy font-semibold text-navy hover:bg-navy hover:text-white">
                        <Link href="/events">
                            <ArrowLeft className="size-4" />
                            Back to Events
                        </Link>
                    </Button>
                </div>
            </article>

            <DonationBand
                title={`Support ${event.title}`}
                description="Your gift helps make this event possible and extends its impact in the communities we serve."
                donateHref={donateHref}
            />
        </PublicLayout>
    );
}
