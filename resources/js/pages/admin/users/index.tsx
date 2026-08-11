import { Head, Link, router } from '@inertiajs/react';
import { Mail, Plus, Search, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { AdminStatCard } from '@/components/admin/stat-card';
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
    create as usersCreate,
    destroy as usersDestroy,
    index as usersIndex,
    resendInvite as usersResendInvite,
} from '@/routes/admin/users';

const ALL = 'all';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
};

type Role = { value: string; label: string };

type Props = {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; role?: string; status?: string };
    stats: { total: number; active: number; pending: number; staff: number };
    roles: Role[];
};

const roleColors: Record<string, string> = {
    admin: 'bg-navy/10 text-navy',
    editor: 'bg-blue-100 text-blue-800',
    finance: 'bg-emerald-100 text-emerald-800',
    volunteer: 'bg-amber-100 text-amber-800',
    partner: 'bg-purple-100 text-purple-800',
};

export default function UsersIndex({ users, filters, stats, roles }: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function filter(
        next: Partial<{ search: string; role: string; status: string }>,
    ) {
        router.get(
            usersIndex.url(),
            {
                search: next.search ?? filters.search ?? '',
                role: next.role ?? filters.role ?? '',
                status: next.status ?? filters.status ?? '',
            },
            { preserveState: true, replace: true },
        );
    }

    function resendInvite(id: number) {
        router.post(usersResendInvite.url(id));
    }

    function destroy() {
        if (pendingDelete === null) {
            return;
        }

        setProcessing(true);
        router.delete(usersDestroy.url(pendingDelete), {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    const activeStatus = filters.status || ALL;
    const activeRole = filters.role || ALL;

    return (
        <>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            Users & Accounts
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Invite staff and manage portal access.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <Link href={usersCreate.url()}>
                            <Plus className="size-4" />
                            Invite User
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AdminStatCard
                        label="All users"
                        value={stats.total}
                        hint="Every account"
                        active={
                            activeStatus === ALL && activeRole === ALL
                        }
                        onClick={() =>
                            filter({ status: '', role: '' })
                        }
                    />
                    <AdminStatCard
                        label="Active"
                        value={stats.active}
                        hint="Verified accounts"
                        active={activeStatus === 'active'}
                        onClick={() => filter({ status: 'active' })}
                    />
                    <AdminStatCard
                        label="Pending"
                        value={stats.pending}
                        hint="Awaiting invite acceptance"
                        active={activeStatus === 'pending'}
                        onClick={() => filter({ status: 'pending' })}
                    />
                    <AdminStatCard
                        label="Staff"
                        value={stats.staff}
                        hint="Admin, editor, and finance"
                        active={false}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search name or email"
                            defaultValue={filters.search}
                            onChange={(e) => filter({ search: e.target.value })}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={activeRole}
                        onValueChange={(value) =>
                            filter({
                                role: value === ALL ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-9 w-[160px]">
                            <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All roles</SelectItem>
                            {roles.map((role) => (
                                <SelectItem key={role.value} value={role.value}>
                                    {role.label}
                                </SelectItem>
                            ))}
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
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {users.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <Users className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No users match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or invite someone to join the
                                team.
                            </p>
                            <Button
                                asChild
                                className="mt-6 bg-brand-green font-bold hover:bg-brand-green-dark"
                            >
                                <Link href={usersCreate.url()}>
                                    <Plus className="size-4" />
                                    Invite User
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {users.data.map((user) => (
                                <div
                                    key={user.id}
                                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-secondary/40 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="truncate text-sm font-semibold text-navy dark:text-foreground">
                                                {user.name}
                                            </p>
                                            <span
                                                className={cn(
                                                    'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                    roleColors[user.role] ??
                                                        'bg-secondary',
                                                )}
                                            >
                                                {user.role}
                                            </span>
                                            {!user.email_verified_at && (
                                                <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                                                    Invite Pending
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {!user.email_verified_at && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    resendInvite(user.id)
                                                }
                                                className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                            >
                                                <Mail className="size-3.5" />
                                                Resend Invite
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPendingDelete(user.id)
                                            }
                                            className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                                            aria-label={`Remove ${user.name}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Pagination links={users.links} />
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Remove this user?"
                description="They will lose access immediately."
                confirmLabel="Remove"
                variant="destructive"
                processing={processing}
                onConfirm={destroy}
            />
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Users', href: usersIndex.url() },
    ],
};
