import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import {
    destroy as messagesDestroy,
    index as messagesIndex,
} from '@/routes/admin/messages';

type Message = {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
};

type Props = { message: Message };

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

export default function MessageShow({ message }: Props) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [processing, setProcessing] = useState(false);

    function destroy() {
        setProcessing(true);
        router.delete(messagesDestroy.url(message.id), {
            onSuccess: () => router.visit(messagesIndex.url()),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title={message.subject} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <Link
                            href={messagesIndex.url()}
                            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                        >
                            <ArrowLeft className="size-3.5" />
                            Back to messages
                        </Link>
                        <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            {message.subject}
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {message.name} · {message.email} ·{' '}
                            {formatDate(message.created_at)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
                        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                    >
                        <Trash2 className="size-4" />
                        Delete
                    </button>
                </div>

                <div className="max-w-2xl rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <p className="text-sm leading-relaxed whitespace-pre-line text-foreground">
                        {message.message}
                    </p>

                    <Button
                        asChild
                        className="mt-6 bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <a
                            href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject)}`}
                        >
                            <Mail className="size-4" />
                            Reply by Email
                        </a>
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
        { title: 'Messages', href: messagesIndex.url() },
        { title: 'Detail', href: '#' },
    ],
};
