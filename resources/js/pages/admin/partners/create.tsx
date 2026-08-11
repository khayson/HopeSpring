import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { PartnerForm } from '@/components/admin/partner-form';
import { dashboard } from '@/routes';
import {
    create as partnersCreate,
    index as partnersIndex,
    store as partnersStore,
} from '@/routes/admin/partners';

export default function PartnersCreate() {
    return (
        <>
            <Head title="New Partner" />
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
                        New Partner
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a partner logo and link for the About page.
                    </p>
                </div>
                <PartnerForm
                    action={partnersStore.url()}
                    method="post"
                    submitLabel="Create Partner"
                    cancelHref={partnersIndex.url()}
                />
            </div>
        </>
    );
}

PartnersCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Partners', href: partnersIndex.url() },
        { title: 'New', href: partnersCreate.url() },
    ],
};
