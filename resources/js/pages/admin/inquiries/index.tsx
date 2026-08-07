import { Pagination } from '@/components/admin/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dashboard } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';

const ALL_TYPES = 'all';
const ALL_STATUSES = 'all';

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
    filters: { type?: string; status?: string };
};

const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-amber-100 text-amber-800',
    converted: 'bg-emerald-100 text-emerald-800',
};

export default function InquiriesIndex({ inquiries, filters }: Props) {
    function filter(next: Partial<{ type: string; status: string }>) {
        router.get('/admin/inquiries', { ...filters, ...next }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Inquiries" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <h1 className="text-xl font-bold">Volunteer & Partner Inquiries</h1>

                <div className="flex flex-wrap items-center gap-3">
                    <Select
                        value={filters.type || ALL_TYPES}
                        onValueChange={(value) => filter({ type: value === ALL_TYPES ? '' : value })}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_TYPES}>All types</SelectItem>
                            <SelectItem value="volunteer">Volunteer</SelectItem>
                            <SelectItem value="partner">Partner</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={filters.status || ALL_STATUSES}
                        onValueChange={(value) => filter({ status: value === ALL_STATUSES ? '' : value })}
                    >
                        <SelectTrigger className="h-9">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL_STATUSES}>All statuses</SelectItem>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="reviewed">Reviewed</SelectItem>
                            <SelectItem value="converted">Converted</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        {inquiries.data.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No inquiries found.</p>
                        ) : (
                            inquiries.data.map((inquiry) => (
                                <Link
                                    key={inquiry.id}
                                    href={`/admin/inquiries/${inquiry.id}`}
                                    className="flex items-center justify-between px-5 py-3 hover:bg-secondary/50"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-medium">{inquiry.name}</p>
                                            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                                                {inquiry.type}
                                            </span>
                                        </div>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {inquiry.email} {inquiry.organisation ? `· ${inquiry.organisation}` : ''}
                                        </p>
                                    </div>
                                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${statusColors[inquiry.status] ?? 'bg-secondary'}`}>
                                        {inquiry.status}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                    <Pagination links={inquiries.links} />
                </div>
            </div>
        </>
    );
}

InquiriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inquiries', href: '/admin/inquiries' },
    ],
};
