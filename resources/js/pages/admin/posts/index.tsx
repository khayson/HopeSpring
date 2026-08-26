import { Head, Link, router } from '@inertiajs/react';
import {
    ExternalLink,
    Newspaper,
    Plus,
    Search,
    Sparkles,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { AdminStatCard } from '@/components/admin/stat-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import {
    create as postsCreate,
    destroy as postsDestroy,
    edit as postsEdit,
    index as postsIndex,
} from '@/routes/admin/posts';
import { show as newsShow } from '@/routes/news';

const ALL = 'all';

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    category: string;
    published_at: string | null;
    is_featured: boolean;
    is_published: boolean;
    author: { name: string };
};

type Props = {
    posts: {
        data: Post[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string; category?: string };
    stats: {
        total: number;
        published: number;
        drafts: number;
        featured: number;
    };
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function PostsIndex({ posts, filters, stats }: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function filter(
        next: Partial<{ search: string; status: string; category: string }>,
    ) {
        router.get(
            postsIndex.url(),
            {
                search: next.search ?? filters.search ?? '',
                status: next.status ?? filters.status ?? '',
                category: next.category ?? filters.category ?? '',
            },
            { preserveState: true, replace: true },
        );
    }

    function destroy() {
        if (pendingDelete === null) {
            return;
        }

        setProcessing(true);
        router.delete(postsDestroy.url(pendingDelete), {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    const activeStatus = filters.status || ALL;
    const activeCategory = filters.category || ALL;

    return (
        <>
            <Head title="Blog Posts" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            Blog Posts
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Write, feature, and publish HopeSpring stories.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <Link href={postsCreate.url()}>
                            <Plus className="size-4" />
                            New Post
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <AdminStatCard
                        label="All posts"
                        value={stats.total}
                        hint="Published and drafts"
                        active={activeStatus === ALL}
                        onClick={() => filter({ status: '' })}
                    />
                    <AdminStatCard
                        label="Published"
                        value={stats.published}
                        hint="Live on the news page"
                        active={activeStatus === 'published'}
                        onClick={() => filter({ status: 'published' })}
                    />
                    <AdminStatCard
                        label="Drafts"
                        value={stats.drafts}
                        hint="Not scheduled yet"
                        active={activeStatus === 'draft'}
                        onClick={() => filter({ status: 'draft' })}
                    />
                    <AdminStatCard
                        label="Featured"
                        value={stats.featured}
                        hint="Homepage highlights"
                        active={activeStatus === 'featured'}
                        onClick={() => filter({ status: 'featured' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search title or excerpt"
                            defaultValue={filters.search}
                            onChange={(e) => filter({ search: e.target.value })}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={activeStatus}
                        onValueChange={(value) =>
                            filter({
                                status: value === ALL ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-9 w-[160px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="draft">Drafts</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select
                        value={activeCategory}
                        onValueChange={(value) =>
                            filter({
                                category: value === ALL ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-9 w-[160px] capitalize">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All categories</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="healthcare">
                                Healthcare
                            </SelectItem>
                            <SelectItem value="community">Community</SelectItem>
                            <SelectItem value="relief">Relief</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {posts.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <Newspaper className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No posts match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or create a new story for the
                                news page.
                            </p>
                            <Button
                                asChild
                                className="mt-6 bg-brand-green font-bold hover:bg-brand-green-dark"
                            >
                                <Link href={postsCreate.url()}>
                                    <Plus className="size-4" />
                                    New Post
                                </Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex flex-col gap-4 px-5 py-4 transition hover:bg-secondary/40 sm:flex-row sm:items-center"
                                >
                                    <div className="flex min-w-0 flex-1 items-start gap-4">
                                        <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/40">
                                            {post.featured_image ? (
                                                <img
                                                    src={post.featured_image}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-muted-foreground">
                                                    <Newspaper className="size-6 opacity-50" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Link
                                                    href={postsEdit.url(
                                                        post.id,
                                                    )}
                                                    className="truncate text-sm font-semibold text-navy hover:underline dark:text-foreground"
                                                >
                                                    {post.title}
                                                </Link>
                                                <span
                                                    className={cn(
                                                        'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                        post.is_published
                                                            ? 'bg-emerald-100 text-emerald-800'
                                                            : 'bg-slate-100 text-slate-700',
                                                    )}
                                                >
                                                    {post.is_published
                                                        ? 'Published'
                                                        : 'Draft'}
                                                </span>
                                                {post.is_featured && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 uppercase">
                                                        <Sparkles className="size-3" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-2 line-clamp-1 text-xs text-muted-foreground capitalize">
                                                {post.category} · by{' '}
                                                {post.author.name}
                                                {post.published_at
                                                    ? ` · ${formatDate(post.published_at)}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 sm:self-center">
                                        {post.is_published && (
                                            <a
                                                href={newsShow.url(post.slug)}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                                            >
                                                View
                                                <ExternalLink className="size-3.5" />
                                            </a>
                                        )}
                                        <Link
                                            href={postsEdit.url(post.id)}
                                            className="rounded-md px-2 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setPendingDelete(post.id)
                                            }
                                            className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                                            aria-label={`Delete ${post.title}`}
                                        >
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Pagination links={posts.links} />
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Delete this post?"
                description="It will disappear from the news page. This cannot be undone."
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
        { title: 'Blog Posts', href: postsIndex.url() },
    ],
};
