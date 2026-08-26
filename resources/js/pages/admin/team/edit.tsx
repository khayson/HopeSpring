import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { TeamForm } from '@/components/admin/team-form';
import { dashboard } from '@/routes';
import { index as teamIndex, update as teamUpdate } from '@/routes/admin/team';

type TeamMember = {
    id: number;
    name: string;
    role: string;
    photo: string | null;
    bio: string | null;
    email: string | null;
    linkedin: string | null;
    type: string;
    sort_order: number;
    is_active: boolean;
};

type Props = {
    member: TeamMember;
    types: { value: string; label: string }[];
};

export default function TeamEdit({ member, types }: Props) {
    return (
        <>
            <Head title={`Edit — ${member.name}`} />
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
                        Edit {member.name}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update their photo, role, and About page section.
                    </p>
                </div>
                <TeamForm
                    member={member}
                    types={types}
                    action={teamUpdate.url(member.id)}
                    method="put"
                    submitLabel="Save Changes"
                    cancelHref={teamIndex.url()}
                />
            </div>
        </>
    );
}

TeamEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Team', href: teamIndex.url() },
        { title: 'Edit', href: '#' },
    ],
};
