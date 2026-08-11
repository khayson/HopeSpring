import { Link, useForm } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type PartnerFormData = {
    name: string;
    logo: File | null;
    remove_logo: boolean;
    url: string;
    sort_order: number;
    is_active: boolean;
};

type PartnerFormProps = {
    partner?: Partial<{
        name: string;
        logo: string;
        url: string;
        sort_order: number;
        is_active: boolean;
    }>;
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

export function PartnerForm({
    partner,
    action,
    method,
    submitLabel,
    cancelHref,
}: PartnerFormProps) {
    const [existingLogo, setExistingLogo] = useState(partner?.logo ?? null);
    const { data, setData, post, put, processing, errors, transform } =
        useForm<PartnerFormData>({
            name: partner?.name ?? '',
            logo: null,
            remove_logo: false,
            url: partner?.url ?? '',
            sort_order: partner?.sort_order ?? 0,
            is_active: partner?.is_active ?? true,
        });

    transform((form) => {
        const payload: Record<string, unknown> = {
            ...form,
            remove_logo: form.remove_logo ? 1 : 0,
            is_active: form.is_active ? 1 : 0,
        };

        if (!form.logo) {
            delete payload.logo;
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
                                Partner details
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Name, website, and display order on the About
                                page.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="WaterAid Ghana"
                                    required
                                />
                                <FieldError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="url">
                                    Website URL
                                    <span className="ml-1 font-normal text-muted-foreground">
                                        (optional)
                                    </span>
                                </Label>
                                <Input
                                    id="url"
                                    type="url"
                                    value={data.url}
                                    onChange={(e) =>
                                        setData('url', e.target.value)
                                    }
                                    placeholder="https://example.org"
                                />
                                <FieldError message={errors.url} />
                            </div>

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
                                <p className="text-xs text-muted-foreground">
                                    Lower numbers appear first in the partner
                                    grid.
                                </p>
                                <FieldError message={errors.sort_order} />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <ImageUpload
                            label="Logo"
                            value={data.logo}
                            existingUrl={existingLogo}
                            removeExisting={data.remove_logo}
                            hint="PNG or SVG with transparent background works best."
                            onChange={(file) => {
                                setData((current) => ({
                                    ...current,
                                    logo: file,
                                    remove_logo: false,
                                }));
                                if (file) {
                                    setExistingLogo(null);
                                }
                            }}
                            onRemoveExisting={() => {
                                setData((current) => ({
                                    ...current,
                                    logo: null,
                                    remove_logo: true,
                                }));
                                setExistingLogo(null);
                            }}
                            error={errors.logo}
                        />
                    </section>

                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-5">
                            <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                                Visibility
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Control whether this logo appears on the About
                                page.
                            </p>
                        </div>

                        <label
                            htmlFor="is_active"
                            className="flex cursor-pointer items-start gap-3 rounded-xl border border-sidebar-border/70 p-4 transition hover:bg-secondary/40"
                        >
                            <Checkbox
                                id="is_active"
                                checked={data.is_active}
                                onCheckedChange={(checked) =>
                                    setData('is_active', checked === true)
                                }
                                className="mt-0.5"
                            />
                            <span>
                                <span className="block text-sm font-medium">
                                    Show on About page
                                </span>
                                <span className="mt-1 block text-xs text-muted-foreground">
                                    Hidden partners stay in the admin list but
                                    are not shown publicly.
                                </span>
                            </span>
                        </label>
                    </section>

                    {partner?.url && (
                        <a
                            href={partner.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-green hover:underline"
                        >
                            Visit partner website
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
