import { Head } from '@inertiajs/react';
import { EventForm } from '@/components/admin/event-form';
import { dashboard } from '@/routes';

export default function EventsCreate() {
    return (
        <>
            <Head title="New Event" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <h1 className="text-xl font-bold">New Event</h1>
                <EventForm action="/admin/events" method="post" submitLabel="Create Event" />
            </div>
        </>
    );
}

EventsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Events', href: '/admin/events' },
        { title: 'New', href: '/admin/events/create' },
    ],
};
