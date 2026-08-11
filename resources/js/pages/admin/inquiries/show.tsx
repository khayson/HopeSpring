import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import {
    index as inquiriesIndex,
    invite as inquiriesInvite,
} from '@/routes/admin/inquiries';

type Inquiry = {
    id: number;
    type: string;
    name: string;
    email: string;
    phone: string | null;
    organisation: string | null;
    message: string;
    status: string;
    converted_user_id: number | null;
    created_at: string;
};

type Props = { inquiry: Inquiry };

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    reviewed: 'bg-amber-100 text-amber-800',
    converted: 'bg-emerald-100 text-emerald-800',
};

export default function InquiryShow({ inquiry }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    function invite() {
        setProcessing(true);
        router.post(
            inquiriesInvite.url(inquiry.id),
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setConfirmOpen(false);
                },
            },
        );
    }

    return (
        <>
            <Head title={`Inquiry — ${inquiry.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <Link
                        href={inquiriesIndex.url()}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to inquiries
                    </Link>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-2xl font-bold capitalize text-navy dark:text-foreground">
                                {inquiry.type} Inquiry — {inquiry.name}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {inquiry.email}
                                {inquiry.organisation
                                    ? ` · ${inquiry.organisation}`
                                    : ''}{' '}
                                · {formatDate(inquiry.created_at)}
                            </p>
                        </div>
                        <span
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-bold uppercase',
                                statusColors[inquiry.status] ?? 'bg-secondary',
                            )}
                        >
                            {inquiry.status}
                        </span>
                    </div>
                </div>

                <div className="max-w-2xl rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground uppercase">
                                Email
                            </dt>
                            <dd className="mt-1 text-sm">{inquiry.email}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground uppercase">
                                Phone
                            </dt>
                            <dd className="mt-1 text-sm">
                                {inquiry.phone || '—'}
                            </dd>
                        </div>
                        {inquiry.organisation && (
                            <div>
                                <dt className="text-xs font-medium text-muted-foreground uppercase">
                                    Organisation
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {inquiry.organisation}
                                </dd>
                            </div>
                        )}
                    </dl>

                    <div className="mt-6 border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <dt className="text-xs font-medium text-muted-foreground uppercase">
                            Message
                        </dt>
                        <dd className="mt-1 text-sm leading-relaxed whitespace-pre-line">
                            {inquiry.message}
                        </dd>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <Button asChild variant="outline">
                            <a href={`mailto:${inquiry.email}`}>
                                <Mail className="size-4" />
                                Reply by Email
                            </a>
                        </Button>
                        {inquiry.converted_user_id ? (
                            <span className="text-sm text-muted-foreground">
                                Account already created.
                            </span>
                        ) : (
                            <Button
                                onClick={() => setConfirmOpen(true)}
                                className="bg-brand-green font-bold hover:bg-brand-green-dark"
                            >
                                <UserPlus className="size-4" />
                                Create Account & Invite
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Create account and send invite?"
                description={`This creates a ${inquiry.type} account for ${inquiry.name} and emails them a link to set their password.`}
                confirmLabel="Create Account & Invite"
                processing={processing}
                onConfirm={invite}
            />
        </>
    );
}

InquiryShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inquiries', href: inquiriesIndex.url() },
        { title: 'Detail', href: '#' },
    ],
};
