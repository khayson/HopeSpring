import { Head, Link, router } from '@inertiajs/react';
import { Heart, Search } from 'lucide-react';
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
    index as donationsIndex,
    show as donationsShow,
} from '@/routes/admin/donations';

const ALL = 'all';

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

type Props = {
    donations: {
        data: Donation[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { status?: string; search?: string };
    stats: {
        raised: number;
        successful: number;
        pending: number;
        failed: number;
    };
};

function formatCurrency(pesewas: number): string {
    return `GHS ${(pesewas / 100).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const statusColors: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    failed: 'bg-rose-100 text-rose-800',
};

export default function DonationsIndex({ donations, filters, stats }: Props) {
    function filter(next: Partial<{ status: string; search: string }>) {
        router.get(
            donationsIndex.url(),
            {
                search: next.search ?? filters.search ?? '',
                status: next.status ?? filters.status ?? '',
            },
            { preserveState: true, replace: true },
        );
    }

    const activeStatus = filters.status || ALL;

    return (
        <>
            <Head title="Donations" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Donations
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Track gifts, payment status, and programme support.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AdminStatCard
                        label="Total raised"
                        value={formatCurrency(stats.raised)}
                        hint="Successful payments only"
                        active={activeStatus === ALL}
                        onClick={() => filter({ status: '' })}
                    />
                    <AdminStatCard
                        label="Successful"
                        value={stats.successful}
                        hint="Completed donations"
                        active={activeStatus === 'success'}
                        onClick={() => filter({ status: 'success' })}
                    />
                    <AdminStatCard
                        label="Pending"
                        value={stats.pending}
                        hint="Awaiting confirmation"
                        active={activeStatus === 'pending'}
                        onClick={() => filter({ status: 'pending' })}
                    />
                    <AdminStatCard
                        label="Failed"
                        value={stats.failed}
                        hint="Unsuccessful attempts"
                        active={activeStatus === 'failed'}
                        onClick={() => filter({ status: 'failed' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search name, email, or reference"
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
                        <SelectTrigger className="h-9 w-[160px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            <SelectItem value="success">Successful</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {donations.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <Heart className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No donations match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or wait for new gifts to arrive.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {donations.data.map((donation) => (
                                <Link
                                    key={donation.id}
                                    href={donationsShow.url(donation.id)}
                                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-navy dark:text-foreground">
                                                {donation.is_anonymous
                                                    ? 'Anonymous Donor'
                                                    : donation.donor_name}
                                            </p>
                                            <span
                                                className={cn(
                                                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                    statusColors[donation.status] ??
                                                        'bg-secondary',
                                                )}
                                            >
                                                {donation.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {donation.donor_email} ·{' '}
                                            {donation.programme || 'General Fund'}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-4 sm:self-center">
                                        <span className="text-sm font-bold text-emerald-600">
                                            {formatCurrency(donation.amount)}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(donation.created_at)}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                    <Pagination links={donations.links} />
                </div>
            </div>
        </>
    );
}

DonationsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Donations', href: donationsIndex.url() },
    ],
};
