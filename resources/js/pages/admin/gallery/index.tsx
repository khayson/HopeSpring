import { Head, Link, router } from '@inertiajs/react';
import { Images, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { Pagination } from '@/components/admin/pagination';
import { AdminStatCard } from '@/components/admin/stat-card';
import { GalleryMediaThumb } from '@/components/public/gallery-media-thumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import {
    create as galleryCreate,
    destroy as galleryDestroy,
    edit as galleryEdit,
    index as galleryIndex,
} from '@/routes/admin/gallery';
import { show as publicGalleryShow } from '@/routes/gallery';

const ALL = 'all';

type GalleryItem = {
    id: number;
    src: string;
    alt: string;
    caption: string | null;
    category: string | null;
    media_type: 'image' | 'video';
    sort_order: number;
};

type Props = {
    images: {
        data: GalleryItem[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; category?: string; type?: string };
    categories: string[];
    stats: { total: number; images: number; videos: number };
};

export default function GalleryIndex({
    images,
    filters,
    categories,
    stats,
}: Props) {
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    function filter(
        next: Partial<{ search: string; category: string; type: string }>,
    ) {
        router.get(
            galleryIndex.url(),
            {
                search: next.search ?? filters.search ?? '',
                category: next.category ?? filters.category ?? '',
                type: next.type ?? filters.type ?? '',
            },
            { preserveState: true, replace: true },
        );
    }

    function destroy() {
        if (pendingDelete === null) {
            return;
        }

        setProcessing(true);
        router.delete(galleryDestroy.url(pendingDelete), {
            onFinish: () => {
                setProcessing(false);
                setPendingDelete(null);
            },
        });
    }

    const activeType = filters.type || ALL;
    const activeCategory = filters.category || ALL;

    return (
        <>
            <Head title="Gallery" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            Gallery
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Photos and videos shown on the public gallery.
                        </p>
                    </div>
                    <Button
                        asChild
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <Link href={galleryCreate.url()}>
                            <Plus className="size-4" />
                            Add media
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <AdminStatCard
                        label="All items"
                        value={stats.total}
                        hint="Photos and videos"
                        active={activeType === ALL}
                        onClick={() => filter({ type: '' })}
                    />
                    <AdminStatCard
                        label="Photos"
                        value={stats.images}
                        hint="Still images"
                        active={activeType === 'image'}
                        onClick={() => filter({ type: 'image' })}
                    />
                    <AdminStatCard
                        label="Videos"
                        value={stats.videos}
                        hint="Playable clips"
                        active={activeType === 'video'}
                        onClick={() => filter({ type: 'video' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search captions"
                            defaultValue={filters.search}
                            onChange={(e) => filter({ search: e.target.value })}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={activeCategory}
                        onValueChange={(value) =>
                            filter({
                                category: value === ALL ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-9 w-[180px] capitalize">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All categories</SelectItem>
                            {categories.map((category) => (
                                <SelectItem
                                    key={category}
                                    value={category}
                                    className="capitalize"
                                >
                                    {category}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {images.data.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <Images className="size-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                                No gallery items match these filters.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {images.data.map((image) => (
                                <article
                                    key={image.id}
                                    className="overflow-hidden rounded-xl border border-sidebar-border/70"
                                >
                                    <GalleryMediaThumb
                                        item={image}
                                        className="aspect-[4/3]"
                                        mediaClassName="size-full object-cover"
                                    />
                                    <div className="space-y-3 p-3">
                                        <p className="line-clamp-2 text-sm font-semibold">
                                            {image.caption ?? image.alt}
                                        </p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {image.category ?? 'Uncategorised'}
                                        </p>
                                        <div className="flex items-center justify-between gap-2">
                                            <Link
                                                href={galleryEdit.url(image.id)}
                                                className="text-sm font-semibold text-brand-green hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <div className="flex items-center gap-1">
                                                <Link
                                                    href={publicGalleryShow.url(
                                                        image.id,
                                                    )}
                                                    className="text-xs text-muted-foreground hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setPendingDelete(
                                                            image.id,
                                                        )
                                                    }
                                                    className="rounded-md p-1.5 text-rose-600 transition hover:bg-rose-50 hover:text-rose-800"
                                                    aria-label={`Delete ${image.alt}`}
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                    <Pagination links={images.links} />
                </div>
            </div>

            <ConfirmDialog
                open={pendingDelete !== null}
                onOpenChange={(open) => !open && setPendingDelete(null)}
                title="Delete this gallery item?"
                description="It will be removed from the public gallery. This cannot be undone."
                confirmLabel="Delete"
                variant="destructive"
                processing={processing}
                onConfirm={destroy}
            />
        </>
    );
}

GalleryIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Gallery', href: galleryIndex.url() },
    ],
};
