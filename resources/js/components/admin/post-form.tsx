import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useForm } from '@inertiajs/react';

type PostFormData = {
    title: string;
    excerpt: string;
    body: string;
    featured_image: string;
    category: string;
    is_featured: boolean;
    published_at: string;
};

type PostFormProps = {
    post?: Partial<PostFormData>;
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
};

const categories = ['education', 'healthcare', 'community', 'relief'];

export function PostForm({ post, action, method, submitLabel }: PostFormProps) {
    const { data, setData, post: postSubmit, put, processing, errors } = useForm<PostFormData>({
        title: post?.title ?? '',
        excerpt: post?.excerpt ?? '',
        body: post?.body ?? '',
        featured_image: post?.featured_image ?? '',
        category: post?.category ?? 'community',
        is_featured: post?.is_featured ?? false,
        published_at: post?.published_at?.slice(0, 16) ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const submit = method === 'post' ? postSubmit : put;
        submit(action);
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} required />
                {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <textarea
                    id="excerpt"
                    value={data.excerpt}
                    onChange={(e) => setData('excerpt', e.target.value)}
                    rows={2}
                    required
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="body">Body</Label>
                <textarea
                    id="body"
                    value={data.body}
                    onChange={(e) => setData('body', e.target.value)}
                    rows={10}
                    required
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.body && <p className="text-xs text-destructive">{errors.body}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="featured_image">Featured Image URL (optional)</Label>
                <Input id="featured_image" value={data.featured_image} onChange={(e) => setData('featured_image', e.target.value)} placeholder="https://..." />
                {errors.featured_image && <p className="text-xs text-destructive">{errors.featured_image}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                        id="category"
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm capitalize"
                    >
                        {categories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="published_at">Publish Date (leave blank to save as draft)</Label>
                    <Input
                        id="published_at"
                        type="datetime-local"
                        value={data.published_at}
                        onChange={(e) => setData('published_at', e.target.value)}
                    />
                    {errors.published_at && <p className="text-xs text-destructive">{errors.published_at}</p>}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(checked) => setData('is_featured', checked === true)} />
                <Label htmlFor="is_featured">Featured post</Label>
            </div>

            <Button type="submit" disabled={processing} className="bg-brand-green font-bold hover:bg-brand-green-dark">
                {processing && <Spinner />}
                {submitLabel}
            </Button>
        </form>
    );
}
