import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';

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

const rows: { label: string; key: keyof Donation }[] = [
    { label: 'Donor Name', key: 'donor_name' },
    { label: 'Email', key: 'donor_email' },
    { label: 'Phone', key: 'donor_phone' },
    { label: 'Reference', key: 'reference' },
    { label: 'Method', key: 'method' },
    { label: 'Programme', key: 'programme' },
];

export default function DonationShow({ donation }: Props) {
    return (
        <>
            <Head title={`Donation — ${donation.reference}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <Button asChild variant="outline" className="w-fit">
                    <Link href="/admin/donations">
                        <ArrowLeft className="size-4" />
                        Back to Donations
                    </Link>
                </Button>

                <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-xl font-bold">
                            {formatCurrency(donation.amount)}
                        </h1>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 capitalize">
                            {donation.status}
                        </span>
                    </div>

                    <dl className="grid gap-4 sm:grid-cols-2">
                        {rows.map(({ label, key }) => (
                            <div key={key}>
                                <dt className="text-xs font-medium text-muted-foreground uppercase">
                                    {label}
                                </dt>
                                <dd className="mt-1 text-sm">
                                    {donation[key]?.toString() || '—'}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    {donation.message && (
                        <div className="mt-6 border-t border-sidebar-border/70 pt-4 dark:border-sidebar-border">
                            <dt className="text-xs font-medium text-muted-foreground uppercase">
                                Message
                            </dt>
                            <dd className="mt-1 text-sm">{donation.message}</dd>
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
        { title: 'Donations', href: '/admin/donations' },
        { title: 'Detail', href: '#' },
    ],
};
