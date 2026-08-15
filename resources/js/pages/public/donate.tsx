import { Head, Link, usePage } from '@inertiajs/react';
import { AlertCircle, Check, Heart, Loader2, Shield } from 'lucide-react';
import { useState } from 'react';
import { BrushEdge } from '@/components/public/brush-edge';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import { store as storeDonation } from '@/routes/donate';

type Programme = {
    id: number;
    title: string;
    slug: string;
    description: string;
    photo: string | null;
};
type FundraisingEvent = {
    id: number;
    title: string;
    slug: string;
    description: string;
    photo: string | null;
    starts_at: string;
};

type Props = {
    programmes: Programme[];
    events: FundraisingEvent[];
    selectedProgrammeId: number | null;
    selectedEventId: number | null;
    defaultHeroImage?: string;
    settings: Record<string, string>;
};

const presetAmounts = [50, 100, 200, 500, 1000, 2500];
const GENERAL_FUND = 'general';

const impactCopy: Record<number, string> = {
    50: 'Clean water for a family for a month',
    100: 'School materials for one child for a term',
    200: 'Essential supplies for a community health visit',
    500: 'A village health screening day',
    1000: 'A full year of schooling for one child',
    2500: 'A meaningful share of a community borehole',
};

type DonationState = 'idle' | 'submitting' | 'success' | 'error';

function destinationValue(
    programmeId: number | null,
    eventId: number | null,
): string {
    if (programmeId) {
        return `programme:${programmeId}`;
    }

    if (eventId) {
        return `event:${eventId}`;
    }

    return GENERAL_FUND;
}

function resolveHero(
    destination: string,
    programmes: Programme[],
    events: FundraisingEvent[],
    defaultHeroImage: string,
): {
    image: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    pageTitle: string;
} {
    if (destination.startsWith('programme:')) {
        const id = Number(destination.slice('programme:'.length));
        const programme = programmes.find((item) => item.id === id);

        if (programme) {
            return {
                image: defaultHeroImage,
                eyebrow: 'Support this programme',
                title: `Support ${programme.title}`,
                subtitle: programme.description,
                pageTitle: `Donate to ${programme.title} — HopeSpring Foundation`,
            };
        }
    }

    if (destination.startsWith('event:')) {
        const id = Number(destination.slice('event:'.length));
        const event = events.find((item) => item.id === id);

        if (event) {
            return {
                image: defaultHeroImage,
                eyebrow: 'Support this event',
                title: `Support ${event.title}`,
                subtitle: event.description,
                pageTitle: `Donate to ${event.title} — HopeSpring Foundation`,
            };
        }
    }

    return {
        image: defaultHeroImage,
        eyebrow: 'HopeSpring Foundation',
        title: 'Give where hope grows',
        subtitle:
            'Partner with us, support the mission, and help transform lives. Direct your gift to a focus area you care about.',
        pageTitle: 'Donate — HopeSpring Foundation',
    };
}

