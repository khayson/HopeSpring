import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { EventForm } from '@/components/admin/event-form';
import { dashboard } from '@/routes';
import {
    index as eventsIndex,
    update as eventsUpdate,
} from '@/routes/admin/events';

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
    is_featured: boolean;
};

type Props = { event: Event };

export default function EventsEdit({ event }: Props) {
    return (
        <>
            <Head title={`Edit — ${event.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <Link
                        href={eventsIndex.url()}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to events
                    </Link>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Edit Event
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update schedule, copy, and visibility for this listing.
                    </p>
                </div>
                <EventForm
                    event={{
                        title: event.title,
                        slug: event.slug,
                        description: event.description,
                        long_description: event.long_description ?? '',
                        location: event.location,
                        photo: event.photo ?? '',
                        starts_at: event.starts_at,
                        ends_at: event.ends_at ?? '',
                        is_featured: event.is_featured,
                    }}
                    action={eventsUpdate.url(event.id)}
                    method="put"
                    submitLabel="Save Changes"
                    cancelHref={eventsIndex.url()}
                />
            </div>
        </>
    );
}

EventsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Events', href: eventsIndex.url() },
        { title: 'Edit', href: '#' },
    ],
};
