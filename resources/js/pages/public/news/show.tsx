import { BrushEdge } from '@/components/public/brush-edge';
import { DonationBand } from '@/components/public/donation-band';
import { NewsCard } from '@/components/public/news-card';
import { PageHero } from '@/components/public/page-hero';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Link as LinkIcon, Twitter, User } from 'lucide-react';
import { useState } from 'react';

type Author = { id: number; name: string };

type Post = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    body: string;
    featured_image: string | null;
    category: 'education' | 'healthcare' | 'community' | 'relief';
    published_at: string;
    author: Author;
};

type RelatedPost = {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    featured_image: string | null;
    category: 'education' | 'healthcare' | 'community' | 'relief';
    published_at: string;
};

type Props = {
    post: Post;
    relatedPosts: RelatedPost[];
};

function estimateReadingTime(text: string): number {
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

const categoryColors: Record<string, string> = {
    education: 'bg-blue-100 text-blue-800',
    healthcare: 'bg-rose-100 text-rose-800',
    community: 'bg-amber-100 text-amber-800',
    relief: 'bg-emerald-100 text-emerald-800',
};

export default function NewsShow({ post, relatedPosts }: Props) {
    const [copied, setCopied] = useState(false);
    const readingTime = estimateReadingTime(post.body);

    const formatDate = (date: string) =>
        new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareText = encodeURIComponent(post.title);

    function copyLink() {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <PublicLayout currentPath="/news">
            <Head title={`${post.title} — HopeSpring Foundation`} />

            <PageHero title={post.title} image={post.featured_image ?? undefined} />
            <BrushEdge className="h-8 text-background md:h-12" />

            <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
                {/* Meta bar */}
                <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-border pb-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <User className="size-3.5" />
                        {post.author.name}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {readingTime} min read
                    </span>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${categoryColors[post.category] || 'bg-brand-green/10 text-brand-green'}`}
                    >
                        {post.category}
                    </span>
                </div>

                {/* Article body */}
                <div className="prose prose-lg max-w-none">
                    {post.body.split('\n\n').map((paragraph, i) => (
                        <p key={i} className="mb-6 leading-relaxed text-muted-foreground">
                            {paragraph}
                        </p>
                    ))}
                </div>

                {/* Share bar */}
                <div className="mt-12 border-t border-border pt-8">
                    <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-navy">Share this story</h3>
                    <div className="flex flex-wrap gap-2">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(pageUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-navy hover:text-navy"
                        >
                            <Twitter className="size-4" />
                            Twitter
                        </a>
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-navy hover:text-navy"
                        >
                            <Facebook className="size-4" />
                            Facebook
                        </a>
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-navy hover:text-navy"
                        >
                            <Linkedin className="size-4" />
                            LinkedIn
                        </a>
                        <button
                            type="button"
                            onClick={copyLink}
                            className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-navy hover:text-navy"
                        >
                            <LinkIcon className="size-4" />
                            {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
                </div>

                {/* Back */}
                <div className="mt-12">
                    <Button asChild variant="outline" className="border-navy font-semibold text-navy hover:bg-navy hover:text-white">
                        <Link href="/news">
                            <ArrowLeft className="size-4" />
                            Back to News
                        </Link>
                    </Button>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-10 text-center font-serif text-2xl font-bold text-navy">Related Stories</h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map((rp) => (
                                <NewsCard
                                    key={rp.id}
                                    title={rp.title}
                                    excerpt={rp.excerpt}
                                    date={formatDate(rp.published_at)}
                                    category={rp.category}
                                    image={rp.featured_image ?? undefined}
                                    href={`/news/${rp.slug}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <DonationBand />
        </PublicLayout>
    );
}
