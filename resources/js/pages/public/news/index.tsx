import { DonationBand } from '@/components/public/donation-band';
import { NewsCard } from '@/components/public/news-card';
import { PageHero } from '@/components/public/page-hero';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';
import { cn } from '@/lib/utils';
import { index as newsIndex, show as newsShow } from '@/routes/news';
import { Head, Link } from '@inertiajs/react';

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

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function NewsIndex({ posts, featuredPost, categories, currentCategory }: Props) {
    const showFeatured = Boolean(featuredPost && !currentCategory);
    const listHeading = currentCategory
        ? `${currentCategory.charAt(0).toUpperCase()}${currentCategory.slice(1)} stories`
        : 'Latest stories';

    return (
        <PublicLayout currentPath="/news">
            <Head title="News & Stories — HopeSpring Foundation" />

            <PageHero
                title="News & Stories"
                subtitle="Field updates and impact stories from communities across Ghana."
                image={pageHeroes.news}
            />

            {showFeatured && featuredPost && (
                <section className="bg-background px-4 pt-10 md:px-6 md:pt-14">
                    <ScrollReveal>
                        <div className="mx-auto max-w-7xl">
                            <NewsCard
                                title={featuredPost.title}
                                excerpt={featuredPost.excerpt}
                                date={formatDate(featuredPost.published_at)}
                                category={featuredPost.category}
                                image={featuredPost.featured_image ?? undefined}
                                href={newsShow.url(featuredPost.slug)}
                                featured
                            />
                        </div>
                    </ScrollReveal>
                </section>
            )}

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
                    <ScrollReveal>
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">From the field</p>
                            <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">{listHeading}</h2>
                            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                                Browse recent updates, or filter by the programme area that matters most to you.
                            </p>
                        </div>
                    </ScrollReveal>

                    {categories.length > 0 && (
                        <ScrollReveal delay={60}>
                            <nav
                                aria-label="Story categories"
                                className="flex flex-wrap items-center gap-x-1 gap-y-2 border-b border-border pb-px"
                            >
                                <Link
                                    href={newsIndex.url()}
                                    className={cn(
                                        '-mb-px border-b-2 px-3 py-2 text-sm font-semibold capitalize transition-colors',
                                        !currentCategory
                                            ? 'border-navy text-navy'
                                            : 'border-transparent text-muted-foreground hover:text-navy',
                                    )}
                                >
                                    All
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat}
                                        href={newsIndex.url({ query: { category: cat } })}
                                        className={cn(
                                            '-mb-px border-b-2 px-3 py-2 text-sm font-semibold capitalize transition-colors',
                                            currentCategory === cat
                                                ? 'border-navy text-navy'
                                                : 'border-transparent text-muted-foreground hover:text-navy',
                                        )}
                                    >
                                        {cat}
                                    </Link>
                                ))}
                            </nav>
                        </ScrollReveal>
                    )}
                </div>

                {posts.data.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {posts.data.map((post, i) => (
                            <ScrollReveal key={post.id} delay={i * 50}>
                                <NewsCard
                                    title={post.title}
                                    excerpt={post.excerpt}
                                    date={formatDate(post.published_at)}
                                    category={post.category}
                                    image={post.featured_image ?? undefined}
                                    href={newsShow.url(post.slug)}
                                />
                            </ScrollReveal>
                        ))}
                    </div>
                ) : (
                    <p className="py-16 text-center text-muted-foreground">No stories found for this filter.</p>
                )}

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
