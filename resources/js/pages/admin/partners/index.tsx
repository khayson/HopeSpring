import { Head, Link, router } from '@inertiajs/react';
import {
    Building2,
    ExternalLink,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { AdminStatCard } from '@/components/admin/stat-card';
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
    create as partnersCreate,
    destroy as partnersDestroy,
    edit as partnersEdit,
    index as partnersIndex,
} from '@/routes/admin/partners';

const ALL = 'all';

type Partner = {
    id: number;
    name: string;
    logo: string | null;
    url: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    partners: {
        data: Partner[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string };
    stats: { total: number; active: number; hidden: number };
};

export default function PartnersIndex({ partners, filters, stats }: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function filter(next: Partial<{ search: string; status: string }>) {
        router.get(
            partnersIndex.url(),
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
        router.delete(partnersDestroy.url(pendingDelete), {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    const activeStatus = filters.status || ALL;

    return (
        <>
            <Head title="Partners" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            Our Partners
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Manage partner logos shown on the About page.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <Link href={partnersCreate.url()}>
                            <Plus className="size-4" />
                            New Partner
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <AdminStatCard
                        label="All partners"
                        value={stats.total}
                        hint="Active and hidden"
                        active={activeStatus === ALL}
                        onClick={() => filter({ status: '' })}
                    />
                    <AdminStatCard
                        label="Active"
                        value={stats.active}
                        hint="Visible on About page"
                        active={activeStatus === 'active'}
                        onClick={() => filter({ status: 'active' })}
                    />
                    <AdminStatCard
                        label="Hidden"
                        value={stats.hidden}
                        hint="Not shown publicly"
                        active={activeStatus === 'hidden'}
                        onClick={() => filter({ status: 'hidden' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search name or website"
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {partners.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <Building2 className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No partners match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or add a partner logo for the
                                About page.
                            </p>
                            <Button
                                asChild
                                className="mt-6 bg-brand-green font-bold hover:bg-brand-green-dark"
                            >
                                <Link href={partnersCreate.url()}>
                                    <Plus className="size-4" />
                                    New Partner
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {partners.data.map((partner) => (
                                <div
                                    key={partner.id}
                                    className="flex flex-col gap-4 px-5 py-4 transition hover:bg-secondary/40 sm:flex-row sm:items-center"
                                >
                                    <div className="flex min-w-0 flex-1 items-start gap-4">
                                        <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/40 p-2">
                                            {partner.logo ? (
                                                <img
                                                    src={partner.logo}
                                                    alt={`${partner.name} logo`}
                                                    className="max-h-full max-w-full object-contain"
                                                />
                                            ) : (
                                                <Building2 className="size-6 text-muted-foreground opacity-50" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href={partnersEdit.url(
                                                        partner.id,
                                                    )}
                                                    className="truncate text-sm font-semibold text-navy hover:underline dark:text-foreground"
                                                >
                                                    {partner.name}
                                                </Link>
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                        partner.is_active
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-slate-100 text-slate-700',
                                                    )}
                                                >
                                                    {partner.is_active
                                                        ? 'Active'
                                                        : 'Hidden'}
                                                </span>
                                            </div>
                                            <p className="mt-2 truncate text-xs text-muted-foreground">
                                                Order {partner.sort_order}
                                                {partner.url
                                                    ? ` · ${partner.url}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 sm:self-center">
                                        {partner.url && (
                                            <a
                                                href={partner.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                                            >
                                                Visit
                                                <ExternalLink className="size-3.5" />
                                            </a>
                                        )}
                                        <Link
                                            href={partnersEdit.url(partner.id)}
                                            className="rounded-md px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPendingDelete(partner.id)
                                            }
                                            className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                                            aria-label={`Delete ${partner.name}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Pagination links={partners.links} />
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Delete this partner?"
                description="They will no longer appear on the About page. This cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                processing={processing}
                onConfirm={destroy}
            />
        </>
    );
}

PartnersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Partners', href: partnersIndex.url() },
    ],
};
