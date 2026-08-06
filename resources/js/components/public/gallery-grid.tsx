import { cn } from '@/lib/utils';
import { useState } from 'react';
import { X } from 'lucide-react';

type GalleryImage = {
    src: string;
    alt: string;
};

type GalleryGridProps = {
    images: GalleryImage[];
    className?: string;
};

export function GalleryGrid({ images, className }: GalleryGridProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    return (
        <>
            <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4', className)}>
                {images.map((image, index) => (
                    <button
                        key={index}
                        type="button"
                        onClick={() => setLightboxIndex(index)}
                        className="group overflow-hidden rounded-lg"
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            width={300}
                            height={300}
                            loading="lazy"
                        />
                    </button>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightboxIndex(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image lightbox"
                >
                    <button
                        type="button"
                        onClick={() => setLightboxIndex(null)}
                        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                        aria-label="Close lightbox"
                    >
                        <X className="size-6" />
                    </button>
                    <img
                        src={images[lightboxIndex].src}
                        alt={images[lightboxIndex].alt}
                        className="max-h-[85vh] max-w-full rounded-lg object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
