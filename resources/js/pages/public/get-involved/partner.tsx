import { InquiryForm } from '@/components/public/inquiry-form';
import { PageHero } from '@/components/public/page-hero';
import PublicLayout from '@/layouts/public/public-layout';
import { Head } from '@inertiajs/react';

export default function PartnerInquiry() {
    return (
        <PublicLayout currentPath="/get-involved">
            <Head title="Partner With Us — HopeSpring Foundation" />

            <PageHero title="Partner With Us" />

            <section className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
                <p className="mb-8 text-center text-muted-foreground">
                    Collaborate with us as a corporate or institutional partner to multiply our impact. Share a few
                    details about your organisation and proposed partnership.
                </p>
                <InquiryForm type="partner" />
            </section>
        </PublicLayout>
    );
}
