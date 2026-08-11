import { Head } from '@inertiajs/react';
import { InquiryForm } from '@/components/public/inquiry-form';
import { PageHero } from '@/components/public/page-hero';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';

export default function VolunteerInquiry() {
    return (
        <PublicLayout currentPath="/get-involved">
            <Head title="Volunteer With Us — HopeSpring Foundation" />

            <PageHero
                title="Volunteer With Us"
                subtitle="Join our team and directly impact the communities we serve. Tell us about yourself and we'll reach out."
                image={pageHeroes.volunteer}
                breadcrumbs={[
                    { label: 'Home', href: '/' },
                    { label: 'Get Involved', href: '/get-involved' },
                    { label: 'Volunteer' },
                ]}
            />

            <section className="mx-auto max-w-2xl px-4 py-16 md:px-6 md:py-24">
                <InquiryForm type="volunteer" />
            </section>
        </PublicLayout>
    );
}
