import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

export type GalleryMediaItem = {
    id: number;
    src: string;
    alt: string;
    caption?: string | null;
    category?: string | null;
    media_type?: 'image' | 'video' | null;
};

export function isGalleryVideo(
    item: Pick<GalleryMediaItem, 'media_type'>,
): boolean {
    return item.media_type === 'video';
}

export function GalleryMediaThumb({
    item,
    className,
    mediaClassName,
    showBadge = true,
}: {
    item: GalleryMediaItem;
    className?: string;
    mediaClassName?: string;
    showBadge?: boolean;
}) {
    const video = isGalleryVideo(item);

    return (
        <div className={cn('relative overflow-hidden bg-secondary', className)}>
            {video ? (
                <video
                    src={`${item.src}#t=0.1`}
                    className={cn('w-full object-cover', mediaClassName)}
                    preload="metadata"
                    muted
                    playsInline
                    aria-hidden
                />
            ) : (
                <img
                    src={item.src}
                    alt={item.alt}
                    className={cn('w-full object-cover', mediaClassName)}
                    loading="lazy"
                />
            )}
            {video && showBadge && (
                <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-navy-dark/85 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                    <Play className="size-3 fill-white" aria-hidden />
                    Video
                </span>
            )}
        </div>
    );
}
