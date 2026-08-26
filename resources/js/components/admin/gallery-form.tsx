import { Link, useForm } from '@inertiajs/react';
import { MediaUpload } from '@/components/admin/media-upload';
import { isGalleryVideo } from '@/components/public/gallery-media-thumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

const NONE = 'none';

type GalleryFormData = {
    files: File[];
    file: File | null;
    alt: string;
    caption: string;
    category: string;
    sort_order: number;
};

type GalleryFormProps = {
    image?: {
        src: string;
        alt: string;
        caption: string | null;
        category: string | null;
        media_type: 'image' | 'video';
        sort_order: number;
    };
    categories: string[];
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
    cancelHref: string;
};

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="text-xs text-destructive">{message}</p>;
}

export function GalleryForm({
    image,
    categories,
    action,
    method,
    submitLabel,
    cancelHref,
}: GalleryFormProps) {
    const creating = method === 'post';
    const { data, setData, post, put, processing, errors, transform } =
        useForm<GalleryFormData>({
            files: [],
            file: null,
            alt: image?.alt ?? '',
            caption: image?.caption ?? '',
            category: image?.category ?? 'community',
            sort_order: image?.sort_order ?? 0,
        });

    transform((form) => {
        const payload: Record<string, unknown> = {
            alt: form.alt,
            caption: form.caption,
            category: form.category === NONE ? '' : form.category,
        };

        if (creating) {
            payload.files = form.files;
        } else {
            payload.sort_order = form.sort_order;

            if (form.file) {
                payload.file = form.file;
            }
        }

        return payload;
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const options = { forceFormData: true };

        if (creating) {
            post(action, options);

            return;
        }

        put(action, options);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                <section className="space-y-6 rounded-2xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <div>
                        <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                            Caption
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Alt text is required. Caption appears on the public
                            gallery.
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="alt">Alt text</Label>
                            <Input
                                id="alt"
                                value={data.alt}
                                onChange={(e) => setData('alt', e.target.value)}
                                placeholder="HopeSpring visit to Anweem, Komenda District"
                                required
                            />
                            <FieldError message={errors.alt} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="caption">Caption</Label>
                            <Input
                                id="caption"
                                value={data.caption}
                                onChange={(e) =>
                                    setData('caption', e.target.value)
                                }
                                placeholder="Visit to Anweem, Komenda District"
                            />
                            <FieldError message={errors.caption} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={data.category || NONE}
                                onValueChange={(value) =>
                                    setData('category', value)
                                }
                            >
                                <SelectTrigger
                                    id="category"
                                    className="w-full capitalize"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={NONE}>None</SelectItem>
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
                            <FieldError message={errors.category} />
                        </div>

                        {!creating && (
                            <div className="space-y-2">
                                <Label htmlFor="sort_order">Sort order</Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    onChange={(e) =>
                                        setData(
                                            'sort_order',
                                            Number(e.target.value) || 0,
                                        )
                                    }
                                    required
                                />
                                <FieldError message={errors.sort_order} />
                            </div>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-sidebar-border/70 bg-card p-6 dark:border-sidebar-border">
                    <MediaUpload
                        label={creating ? 'Files' : 'Replace file'}
                        files={
                            creating ? data.files : data.file ? [data.file] : []
                        }
                        existingUrl={creating ? null : image?.src}
                        existingIsVideo={
                            creating ? false : isGalleryVideo(image ?? {})
                        }
                        multiple={creating}
                        onChange={(next) => {
                            if (creating) {
                                setData('files', next);

                                return;
                            }

                            setData('file', next[0] ?? null);
                        }}
                        error={creating ? errors.files : errors.file}
                    />
                </section>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                <Button
                    type="submit"
                    disabled={processing}
                    className="bg-brand-green font-bold hover:bg-brand-green-dark"
                >
                    {processing && <Spinner />}
                    {submitLabel}
                </Button>
                <Button asChild type="button" variant="outline">
                    <Link href={cancelHref}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
