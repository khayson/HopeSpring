import { Head, router } from '@inertiajs/react';
import { Mail, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { AdminStatCard } from '@/components/admin/stat-card';
import { Pagination } from '@/components/admin/pagination';
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
    destroy as newsletterDestroy,
    index as newsletterIndex,
} from '@/routes/admin/newsletter';

const ALL = 'all';

type Subscriber = {
    id: number;
    email: string;
    subscribed_at: string;
    unsubscribed_at: string | null;
};

type Props = {
    subscribers: {
        data: Subscriber[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string };
    stats: { total: number; active: number; unsubscribed: number };
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function NewsletterIndex({
    subscribers,
    filters,
    stats,
}: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function filter(next: Partial<{ search: string; status: string }>) {
        router.get(
            newsletterIndex.url(),
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
        router.delete(newsletterDestroy.url(pendingDelete), {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    const activeStatus = filters.status || ALL;

    return (
        <>
            <Head title="Newsletter Subscribers" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Newsletter Subscribers
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage who receives HopeSpring email updates.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <AdminStatCard
                        label="All subscribers"
                        value={stats.total}
                        hint="Everyone on the list"
                        active={activeStatus === ALL}
                        onClick={() => filter({ status: '' })}
                    />
                    <AdminStatCard
                        label="Active"
                        value={stats.active}
                        hint="Receiving emails"
                        active={activeStatus === 'active'}
                        onClick={() => filter({ status: 'active' })}
                    />
                    <AdminStatCard
                        label="Unsubscribed"
                        value={stats.unsubscribed}
                        hint="Opted out"
                        active={activeStatus === 'unsubscribed'}
                        onClick={() => filter({ status: 'unsubscribed' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search email address"
                            defaultValue={filters.search}
                            onChange={(e) => filter({ search: e.target.value })}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={activeStatus}
                        onValueChange={(value) =>
                            filter({
                                status: value === ALL ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-9 w-[180px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="unsubscribed">
                                Unsubscribed
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {subscribers.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <Mail className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No subscribers match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or wait for new sign-ups from
                                the public site.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {subscribers.data.map((sub) => (
                                <div
                                    key={sub.id}
                                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-secondary/40"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-navy dark:text-foreground">
                                                {sub.email}
                                            </p>
                                            <span
                                                className={cn(
                                                    'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                    sub.unsubscribed_at
                                                        ? 'bg-slate-100 text-slate-700'
                                                        : 'bg-emerald-100 text-emerald-800',
                                                )}
                                            >
                                                {sub.unsubscribed_at
                                                    ? 'Unsubscribed'
                                                    : 'Active'}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {sub.unsubscribed_at
                                                ? 'Unsubscribed'
                                                : 'Subscribed'}{' '}
                                            {formatDate(
                                                sub.unsubscribed_at ??
                                                    sub.subscribed_at,
                                            )}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPendingDelete(sub.id)
                                        }
                                        className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                                        aria-label={`Remove ${sub.email}`}
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <Pagination links={subscribers.links} />
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Remove this subscriber?"
                description="They will stop receiving newsletter emails."
                confirmLabel="Remove"
                variant="destructive"
                processing={processing}
                onConfirm={destroy}
            />
        </>
    );
}

NewsletterIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Newsletter', href: newsletterIndex.url() },
    ],
};
