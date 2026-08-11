import { DonationBand } from '@/components/public/donation-band';
import { PageHero } from '@/components/public/page-hero';
import { ProjectCard } from '@/components/public/project-card';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { pageHeroes } from '@/lib/page-heroes';
import { Head, Link } from '@inertiajs/react';

type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    photo: string | null;
    status: string;
    programme: { id: number; title: string; slug: string } | null;
};

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
};

type Props = {
    projects: PaginatedData<Project>;
};

export default function ProjectsIndex({ projects }: Props) {
    return (
        <PublicLayout currentPath="/projects">
            <Head title="Our Projects — HopeSpring Foundation" />

            <PageHero
                title="Our Projects"
                subtitle="See the impact of your support on the ground — real projects, real communities, real change."
                image={pageHeroes.projects}
            />

            <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.data.map((project, i) => (
                        <ScrollReveal key={project.id} delay={i * 50}>
                            <ProjectCard
                                title={project.title}
                                description={project.description}
                                location={project.location}
                                image={project.photo ?? undefined}
                                href={`/projects/${project.slug}`}
                            />
                        </ScrollReveal>
                    ))}
                </div>

                {/* Pagination */}
                {projects.last_page > 1 && (
                    <div className="mt-12 flex items-center justify-center gap-3">
                        {projects.prev_page_url && (
                            <Button asChild variant="outline">
                                <Link href={projects.prev_page_url}>Previous</Link>
                            </Button>
                        )}
                        <span className="text-sm text-muted-foreground">
                            Page {projects.current_page} of {projects.last_page}
                        </span>
                        {projects.next_page_url && (
                            <Button asChild variant="outline">
                                <Link href={projects.next_page_url}>Next</Link>
                            </Button>
                        )}
                    </div>
                )}
            </section>

            <DonationBand />
        </PublicLayout>
    );
}
