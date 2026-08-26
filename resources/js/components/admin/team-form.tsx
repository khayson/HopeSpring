import { Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

type TeamType = {
    value: string;
    label: string;
};

type TeamFormData = {
    name: string;
    role: string;
    photo: File | null;
    remove_photo: boolean;
    bio: string;
    email: string;
    linkedin: string;
    type: string;
    sort_order: number;
    is_active: boolean;
};

type TeamFormProps = {
    member?: Partial<{
        name: string;
        role: string;
        photo: string | null;
        bio: string | null;
        email: string | null;
        linkedin: string | null;
        type: string;
        sort_order: number;
        is_active: boolean;
    }>;
    types: TeamType[];
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

export function TeamForm({
    member,
    types,
    action,
    method,
    submitLabel,
    cancelHref,
}: TeamFormProps) {
    const [existingPhoto, setExistingPhoto] = useState(member?.photo ?? null);
    const { data, setData, post, put, processing, errors, transform } =
        useForm<TeamFormData>({
            name: member?.name ?? '',
            role: member?.role ?? '',
            photo: null,
            remove_photo: false,
            bio: member?.bio ?? '',
            email: member?.email ?? '',
            linkedin: member?.linkedin ?? '',
            type: member?.type ?? 'leadership',
            sort_order: member?.sort_order ?? 0,
            is_active: member?.is_active ?? true,
        });

    transform((form) => {
        const payload: Record<string, unknown> = {
            ...form,
            remove_photo: form.remove_photo ? 1 : 0,
            is_active: form.is_active ? 1 : 0,
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
                                Profile
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Name, role, and which About page section they
                                appear in.
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
                                    placeholder="Melina Diamond"
                                    required
                                />
                                <FieldError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                    id="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData('role', e.target.value)
                                    }
                                    placeholder="Founder & Executive Director"
                                    required
                                />
                                <FieldError message={errors.role} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Section</Label>
                                <Select
                                    value={data.type}
                                    onValueChange={(value) =>
                                        setData('type', value)
                                    }
                                >
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {types.map((type) => (
                                            <SelectItem
                                                key={type.value}
                                                value={type.value}
                                            >
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FieldError message={errors.type} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    value={data.bio}
                                    onChange={(e) =>
                                        setData('bio', e.target.value)
                                    }
                                    rows={5}
                                    maxLength={2000}
                                    placeholder="Short biography shown with the Leadership Team."
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Used on the Leadership Team section.
                                </p>
                                <FieldError message={errors.bio} />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email
                                        <span className="ml-1 font-normal text-muted-foreground">
                                            (optional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="name@hopespringfoundation.org"
                                    />
                                    <FieldError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="linkedin">
                                        LinkedIn
                                        <span className="ml-1 font-normal text-muted-foreground">
                                            (optional)
                                        </span>
                                    </Label>
                                    <Input
                                        id="linkedin"
                                        type="url"
                                        value={data.linkedin}
                                        onChange={(e) =>
                                            setData('linkedin', e.target.value)
                                        }
                                        placeholder="https://linkedin.com/in/..."
                                    />
                                    <FieldError message={errors.linkedin} />
                                </div>
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
                                    Lower numbers appear first in that section.
                                </p>
                                <FieldError message={errors.sort_order} />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <ImageUpload
                            label="Photo"
                            value={data.photo}
                            existingUrl={existingPhoto}
                            removeExisting={data.remove_photo}
                            hint="Square portrait, JPG or PNG up to 5MB."
                            aspectClassName="aspect-square"
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
                                Control whether this person appears on the About
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
                                    Hidden people stay in this list but are not
                                    shown publicly.
                                </span>
                            </span>
                        </label>
                    </section>
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
