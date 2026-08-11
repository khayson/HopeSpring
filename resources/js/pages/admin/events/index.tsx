import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarDays,
    ExternalLink,
    MapPin,
    Plus,
    Search,
    Sparkles,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import {
    create as eventsCreate,
    destroy as eventsDestroy,
    edit as eventsEdit,
    index as eventsIndex,
} from '@/routes/admin/events';
import { show as publicEventShow } from '@/routes/events';

const ALL_STATUSES = 'all';

type Event = {
    id: number;
    title: string;
    slug: string;
    location: string;
    photo: string | null;
    starts_at: string;
    ends_at: string | null;
    is_featured: boolean;
    is_upcoming: boolean;
};

type Props = {
    events: {
        data: Event[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string };
    stats: {
        total: number;
        upcoming: number;
        past: number;
        featured: number;
    };
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatTime(value: string): string {
    return new Date(value).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

function StatCard({
    label,
    value,
    hint,
    active = false,
    onClick,
}: {
    label: string;
    value: number;
    hint: string;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md dark:bg-neutral-900',
                active
                    ? 'border-brand-green/50 ring-2 ring-brand-green/20'
                    : 'border-sidebar-border/70 dark:border-sidebar-border',
            )}
        >
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy dark:text-foreground">
                {value}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
        </button>
    );
}

export default function EventsIndex({ events, filters, stats }: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function filter(next: Partial<{ search: string; status: string }>) {
        router.get(
            eventsIndex.url(),
            {
                search: next.search ?? filters.search ?? '',
                status: next.status ?? filters.status ?? '',
            },
            { preserveState: true, replace: true },
        );
    }

    function destroy() {
        if (pendingDelete === null) {
            return;
        }

        setProcessing(true);
        router.delete(eventsDestroy.url(pendingDelete), {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    const activeStatus = filters.status || ALL_STATUSES;

    return (
        <>
            <Head title="Events" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            Events
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Plan, feature, and publish HopeSpring gatherings.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <Link href={eventsCreate.url()}>
                            <Plus className="size-4" />
                            New Event
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="All events"
                        value={stats.total}
                        hint="Everything in the calendar"
                        active={activeStatus === ALL_STATUSES}
                        onClick={() => filter({ status: '' })}
                    />
                    <StatCard
                        label="Upcoming"
                        value={stats.upcoming}
                        hint="Still ahead of now"
                        active={activeStatus === 'upcoming'}
                        onClick={() => filter({ status: 'upcoming' })}
                    />
                    <StatCard
                        label="Past"
                        value={stats.past}
                        hint="Already happened"
                        active={activeStatus === 'past'}
                        onClick={() => filter({ status: 'past' })}
                    />
                    <StatCard
                        label="Featured"
                        value={stats.featured}
                        hint="Priority listings"
                        active={activeStatus === 'featured'}
                        onClick={() => filter({ status: 'featured' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search title or location"
                            defaultValue={filters.search}
                            onChange={(e) => filter({ search: e.target.value })}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={activeStatus}
                        onValueChange={(value) =>
                            filter({
                                status: value === ALL_STATUSES ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-9 w-[180px]">
                            <SelectValue placeholder="Filter status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_STATUSES}>
                                All statuses
                            </SelectItem>
                            <SelectItem value="upcoming">Upcoming</SelectItem>
                            <SelectItem value="past">Past</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {events.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <CalendarDays className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No events match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or create a new event for the
                                public calendar.
                            </p>
                            <Button
                                asChild
                                className="mt-6 bg-brand-green font-bold hover:bg-brand-green-dark"
                            >
                                <Link href={eventsCreate.url()}>
                                    <Plus className="size-4" />
                                    New Event
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {events.data.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex flex-col gap-4 px-5 py-4 transition hover:bg-secondary/40 sm:flex-row sm:items-center"
                                >
                                    <div className="flex min-w-0 flex-1 items-start gap-4">
                                        <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/40">
                                            {event.photo ? (
                                                <img
                                                    src={event.photo}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                                    <CalendarDays className="size-6 opacity-50" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href={eventsEdit.url(
                                                        event.id,
                                                    )}
                                                    className="truncate text-sm font-semibold text-navy hover:underline dark:text-foreground"
                                                >
                                                    {event.title}
                                                </Link>
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                        event.is_upcoming
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-slate-100 text-slate-700',
                                                    )}
                                                >
                                                    {event.is_upcoming
                                                        ? 'Upcoming'
                                                        : 'Past'}
                                                </span>
                                                {event.is_featured && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                                                        <Sparkles className="size-3" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <CalendarDays className="size-3.5 text-brand-green" />
                                                    {formatDate(
                                                        event.starts_at,
                                                    )}{' '}
                                                    · {formatTime(event.starts_at)}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <MapPin className="size-3.5 text-brand-green" />
                                                    <span className="truncate">
                                                        {event.location}
                                                    </span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 sm:self-center">
                                        <a
                                            href={publicEventShow.url(
                                                event.slug,
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                                        >
                                            View
                                            <ExternalLink className="size-3.5" />
                                        </a>
                                        <Link
                                            href={eventsEdit.url(event.id)}
                                            className="rounded-md px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPendingDelete(event.id)
                                            }
                                            className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                                            aria-label={`Delete ${event.title}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Pagination links={events.links} />
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Delete this event?"
                description="It will disappear from the public calendar. This cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                processing={processing}
                onConfirm={destroy}
            />
        </>
    );
}

EventsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Events', href: eventsIndex.url() },
    ],
};
