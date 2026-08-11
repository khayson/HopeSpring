import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PostForm } from '@/components/admin/post-form';
import { dashboard } from '@/routes';
import {
    index as postsIndex,
    update as postsUpdate,
} from '@/routes/admin/posts';

type Post = {
    id: number;
    title: string;
    slug: string;
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
                <div>
                    <Link
                        href={postsIndex.url()}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to posts
                    </Link>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Edit Post
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update copy, cover image, and publishing settings.
                    </p>
                </div>
                <PostForm
                    post={{
                        title: post.title,
                        slug: post.slug,
                        excerpt: post.excerpt,
                        body: post.body,
                        featured_image: post.featured_image ?? '',
                        category: post.category,
                        is_featured: post.is_featured,
                        published_at: post.published_at ?? '',
                    }}
                    action={postsUpdate.url(post.id)}
                    method="put"
                    submitLabel="Save Changes"
                    cancelHref={postsIndex.url()}
                />
            </div>
        </>
    );
}

PostsEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Blog Posts', href: postsIndex.url() },
        { title: 'Edit', href: '#' },
    ],
};
