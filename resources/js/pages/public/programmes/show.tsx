import { DonationBand } from '@/components/public/donation-band';
import { PageHero } from '@/components/public/page-hero';
import { ProjectCard } from '@/components/public/project-card';
import PublicLayout from '@/layouts/public/public-layout';
import { getIcon } from '@/lib/icon-map';
import { Head } from '@inertiajs/react';

type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    photo: string | null;
    status: string;
};

type Programme = {
    id: number;
    title: string;
    slug: string;
    description: string;
    long_description: string | null;
    icon: string;
    photo: string | null;
    projects: Project[];
};

type Props = {
    programme: Programme;
};

export default function ProgrammeShow({ programme }: Props) {
    const Icon = getIcon(programme.icon);

    return (
        <PublicLayout currentPath="/programmes">
            <Head title={`${programme.title} — HopeSpring Foundation`} />

            <PageHero title={programme.title} image={programme.photo ?? undefined} />

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-6 flex size-14 items-center justify-center rounded-full bg-brand-green">
                        <Icon className="size-7 text-white" />
                    </div>
                    <p className="text-lg leading-relaxed text-muted-foreground">{programme.description}</p>
                    {programme.long_description && (
                        <div className="mt-6 text-base leading-relaxed text-muted-foreground">
                            {programme.long_description}
                        </div>
                    )}
                </div>
            </section>

            {programme.projects.length > 0 && (
                <section className="bg-secondary/50 px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-7xl">
                        <h2 className="mb-10 text-center font-serif text-3xl font-bold text-navy">
                            Projects Under {programme.title}
                        </h2>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {programme.projects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    title={project.title}
                                    description={project.description}
                                    location={project.location}
                                    image={project.photo ?? undefined}
                                    href={`/projects/${project.slug}`}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <DonationBand />
        </PublicLayout>
    );
}
