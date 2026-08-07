import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';

type Event = {
    id: number;
    title: string;
    location: string;
    starts_at: string;
    is_featured: boolean;
};

type Props = {
    events: {
        data: Event[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function EventsIndex({ events }: Props) {
    function destroy(id: number) {
        if (confirm('Delete this event? This cannot be undone.')) {
            router.delete(`/admin/events/${id}`);
        }
    }

    return (
        <>
            <Head title="Events" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Events</h1>
                    <Button asChild className="bg-brand-green font-bold hover:bg-brand-green-dark">
                        <Link href="/admin/events/create">
                            <Plus className="size-4" />
                            New Event
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        {events.data.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No events yet.</p>
                        ) : (
                            events.data.map((event) => (
                                <div key={event.id} className="flex items-center justify-between px-5 py-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-medium">{event.title}</p>
                                            {event.is_featured && (
                                                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {event.location} &middot;{' '}
                                            {new Date(event.starts_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Link href={`/admin/events/${event.id}/edit`} className="text-xs font-medium text-blue-600 hover:underline">
                                            Edit
                                        </Link>
                                        <button onClick={() => destroy(event.id)} className="text-rose-600 hover:text-rose-800" aria-label="Delete event">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Pagination links={events.links} />
                </div>
            </div>
        </>
    );
}

EventsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Events', href: '/admin/events' },
    ],
};
