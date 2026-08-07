import { BrushEdge } from '@/components/public/brush-edge';
import { PageHero } from '@/components/public/page-hero';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicLayout from '@/layouts/public/public-layout';
import { cn } from '@/lib/utils';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, Check, Heart, Loader2, Shield } from 'lucide-react';
import { useState } from 'react';

type Programme = { id: number; title: string; slug: string };

type Props = {
    programmes: Programme[];
    settings: Record<string, string>;
};

const presetAmounts = [50, 100, 200, 500, 1000, 2500];

type DonationState = 'idle' | 'submitting' | 'success' | 'error';

export default function Donate({ programmes, settings }: Props) {
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;
    const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
    const [customAmount, setCustomAmount] = useState('');
    const [selectedProgramme, setSelectedProgramme] = useState('');
    const [donorName, setDonorName] = useState('');
    const [donorEmail, setDonorEmail] = useState('');
    const [donorPhone, setDonorPhone] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [state, setState] = useState<DonationState>(flash?.success ? 'success' : 'idle');
    const [errorMessage, setErrorMessage] = useState(flash?.error || '');
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const amount = customAmount ? Number(customAmount) : selectedAmount;
    const amountInPesewas = amount ? amount * 100 : 0;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFieldErrors({});
        setErrorMessage('');

        if (!amount || amount <= 0) {
            setErrorMessage('Please select or enter a donation amount.');
            return;
        }

        if (!donorName.trim()) {
            setFieldErrors((prev) => ({ ...prev, donor_name: 'Please enter your name.' }));
            return;
        }

        if (!donorEmail.trim()) {
            setFieldErrors((prev) => ({ ...prev, donor_email: 'Please enter your email.' }));
            return;
        }

        setState('submitting');

        try {
            const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

            const response = await fetch('/donate', {
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
                    programme: selectedProgramme || null,
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
                throw new Error(data.message || 'Payment initialization failed.');
            }

            if (data.authorization_url) {
                window.location.href = data.authorization_url;
            } else {
                throw new Error('No payment URL returned.');
            }
        } catch (err) {
            setState('error');
            setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        }
    }

    if (state === 'success' || flash?.success) {
        return (
            <PublicLayout currentPath="/donate">
                <Head title="Thank You — HopeSpring Foundation" />
                <PageHero title="Thank You!" />
                <BrushEdge className="h-8 text-background md:h-12" />
                <section className="mx-auto max-w-2xl px-4 py-16 text-center md:py-24">
                    <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-brand-green/10">
                        <Check className="size-8 text-brand-green" />
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-navy">Your Donation Was Successful!</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {flash?.success || 'Thank you for your generous contribution to HopeSpring Foundation. Your support helps transform lives across Ghana.'}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                        A confirmation has been sent to your email address.
                    </p>
                    <Button
                        asChild
                        size="lg"
                        className="mt-8 bg-brand-green font-bold hover:bg-brand-green-dark"
                    >
                        <a href="/">Return Home</a>
                    </Button>
                </section>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout currentPath="/donate">
            <Head title="Donate — HopeSpring Foundation" />

            <PageHero title="Make a Donation" />
            <BrushEdge className="h-8 text-background md:h-12" />

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="grid gap-12 lg:grid-cols-5">
                    {/* Donation Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="rounded-xl bg-white p-8 shadow-md">
                            <h2 className="font-serif text-2xl font-bold text-navy">Choose an Amount</h2>
                            <p className="mt-2 text-sm text-muted-foreground">All amounts are in Ghana Cedis (GHS)</p>

                            {/* Error banner */}
                            {(state === 'error' || errorMessage || flash?.error) && (
                                <div className="mt-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                                    <p className="text-sm text-destructive">{errorMessage || flash?.error}</p>
                                </div>
                            )}

                            {/* Preset Amounts */}
                            <div className="mt-6 grid grid-cols-3 gap-3">
                                {presetAmounts.map((amt) => (
                                    <button
                                        key={amt}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAmount(amt);
                                            setCustomAmount('');
                                        }}
                                        className={cn(
                                            'rounded-lg border-2 px-4 py-3 text-center font-bold transition-colors',
                                            selectedAmount === amt && !customAmount
                                                ? 'border-brand-green bg-brand-green/10 text-brand-green'
                                                : 'border-border text-navy hover:border-brand-green/50',
                                        )}
                                    >
                                        GHS {amt}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Amount */}
                            <div className="mt-4 space-y-2">
                                <Label htmlFor="custom-amount">Or enter a custom amount</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">
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
                                        className="pl-12"
                                        placeholder="Enter amount"
                                    />
                                </div>
                            </div>

                            {/* Donor Information */}
                            <div className="mt-8 border-t border-border pt-8">
                                <h3 className="font-serif text-lg font-bold text-navy">Your Information</h3>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="donor-name">Full Name *</Label>
                                        <Input
                                            id="donor-name"
                                            value={donorName}
                                            onChange={(e) => setDonorName(e.target.value)}
                                            placeholder="Your full name"
                                            required
                                        />
                                        {fieldErrors.donor_name && (
                                            <p className="text-xs text-destructive">{fieldErrors.donor_name}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="donor-email">Email Address *</Label>
                                        <Input
                                            id="donor-email"
                                            type="email"
                                            value={donorEmail}
                                            onChange={(e) => setDonorEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                        />
                                        {fieldErrors.donor_email && (
                                            <p className="text-xs text-destructive">{fieldErrors.donor_email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <Label htmlFor="donor-phone">Phone Number (optional)</Label>
                                    <Input
                                        id="donor-phone"
                                        type="tel"
                                        value={donorPhone}
                                        onChange={(e) => setDonorPhone(e.target.value)}
                                        placeholder="+233 24 123 4567"
                                    />
                                    {fieldErrors.donor_phone && (
                                        <p className="text-xs text-destructive">{fieldErrors.donor_phone}</p>
                                    )}
                                </div>
                            </div>

                            {/* Programme Selection */}
                            {programmes.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    <Label htmlFor="programme">Direct your donation (optional)</Label>
                                    <select
                                        id="programme"
                                        value={selectedProgramme}
                                        onChange={(e) => setSelectedProgramme(e.target.value)}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="">Where it&apos;s needed most</option>
                                        {programmes.map((p) => (
                                            <option key={p.id} value={p.title}>
                                                {p.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Message */}
                            <div className="mt-4 space-y-2">
                                <Label htmlFor="donation-message">Leave a message (optional)</Label>
                                <textarea
                                    id="donation-message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Share why you're giving..."
                                    rows={3}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>

                            {/* Anonymous */}
                            <label className="mt-4 flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="size-4 rounded border-input text-brand-green focus:ring-brand-green"
                                />
                                <span className="text-sm text-muted-foreground">Make this donation anonymous</span>
                            </label>

                            {/* Submit */}
                            <Button
                                type="submit"
                                size="lg"
                                className="mt-8 w-full bg-brand-green font-bold hover:bg-brand-green-dark"
                                disabled={!amount || amount <= 0 || state === 'submitting'}
                            >
                                {state === 'submitting' ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <Heart className="size-4" />
                                        Donate GHS {amount || 0}
                                    </>
                                )}
                            </Button>

                            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                <Shield className="size-3.5" />
                                Secure payment powered by Paystack
                            </p>
                        </form>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="rounded-xl border border-border bg-secondary/50 p-6">
                            <h3 className="font-serif text-lg font-bold text-navy">Your Impact</h3>
                            <ul className="mt-4 space-y-4 text-sm text-muted-foreground">
                                <li className="flex gap-3">
                                    <span className="font-bold text-brand-green">GHS 50</span>
                                    <span>Provides clean water to a family for a month</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-brand-green">GHS 100</span>
                                    <span>Supplies school materials for one child for a term</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-brand-green">GHS 500</span>
                                    <span>Funds a health screening for an entire village</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-brand-green">GHS 1,000</span>
                                    <span>Sponsors a child&apos;s education for a full year</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="font-bold text-brand-green">GHS 2,500</span>
                                    <span>Contributes to a community water borehole project</span>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-6 rounded-xl border border-border bg-white p-6">
                            <h3 className="font-serif text-lg font-bold text-navy">Payment Methods</h3>
                            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                                <p className="flex items-center gap-2">
                                    <span className="inline-block size-2 rounded-full bg-brand-green" />
                                    Credit / Debit Card (Visa, Mastercard)
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="inline-block size-2 rounded-full bg-brand-green" />
                                    Mobile Money (MTN, Vodafone, AirtelTigo)
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="inline-block size-2 rounded-full bg-brand-green" />
                                    Bank Transfer
                                </p>
                            </div>
                        </div>

                        {settings.donation_goal && (
                            <div className="mt-6 rounded-xl border border-border bg-white p-6">
                                <h3 className="font-serif text-lg font-bold text-navy">Fundraising Goal</h3>
                                <p className="mt-2 text-2xl font-bold text-brand-green">
                                    GHS {Number(settings.donation_goal).toLocaleString()}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">Help us reach our target</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
