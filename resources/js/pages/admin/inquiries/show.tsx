import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, UserPlus } from 'lucide-react';

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

export default function InquiryShow({ inquiry }: Props) {
    function invite() {
        if (confirm(`Create a ${inquiry.type} account for ${inquiry.name} and send an invite email?`)) {
            router.post(`/admin/inquiries/${inquiry.id}/invite`);
        }
    }

    return (
        <>
            <Head title={`Inquiry — ${inquiry.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <Button asChild variant="outline" className="w-fit">
                    <Link href="/admin/inquiries">
                        <ArrowLeft className="size-4" />
                        Back to Inquiries
                    </Link>
                </Button>

                <div className="max-w-2xl rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-lg font-bold capitalize">{inquiry.type} Inquiry — {inquiry.name}</h1>
                        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize">{inquiry.status}</span>
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium uppercase text-muted-foreground">Email</dt>
                            <dd className="mt-1 text-sm">{inquiry.email}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium uppercase text-muted-foreground">Phone</dt>
                            <dd className="mt-1 text-sm">{inquiry.phone || '—'}</dd>
                        </div>
                        {inquiry.organisation && (
                            <div>
                                <dt className="text-xs font-medium uppercase text-muted-foreground">Organisation</dt>
                                <dd className="mt-1 text-sm">{inquiry.organisation}</dd>
                            </div>
                        )}
                    </dl>

                    <div className="mt-6 border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                        <dt className="text-xs font-medium uppercase text-muted-foreground">Message</dt>
                        <dd className="mt-1 whitespace-pre-line text-sm leading-relaxed">{inquiry.message}</dd>
                    </div>

                    <div className="mt-6 flex items-center gap-3">
                        <Button asChild variant="outline">
                            <a href={`mailto:${inquiry.email}`}>Reply by Email</a>
                        </Button>
                        {inquiry.converted_user_id ? (
                            <span className="text-sm text-muted-foreground">Account already created.</span>
                        ) : (
                            <Button onClick={invite} className="bg-brand-green font-bold hover:bg-brand-green-dark">
                                <UserPlus className="size-4" />
                                Create Account & Invite
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

InquiryShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Inquiries', href: '/admin/inquiries' },
        { title: 'Detail', href: '#' },
    ],
};
