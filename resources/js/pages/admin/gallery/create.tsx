import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { GalleryForm } from '@/components/admin/gallery-form';
import { dashboard } from '@/routes';
import {
    create as galleryCreate,
    index as galleryIndex,
    store as galleryStore,
} from '@/routes/admin/gallery';

type Props = {
    categories: string[];
};

export default function GalleryCreate({ categories }: Props) {
    return (
        <>
            <Head title="Add gallery media" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <Link
                        href={galleryIndex.url()}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to gallery
                    </Link>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Add gallery media
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Upload photos or videos for the public gallery.
                    </p>
                </div>
                <GalleryForm
                    categories={categories}
                    action={galleryStore.url()}
                    method="post"
                    submitLabel="Add to gallery"
                    cancelHref={galleryIndex.url()}
                />
            </div>
        </>
    );
}

GalleryCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Gallery', href: galleryIndex.url() },
        { title: 'New', href: galleryCreate.url() },
    ],
};
