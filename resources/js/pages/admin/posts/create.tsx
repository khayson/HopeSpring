import { Head } from '@inertiajs/react';
import { PostForm } from '@/components/admin/post-form';
import { dashboard } from '@/routes';

export default function PostsCreate() {
    return (
        <>
            <Head title="New Post" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <h1 className="text-xl font-bold">New Post</h1>
                <PostForm
                    action="/admin/posts"
                    method="post"
                    submitLabel="Create Post"
                />
            </div>
        </>
    );
}

PostsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Blog Posts', href: '/admin/posts' },
        { title: 'New', href: '/admin/posts/create' },
    ],
};
