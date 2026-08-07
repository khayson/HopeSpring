import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Post = {
    id: number;
    title: string;
    category: string;
    published_at: string | null;
    is_featured: boolean;
    author: { name: string };
};

type Props = {
    posts: {
        data: Post[];
        links: { url: string | null; label: string; active: boolean }[];
    };
};

export default function PostsIndex({ posts }: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function destroy() {
        if (pendingDelete === null) return;
        setProcessing(true);
        router.delete(`/admin/posts/${pendingDelete}`, {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    return (
        <>
            <Head title="Blog Posts" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Blog Posts</h1>
                    <Button asChild className="bg-brand-green font-bold hover:bg-brand-green-dark">
                        <Link href="/admin/posts/create">
                            <Plus className="size-4" />
                            New Post
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        {posts.data.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No posts yet.</p>
                        ) : (
                            posts.data.map((post) => (
                                <div key={post.id} className="flex items-center justify-between px-5 py-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-medium">{post.title}</p>
                                            {post.is_featured && (
                                                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                                                    Featured
                                                </span>
                                            )}
                                            {!post.published_at && (
                                                <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
                                                    Draft
                                                </span>
                                            )}
                                        </div>
                                        <p className="truncate text-xs capitalize text-muted-foreground">
                                            {post.category} &middot; by {post.author.name}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        <Link href={`/admin/posts/${post.id}/edit`} className="text-xs font-medium text-blue-600 hover:underline">
                                            Edit
                                        </Link>
                                        <button onClick={() => setPendingDelete(post.id)} className="text-rose-600 hover:text-rose-800" aria-label="Delete post">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Pagination links={posts.links} />
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Delete this post?"
                description="This cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                processing={processing}
                onConfirm={destroy}
            />
        </>
    );
}

PostsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Blog Posts', href: '/admin/posts' },
    ],
};
