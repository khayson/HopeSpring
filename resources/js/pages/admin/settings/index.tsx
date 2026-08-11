import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import { Head, useForm } from '@inertiajs/react';

type ImpactStat = {
    id: number;
    label: string;
    value: number;
    suffix: string | null;
    sort_order: number;
};

type Props = {
    settings: Record<string, Record<string, string | null>>;
    impactStats: ImpactStat[];
};

const groupLabels: Record<string, string> = {
    general: 'General',
    home: 'Home Page',
    about: 'About',
    contact: 'Contact',
    social: 'Social',
    payment: 'Payment',
};

const textareaKeys = new Set([
    'home_hero_subtitle',
    'home_about_body',
    'home_banner_text',
    'about_mission',
    'about_vision',
    'home_value_1_description',
    'home_value_2_description',
    'home_value_3_description',
    'home_value_4_description',
    'contact_address',
]);

function labelFor(key: string): string {
    return key
        .replace(/^home_/, '')
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export default function SettingsIndex({ settings, impactStats }: Props) {
    const flat = Object.values(settings).reduce<Record<string, string>>((acc, group) => {
        for (const [key, value] of Object.entries(group)) {
            acc[key] = value ?? '';
        }

        return acc;
    }, {});

    const { data, setData, put, processing, recentlySuccessful } = useForm<{
        settings: Record<string, string>;
        impact_stats: Array<{ id: number; label: string; value: number; suffix: string }>;
    }>({
        settings: flat,
        impact_stats: impactStats.map((stat) => ({
            id: stat.id,
            label: stat.label,
            value: stat.value,
            suffix: stat.suffix ?? '',
        })),
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put('/admin/settings');
    }

    function updateImpactStat(index: number, field: 'label' | 'value' | 'suffix', value: string) {
        const next = data.impact_stats.map((stat, i) => {
            if (i !== index) {
                return stat;
            }

            if (field === 'value') {
                return { ...stat, value: Number(value) || 0 };
            }

            return { ...stat, [field]: value };
        });

        setData('impact_stats', next);
    }

    const orderedGroups = Object.entries(settings).sort(([a], [b]) => {
        const order = ['general', 'home', 'about', 'contact', 'social', 'payment'];
        return order.indexOf(a) - order.indexOf(b);
    });

    return (
        <>
            <Head title="Site Settings" />
            <form onSubmit={handleSubmit} className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">Site Settings</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Edit homepage copy, images, impact stats, and site-wide settings.
                        </p>
                    </div>
                    <Button type="submit" disabled={processing} className="bg-brand-green font-bold hover:bg-brand-green-dark">
                        {processing && <Spinner />}
                        Save Changes
                    </Button>
                </div>

                {recentlySuccessful && <p className="text-sm font-medium text-emerald-600">Settings saved.</p>}

                {orderedGroups.map(([group, fields]) => (
                    <div key={group} className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h2 className="mb-4 text-sm font-bold tracking-wide text-muted-foreground uppercase">
                            {groupLabels[group] ?? group}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {Object.keys(fields).map((key) => {
                                const isWide = textareaKeys.has(key) || key.includes('image') || key.includes('body');

                                return (
                                    <div key={key} className={`space-y-2 ${isWide ? 'sm:col-span-2' : ''}`}>
                                        <Label htmlFor={key}>{labelFor(key)}</Label>
                                        {textareaKeys.has(key) ? (
                                            <textarea
                                                id={key}
                                                rows={3}
                                                value={data.settings[key] ?? ''}
                                                onChange={(e) =>
                                                    setData('settings', { ...data.settings, [key]: e.target.value })
                                                }
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            />
                                        ) : (
                                            <Input
                                                id={key}
                                                value={data.settings[key] ?? ''}
                                                onChange={(e) =>
                                                    setData('settings', { ...data.settings, [key]: e.target.value })
                                                }
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {data.impact_stats.length > 0 && (
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <h2 className="mb-4 text-sm font-bold tracking-wide text-muted-foreground uppercase">
                            Impact Stats
                        </h2>
                        <div className="space-y-4">
                            {data.impact_stats.map((stat, index) => (
                                <div key={stat.id} className="grid gap-3 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor={`stat-label-${stat.id}`}>Label</Label>
                                        <Input
                                            id={`stat-label-${stat.id}`}
                                            value={stat.label}
                                            onChange={(e) => updateImpactStat(index, 'label', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`stat-value-${stat.id}`}>Value</Label>
                                        <Input
                                            id={`stat-value-${stat.id}`}
                                            type="number"
                                            min={0}
                                            value={stat.value}
                                            onChange={(e) => updateImpactStat(index, 'value', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`stat-suffix-${stat.id}`}>Suffix</Label>
                                        <Input
                                            id={`stat-suffix-${stat.id}`}
                                            value={stat.suffix}
                                            placeholder="+"
                                            onChange={(e) => updateImpactStat(index, 'suffix', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
