import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Check, Facebook, Link as LinkIcon, Linkedin, Twitter } from 'lucide-react';
import { useState } from 'react';
import { DonationBand } from '@/components/public/donation-band';
import { NewsCard } from '@/components/public/news-card';
import { PageHero } from '@/components/public/page-hero';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';
import { cn } from '@/lib/utils';
import { index as newsIndex, show as newsShow } from '@/routes/news';

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
    shareUrl: string;
};

const categoryTone: Record<Post['category'], string> = {
    education: 'text-brand-blue',
    healthcare: 'text-brand-gold',
    community: 'text-brand-green',
    relief: 'text-brand-gold',
};

function estimateReadingTime(text: string): number {
    const words = text.trim().split(/\s+/).length;

    return Math.max(1, Math.ceil(words / 200));
}

function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function articleParagraphs(body: string): string[] {
    return body
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}

export default function NewsShow({ post, relatedPosts, shareUrl }: Props) {
    const [copied, setCopied] = useState(false);
    const readingTime = estimateReadingTime(post.body);
    const paragraphs = articleParagraphs(post.body);
    const heroImage = post.featured_image || pageHeroes.news;
    const encodedUrl = encodeURIComponent(shareUrl);
    const shareText = encodeURIComponent(post.title);

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }

    return (
        <PublicLayout currentPath="/news">
            <Head title={`${post.title} — HopeSpring Foundation`} />

            <PageHero
                title={post.title}
                subtitle={post.excerpt}
                image={heroImage}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'News & Stories', href: newsIndex.url() },
                    { label: post.title },
                ]}
            />

            <article className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
                <ScrollReveal>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border pb-6 text-sm text-muted-foreground">
                        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                        <span aria-hidden="true" className="text-border">
                            ·
                        </span>
                        <span>{post.author.name}</span>
                        <span aria-hidden="true" className="text-border">
                            ·
                        </span>
                        <span>{readingTime} min read</span>
                        <span aria-hidden="true" className="text-border">
                            ·
                        </span>
                        <span className={cn('text-xs font-bold tracking-[0.16em] uppercase', categoryTone[post.category])}>
                            {post.category}
                        </span>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={60}>
                    <div className="mt-10 space-y-6">
                        {paragraphs.map((paragraph, index) => (
                            <p key={index} className="text-lg leading-relaxed text-muted-foreground">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={100}>
                    <div className="mt-14 border-t border-border pt-8">
                        <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">Share this story</p>
                        <div className="mt-4 flex flex-wrap items-center gap-1">
                            <a
                                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
                            >
                                <Twitter className="size-4" />
                                X
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
                            >
                                <Facebook className="size-4" />
                                Facebook
                            </a>
                            <a
                                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
                            >
                                <Linkedin className="size-4" />
                                LinkedIn
                            </a>
                            <button
                                type="button"
                                onClick={copyLink}
                                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-navy"
                            >
                                {copied ? <Check className="size-4 text-brand-green" /> : <LinkIcon className="size-4" />}
                                {copied ? 'Copied' : 'Copy link'}
                            </button>
                        </div>
                    </div>
                </ScrollReveal>

                <ScrollReveal delay={120}>
                    <div className="mt-10">
                        <Link
                            href={newsIndex.url()}
                            className="inline-flex items-center gap-2 text-sm font-bold text-navy transition-colors hover:text-brand-green-dark"
                        >
                            <ArrowLeft className="size-4" />
                            Back to News & Stories
                        </Link>
                    </div>
                </ScrollReveal>
            </article>

            {relatedPosts.length > 0 && (
                <section className="bg-secondary/40 px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <ScrollReveal>
                            <div className="mb-10 max-w-2xl">
                                <p className="text-xs font-bold tracking-[0.18em] text-brand-green uppercase">Keep reading</p>
                                <h2 className="mt-3 font-serif text-3xl font-bold text-navy md:text-4xl">Related stories</h2>
                                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                                    More from our {post.category} work across Ghana.
                                </p>
                            </div>
                        </ScrollReveal>

                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {relatedPosts.map((related, index) => (
                                <ScrollReveal key={related.id} delay={index * 50}>
                                    <NewsCard
                                        title={related.title}
                                        excerpt={related.excerpt}
                                        date={formatDate(related.published_at)}
                                        category={related.category}
                                        image={related.featured_image ?? undefined}
                                        href={newsShow.url(related.slug)}
                                    />
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <DonationBand />
        </PublicLayout>
    );
}
