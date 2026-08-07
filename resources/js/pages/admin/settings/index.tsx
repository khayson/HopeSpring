import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { Head, useForm } from '@inertiajs/react';

type Props = {
    settings: Record<string, Record<string, string>>;
};

function labelFor(key: string): string {
    return key
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export default function SettingsIndex({ settings }: Props) {
    const flat = Object.values(settings).reduce<Record<string, string>>((acc, group) => ({ ...acc, ...group }), {});

    const { data, setData, put, processing, recentlySuccessful } = useForm<{ settings: Record<string, string> }>({
        settings: flat,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put('/admin/settings');
    }

    return (
        <>
            <Head title="Site Settings" />
            <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">Site Settings</h1>
                    <Button type="submit" disabled={processing} className="bg-brand-green font-bold hover:bg-brand-green-dark">
                        {processing && <Spinner />}
                        Save Changes
                    </Button>
                </div>

                {recentlySuccessful && <p className="text-sm font-medium text-emerald-600">Settings saved.</p>}

                {Object.entries(settings).map(([group, fields]) => (
                    <div key={group} className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">{group}</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {Object.keys(fields).map((key) => (
                                <div key={key} className="space-y-2">
                                    <Label htmlFor={key}>{labelFor(key)}</Label>
                                    <Input
                                        id={key}
                                        value={data.settings[key] ?? ''}
                                        onChange={(e) => setData('settings', { ...data.settings, [key]: e.target.value })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </form>
        </>
    );
}

SettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Settings', href: '/admin/settings' },
    ],
};
