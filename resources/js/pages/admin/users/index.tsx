import { Head, Link, router } from '@inertiajs/react';
import { Mail, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
};

type Props = {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

const roleColors: Record<string, string> = {
    admin: 'bg-navy/10 text-navy',
    editor: 'bg-blue-100 text-blue-800',
    finance: 'bg-emerald-100 text-emerald-800',
    volunteer: 'bg-amber-100 text-amber-800',
    partner: 'bg-purple-100 text-purple-800',
};

export default function UsersIndex({ users }: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function resendInvite(id: number) {
        router.post(`/admin/users/${id}/resend-invite`);
    }

    function destroy() {
        if (pendingDelete === null) {
            return;
        }

        setProcessing(true);
        router.delete(`/admin/users/${pendingDelete}`, {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    return (
        <>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Users & Accounts</h1>
                    <Button
                        asChild
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <Link href="/admin/users/create">
                            <Plus className="size-4" />
                            Invite User
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        {users.data.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between px-5 py-3"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium">
                                            {user.name}
                                        </p>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${roleColors[user.role] ?? 'bg-secondary'}`}
                                        >
                                            {user.role}
                                        </span>
                                        {!user.email_verified_at && (
                                            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                                                Invite Pending
                                            </span>
                                        )}
                                    </div>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                                <div className="flex shrink-0 items-center gap-3">
                                    {!user.email_verified_at && (
                                        <button
                                            onClick={() =>
                                                resendInvite(user.id)
                                            }
                                            className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                                        >
                                            <Mail className="size-3.5" />
                                            Resend Invite
                                        </button>
                                    )}
                                    <button
                                        onClick={() =>
                                            setPendingDelete(user.id)
                                        }
                                        className="text-rose-600 hover:text-rose-800"
                                        aria-label="Remove user"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
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
        { title: 'Users', href: '/admin/users' },
    ],
};
