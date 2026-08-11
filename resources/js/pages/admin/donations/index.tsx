import { Head, Link, router } from '@inertiajs/react';
import { Pagination } from '@/components/admin/pagination';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';

const ALL_STATUSES = 'all';

type Donation = {
    id: number;
    donor_name: string;
    donor_email: string;
    amount: number;
    currency: string;
    status: string;
    programme: string | null;
    is_anonymous: boolean;
    created_at: string;
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
};

type Props = {
    donations: Paginated<Donation>;
    filters: { status?: string; search?: string };
    totals: { successful: number; count: number };
};

function formatCurrency(pesewas: number): string {
    return `GHS ${(pesewas / 100).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
}

const statusColors: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    failed: 'bg-rose-100 text-rose-800',
};

export default function DonationsIndex({ donations, filters, totals }: Props) {
    function filter(next: Partial<{ status: string; search: string }>) {
        router.get('/admin/donations', { ...filters, ...next }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Donations" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 lg:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                        <p className="text-sm font-medium text-muted-foreground">Total Raised</p>
                        <p className="mt-2 text-2xl font-bold tracking-tight">{formatCurrency(totals.successful)}</p>
                    </div>
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                        <p className="text-sm font-medium text-muted-foreground">Successful Donations</p>
                        <p className="mt-2 text-2xl font-bold tracking-tight">{totals.count.toLocaleString()}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search by name, email, or reference"
                        defaultValue={filters.search}
                        onChange={(e) => filter({ search: e.target.value })}
                        className="max-w-xs"
                    />
                    <Select
                        value={filters.status || ALL_STATUSES}
                        onValueChange={(value) => filter({ status: value === ALL_STATUSES ? '' : value })}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        {donations.data.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No donations found.</p>
                        ) : (
                            donations.data.map((donation) => (
                                <Link
                                    key={donation.id}
                                    href={`/admin/donations/${donation.id}`}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-secondary/50"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {donation.donor_email} &middot; {donation.programme || 'General Fund'}
                                        </p>
                                    </div>
                                    <span className={`mx-3 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[donation.status] ?? 'bg-secondary'}`}>
                                        {donation.status}
                                    </span>
                                    <span className="shrink-0 text-sm font-bold text-emerald-600">{formatCurrency(donation.amount)}</span>
                                </Link>
                            ))
                        )}
                    </div>
                    <Pagination links={donations.links} />
                </div>
            </div>
        </>
    );
}

DonationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Donations', href: '/admin/donations' },
    ],
};
