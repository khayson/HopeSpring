import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { GalleryForm } from '@/components/admin/gallery-form';
import { dashboard } from '@/routes';
import {
    index as galleryIndex,
    update as galleryUpdate,
} from '@/routes/admin/gallery';

type Image = {
    id: number;
    src: string;
    alt: string;
    caption: string | null;
    category: string | null;
    media_type: 'image' | 'video';
    sort_order: number;
};

type Props = {
    image: Image;
    categories: string[];
};

export default function GalleryEdit({ image, categories }: Props) {
    return (
        <>
            <Head title={`Edit — ${image.caption ?? image.alt}`} />
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
                        Edit gallery item
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update caption, category, or replace the file.
                    </p>
                </div>
                <GalleryForm
                    image={image}
                    categories={categories}
                    action={galleryUpdate.url(image.id)}
                    method="put"
                    submitLabel="Save changes"
                    cancelHref={galleryIndex.url()}
                />
            </div>
        </>
    );
}

GalleryEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Gallery', href: galleryIndex.url() },
        { title: 'Edit', href: '#' },
    ],
};
