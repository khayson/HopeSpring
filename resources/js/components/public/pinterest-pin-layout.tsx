import { show as galleryShow } from '@/routes/gallery';
import { Link } from '@inertiajs/react';
import { useLayoutEffect, useRef, useState } from 'react';

type RelatedImage = {
    id: number;
    src: string;
    alt: string;
    caption: string | null;
    category: string | null;
};

type Position = {
    top: number;
    left: number;
    width: number;
};

type PinterestPinLayoutProps = {
    related: RelatedImage[];
    children: React.ReactNode;
};

const ASPECTS = ['aspect-[3/4]', 'aspect-square', 'aspect-[4/5]', 'aspect-[5/6]', 'aspect-[2/3]'] as const;

/**
 * Dynamic Pinterest-style layout: the pin sits top-left and related
 * images pack into responsive columns beside and underneath it.
 */
export function PinterestPinLayout({ related, children }: PinterestPinLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
    const frameRef = useRef<number | null>(null);
    const [layout, setLayout] = useState<{
        height: number;
        pinWidth: number;
        items: Position[];
        ready: boolean;
    }>({
        height: 0,
        pinWidth: 0,
        items: [],
        ready: false,
    });

    useLayoutEffect(() => {
        const container = containerRef.current;
        const pin = pinRef.current;

        if (!container || !pin) {
            return;
        }

        itemRefs.current = itemRefs.current.slice(0, related.length);

        const gap = 16;
        const minColWidth = 200;

        function scheduleRelayout() {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }

            frameRef.current = requestAnimationFrame(() => {
                frameRef.current = requestAnimationFrame(relayout);
            });
        }

        function relayout() {
            if (!container || !pin) {
                return;
            }

            const width = container.clientWidth;

            if (width <= 0) {
                return;
            }

            const columnCount = Math.max(2, Math.floor((width + gap) / (minColWidth + gap)));
            const columnWidth = (width - gap * (columnCount - 1)) / columnCount;

            const isStacked = width < 1024;
            const preferredPinWidth = Math.min(720, width * 0.58);
            const pinSpan = isStacked
                ? columnCount
                : Math.min(columnCount - 1, Math.max(2, Math.round(preferredPinWidth / (columnWidth + gap))));

            const pinWidth = pinSpan * columnWidth + (pinSpan - 1) * gap;
            pin.style.width = `${pinWidth}px`;

            // Ensure item widths are applied before measuring heights.
            related.forEach((_, index) => {
                const el = itemRefs.current[index];

                if (el) {
                    el.style.width = `${columnWidth}px`;
                }
            });

            const pinHeight = pin.getBoundingClientRect().height;
            const columnHeights = Array.from({ length: columnCount }, () => 0);

            for (let i = 0; i < pinSpan; i++) {
                columnHeights[i] = pinHeight + gap;
            }

            const items: Position[] = related.map((_, index) => {
                const el = itemRefs.current[index];
                const height = el ? el.getBoundingClientRect().height : columnWidth * 1.25;

                let shortest = 0;

                for (let c = 1; c < columnCount; c++) {
                    if (columnHeights[c] < columnHeights[shortest]) {
                        shortest = c;
                    }
                }

                const position = {
                    top: columnHeights[shortest],
                    left: shortest * (columnWidth + gap),
                    width: columnWidth,
                };

                columnHeights[shortest] += Math.max(height, 1) + gap;

                return position;
            });

            const nextHeight = Math.max(pinHeight, ...columnHeights, 0);

            setLayout((prev) => {
                const same =
                    prev.ready &&
                    prev.height === nextHeight &&
                    prev.pinWidth === pinWidth &&
                    prev.items.length === items.length &&
                    prev.items.every(
                        (item, i) =>
                            item.top === items[i].top &&
                            item.left === items[i].left &&
                            item.width === items[i].width,
                    );

                if (same) {
                    return prev;
                }

                return {
                    height: nextHeight,
                    pinWidth,
                    items,
                    ready: true,
                };
            });
        }

        scheduleRelayout();

        const resizeObserver = new ResizeObserver(() => {
            scheduleRelayout();
        });

        resizeObserver.observe(container);
        resizeObserver.observe(pin);

        itemRefs.current.forEach((el) => {
            if (el) {
                resizeObserver.observe(el);
            }
        });

        const onImageLoad = () => scheduleRelayout();
        const images = container.querySelectorAll('img');

        images.forEach((img) => {
            img.addEventListener('load', onImageLoad);
            img.addEventListener('error', onImageLoad);
        });

        window.addEventListener('resize', scheduleRelayout);

        return () => {
            if (frameRef.current !== null) {
                cancelAnimationFrame(frameRef.current);
            }

            resizeObserver.disconnect();
            window.removeEventListener('resize', scheduleRelayout);
            images.forEach((img) => {
                img.removeEventListener('load', onImageLoad);
                img.removeEventListener('error', onImageLoad);
            });
        };
    }, [related]);

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            style={{ height: layout.ready ? layout.height : undefined, minHeight: layout.ready ? undefined : 480 }}
        >
            <div
                ref={pinRef}
                className="absolute top-0 left-0 z-10"
                style={{
                    width: layout.pinWidth || '100%',
                    opacity: layout.ready ? 1 : 0,
                }}
            >
                {children}
            </div>

            {related.map((item, index) => {
                const position = layout.items[index];

                return (
                    <div
                        key={item.id}
                        ref={(el) => {
                            itemRefs.current[index] = el;
                        }}
                        className="absolute"
                        style={{
                            top: position?.top ?? 0,
                            left: position?.left ?? 0,
                            width: position?.width || 200,
                            opacity: layout.ready ? 1 : 0,
                            zIndex: 1,
                        }}
                    >
                        <Link
                            href={galleryShow.url(item.id)}
                            prefetch
                            className="group block text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
                        >
                            <figure>
                                <div
                                    className={`overflow-hidden rounded-2xl bg-navy ${ASPECTS[index % ASPECTS.length]}`}
                                >
                                    <img
                                        src={item.src}
                                        alt={item.alt}
                                        className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                                        loading="eager"
                                        decoding="async"
                                    />
                                </div>
                                <figcaption className="mt-1.5 px-0.5">
                                    <p className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                                        {item.caption ?? item.alt}
                                    </p>
                                    {item.category && (
                                        <p className="mt-0.5 text-xs capitalize text-white/60">{item.category}</p>
                                    )}
                                </figcaption>
                            </figure>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
