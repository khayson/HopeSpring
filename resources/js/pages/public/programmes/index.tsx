import { DonationBand } from '@/components/public/donation-band';
import { PageHero } from '@/components/public/page-hero';
import { ProgrammeCard } from '@/components/public/programme-card';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import PublicLayout from '@/layouts/public/public-layout';
import { getIcon } from '@/lib/icon-map';
import { pageHeroes } from '@/lib/page-heroes';
import { Head } from '@inertiajs/react';

type Programme = {
    id: number;
    title: string;
    slug: string;
    description: string;
    icon: string;
    photo: string | null;
    projects_count: number;
};

type Props = {
    programmes: Programme[];
};

export default function ProgrammesIndex({ programmes }: Props) {
    return (
        <PublicLayout currentPath="/programmes">
            <Head title="Our Programmes — HopeSpring Foundation" />

            <PageHero
                title="Our Programmes"
                subtitle="Four focus areas creating lasting, sustainable change in communities across Ghana."
                image={pageHeroes.programmes}
            />

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="mb-10 text-center">
                    <p className="mx-auto max-w-2xl text-muted-foreground">
                        We operate across four key programme areas, each designed to create lasting, sustainable impact in the communities we serve.
                    </p>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    {programmes.map((p, i) => (
                        <ScrollReveal key={p.id} delay={i * 50}>
                            <ProgrammeCard
                                title={p.title}
                                description={p.description}
                                icon={getIcon(p.icon)}
                                image={p.photo ?? undefined}
                                href={`/programmes/${p.slug}`}
                            />
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            <DonationBand />
        </PublicLayout>
    );
}
