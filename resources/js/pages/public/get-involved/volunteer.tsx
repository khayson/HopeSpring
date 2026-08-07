import { InquiryForm } from '@/components/public/inquiry-form';
import { PageHero } from '@/components/public/page-hero';
import PublicLayout from '@/layouts/public/public-layout';
import { Head } from '@inertiajs/react';

export default function VolunteerInquiry() {
    return (
        <PublicLayout currentPath="/get-involved">
            <Head title="Volunteer With Us — HopeSpring Foundation" />

            <PageHero title="Volunteer With Us" />

            <section className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
                <p className="mb-8 text-center text-muted-foreground">
                    Join our team of dedicated volunteers and directly impact the communities we serve. Tell us a bit
                    about yourself and we&apos;ll reach out with opportunities that fit.
                </p>
                <InquiryForm type="volunteer" />
            </section>
        </PublicLayout>
    );
}
