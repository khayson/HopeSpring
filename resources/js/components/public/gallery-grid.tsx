import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { show as galleryShow } from '@/routes/gallery';

type GalleryImage = {
    id: number;
    src: string;
    alt: string;
    caption?: string | null;
    category?: string | null;
};

type GalleryGridProps = {
    images: GalleryImage[];
    className?: string;
    /** Pinterest-style: title sits under the image instead of a hover overlay */
    captionBelow?: boolean;
    columns?: '2' | '3' | '4' | '5';
};

const columnClasses = {
    '2': 'columns-1 sm:columns-2',
    '3': 'columns-2 sm:columns-3',
    '4': 'columns-1 sm:columns-2 md:columns-3 lg:columns-4',
    '5': 'columns-2 sm:columns-3 md:columns-4 xl:columns-5',
};

export function GalleryGrid({
    images,
    className,
    captionBelow = false,
    columns = '4',
}: GalleryGridProps) {
    return (
        <div className={cn(columnClasses[columns], 'gap-4', className)}>
            {images.map((image) => (
                <Link
                    key={image.id}
                    href={galleryShow.url(image.id)}
                    className="group mb-4 block w-full break-inside-avoid text-left focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:outline-none"
                    prefetch
                >
                    <figure>
                        <div className="relative overflow-hidden rounded-2xl bg-secondary">
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                loading="lazy"
                            />
                            {!captionBelow && (
                                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/50 to-transparent px-3 pt-10 pb-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                                    {image.category && (
                                        <span className="mb-1.5 inline-block rounded bg-brand-green px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                                            {image.category}
                                        </span>
                                    )}
                                    {image.caption && (
                                        <p className="font-serif text-sm leading-snug font-semibold text-white">
                                            {image.caption}
                                        </p>
                                    )}
                                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/70">
                                        {image.alt}
                                    </p>
                                </figcaption>
                            )}
                        </div>
                        {captionBelow && (
                            <figcaption className="mt-2 px-0.5">
                                <p className="line-clamp-2 text-sm leading-snug font-semibold text-foreground">
                                    {image.caption ?? image.alt}
                                </p>
                                {image.category && (
                                    <p className="mt-0.5 text-xs text-muted-foreground capitalize">
                                        {image.category}
                                    </p>
                                )}
                            </figcaption>
                        )}
                    </figure>
                </Link>
            ))}
        </div>
    );
}
