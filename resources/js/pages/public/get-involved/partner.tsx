import { Head } from '@inertiajs/react';
import { InquiryForm } from '@/components/public/inquiry-form';
import { PageHero } from '@/components/public/page-hero';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';

export default function PartnerInquiry() {
    return (
        <PublicLayout currentPath="/get-involved">
            <Head title="Partner With Us — HopeSpring Foundation" />

            <PageHero
                title="Partner With Us"
                subtitle="Collaborate as a corporate or institutional partner to multiply our impact across Ghana."
                image={pageHeroes.partner}
                breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Get Involved', href: '/get-involved' }, { label: 'Partner' }]}
            />

            <section className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
                <InquiryForm type="partner" />
            </section>
        </PublicLayout>
    );
}
