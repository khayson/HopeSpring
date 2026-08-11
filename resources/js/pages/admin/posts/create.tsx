import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PostForm } from '@/components/admin/post-form';
import { dashboard } from '@/routes';
import {
    create as postsCreate,
    index as postsIndex,
    store as postsStore,
} from '@/routes/admin/posts';

export default function PostsCreate() {
    return (
        <>
            <Head title="New Post" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <Link
                        href={postsIndex.url()}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to posts
                    </Link>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        New Post
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Draft or publish a story for the public news page.
                    </p>
                </div>
                <PostForm
                    action={postsStore.url()}
                    method="post"
                    submitLabel="Create Post"
                    cancelHref={postsIndex.url()}
                />
            </div>
        </>
    );
}

PostsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Blog Posts', href: postsIndex.url() },
        { title: 'New', href: postsCreate.url() },
    ],
};
