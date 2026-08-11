import { Head } from '@inertiajs/react';
import { PostForm } from '@/components/admin/post-form';
import { dashboard } from '@/routes';

type Post = {
    id: number;
    title: string;
    excerpt: string;
    body: string;
    featured_image: string | null;
    category: string;
    is_featured: boolean;
    published_at: string | null;
};

type Props = { post: Post };

export default function PostsEdit({ post }: Props) {
    return (
        <>
            <Head title={`Edit — ${post.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <h1 className="text-xl font-bold">Edit Post</h1>
                <PostForm
                    post={{
                        title: post.title,
                        excerpt: post.excerpt,
                        body: post.body,
                        featured_image: post.featured_image ?? '',
                        category: post.category,
                        is_featured: post.is_featured,
                        published_at: post.published_at ?? '',
                    }}
                    action={`/admin/posts/${post.id}`}
                    method="put"
                    submitLabel="Save Changes"
                />
            </div>
        </>
    );
}

PostsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Blog Posts', href: '/admin/posts' },
        { title: 'Edit', href: '#' },
    ],
};
