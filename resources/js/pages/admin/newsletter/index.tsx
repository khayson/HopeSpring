import { Pagination } from '@/components/admin/pagination';
import { dashboard } from '@/routes';
import { Head, router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';

type Subscriber = {
    id: number;
    email: string;
    subscribed_at: string;
    unsubscribed_at: string | null;
};

type Props = {
    subscribers: {
        data: Subscriber[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    activeCount: number;
};

export default function NewsletterIndex({ subscribers, activeCount }: Props) {
    function destroy(id: number) {
        if (confirm('Remove this subscriber?')) {
            router.delete(`/admin/newsletter/${id}`);
        }
    }

    return (
        <>
            <Head title="Newsletter Subscribers" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Newsletter Subscribers</h1>
                    <span className="text-sm text-muted-foreground">{activeCount.toLocaleString()} active</span>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        {subscribers.data.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No subscribers yet.</p>
                        ) : (
                            subscribers.data.map((sub) => (
                                <div key={sub.id} className="flex items-center justify-between px-5 py-3">
                                    <div>
                                        <p className="text-sm font-medium">{sub.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {sub.unsubscribed_at ? 'Unsubscribed' : 'Subscribed'}{' '}
                                            {new Date(sub.unsubscribed_at ?? sub.subscribed_at).toLocaleDateString('en-GB', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <button onClick={() => destroy(sub.id)} className="text-rose-600 hover:text-rose-800" aria-label="Remove subscriber">
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                    <Pagination links={subscribers.links} />
                </div>
            </div>
        </>
    );
}

NewsletterIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Newsletter', href: '/admin/newsletter' },
    ],
};
