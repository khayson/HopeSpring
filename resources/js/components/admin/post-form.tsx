import { Link, useForm } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { ImageUpload } from '@/components/admin/image-upload';
import { RichTextEditor } from '@/components/admin/rich-text-editor';
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
import { cn } from '@/lib/utils';
import { show as newsShow } from '@/routes/news';

const categories = ['education', 'healthcare', 'community', 'relief'] as const;

type PostFormData = {
    title: string;
    excerpt: string;
    body: string;
    featured_image: File | null;
    remove_featured_image: boolean;
    category: string;
    is_featured: boolean;
    published_at: string;
};

type PostFormProps = {
    post?: Partial<{
        title: string;
        slug: string;
        excerpt: string;
        body: string;
        featured_image: string;
        category: string;
        is_featured: boolean;
        published_at: string;
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

export function PostForm({
    post,
    action,
    method,
    submitLabel,
    cancelHref,
}: PostFormProps) {
    const [existingImage, setExistingImage] = useState(
        post?.featured_image ?? null,
    );
    const {
        data,
        setData,
        post: postSubmit,
        put,
        processing,
        errors,
        transform,
    } = useForm<PostFormData>({
        title: post?.title ?? '',
        excerpt: post?.excerpt ?? '',
        body: post?.body ?? '',
        featured_image: null,
        remove_featured_image: false,
        category: post?.category ?? 'community',
        is_featured: post?.is_featured ?? false,
        published_at: post?.published_at?.slice(0, 16) ?? '',
    });

    transform((form) => {
        const payload: Record<string, unknown> = {
            ...form,
            remove_featured_image: form.remove_featured_image ? 1 : 0,
            is_featured: form.is_featured ? 1 : 0,
        };

        if (!form.featured_image) {
            delete payload.featured_image;
        }

        return payload;
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const options = { forceFormData: true };

        if (method === 'post') {
            postSubmit(action, options);

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
                                Story details
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Title, excerpt, and the full article body.
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
                                    placeholder="How clean water changed a village"
                                    required
                                />
                                <FieldError message={errors.title} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-3">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <span
                                        className={cn(
                                            'text-[11px] tabular-nums text-muted-foreground',
                                            data.excerpt.length > 450 &&
                                                'text-amber-600',
                                        )}
                                    >
                                        {data.excerpt.length}/500
                                    </span>
                                </div>
                                <textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) =>
                                        setData('excerpt', e.target.value)
                                    }
                                    rows={3}
                                    maxLength={500}
                                    required
                                    placeholder="A short summary for cards and social previews."
                                    className="flex min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <FieldError message={errors.excerpt} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="body">Body</Label>
                                <RichTextEditor
                                    id="body"
                                    value={data.body}
                                    onChange={(value) =>
                                        setData('body', value)
                                    }
                                    placeholder="Write the full story…"
                                />
                                <FieldError message={errors.body} />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <ImageUpload
                            label="Featured image"
                            value={data.featured_image}
                            existingUrl={existingImage}
                            removeExisting={data.remove_featured_image}
                            onChange={(file) => {
                                setData((current) => ({
                                    ...current,
                                    featured_image: file,
                                    remove_featured_image: false,
                                }));
                                if (file) {
                                    setExistingImage(null);
                                }
                            }}
                            onRemoveExisting={() => {
                                setData((current) => ({
                                    ...current,
                                    featured_image: null,
                                    remove_featured_image: true,
                                }));
                                setExistingImage(null);
                            }}
                            error={errors.featured_image}
                        />
                    </section>

                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-5">
                            <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                                Publishing
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Category, schedule, and featured visibility.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={data.category}
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

                            <div className="space-y-2">
                                <Label htmlFor="published_at">
                                    Publish date
                                </Label>
                                <Input
                                    id="published_at"
                                    type="datetime-local"
                                    value={data.published_at}
                                    onChange={(e) =>
                                        setData(
                                            'published_at',
                                            e.target.value,
                                        )
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    Leave blank to keep this post as a draft.
                                </p>
                                <FieldError message={errors.published_at} />
                            </div>

                            <label
                                htmlFor="is_featured"
                                className="flex cursor-pointer items-start gap-3 rounded-xl border border-sidebar-border/70 p-4 transition hover:bg-secondary/40"
                            >
                                <Checkbox
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'is_featured',
                                            checked === true,
                                        )
                                    }
                                    className="mt-0.5"
                                />
                                <span>
                                    <span className="block text-sm font-medium">
                                        Featured post
                                    </span>
                                    <span className="mt-1 block text-xs text-muted-foreground">
                                        Highlight this story on the news
                                        homepage.
                                    </span>
                                </span>
                            </label>
                        </div>
                    </section>

                    {post?.slug && post.published_at && (
                        <a
                            href={newsShow.url(post.slug)}
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
