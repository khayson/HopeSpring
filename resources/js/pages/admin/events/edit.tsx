import { EventForm } from '@/components/admin/event-form';
import { dashboard } from '@/routes';
import { Head } from '@inertiajs/react';

type Event = {
    id: number;
    title: string;
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
                <h1 className="text-xl font-bold">Edit Event</h1>
                <EventForm
                    event={{
                        title: event.title,
                        description: event.description,
                        long_description: event.long_description ?? '',
                        location: event.location,
                        photo: event.photo ?? '',
                        starts_at: event.starts_at,
                        ends_at: event.ends_at ?? '',
                        is_featured: event.is_featured,
                    }}
                    action={`/admin/events/${event.id}`}
                    method="put"
                    submitLabel="Save Changes"
                />
            </div>
        </>
    );
}

EventsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Events', href: '/admin/events' },
        { title: 'Edit', href: '#' },
    ],
};
