import { Head, Link, router } from '@inertiajs/react';
import { Mail, Search } from 'lucide-react';
import { AdminStatCard } from '@/components/admin/stat-card';
import { Pagination } from '@/components/admin/pagination';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import {
    index as messagesIndex,
    show as messagesShow,
} from '@/routes/admin/messages';

const ALL = 'all';

type Message = {
    id: number;
    name: string;
    email: string;
    subject: string;
    is_read: boolean;
    created_at: string;
};

type Props = {
    messages: {
        data: Message[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string };
    stats: { total: number; unread: number; read: number };
};

function formatDate(value: string): string {
    return new Date(value).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

export default function MessagesIndex({ messages, filters, stats }: Props) {
    function filter(next: Partial<{ search: string; status: string }>) {
        router.get(
            messagesIndex.url(),
            {
                search: next.search ?? filters.search ?? '',
                status: next.status ?? filters.status ?? '',
            },
            { preserveState: true, replace: true },
        );
    }

    const activeStatus = filters.status || ALL;

    return (
        <>
            <Head title="Messages" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4 lg:p-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-navy dark:text-foreground">
                        Contact Messages
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Read and respond to enquiries from the public site.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <AdminStatCard
                        label="All messages"
                        value={stats.total}
                        hint="Every enquiry received"
                        active={activeStatus === ALL}
                        onClick={() => filter({ status: '' })}
                    />
                    <AdminStatCard
                        label="Unread"
                        value={stats.unread}
                        hint="Still need attention"
                        active={activeStatus === 'unread'}
                        onClick={() => filter({ status: 'unread' })}
                    />
                    <AdminStatCard
                        label="Read"
                        value={stats.read}
                        hint="Already reviewed"
                        active={activeStatus === 'read'}
                        onClick={() => filter({ status: 'read' })}
                    />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[220px] flex-1 sm:max-w-sm">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search name, email, or subject"
                            defaultValue={filters.search}
                            onChange={(e) => filter({ search: e.target.value })}
                            className="pl-9"
                        />
                    </div>
                    <Select
                        value={activeStatus}
                        onValueChange={(value) =>
                            filter({
                                status: value === ALL ? '' : value,
                            })
                        }
                    >
                        <SelectTrigger className="h-9 w-[160px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={ALL}>All statuses</SelectItem>
                            <SelectItem value="unread">Unread</SelectItem>
                            <SelectItem value="read">Read</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    {messages.data.length === 0 ? (
                        <div className="flex flex-col items-center px-6 py-16 text-center">
                            <div className="mb-4 rounded-2xl bg-brand-green/10 p-4 text-brand-green">
                                <Mail className="size-8" />
                            </div>
                            <h2 className="font-serif text-xl font-semibold text-navy dark:text-foreground">
                                No messages match
                            </h2>
                            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                                Adjust filters or wait for new contact form
                                submissions.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {messages.data.map((msg) => (
                                <Link
                                    key={msg.id}
                                    href={messagesShow.url(msg.id)}
                                    className="flex items-start gap-3 px-5 py-4 transition hover:bg-secondary/40"
                                >
                                    {!msg.is_read && (
                                        <span className="mt-2 inline-block size-2 shrink-0 rounded-full bg-blue-500" />
                                    )}
                                    <div
                                        className={cn(
                                            'min-w-0 flex-1',
                                            msg.is_read && 'pl-5',
                                        )}
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p
                                                className={cn(
                                                    'truncate text-sm font-semibold text-navy dark:text-foreground',
                                                    !msg.is_read && 'font-bold',
                                                )}
                                            >
                                                {msg.subject}
                                            </p>
                                            <span
                                                className={cn(
                                                    'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                                                    msg.is_read
                                                        ? 'bg-slate-100 text-slate-700'
                                                        : 'bg-blue-100 text-blue-800',
                                                )}
                                            >
                                                {msg.is_read ? 'Read' : 'Unread'}
                                            </span>
                                        </div>
                                        <p className="mt-1 truncate text-xs text-muted-foreground">
                                            {msg.name} · {msg.email}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {formatDate(msg.created_at)}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}
                    <Pagination links={messages.links} />
                </div>
            </div>
        </>
    );
}

MessagesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Messages', href: messagesIndex.url() },
    ],
};
