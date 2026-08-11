import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    Heart,
    Link2,
    Maximize2,
    MessageCircle,
    Share2,
    X,
} from 'lucide-react';
import type { FormEvent} from 'react';
import { useEffect, useState } from 'react';
import { DonationBand } from '@/components/public/donation-band';
import { PinterestPinLayout } from '@/components/public/pinterest-pin-layout';
import PublicLayout from '@/layouts/public/public-layout';
import { donate } from '@/routes';
import { index as galleryIndex, like as toggleLike, show as galleryShow } from '@/routes/gallery';
import { store as storeComment } from '@/routes/gallery/comments';

type GalleryImage = {
    id: number;
    src: string;
    alt: string;
    caption: string | null;
    category: string | null;
};

type GalleryComment = {
    id: number;
    name: string;
    body: string;
    created_at: string;
};

type Props = {
    image: GalleryImage;
    related: GalleryImage[];
    previous: GalleryImage | null;
    next: GalleryImage | null;
    position: number;
    total: number;
    likesCount: number;
    liked: boolean;
    comments: GalleryComment[];
    donateProgrammeSlug: string | null;
};

export default function GalleryShow({
    image,
    related,
    previous,
    next,
    position,
    total,
    likesCount,
    liked,
    comments,
    donateProgrammeSlug,
}: Props) {
    const title = image.caption ?? image.alt;
    const [copied, setCopied] = useState(false);
    const [zoomed, setZoomed] = useState(false);
    const donateHref = donateProgrammeSlug
        ? donate.url({ query: { programme: donateProgrammeSlug } })
        : donate.url();

    const commentForm = useForm({
        name: '',
        body: '',
    });

    function share() {
        const url = window.location.href;

        if (navigator.share) {
            void navigator.share({ title, url });

            return;
        }

        void copyLink();
    }

    function copyLink() {
        void navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    function handleLike() {
        router.post(toggleLike.url(image.id), {}, { preserveScroll: true });
    }

    function submitComment(e: FormEvent) {
        e.preventDefault();
        commentForm.post(storeComment.url(image.id), {
            preserveScroll: true,
            onSuccess: () => commentForm.reset('body'),
        });
    }

    useEffect(() => {
        if (!zoomed) {
            return;
        }

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                setZoomed(false);
            }
        }

        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.body.style.overflow = '';
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [zoomed]);

    return (
        <PublicLayout currentPath="/gallery">
            <Head title={`${title} — Gallery — HopeSpring Foundation`} />

            <div className="min-h-screen bg-navy-dark">
                <div className="mx-auto max-w-7xl px-4 py-5 md:px-6 md:py-8 lg:px-8">
                    <PinterestPinLayout related={related}>
                        <article className="overflow-hidden rounded-2xl bg-navy shadow-2xl ring-1 ring-white/10">
                            <div className="flex flex-col md:flex-row">
                                <div className="group relative min-w-0 flex-1 bg-navy-dark">
                                    <div className="absolute left-2.5 top-2.5 z-20 flex items-center gap-2">
                                        <Link
                                            href={galleryIndex.url()}
                                            className="flex size-8 items-center justify-center rounded-full bg-white/95 text-navy-dark shadow-sm transition-transform hover:scale-105"
                                            aria-label="Back to gallery"
                                        >
                                            <ArrowLeft className="size-3.5" />
                                        </Link>
                                        <span className="rounded-full bg-navy-dark/70 px-2.5 py-1 text-[10px] font-bold tracking-wide text-white backdrop-blur-sm">
                                            {position} / {total}
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setZoomed(true)}
                                        className="relative block w-full cursor-zoom-in text-left"
                                        aria-label="View full image"
                                    >
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            className="aspect-[4/5] max-h-[420px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                        />
                                        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-dark/50 via-transparent to-navy-dark/20 opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
                                        <span className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-navy-dark opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                            <Maximize2 className="size-3.5" aria-hidden />
                                            Expand
                                        </span>
                                    </button>

                                    <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 flex items-center justify-between px-2">
                                        {previous ? (
                                            <Link
                                                href={galleryShow.url(previous.id)}
                                                prefetch
                                                className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-white/90 text-navy-dark opacity-0 shadow-md transition-all hover:scale-105 group-hover:opacity-100"
                                                aria-label="Previous image"
                                            >
                                                <ChevronLeft className="size-4" />
                                            </Link>
                                        ) : (
                                            <span />
                                        )}
                                        {next ? (
                                            <Link
                                                href={galleryShow.url(next.id)}
                                                prefetch
                                                className="pointer-events-auto flex size-8 items-center justify-center rounded-full bg-white/90 text-navy-dark opacity-0 shadow-md transition-all hover:scale-105 group-hover:opacity-100"
                                                aria-label="Next image"
                                            >
                                                <ChevronRight className="size-4" />
                                            </Link>
                                        ) : (
                                            <span />
                                        )}
                                    </div>
                                </div>

                                <div className="flex w-full flex-col justify-between bg-gradient-to-b from-navy to-navy-dark md:w-[280px] md:shrink-0">
                                    <div className="flex flex-col gap-4 px-4 pb-3 pt-4">
                                        <div className="flex items-start justify-between gap-2">
                                            {image.category ? (
                                                <Link
                                                    href={galleryIndex.url({ query: { category: image.category } })}
                                                    className="inline-flex items-center rounded-full border border-brand-green/40 bg-brand-green/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-green-light transition-colors hover:bg-brand-green/25"
                                                >
                                                    {image.category}
                                                </Link>
                                            ) : (
                                                <span />
                                            )}

                                            <div className="flex items-center gap-0.5">
                                                <button
                                                    type="button"
                                                    onClick={handleLike}
                                                    className="flex items-center gap-1 rounded-full px-2 py-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                                    aria-label={liked ? 'Unlike image' : 'Like image'}
                                                    aria-pressed={liked}
                                                >
                                                    <Heart
                                                        className={`size-3.5 ${liked ? 'fill-brand-green text-brand-green' : ''}`}
                                                    />
                                                    <span className="text-[11px] font-semibold tabular-nums">
                                                        {likesCount}
                                                    </span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={copyLink}
                                                    className="flex size-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                                    aria-label="Copy link"
                                                >
                                                    <Link2 className="size-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={share}
                                                    className="flex size-8 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                                    aria-label="Share"
                                                >
                                                    <Share2 className="size-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {copied && (
                                            <p className="text-[11px] font-semibold text-brand-green-light">Link copied</p>
                                        )}

                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-gold-light/90">
                                                HopeSpring Foundation
                                            </p>
                                            <div className="mt-2 h-0.5 w-10 rounded-full bg-brand-green" />
                                            <h1 className="mt-3 font-serif text-xl font-bold leading-snug text-white">
                                                {title}
                                            </h1>
                                            <p className="mt-2.5 text-xs leading-relaxed text-white/70">{image.alt}</p>
                                        </div>

                                        {/* Comments */}
                                        <div className="border-t border-white/10 pt-3">
                                            <div className="mb-2.5 flex items-center gap-1.5 text-white/80">
                                                <MessageCircle className="size-3.5" />
                                                <p className="text-[11px] font-bold uppercase tracking-wider">
                                                    {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                                                </p>
                                            </div>

                                            <div className="mb-3 max-h-36 space-y-2.5 overflow-y-auto pr-1">
                                                {comments.length === 0 && (
                                                    <p className="text-xs text-white/45">Be the first to leave a comment.</p>
                                                )}
                                                {comments.map((comment) => (
                                                    <div key={comment.id} className="rounded-lg bg-white/5 px-2.5 py-2">
                                                        <p className="text-[11px] font-bold text-brand-green-light">
                                                            {comment.name}
                                                        </p>
                                                        <p className="mt-0.5 text-xs leading-relaxed text-white/75">
                                                            {comment.body}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {commentForm.recentlySuccessful && (
                                                <p className="mb-2 text-[11px] font-semibold text-brand-green-light">
                                                    Thanks for your comment.
                                                </p>
                                            )}

                                            <form onSubmit={submitComment} className="space-y-2">
                                                <input
                                                    type="text"
                                                    value={commentForm.data.name}
                                                    onChange={(e) => commentForm.setData('name', e.target.value)}
                                                    placeholder="Your name"
                                                    required
                                                    maxLength={80}
                                                    className="h-8 w-full rounded-md border border-white/15 bg-white/5 px-2.5 text-xs text-white placeholder:text-white/35 focus:border-brand-green focus:outline-none"
                                                />
                                                {commentForm.errors.name && (
                                                    <p className="text-[11px] text-red-300">{commentForm.errors.name}</p>
                                                )}
                                                <textarea
                                                    value={commentForm.data.body}
                                                    onChange={(e) => commentForm.setData('body', e.target.value)}
                                                    placeholder="Add a comment..."
                                                    required
                                                    rows={2}
                                                    maxLength={1000}
                                                    className="w-full resize-none rounded-md border border-white/15 bg-white/5 px-2.5 py-2 text-xs text-white placeholder:text-white/35 focus:border-brand-green focus:outline-none"
                                                />
                                                {commentForm.errors.body && (
                                                    <p className="text-[11px] text-red-300">{commentForm.errors.body}</p>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={commentForm.processing}
                                                    className="w-full rounded-full bg-brand-green px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-brand-green-light disabled:opacity-60"
                                                >
                                                    {commentForm.processing ? 'Posting…' : 'Post comment'}
                                                </button>
                                            </form>
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-2 border-t border-white/10 px-4 py-3">
                                        <div className="flex items-center justify-between gap-3">
                                            {previous ? (
                                                <Link
                                                    href={galleryShow.url(previous.id)}
                                                    prefetch
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/60 transition-colors hover:text-white"
                                                >
                                                    <ChevronLeft className="size-3" />
                                                    Previous
                                                </Link>
                                            ) : (
                                                <span className="text-[11px] text-white/25">Previous</span>
                                            )}
                                            {next ? (
                                                <Link
                                                    href={galleryShow.url(next.id)}
                                                    prefetch
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-white/60 transition-colors hover:text-white"
                                                >
                                                    Next
                                                    <ChevronRight className="size-3" />
                                                </Link>
                                            ) : (
                                                <span className="text-[11px] text-white/25">Next</span>
                                            )}
                                        </div>

                                        <Link
                                            href={donateHref}
                                            className="flex w-full items-center justify-center gap-1.5 rounded-full bg-brand-green px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-green-light"
                                        >
                                            <Heart className="size-3" fill="currentColor" />
                                            Support this work
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </PinterestPinLayout>
                </div>
            </div>

            {zoomed && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-dark/95 p-4 backdrop-blur-sm animate-in fade-in-0 duration-200"
                    onClick={() => setZoomed(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Zoomed image"
                >
                    <button
                        type="button"
                        onClick={() => setZoomed(false)}
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
                        aria-label="Close zoomed image"
                    >
                        <X className="size-5" />
                    </button>
                    <div
                        className="flex max-h-[92vh] max-w-5xl flex-col items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl animate-in zoom-in-95 duration-300"
                        />
                        <p className="max-w-xl text-center font-serif text-lg text-white">{title}</p>
                    </div>
                </div>
            )}

            <DonationBand donateHref={donateHref} />
        </PublicLayout>
    );
}
