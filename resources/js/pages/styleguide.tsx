import { BrushEdge } from '@/components/public/brush-edge';
import { DonationBand } from '@/components/public/donation-band';
import { StatsBar } from '@/components/public/stats-bar';
import { Button } from '@/components/ui/button';
import { Head, Link } from '@inertiajs/react';

const colors = [
    { label: 'Navy', class: 'bg-navy', hex: '#1a2f5c' },
    { label: 'Navy Dark', class: 'bg-navy-dark', hex: '#152447' },
    { label: 'Navy Light', class: 'bg-navy-light', hex: '#3a4f7c' },
    { label: 'Green', class: 'bg-brand-green', hex: '#5fa93d' },
    { label: 'Green Light', class: 'bg-brand-green-light', hex: '#7fc95c' },
    { label: 'Green Dark', class: 'bg-brand-green-dark', hex: '#4a8930' },
    { label: 'Gold', class: 'bg-brand-gold', hex: '#f0a938' },
    { label: 'Gold Light', class: 'bg-brand-gold-light', hex: '#f5c76a' },
    { label: 'Blue', class: 'bg-brand-blue', hex: '#3f8fd9' },
    { label: 'Blue Light', class: 'bg-brand-blue-light', hex: '#6cb0e8' },
];

const semanticColors = [
    { label: 'Primary', bg: 'bg-primary', fg: 'text-primary-foreground' },
    { label: 'Secondary', bg: 'bg-secondary', fg: 'text-secondary-foreground' },
    { label: 'Accent', bg: 'bg-accent', fg: 'text-accent-foreground' },
    { label: 'Muted', bg: 'bg-muted', fg: 'text-muted-foreground' },
    { label: 'Destructive', bg: 'bg-destructive', fg: 'text-destructive-foreground' },
    { label: 'Success', bg: 'bg-success', fg: 'text-success-foreground' },
    { label: 'Warning', bg: 'bg-warning', fg: 'text-warning-foreground' },
    { label: 'Info', bg: 'bg-info', fg: 'text-info-foreground' },
];

function ColorSwatch({ label, className, hex }: { label: string; className: string; hex?: string }) {
    return (
        <div className="space-y-2">
            <div className={`h-20 w-full rounded-lg border border-border ${className}`} />
            <p className="text-sm font-semibold">{label}</p>
            {hex && <p className="font-mono text-xs text-muted-foreground">{hex}</p>}
        </div>
    );
}

function SemanticSwatch({ label, bg, fg }: { label: string; bg: string; fg: string }) {
    return (
        <div className={`flex items-center justify-center rounded-lg p-6 ${bg}`}>
            <span className={`text-sm font-semibold ${fg}`}>{label}</span>
        </div>
    );
}

