import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import {
    index as donationsIndex,
} from '@/routes/admin/donations';

type Donation = {
    id: number;
    donor_name: string;
    donor_email: string;
    donor_phone: string | null;
    amount: number;
    currency: string;
    reference: string;
    method: string;
    status: string;
    is_recurring: boolean;
    programme: string | null;
    message: string | null;
    is_anonymous: boolean;
    created_at: string;
};

type Props = { donation: Donation };

function formatCurrency(pesewas: number): string {
    return `GHS ${(pesewas / 100).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
}

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

const statusColors: Record<string, string> = {
    success: 'bg-emerald-100 text-emerald-800',
    pending: 'bg-amber-100 text-amber-800',
    failed: 'bg-rose-100 text-rose-800',
};

const rows: { label: string; key: keyof Donation }[] = [
    { label: 'Donor Name', key: 'donor_name' },
    { label: 'Email', key: 'donor_email' },
    { label: 'Phone', key: 'donor_phone' },
    { label: 'Reference', key: 'reference' },
    { label: 'Method', key: 'method' },
    { label: 'Programme', key: 'programme' },
];

export default function DonationShow({ donation }: Props) {
    const displayName = donation.is_anonymous
        ? 'Anonymous Donor'
        : donation.donor_name;

    return (
        <>
            <Head title={`Donation — ${donation.reference}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <Link
                        href={donationsIndex.url()}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to donations
                    </Link>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                                {formatCurrency(donation.amount)}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {displayName} · {donation.reference} ·{' '}
                                {formatDate(donation.created_at)}
                            </p>
                        </div>
                        <span
                            className={cn(
                                'rounded-full px-3 py-1 text-xs font-bold uppercase',
                                statusColors[donation.status] ?? 'bg-secondary',
                            )}
                        >
                            {donation.status}
                        </span>
                    </div>
                </div>

                <div className="max-w-2xl rounded-2xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <dl className="grid gap-4 sm:grid-cols-2">
                        {rows.map(({ label, key }) => (
                            <div key={key}>
                                <dt className="text-xs font-medium text-muted-foreground uppercase">
                                    {label}
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {key === 'donor_name'
                                        ? displayName
                                        : donation[key]?.toString() || '—'}
                                </dd>
                            </div>
                        ))}
                        <div>
                            <dt className="text-xs font-medium text-muted-foreground uppercase">
                                Recurring
                            </dt>
                            <dd className="mt-1 text-sm">
                                {donation.is_recurring ? 'Yes' : 'No'}
                            </dd>
                        </div>
                    </dl>

                    {donation.message && (
                        <div className="mt-6 border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                            <dt className="text-xs font-medium text-muted-foreground uppercase">
                                Message
                            </dt>
                            <dd className="mt-1 text-sm leading-relaxed whitespace-pre-line">
                                {donation.message}
                            </dd>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

DonationShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Donations', href: donationsIndex.url() },
        { title: 'Detail', href: '#' },
    ],
};
