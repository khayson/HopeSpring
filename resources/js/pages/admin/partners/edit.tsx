import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PartnerForm } from '@/components/admin/partner-form';
import { dashboard } from '@/routes';
import {
    index as partnersIndex,
    update as partnersUpdate,
} from '@/routes/admin/partners';

type Partner = {
    id: number;
    name: string;
    logo: string | null;
    url: string | null;
    sort_order: number;
    is_active: boolean;
};

type Props = { partner: Partner };

export default function PartnersEdit({ partner }: Props) {
    return (
        <>
            <Head title={`Edit — ${partner.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <Link
                        href={partnersIndex.url()}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to partners
                    </Link>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Edit Partner
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update logo, website link, and visibility settings.
                    </p>
                </div>
                <PartnerForm
                    partner={{
                        name: partner.name,
                        logo: partner.logo ?? '',
                        url: partner.url ?? '',
                        sort_order: partner.sort_order,
                        is_active: partner.is_active,
                    }}
                    action={partnersUpdate.url(partner.id)}
                    method="put"
                    submitLabel="Save Changes"
                    cancelHref={partnersIndex.url()}
                />
            </div>
        </>
    );
}

PartnersEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Partners', href: partnersIndex.url() },
        { title: 'Edit', href: '#' },
    ],
};
