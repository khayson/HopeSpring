import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

type Message = {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
};

type Props = { message: Message };

export default function MessageShow({ message }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    function destroy() {
        setProcessing(true);
        router.delete(`/admin/messages/${message.id}`, {
            onSuccess: () => router.visit('/admin/messages'),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title={message.subject} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <Button asChild variant="outline" className="w-fit">
                        <Link href="/admin/messages">
                            <ArrowLeft className="size-4" />
                            Back to Messages
                        </Link>
                    </Button>
                    <button onClick={() => setConfirmOpen(true)} className="flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-800">
                        <Trash2 className="size-4" />
                        Delete
                    </button>
                </div>

                <div className="max-w-2xl rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <h1 className="text-lg font-bold">{message.subject}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {message.name} &middot; {message.email} &middot;{' '}
                        {new Date(message.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="mt-6 whitespace-pre-line text-sm leading-relaxed">{message.message}</p>

                    <Button asChild className="mt-6 bg-brand-green font-bold hover:bg-brand-green-dark">
                        <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>Reply by Email</a>
                    </Button>
                </div>
            </div>

            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Delete this message?"
                description="This cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                processing={processing}
                onConfirm={destroy}
            />
        </>
    );
}

MessageShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Messages', href: '/admin/messages' },
        { title: 'Detail', href: '#' },
    ],
};