export default function Donate({
    programmes,
    events,
    selectedProgrammeId,
    selectedEventId,
    defaultHeroImage = pageHeroes.donate,
    settings,
}: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>()
        .props;
    const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
    const [customAmount, setCustomAmount] = useState('');
    const [destination, setDestination] = useState(() =>
        destinationValue(selectedProgrammeId, selectedEventId),
    );
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [donorPhone, setDonorPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [state, setState] = useState<DonationState>(
        flash?.success ? 'success' : 'idle',
    );
    const [errorMessage, setErrorMessage] = useState(flash?.error || '');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const amount = customAmount ? Number(customAmount) : selectedAmount;
    const amountInPesewas = amount ? amount * 100 : 0;
    const hasDestinations = programmes.length > 0 || events.length > 0;
    const hero = resolveHero(destination, programmes, events, defaultHeroImage);

    const selectedLabel = (() => {
        if (destination.startsWith('programme:')) {
            const id = Number(destination.slice('programme:'.length));

            return (
                programmes.find((programme) => programme.id === id)?.title ??
                null
            );
        }

        if (destination.startsWith('event:')) {
            const id = Number(destination.slice('event:'.length));
            const event = events.find((item) => item.id === id);

            return event ? `Event: ${event.title}` : null;
        }

        return null;
    })();

    const impactText = (() => {
        if (!amount || amount <= 0) {
            return 'Choose an amount to see what your gift can do.';
        }

        if (impactCopy[amount]) {
            return impactCopy[amount];
        }

        if (amount < 50) {
            return 'Every gift joins a larger effort to impact lives globally.';
        }

        if (amount < 100) {
            return 'Helps strengthen community outreach where need is greatest.';
        }

        if (amount < 500) {
            return 'Supports youth empowerment, health & wellness, and education.';
        }

        return 'Fuels people-centered solutions across our focus areas.';
    })();

    function parseDestination(value: string): {
        programme_id: number | null;
        event_id: number | null;
    } {
        if (value.startsWith('programme:')) {
            return {
                programme_id: Number(value.slice('programme:'.length)),
                event_id: null,
            };
        }

        if (value.startsWith('event:')) {
            return {
                programme_id: null,
                event_id: Number(value.slice('event:'.length)),
            };
        }

        return { programme_id: null, event_id: null };
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFieldErrors({});
        setErrorMessage('');

        if (!amount || amount <= 0) {
            setErrorMessage('Please select or enter a donation amount.');

            return;
        }

        if (!donorName.trim()) {
            setFieldErrors((prev) => ({
                ...prev,
                donor_name: 'Please enter your name.',
            }));

            return;
        }

        if (!donorEmail.trim()) {
            setFieldErrors((prev) => ({
                ...prev,
                donor_email: 'Please enter your email.',
            }));

            return;
        }

        setState('submitting');

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>(
                'meta[name="csrf-token"]',
            )?.content;
            const { programme_id, event_id } = parseDestination(destination);

            const response = await fetch(storeDonation.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                },
                body: JSON.stringify({
                    donor_name: donorName,
                    donor_email: donorEmail,
                    donor_phone: donorPhone || null,
                    amount: amountInPesewas,
                    programme_id,
                    event_id,
                    message: message || null,
                    is_anonymous: isAnonymous,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422 && data.errors) {
                    const errors: Record<string, string> = {};

                    for (const [key, msgs] of Object.entries(data.errors)) {
                        errors[key] = (msgs as string[])[0];
                    }

                    setFieldErrors(errors);
                    setState('idle');

                    return;
                }

                throw new Error(
                    data.message || 'Payment initialization failed.',
                );
            }

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error('No payment URL returned.');
            }
        } catch (err) {
            setState('error');
            setErrorMessage(
                err instanceof Error
                    ? err.message
                    : 'Something went wrong. Please try again.',
            );
        }
    }

    if (state === 'success' || flash?.success) {
        return (
            <PublicLayout currentPath="/donate">
                <Head title="Thank You — HopeSpring Foundation" />
                <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-navy-dark">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{
                            background:
                                'radial-gradient(ellipse at 20% 20%, oklch(0.56 0.15 145 / 0.35), transparent 50%), radial-gradient(ellipse at 80% 70%, oklch(0.79 0.15 75 / 0.2), transparent 45%)',
                        }}
                    />
                    <div className="relative z-10 mx-auto max-w-2xl px-4 py-24 text-center md:px-6">
                        <div className="mx-auto mb-6 flex size-16 animate-in items-center justify-center rounded-full bg-brand-green/20 text-brand-green-light duration-500 zoom-in-95">
                            <Check className="size-8" strokeWidth={2.5} />
                        </div>
                        <p className="font-serif text-sm font-semibold tracking-[0.2em] text-brand-gold uppercase">
                            HopeSpring Foundation
                        </p>
                        <h1 className="mt-4 animate-in font-serif text-4xl font-bold text-white duration-700 fade-in-0 slide-in-from-bottom-2 md:text-5xl">
                            Thank you
                        </h1>
                        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/70">
                            {flash?.success ||
                                'Thank you for joining us in impacting lives globally.'}
                        </p>
                        <Button
                            asChild
                            size="lg"
                            className="mt-10 bg-brand-green font-bold hover:bg-brand-green-dark"
                        >
                            <Link href={home.url()}>Return home</Link>
                        </Button>
                    </div>
                </section>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout currentPath="/donate">
            <Head title={hero.pageTitle} />

            <section className="relative overflow-hidden bg-navy-dark">
                <img
                    key={hero.image}
                    src={hero.image}
                    alt=""
                    className="absolute inset-0 size-full scale-105 animate-in object-cover duration-700 fade-in-0"
                    width={1600}
                    height={900}
                />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(115deg, oklch(0.18 0.05 258 / 0.88) 0%, oklch(0.22 0.06 258 / 0.72) 45%, oklch(0.24 0.06 258 / 0.45) 100%)',
                    }}
                />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(to top, oklch(0.18 0.05 258 / 0.75) 0%, transparent 55%)',
                    }}
                />
                <div
                    className="pointer-events-none absolute top-10 -right-24 size-80 rounded-full blur-3xl"
                    style={{ background: 'oklch(0.56 0.15 145 / 0.2)' }}
                />
                <div
                    className="pointer-events-none absolute bottom-0 -left-16 size-72 rounded-full blur-3xl"
                    style={{ background: 'oklch(0.79 0.15 75 / 0.14)' }}
                />

                <div className="relative z-10 mx-auto flex min-h-[48vh] max-w-7xl flex-col justify-end px-4 pt-28 pb-14 md:min-h-[56vh] md:px-6 md:pt-32 md:pb-16">
                    <p
                        key={`eyebrow-${hero.eyebrow}`}
                        className="animate-in font-serif text-sm font-semibold tracking-[0.22em] text-brand-gold uppercase duration-500 fade-in-0"
                    >
                        {hero.eyebrow}
                    </p>
                    <h1
                        key={`title-${hero.title}`}
                        className="mt-4 max-w-3xl animate-in font-serif text-4xl leading-[1.1] font-bold text-white duration-500 fade-in-0 slide-in-from-bottom-3 md:text-5xl lg:text-6xl"
                    >
                        {hero.title}
                    </h1>
                    <p
                        key={`subtitle-${hero.subtitle}`}
                        className="mt-5 max-w-xl animate-in text-base leading-relaxed text-white/70 duration-700 fade-in-0 slide-in-from-bottom-2 md:text-lg"
                    >
                        {hero.subtitle}
                    </p>
                    <div className="mt-8 animate-in duration-1000 fade-in-0">
                        <a
                            href="#give"
                            className="inline-flex items-center gap-2 bg-brand-green px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-green-dark"
                        >
                            <Heart className="size-4" fill="currentColor" />
                            Choose your gift
                        </a>
                    </div>
                </div>
            </section>

            <BrushEdge className="h-8 text-background md:h-12" />

            <section
                id="give"
                className="relative bg-background px-4 py-14 md:px-6 md:py-20"
            >
                <div
                    className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-60"
                    style={{
                        background:
                            'radial-gradient(ellipse at 50% 0%, oklch(0.56 0.15 145 / 0.08), transparent 65%)',
                    }}
                />

                <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-16">
                    <ScrollReveal>
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {(state === 'error' ||
                                errorMessage ||
                                flash?.error) && (
                                <div className="flex items-start gap-3 border-l-4 border-destructive bg-destructive/5 px-4 py-3">
                                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                                    <p className="text-sm text-destructive">
                                        {errorMessage || flash?.error}
                                    </p>
                                </div>
                            )}

                            {selectedLabel && (
                                <div className="flex items-center gap-3 border-l-4 border-brand-gold bg-brand-gold/10 px-4 py-3">
                                    <Heart
                                        className="size-4 shrink-0 text-brand-gold"
                                        fill="currentColor"
                                    />
                                    <p className="text-sm text-navy">
                                        Directing this gift to{' '}
                                        <span className="font-semibold">
                                            {selectedLabel}
                                        </span>
                                    </p>
                                </div>
                            )}

                            <div>
                                <div className="flex items-end justify-between gap-4">
                                    <div>
                                        <h2 className="font-serif text-2xl font-bold text-navy md:text-3xl">
                                            Choose an amount
                                        </h2>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            Amounts in Ghana Cedis (GHS)
                                        </p>
                                    </div>
                                    {amount && amount > 0 && (
                                        <p className="hidden font-serif text-2xl font-bold text-brand-green sm:block">
                                            GHS {amount.toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {presetAmounts.map((amt, index) => {
                                        const active =
                                            selectedAmount === amt &&
                                            !customAmount;

                                        return (
                                            <button
                                                key={amt}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedAmount(amt);
                                                    setCustomAmount('');
                                                }}
                                                className={cn(
                                                    'group relative overflow-hidden px-4 py-5 text-left transition-all duration-300',
                                                    active
                                                        ? 'bg-navy text-white shadow-lg shadow-navy/20'
                                                        : 'bg-secondary/70 text-navy hover:bg-secondary',
                                                )}
                                                style={{
                                                    transitionDelay: `${index * 20}ms`,
                                                }}
                                            >
                                                <span className="block text-xs font-semibold tracking-wider text-current/55 uppercase">
                                                    GHS
                                                </span>
                                                <span className="mt-1 block font-serif text-2xl font-bold tabular-nums">
                                                    {amt.toLocaleString()}
                                                </span>
                                                {active && (
                                                    <span className="absolute inset-x-0 bottom-0 h-1 bg-brand-green" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-4">
                                    <Label
                                        htmlFor="custom-amount"
                                        className="sr-only"
                                    >
                                        Custom amount
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute top-1/2 left-4 -translate-y-1/2 text-sm font-bold text-muted-foreground">
                                            GHS
                                        </span>
                                        <Input
                                            id="custom-amount"
                                            type="number"
                                            min="1"
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setSelectedAmount(null);
                                            }}
                                            className="h-12 border-0 bg-secondary/70 pl-14 text-base shadow-none focus-visible:ring-brand-green"
                                            placeholder="Or enter a custom amount"
                                        />
                                    </div>
                                </div>

                                <p
                                    key={impactText}
                                    className="mt-5 animate-in text-sm leading-relaxed text-muted-foreground duration-300 fade-in-0 slide-in-from-bottom-1"
                                >
                                    <span className="font-semibold text-brand-green">
                                        Your impact:
                                    </span>{' '}
                                    {impactText}
                                </p>
                            </div>

                            {hasDestinations && (
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-navy">
                                        Where should it go?
                                    </h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Keep it flexible, or direct the gift to
                                        a programme or upcoming event.
                                    </p>

                                    <div className="mt-5 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDestination(GENERAL_FUND)
                                            }
                                            className={cn(
                                                'px-4 py-2 text-sm font-semibold transition-colors duration-200',
                                                destination === GENERAL_FUND
                                                    ? 'bg-brand-green text-white'
                                                    : 'bg-secondary text-navy hover:bg-secondary/80',
                                            )}
                                        >
                                            Where it&apos;s needed most
                                        </button>
                                        {programmes.map((programme) => {
                                            const value = `programme:${programme.id}`;

                                            return (
                                                <button
                                                    key={programme.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setDestination(value)
                                                    }
                                                    className={cn(
                                                        'px-4 py-2 text-sm font-semibold transition-colors duration-200',
                                                        destination === value
                                                            ? 'bg-navy text-white'
                                                            : 'bg-secondary text-navy hover:bg-secondary/80',
                                                    )}
                                                >
                                                    {programme.title}
                                                </button>
                                            );
                                        })}
                                        {events.map((event) => {
                                            const value = `event:${event.id}`;

                                            return (
                                                <button
                                                    key={event.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setDestination(value)
                                                    }
                                                    className={cn(
                                                        'px-4 py-2 text-sm font-semibold transition-colors duration-200',
                                                        destination === value
                                                            ? 'bg-navy text-white'
                                                            : 'bg-secondary text-navy hover:bg-secondary/80',
                                                    )}
                                                >
                                                    {event.title}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {(fieldErrors.programme_id ||
                                        fieldErrors.event_id) && (
                                        <p className="mt-2 text-xs text-destructive">
                                            {fieldErrors.programme_id ||
                                                fieldErrors.event_id}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div>
                                <h3 className="font-serif text-xl font-bold text-navy">
                                    Your details
                                </h3>
                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="donor-name">
                                            Full name
                                        </Label>
                                        <Input
                                            id="donor-name"
                                            value={donorName}
                                            onChange={(e) =>
                                                setDonorName(e.target.value)
                                            }
                                            placeholder="Your full name"
                                            required
                                            className="h-11 border-0 bg-secondary/70 shadow-none focus-visible:ring-brand-green"
                                        />
                                        {fieldErrors.donor_name && (
                                            <p className="text-xs text-destructive">
                                                {fieldErrors.donor_name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="donor-email">
                                            Email
                                        </Label>
                                        <Input
                                            id="donor-email"
                                            type="email"
                                            value={donorEmail}
                                            onChange={(e) =>
                                                setDonorEmail(e.target.value)
                                            }
                                            placeholder="you@example.com"
                                            required
                                            className="h-11 border-0 bg-secondary/70 shadow-none focus-visible:ring-brand-green"
                                        />
                                        {fieldErrors.donor_email && (
                                            <p className="text-xs text-destructive">
                                                {fieldErrors.donor_email}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="donor-phone">
                                            Phone (optional)
                                        </Label>
                                        <Input
                                            id="donor-phone"
                                            type="tel"
                                            value={donorPhone}
                                            onChange={(e) =>
                                                setDonorPhone(e.target.value)
                                            }
                                            placeholder="+233 24 123 4567"
                                            className="h-11 border-0 bg-secondary/70 shadow-none focus-visible:ring-brand-green"
                                        />
                                        {fieldErrors.donor_phone && (
                                            <p className="text-xs text-destructive">
                                                {fieldErrors.donor_phone}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="donation-message">
                                            Message (optional)
                                        </Label>
                                        <textarea
                                            id="donation-message"
                                            value={message}
                                            onChange={(e) =>
                                                setMessage(e.target.value)
                                            }
                                            placeholder="Share why you're giving..."
                                            rows={3}
                                            className="flex w-full rounded-md border-0 bg-secondary/70 px-3 py-2 text-sm shadow-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:outline-none"
                                        />
                                    </div>
                                </div>

                                <label className="mt-5 flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) =>
                                            setIsAnonymous(e.target.checked)
                                        }
                                        className="size-4 rounded border-input text-brand-green focus:ring-brand-green"
                                    />
                                    <span className="text-sm text-muted-foreground">
                                        Make this donation anonymous
                                    </span>
                                </label>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="h-12 w-full bg-brand-green text-base font-bold hover:bg-brand-green-dark sm:w-auto sm:min-w-64"
                                    disabled={
                                        !amount ||
                                        amount <= 0 ||
                                        state === 'submitting'
                                    }
                                >
                                    {state === 'submitting' ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Connecting to Paystack…
                                        </>
                                    ) : (
                                        <>
                                            <Heart
                                                className="size-4"
                                                fill="currentColor"
                                            />
                                            Donate
                                            {amount
                                                ? ` GHS ${amount.toLocaleString()}`
                                                : ''}
                                        </>
                                    )}
                                </Button>
                                <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <Shield className="size-3.5" />
                                    Secure checkout via Paystack · Card, MoMo,
                                    and bank transfer
                                </p>
                            </div>
                        </form>
                    </ScrollReveal>

                    <ScrollReveal delay={120} className="lg:pt-2">
                        <aside className="relative overflow-hidden bg-navy px-7 py-8 text-white md:px-8 md:py-10">
                            <div
                                className="pointer-events-none absolute -top-20 -right-16 size-48 rounded-full blur-3xl"
                                style={{
                                    background: 'oklch(0.56 0.15 145 / 0.35)',
                                }}
                            />
                            <div
                                className="pointer-events-none absolute -bottom-24 -left-10 size-56 rounded-full blur-3xl"
                                style={{
                                    background: 'oklch(0.79 0.15 75 / 0.2)',
                                }}
                            />

                            <div className="relative">
                                <p className="text-xs font-bold tracking-[0.18em] text-brand-gold uppercase">
                                    Why give
                                </p>
                                <h2 className="mt-3 font-serif text-2xl leading-snug font-bold md:text-3xl">
                                    Join us in impacting lives globally
                                </h2>
                                <p className="mt-4 text-sm leading-relaxed text-white/70">
                                    Partner with us, support the mission, and
                                    help transform lives through empowerment,
                                    support, and sustainable development.
                                </p>

                                <div className="mt-8 space-y-8 border-t border-white/10 pt-8">
                                    {settings.donation_goal && (
                                        <p className="text-sm text-white/60">
                                            Campaign goal{' '}
                                            <span className="font-semibold text-brand-gold-light">
                                                GHS{' '}
                                                {Number(
                                                    settings.donation_goal,
                                                ).toLocaleString()}
                                            </span>
                                        </p>
                                    )}

                                    <ul className="space-y-5">
                                        <li>
                                            <p className="font-serif text-lg font-semibold text-brand-green-light">
                                                Community Outreach
                                            </p>
                                            <p className="mt-1 text-sm text-white/60">
                                                People-centered support that
                                                meets real needs where they are.
                                            </p>
                                        </li>
                                        <li>
                                            <p className="font-serif text-lg font-semibold text-brand-green-light">
                                                Youth Empowerment
                                            </p>
                                            <p className="mt-1 text-sm text-white/60">
                                                Skills, confidence, and
                                                opportunity for the next
                                                generation.
                                            </p>
                                        </li>
                                        <li>
                                            <p className="font-serif text-lg font-semibold text-brand-green-light">
                                                Health & Education
                                            </p>
                                            <p className="mt-1 text-sm text-white/60">
                                                Wellness and learning pathways
                                                that open access to opportunity.
                                            </p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </aside>
                    </ScrollReveal>
                </div>
            </section>
        </PublicLayout>
    );
}
