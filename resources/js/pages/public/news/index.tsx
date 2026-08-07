import { DonationBand } from '@/components/public/donation-band';
import { NewsCard } from '@/components/public/news-card';
import { PageHero } from '@/components/public/page-hero';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    category: 'education' | 'healthcare' | 'community' | 'relief';
    is_featured: boolean;
    published_at: string;
};

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

type Props = {
    posts: PaginatedData<Post>;
    featuredPost: Post | null;
    categories: string[];
    currentCategory: string | null;
};

export default function NewsIndex({ posts, featuredPost, categories, currentCategory }: Props) {
    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
        <PublicLayout currentPath="/news">
            <Head title="News & Stories — HopeSpring Foundation" />

            <PageHero title="News & Stories" />

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                {/* Featured Post */}
                {featuredPost && !currentCategory && (
                    <div className="mb-12">
                        <NewsCard
                            title={featuredPost.title}
                            excerpt={featuredPost.excerpt}
                            date={formatDate(featuredPost.published_at)}
                            category={featuredPost.category}
                            image={featuredPost.featured_image ?? undefined}
                            href={`/news/${featuredPost.slug}`}
                            featured
                        />
                    </div>
                )}

                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        <Link
                            href="/news"
                            className={cn(
                                'rounded-full px-4 py-1.5 text-sm font-semibold transition-colors',
                                !currentCategory ? 'bg-navy text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                            )}
                        >
                            All
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/news?category=${cat}`}
                                className={cn(
                                    'rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors',
                                    currentCategory === cat ? 'bg-navy text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                                )}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Posts Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.data.map((post) => (
                        <NewsCard
                            key={post.id}
                            title={post.title}
                            excerpt={post.excerpt}
                            date={formatDate(post.published_at)}
                            category={post.category}
                            image={post.featured_image ?? undefined}
                            href={`/news/${post.slug}`}
                        />
                    ))}
                </div>

                {posts.data.length === 0 && (
                    <p className="py-12 text-center text-muted-foreground">No stories found.</p>
                )}

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-3">
                        {posts.prev_page_url && (
                            <Button asChild variant="outline">
                                <Link href={posts.prev_page_url}>Previous</Link>
                            </Button>
                        )}
                        <span className="text-sm text-muted-foreground">
                            Page {posts.current_page} of {posts.last_page}
                        </span>
                        {posts.next_page_url && (
                            <Button asChild variant="outline">
                                <Link href={posts.next_page_url}>Next</Link>
                            </Button>
                        )}
                    </div>
                )}
            </section>

            <DonationBand />
        </PublicLayout>
    );
}
