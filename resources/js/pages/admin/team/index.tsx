import { Head, Link, router } from '@inertiajs/react';
import { Plus, Search, Trash2, UserRound } from 'lucide-react';
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
    create as teamCreate,
    destroy as teamDestroy,
    edit as teamEdit,
    index as teamIndex,
} from '@/routes/admin/team';

const ALL = 'all';

type TeamMember = {
    id: number;
    name: string;
    role: string;
    photo: string | null;
    type: string;
    type_label: string;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    members: {
        data: TeamMember[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; type?: string; status?: string };
    stats: {
        total: number;
        leadership: number;
        staff: number;
        board: number;
    };
};

export default function TeamIndex({ members, filters, stats }: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function filter(
        next: Partial<{ search: string; type: string; status: string }>,
    ) {
        router.get(
            teamIndex.url(),
            {
                search: next.search ?? filters.search ?? '',
                type: next.type ?? filters.type ?? '',
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
        router.delete(teamDestroy.url(pendingDelete), {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    const activeType = filters.type || ALL;
    const activeStatus = filters.status || ALL;

    return (
        <>
            <Head title="Team" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            Team
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Photos and profiles for Leadership, Our Team, and
                            the Board of Directors.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <Link href={teamCreate.url()}>
                            <Plus className="size-4" />
                            Add person
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AdminStatCard
                        label="All people"
                        value={stats.total}
                        hint="Every section"
                        active={activeType === ALL}
                        onClick={() => filter({ type: '' })}
                    />
                    <AdminStatCard
                        label="Leadership"
                        value={stats.leadership}
                        hint="Leadership Team"
                        active={activeType === 'leadership'}
                        onClick={() => filter({ type: 'leadership' })}
                    />
                    <AdminStatCard
                        label="Our Team"
                        value={stats.staff}
                        hint="Staff profiles"
                        active={activeType === 'staff'}
                        onClick={() => filter({ type: 'staff' })}
                    />
                    <AdminStatCard
                        label="Board"
                        value={stats.board}
                        hint="Board of Directors"
                        active={activeType === 'board'}
                        onClick={() => filter({ type: 'board' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search name or role"
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
                    {members.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <UserRound className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No people match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or add someone to the About page.
                            </p>
                            <Button
                                asChild
                                className="mt-6 bg-brand-green font-bold hover:bg-brand-green-dark"
                            >
                                <Link href={teamCreate.url()}>
                                    <Plus className="size-4" />
                                    Add person
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {members.data.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex flex-col gap-4 px-5 py-4 transition hover:bg-secondary/40 sm:flex-row sm:items-center"
                                >
                                    <div className="flex min-w-0 flex-1 items-start gap-4">
                                        <div className="size-16 shrink-0 overflow-hidden rounded-full border border-sidebar-border/70 bg-muted/40">
                                            {member.photo ? (
                                                <img
                                                    src={member.photo}
                                                    alt={member.name}
                                                    className="size-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex size-full items-center justify-center font-serif text-lg font-bold text-muted-foreground">
                                                    {member.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href={teamEdit.url(
                                                        member.id,
                                                    )}
                                                    className="truncate text-sm font-semibold text-navy hover:underline dark:text-foreground"
                                                >
                                                    {member.name}
                                                </Link>
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                        member.is_active
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-slate-100 text-slate-700',
                                                    )}
                                                >
                                                    {member.is_active
                                                        ? 'Active'
                                                        : 'Hidden'}
                                                </span>
                                            </div>
                                            <p className="mt-1 truncate text-sm text-muted-foreground">
                                                {member.role}
                                            </p>
                                            <p className="mt-1 truncate text-xs text-muted-foreground">
                                                {member.type_label} · Order{' '}
                                                {member.sort_order}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 sm:self-center">
                                        <Link
                                            href={teamEdit.url(member.id)}
                                            className="rounded-md px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPendingDelete(member.id)
                                            }
                                            className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                                            aria-label={`Delete ${member.name}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Pagination links={members.links} />
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Delete this person?"
                description="They will no longer appear on the About page. This cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                processing={processing}
                onConfirm={destroy}
            />
        </>
    );
}

TeamIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Team', href: teamIndex.url() },
    ],
};
