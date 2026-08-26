import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { TeamForm } from '@/components/admin/team-form';
import { dashboard } from '@/routes';
import {
    create as teamCreate,
    index as teamIndex,
    store as teamStore,
} from '@/routes/admin/team';

type Props = {
    types: { value: string; label: string }[];
};

export default function TeamCreate({ types }: Props) {
    return (
        <>
            <Head title="Add team member" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <Link
                        href={teamIndex.url()}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Back to team
                    </Link>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Add person
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Add a photo and profile for Leadership, Our Team, or the
                        Board of Directors.
                    </p>
                </div>
                <TeamForm
                    types={types}
                    action={teamStore.url()}
                    method="post"
                    submitLabel="Add to About page"
                    cancelHref={teamIndex.url()}
                />
            </div>
        </>
    );
}

TeamCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Team', href: teamIndex.url() },
        { title: 'New', href: teamCreate.url() },
    ],
};
