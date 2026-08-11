import { Head, Link } from '@inertiajs/react';
import { Pagination } from '@/components/admin/pagination';
import { dashboard } from '@/routes';

type Message = {
    id: number;
    name: string;
    email: string;
    subject: string;
    is_read: boolean;
    created_at: string;
};

type Props = {
    messages: {
        data: Message[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function MessagesIndex({ messages }: Props) {
    return (
        <>
            <Head title="Messages" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <h1 className="text-xl font-bold">Contact Messages</h1>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        {messages.data.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                                No messages yet.
                            </p>
                        ) : (
                            messages.data.map((msg) => (
                                <Link
                                    key={msg.id}
                                    href={`/admin/messages/${msg.id}`}
                                    className="flex items-start gap-3 px-5 py-3 hover:bg-secondary/50"
                                >
                                    {!msg.is_read && (
                                        <span className="mt-1.5 inline-block size-2 shrink-0 rounded-full bg-blue-500" />
                                    )}
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium">
                                            {msg.subject}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {msg.name} ({msg.email})
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {new Date(
                                            msg.created_at,
                                        ).toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                        })}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                    <Pagination links={messages.links} />
                </div>
            </div>
        </>
    );
}

MessagesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Messages', href: '/admin/messages' },
    ],
};
