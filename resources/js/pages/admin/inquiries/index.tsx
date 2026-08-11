import { Head, Link, router } from '@inertiajs/react';
import { Handshake, Search } from 'lucide-react';
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
    index as inquiriesIndex,
    show as inquiriesShow,
} from '@/routes/admin/inquiries';

const ALL = 'all';

type Inquiry = {
    id: number;
    type: string;
    name: string;
    email: string;
    organisation: string | null;
    status: string;
    created_at: string;
};

type Props = {
    inquiries: {
        data: Inquiry[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { type?: string; status?: string; search?: string };
    stats: {
        total: number;
        new: number;
        reviewed: number;
        converted: number;
    };
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-amber-100 text-amber-800',
    converted: 'bg-emerald-100 text-emerald-800',
};

const typeColors: Record<string, string> = {
    volunteer: 'bg-amber-100 text-amber-800',
    partner: 'bg-purple-100 text-purple-800',
};

export default function InquiriesIndex({ inquiries, filters, stats }: Props) {
    function filter(
        next: Partial<{ type: string; status: string; search: string }>,
    ) {
        router.get(
            inquiriesIndex.url(),
            {
                search: next.search ?? filters.search ?? '',
                type: next.type ?? filters.type ?? '',
                status: next.status ?? filters.status ?? '',
            },
            { preserveState: true, replace: true },
        );
    }

    const activeStatus = filters.status || ALL;
    const activeType = filters.type || ALL;

    return (
        <>
            <Head title="Inquiries" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Volunteer & Partner Inquiries
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Review interest forms and convert applicants to accounts.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AdminStatCard
                        label="All inquiries"
                        value={stats.total}
                        hint="Volunteer and partner"
                        active={
                            activeStatus === ALL && activeType === ALL
                        }
                        onClick={() => filter({ status: '', type: '' })}
                    />
                    <AdminStatCard
                        label="New"
                        value={stats.new}
                        hint="Not yet reviewed"
                        active={activeStatus === 'new'}
                        onClick={() => filter({ status: 'new' })}
                    />
                    <AdminStatCard
                        label="Reviewed"
                        value={stats.reviewed}
                        hint="Seen by your team"
                        active={activeStatus === 'reviewed'}
                        onClick={() => filter({ status: 'reviewed' })}
                    />
                    <AdminStatCard
                        label="Converted"
                        value={stats.converted}
                        hint="Accounts created"
                        active={activeStatus === 'converted'}
                        onClick={() => filter({ status: 'converted' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search name, email, or organisation"
                            defaultValue={filters.search}
                            onChange={(e) => filter({ search: e.target.value })}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={activeType}
                        onValueChange={(value) =>
                            filter({ type: value === ALL ? '' : value })
                        }
                    >
                        <SelectTrigger className="h-9 w-[160px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All types</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                            <SelectItem value="partner">Partner</SelectItem>
                        </SelectContent>
                    </Select>
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
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {inquiries.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <Handshake className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No inquiries match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or wait for new volunteer and
                                partner submissions.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {inquiries.data.map((inquiry) => (
                                <Link
                                    key={inquiry.id}
                                    href={inquiriesShow.url(inquiry.id)}
                                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-navy dark:text-foreground">
                                                {inquiry.name}
                                            </p>
                                            <span
                                                className={cn(
                                                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                    typeColors[inquiry.type] ??
                                                        'bg-secondary',
                                                )}
                                            >
                                                {inquiry.type}
                                            </span>
                                            <span
                                                className={cn(
                                                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                    statusColors[inquiry.status] ??
                                                        'bg-secondary',
                                                )}
                                            >
                                                {inquiry.status}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {inquiry.email}
                                            {inquiry.organisation
                                                ? ` · ${inquiry.organisation}`
                                                : ''}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {formatDate(inquiry.created_at)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                    <Pagination links={inquiries.links} />
                </div>
            </div>
        </>
    );
}

InquiriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inquiries', href: inquiriesIndex.url() },
    ],
};
