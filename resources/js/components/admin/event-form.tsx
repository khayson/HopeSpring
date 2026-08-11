import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

type EventFormData = {
    title: string;
    description: string;
    long_description: string;
    location: string;
    photo: string;
    starts_at: string;
    ends_at: string;
    is_featured: boolean;
};

type EventFormProps = {
    event?: Partial<EventFormData>;
    action: string;
    method: 'post' | 'put';
    submitLabel: string;
};

function toDatetimeLocal(value?: string): string {
    if (!value) {
return '';
}

    return value.slice(0, 16);
}

export function EventForm({ event, action, method, submitLabel }: EventFormProps) {
    const { data, setData, post, put, processing, errors } = useForm<EventFormData>({
        title: event?.title ?? '',
        description: event?.description ?? '',
        long_description: event?.long_description ?? '',
        location: event?.location ?? '',
        photo: event?.photo ?? '',
        starts_at: toDatetimeLocal(event?.starts_at),
        ends_at: toDatetimeLocal(event?.ends_at),
        is_featured: event?.is_featured ?? false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const submit = method === 'post' ? post : put;
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
                <Label htmlFor="description">Short Description</Label>
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={3}
                    required
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="long_description">Full Description (optional)</Label>
                <textarea
                    id="long_description"
                    value={data.long_description}
                    onChange={(e) => setData('long_description', e.target.value)}
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {errors.long_description && <p className="text-xs text-destructive">{errors.long_description}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} required />
                {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="photo">Photo URL (optional)</Label>
                <Input id="photo" value={data.photo} onChange={(e) => setData('photo', e.target.value)} placeholder="https://..." />
                {errors.photo && <p className="text-xs text-destructive">{errors.photo}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="starts_at">Starts At</Label>
                    <Input
                        id="starts_at"
                        type="datetime-local"
                        value={data.starts_at}
                        onChange={(e) => setData('starts_at', e.target.value)}
                        required
                    />
                    {errors.starts_at && <p className="text-xs text-destructive">{errors.starts_at}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ends_at">Ends At (optional)</Label>
                    <Input
                        id="ends_at"
                        type="datetime-local"
                        value={data.ends_at}
                        onChange={(e) => setData('ends_at', e.target.value)}
                    />
                    {errors.ends_at && <p className="text-xs text-destructive">{errors.ends_at}</p>}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <Checkbox id="is_featured" checked={data.is_featured} onCheckedChange={(checked) => setData('is_featured', checked === true)} />
                <Label htmlFor="is_featured">Featured event</Label>
            </div>

            <Button type="submit" disabled={processing} className="bg-brand-green font-bold hover:bg-brand-green-dark">
                {processing && <Spinner />}
                {submitLabel}
            </Button>
        </form>
    );
}
