import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { dashboard } from '@/routes';
import {
    edit as settingsEdit,
    update as settingsUpdate,
} from '@/routes/admin/settings';

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

const groupHints: Record<string, string> = {
    general: 'Site-wide identity and fundraising goal.',
    home: 'Hero, values, and homepage storytelling.',
    about: 'Mission, vision, and partners copy.',
    contact: 'How visitors reach HopeSpring.',
    social: 'Public social profile links.',
    payment: 'Payment provider configuration.',
};

const textareaKeys = new Set([
    'home_hero_subtitle',
    'home_about_body',
    'home_banner_text',
    'about_mission',
    'about_vision',
    'about_partners_intro',
    'about_partners_empty_message',
    'home_value_1_description',
    'home_value_2_description',
    'home_value_3_description',
    'home_value_4_description',
    'home_value_5_description',
    'about_who_we_are',
    'contact_address',
]);

function labelFor(key: string): string {
    return key
        .replace(/^home_/, '')
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

function isImageKey(key: string): boolean {
    return key.includes('image') || key.includes('photo') || key.includes('logo');
}

export default function SettingsIndex({ settings, impactStats }: Props) {
    const flat = Object.values(settings).reduce<Record<string, string>>(
        (acc, group) => {
            for (const [key, value] of Object.entries(group)) {
                acc[key] = value ?? '';
            }

            return acc;
        },
        {},
    );

    const { data, setData, put, processing, recentlySuccessful } = useForm<{
        settings: Record<string, string>;
        impact_stats: Array<{
            id: number;
            label: string;
            value: number;
            suffix: string;
        }>;
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
        put(settingsUpdate.url());
    }

    function updateSetting(key: string, value: string) {
        setData('settings', {
            ...data.settings,
            [key]: value,
        });
    }

    function updateImpactStat(
        index: number,
        field: 'label' | 'value' | 'suffix',
        value: string,
    ) {
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
        const order = [
            'general',
            'home',
            'about',
            'contact',
            'social',
            'payment',
        ];

        return order.indexOf(a) - order.indexOf(b);
    });

    return (
        <>
            <Head title="Site Settings" />
            <form
                onSubmit={handleSubmit}
                className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6"
            >
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                            Site Settings
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Edit homepage copy, images, impact stats, and
                            site-wide settings.
                        </p>
                    </div>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        {processing && <Spinner />}
                        Save Changes
                    </Button>
                </div>

                {recentlySuccessful && (
                    <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        Settings saved.
                    </p>
                )}

                {orderedGroups.map(([group, fields]) => (
                    <section
                        key={group}
                        className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900"
                    >
                        <div className="mb-5">
                            <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                                {groupLabels[group] ?? group}
                            </h2>
                            {groupHints[group] && (
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {groupHints[group]}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {Object.keys(fields).map((key) => {
                                const isWide =
                                    textareaKeys.has(key) || isImageKey(key);
                                const value = data.settings[key] ?? '';

                                return (
                                    <div
                                        key={key}
                                        className={`space-y-2 ${isWide ? 'sm:col-span-2' : ''}`}
                                    >
                                        <Label htmlFor={key}>
                                            {labelFor(key)}
                                        </Label>
                                        {textareaKeys.has(key) ? (
                                            <textarea
                                                id={key}
                                                rows={3}
                                                value={value}
                                                onChange={(e) =>
                                                    updateSetting(
                                                        key,
                                                        e.target.value,
                                                    )
                                                }
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                            />
                                        ) : (
                                            <Input
                                                id={key}
                                                value={value}
                                                onChange={(e) =>
                                                    updateSetting(
                                                        key,
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={
                                                    isImageKey(key)
                                                        ? '/storage/... or https://...'
                                                        : undefined
                                                }
                                            />
                                        )}
                                        {isImageKey(key) && value && (
                                            <div className="overflow-hidden rounded-xl border border-sidebar-border/70 bg-muted/30">
                                                <img
                                                    src={value}
                                                    alt={`${labelFor(key)} preview`}
                                                    className="max-h-48 w-full object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}

                {data.impact_stats.length > 0 && (
                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="mb-5">
                            <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                                Impact Stats
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Numbers highlighted across the public site.
                            </p>
                        </div>
                        <div className="space-y-4">
                            {data.impact_stats.map((stat, index) => (
                                <div
                                    key={stat.id}
                                    className="grid gap-3 rounded-xl border border-sidebar-border/60 p-4 sm:grid-cols-3"
                                >
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`stat-label-${stat.id}`}
                                        >
                                            Label
                                        </Label>
                                        <Input
                                            id={`stat-label-${stat.id}`}
                                            value={stat.label}
                                            onChange={(e) =>
                                                updateImpactStat(
                                                    index,
                                                    'label',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`stat-value-${stat.id}`}
                                        >
                                            Value
                                        </Label>
                                        <Input
                                            id={`stat-value-${stat.id}`}
                                            type="number"
                                            min={0}
                                            value={stat.value}
                                            onChange={(e) =>
                                                updateImpactStat(
                                                    index,
                                                    'value',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor={`stat-suffix-${stat.id}`}
                                        >
                                            Suffix
                                        </Label>
                                        <Input
                                            id={`stat-suffix-${stat.id}`}
                                            value={stat.suffix}
                                            placeholder="+"
                                            onChange={(e) =>
                                                updateImpactStat(
                                                    index,
                                                    'suffix',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <div className="sticky bottom-0 z-10 -mx-4 border-t border-sidebar-border/70 bg-background/95 px-4 py-4 backdrop-blur lg:-mx-6 lg:px-6">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-muted-foreground">
                            Changes apply across the public site after save.
                        </p>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-brand-green font-bold hover:bg-brand-green-dark"
                        >
                            {processing && <Spinner />}
                            Save Changes
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
}

SettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Settings', href: settingsEdit.url() },
    ],
};
