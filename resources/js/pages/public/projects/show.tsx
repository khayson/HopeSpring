import { BrushEdge } from '@/components/public/brush-edge';
import { DonationBand } from '@/components/public/donation-band';
import { PageHero } from '@/components/public/page-hero';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public/public-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

type Programme = { id: number; title: string; slug: string };

type Project = {
    id: number;
    title: string;
    slug: string;
    description: string;
    long_description: string | null;
    location: string;
    photo: string | null;
    status: string;
    start_date: string | null;
    end_date: string | null;
    programme: Programme | null;
};

type Props = {
    project: Project;
};

const statusColors: Record<string, string> = {
    ongoing: 'bg-brand-green text-white',
    completed: 'bg-brand-blue text-white',
    upcoming: 'bg-brand-gold text-white',
};

export default function ProjectShow({ project }: Props) {
    return (
        <PublicLayout currentPath="/projects">
            <Head title={`${project.title} — HopeSpring Foundation`} />

            <PageHero title={project.title} image={project.photo ?? undefined} />
            <BrushEdge className="h-8 text-background md:h-12" />

            <article className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
                <div className="mb-8 flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusColors[project.status] ?? 'bg-muted text-muted-foreground'}`}>
                        {project.status}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="size-3.5" />
                        {project.location}
                    </span>
                    {project.start_date && (
                        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Calendar className="size-3.5" />
                            {new Date(project.start_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                            {project.end_date && ` — ${new Date(project.end_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}`}
                        </span>
                    )}
                </div>

                {project.programme && (
                    <p className="mb-6 text-sm text-muted-foreground">
                        Programme:{' '}
                        <Link href={`/programmes/${project.programme.slug}`} className="font-semibold text-brand-green hover:underline">
                            {project.programme.title}
                        </Link>
                    </p>
                )}

                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="text-lg leading-relaxed">{project.description}</p>
                    {project.long_description && (
                        <div className="mt-6">{project.long_description}</div>
                    )}
                </div>

                <div className="mt-12">
                    <Button asChild variant="outline" className="border-navy font-semibold text-navy hover:bg-navy hover:text-white">
                        <Link href="/projects">
                            <ArrowLeft className="size-4" />
                            Back to Projects
                        </Link>
                    </Button>
                </div>
            </article>

            <DonationBand />
        </PublicLayout>
    );
}
