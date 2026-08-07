import { GalleryGrid } from '@/components/public/gallery-grid';
import { PageHero } from '@/components/public/page-hero';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';

type GalleryImage = {
    id: number;
    src: string;
    alt: string;
    caption: string | null;
    category: string | null;
};

type Props = {
    images: GalleryImage[];
    categories: string[];
    currentCategory: string | null;
};

export default function Gallery({ images, categories, currentCategory }: Props) {
    return (
        <PublicLayout currentPath="/gallery">
            <Head title="Gallery — HopeSpring Foundation" />

            <PageHero title="Gallery" />

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                {/* Category Filter */}
                {categories.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-2">
                        <Link
                            href="/gallery"
                            className={cn(
                                'rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors',
                                !currentCategory ? 'bg-navy text-white' : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                            )}
                        >
                            All
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                href={`/gallery?category=${cat}`}
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

                {images.length > 0 ? (
                    <GalleryGrid images={images.map((img) => ({ src: img.src, alt: img.alt }))} />
                ) : (
                    <p className="py-12 text-center text-muted-foreground">No images found.</p>
                )}
            </section>
        </PublicLayout>
    );
}
