import { Head, Link } from '@inertiajs/react';
import { DonationBand } from '@/components/public/donation-band';
import { GalleryGrid } from '@/components/public/gallery-grid';
import { PageHero } from '@/components/public/page-hero';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';
import { cn } from '@/lib/utils';
import { index as galleryIndex } from '@/routes/gallery';

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

export default function GalleryIndex({
    images,
    categories,
    currentCategory,
}: Props) {
    return (
        <PublicLayout currentPath="/gallery">
            <Head title="Gallery — HopeSpring Foundation" />

            <PageHero
                title="Gallery"
                subtitle="Moments captured from our work across communities in Ghana — water, classrooms, clinics, and the people who make change possible."
                image={pageHeroes.gallery}
            />

            <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
                {categories.length > 0 && (
                    <ScrollReveal>
                        <div
                            className="mb-4 flex flex-wrap gap-2"
                            role="navigation"
                            aria-label="Gallery categories"
                        >
                            <Link
                                href={galleryIndex.url()}
                                className={cn(
                                    'rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors',
                                    !currentCategory
                                        ? 'bg-navy text-white'
                                        : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                                )}
                            >
                                All
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat}
                                    href={galleryIndex.url({
                                        query: { category: cat },
                                    })}
                                    className={cn(
                                        'rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-colors',
                                        currentCategory === cat
                                            ? 'bg-navy text-white'
                                            : 'bg-secondary text-muted-foreground hover:bg-secondary/80',
                                    )}
                                >
                                    {cat}
                                </Link>
                            ))}
                        </div>
                    </ScrollReveal>
                )}

                {images.length > 0 ? (
                    <ScrollReveal delay={80}>
                        <GalleryGrid images={images} />
                    </ScrollReveal>
                ) : (
                    <p className="py-12 text-center text-muted-foreground">
                        No images found for this category.
                    </p>
                )}
            </section>

            <DonationBand />
        </PublicLayout>
    );
}
