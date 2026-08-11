import { Link, useForm } from '@inertiajs/react';
import { ExternalLink, MapPin } from 'lucide-react';
import { useState } from 'react';
import { ImageUpload } from '@/components/admin/image-upload';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { show as publicEventShow } from '@/routes/events';

type EventFormData = {
    title: string;
    description: string;
    long_description: string;
    location: string;
    photo: File | null;
    remove_photo: boolean;
    starts_at: string;
    ends_at: string;
    is_featured: boolean;
};

type EventFormProps = {
    event?: Partial<{
        title: string;
        slug: string;
        description: string;
        long_description: string;
        location: string;
        photo: string;
        starts_at: string;
        ends_at: string;
        is_featured: boolean;
    }>;
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
    cancelHref: string;
};

function toDatetimeLocal(value?: string): string {
    if (!value) {
        return '';
    }

    return value.slice(0, 16);
}

function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="text-xs text-destructive">{message}</p>;
}

export function EventForm({
    event,
    action,
    method,
    submitLabel,
    cancelHref,
}: EventFormProps) {
    const [existingPhoto, setExistingPhoto] = useState(event?.photo ?? null);
    const { data, setData, post, put, processing, errors, transform } =
        useForm<EventFormData>({
            title: event?.title ?? '',
            description: event?.description ?? '',
            long_description: event?.long_description ?? '',
            location: event?.location ?? '',
            photo: null,
            remove_photo: false,
            starts_at: toDatetimeLocal(event?.starts_at),
            ends_at: toDatetimeLocal(event?.ends_at),
            is_featured: event?.is_featured ?? false,
        });

    transform((form) => {
        const payload: Record<string, unknown> = {
            ...form,
            remove_photo: form.remove_photo ? 1 : 0,
            is_featured: form.is_featured ? 1 : 0,
        };

        if (!form.photo) {
            delete payload.photo;
        }

        return payload;
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const options = { forceFormData: true };

        if (method === 'post') {
            post(action, options);

            return;
        }

        put(action, options);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-5">
                            <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                                Event details
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Title and copy shown on the public events pages.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Community health outreach day"
                                    required
                                />
                                <FieldError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="description">
                                        Short description
                                    </Label>
                                    <span
                                        className={cn(
                                            'text-[11px] tabular-nums text-muted-foreground',
                                            data.description.length > 900 &&
                                                'text-amber-600',
                                        )}
                                    >
                                        {data.description.length}/1000
                                    </span>
                                </div>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    rows={3}
                                    maxLength={1000}
                                    required
                                    placeholder="A concise summary for cards and listings."
                                    className="flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <FieldError message={errors.description} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="long_description">
                                    Full description
                                </Label>
                                <RichTextEditor
                                    id="long_description"
                                    value={data.long_description}
                                    onChange={(value) =>
                                        setData('long_description', value)
                                    }
                                    placeholder="Agenda, speakers, what attendees should expect…"
                                />
                                <FieldError
                                    message={errors.long_description}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-5">
                            <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                                Schedule & location
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                When and where people should show up.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        className="pl-9"
                                        placeholder="Accra International Conference Centre"
                                        required
                                    />
                                </div>
                                <FieldError message={errors.location} />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="starts_at">Starts at</Label>
                                    <Input
                                        id="starts_at"
                                        type="datetime-local"
                                        value={data.starts_at}
                                        onChange={(e) =>
                                            setData(
                                                'starts_at',
                                                e.target.value,
                                            )
                                        }
                                        required
                                    />
                                    <FieldError message={errors.starts_at} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ends_at">
                                        Ends at
                                        <span className="ml-1 font-normal text-muted-foreground">
                                            (optional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="ends_at"
                                        type="datetime-local"
                                        value={data.ends_at}
                                        onChange={(e) =>
                                            setData('ends_at', e.target.value)
                                        }
                                    />
                                    <FieldError message={errors.ends_at} />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <ImageUpload
                            value={data.photo}
                            existingUrl={existingPhoto}
                            removeExisting={data.remove_photo}
                            onChange={(file) => {
                                setData((current) => ({
                                    ...current,
                                    photo: file,
                                    remove_photo: false,
                                }));
                                if (file) {
                                    setExistingPhoto(null);
                                }
                            }}
                            onRemoveExisting={() => {
                                setData((current) => ({
                                    ...current,
                                    photo: null,
                                    remove_photo: true,
                                }));
                                setExistingPhoto(null);
                            }}
                            error={errors.photo}
                        />
                    </section>

                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-5">
                            <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                                Visibility
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Featured events can be highlighted on the site.
                            </p>
                        </div>

                        <label
                            htmlFor="is_featured"
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-sidebar-border/70 p-4 transition hover:bg-secondary/40"
                        >
                            <Checkbox
                                id="is_featured"
                                checked={data.is_featured}
                                onCheckedChange={(checked) =>
                                    setData('is_featured', checked === true)
                                }
                                className="mt-0.5"
                            />
                            <span>
                                <span className="block text-sm font-medium">
                                    Featured event
                                </span>
                                <span className="mt-1 block text-xs text-muted-foreground">
                                    Mark this as a priority listing for staff
                                    and visitors.
                                </span>
                            </span>
                        </label>
                    </section>

                    {event?.slug && (
                        <a
                            href={publicEventShow.url(event.slug)}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline"
                        >
                            View on public site
                            <ExternalLink className="size-3.5" />
                        </a>
                    )}
                </div>
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