export default function Styleguide() {
    return (
        <>
            <Head title="Design Tokens — Styleguide" />
            <div className="mx-auto max-w-5xl space-y-16 px-6 py-12">
                <header>
                    <h1 className="font-serif text-4xl font-bold text-foreground">
                        HopeSpring Design Tokens
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground">
                        Direction A — "The Founder&apos;s Mark"
                    </p>
                </header>

                {/* Typography */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">Typography</h2>
                    <div className="space-y-4 rounded-xl border border-border bg-card p-8">
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Display — Lora (serif)
                            </p>
                            <p className="font-serif text-5xl font-bold">
                                Transforming Lives Together
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Heading 1 — Lora
                            </p>
                            <h1 className="font-serif text-4xl font-bold">
                                Clean Water for Every Community
                            </h1>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Heading 2 — Lora
                            </p>
                            <h2 className="font-serif text-3xl font-semibold">Our Programmes</h2>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Heading 3 — Lora
                            </p>
                            <h3 className="font-serif text-2xl font-semibold">Impact Report 2026</h3>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Body — Mulish (sans-serif)
                            </p>
                            <p className="max-w-prose text-base leading-relaxed">
                                HopeSpring Foundation was born out of a simple act of compassion — a
                                torn school bag held together with pride by a child in Accra. Today, we
                                serve over 25,000 lives across Ghana through clean water, education,
                                healthcare, and community development programmes.
                            </p>
                        </div>
                        <div>
                            <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Small / Caption — Mulish
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Last updated 6 August 2026 · East Legon, Accra
                            </p>
                        </div>
                    </div>
                </section>

                {/* Brand Colors */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Brand Palette
                    </h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {colors.map((c) => (
                            <ColorSwatch key={c.label} label={c.label} className={c.class} hex={c.hex} />
                        ))}
                    </div>
                </section>

                {/* Semantic Colors */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Semantic Tokens
                    </h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {semanticColors.map((c) => (
                            <SemanticSwatch key={c.label} {...c} />
                        ))}
                    </div>
                </section>

                {/* Surface & Card */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Surfaces
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl border border-border bg-background p-6">
                            <p className="text-sm font-semibold">Background</p>
                            <p className="text-xs text-muted-foreground">bg-background</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-6">
                            <p className="text-sm font-semibold text-card-foreground">Card</p>
                            <p className="text-xs text-muted-foreground">bg-card</p>
                        </div>
                        <div className="rounded-xl bg-navy p-6">
                            <p className="text-sm font-semibold text-white">Navy Surface</p>
                            <p className="text-xs text-white/60">bg-navy</p>
                        </div>
                    </div>
                </section>

                {/* Spacing & Radius */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Border Radius
                    </h2>
                    <div className="flex items-end gap-6">
                        <div className="space-y-2 text-center">
                            <div className="h-16 w-16 rounded-sm border-2 border-primary bg-secondary" />
                            <p className="text-xs text-muted-foreground">sm</p>
                        </div>
                        <div className="space-y-2 text-center">
                            <div className="h-16 w-16 rounded-md border-2 border-primary bg-secondary" />
                            <p className="text-xs text-muted-foreground">md</p>
                        </div>
                        <div className="space-y-2 text-center">
                            <div className="h-16 w-16 rounded-lg border-2 border-primary bg-secondary" />
                            <p className="text-xs text-muted-foreground">lg</p>
                        </div>
                        <div className="space-y-2 text-center">
                            <div className="h-16 w-16 rounded-xl border-2 border-primary bg-secondary" />
                            <p className="text-xs text-muted-foreground">xl</p>
                        </div>
                        <div className="space-y-2 text-center">
                            <div className="h-16 w-16 rounded-full border-2 border-primary bg-secondary" />
                            <p className="text-xs text-muted-foreground">full</p>
                        </div>
                    </div>
                </section>

                {/* Brush Edge */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Brush Edge — Signature Motif
                    </h2>
                    <div className="overflow-hidden rounded-xl">
                        <div className="bg-navy px-6 py-12 text-center">
                            <p className="font-serif text-2xl font-bold text-white">Hero Section</p>
                        </div>
                        <BrushEdge className="h-10 text-background" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Used once per screen at the hero-to-stats transition. Never as wallpaper.
                    </p>
                </section>

                {/* Stats Bar */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Stats Bar
                    </h2>
                    <div className="overflow-hidden rounded-xl">
                        <div className="bg-navy px-6 py-16" />
                        <StatsBar
                            stats={[
                                { value: 25000, label: 'Lives Impacted' },
                                { value: 50, label: 'Water Projects' },
                                { value: 3000, label: 'Children Supported' },
                                { value: 100, label: 'Communities Served' },
                            ]}
                        />
                    </div>
                </section>

                {/* Buttons */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Buttons
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button>Primary (Navy)</Button>
                        <Button className="bg-brand-green hover:bg-brand-green-dark">Donate Now</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="destructive">Destructive</Button>
                        <Button asChild variant="outline" className="border-navy font-semibold text-navy hover:bg-navy hover:text-white">
                            <Link href="#">Get Involved</Link>
                        </Button>
                    </div>
                </section>

                {/* Donation Band */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Donation Band
                    </h2>
                    <div className="-mx-6 overflow-hidden">
                        <DonationBand />
                    </div>
                </section>

                {/* Sidebar Preview */}
                <section className="space-y-6">
                    <h2 className="font-serif text-2xl font-semibold text-foreground">
                        Admin Sidebar
                    </h2>
                    <div className="max-w-xs overflow-hidden rounded-xl">
                        <div className="space-y-2 bg-sidebar p-6">
                            <p className="text-sm font-bold text-sidebar-foreground">Dashboard</p>
                            <div className="rounded-md bg-sidebar-accent px-3 py-2">
                                <p className="text-sm text-sidebar-accent-foreground">Donations</p>
                            </div>
                            <p className="px-3 text-sm text-sidebar-foreground/60">Events</p>
                            <p className="px-3 text-sm text-sidebar-foreground/60">Blog Posts</p>
                            <div className="border-t border-sidebar-border pt-4">
                                <div className="inline-block rounded-full bg-sidebar-primary px-3 py-1">
                                    <span className="text-xs font-bold text-sidebar-primary-foreground">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="border-t border-border pt-8 text-sm text-muted-foreground">
                    <p>
                        This styleguide is only available in the local environment. It documents the
                        design tokens for Direction A — "The Founder&apos;s Mark."
                    </p>
                </footer>
            </div>
        </>
    );
}
