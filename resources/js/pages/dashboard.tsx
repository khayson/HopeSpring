import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { CircleDollarSign, FileText, Heart, Mail, Newspaper, Users } from 'lucide-react';

type Stats = {
    totalDonations: number;
    donationCount: number;
    subscriberCount: number;
    unreadMessages: number;
    projectCount: number;
    postCount: number;
};

type Donation = {
    id: number;
    donor_name: string;
    donor_email: string;
    amount: number;
    currency: string;
    programme: string | null;
    is_anonymous: boolean;
    created_at: string;
};

type Message = {
    id: number;
    name: string;
    email: string;
    subject: string;
    is_read: boolean;
    created_at: string;
};

type Post = {
    id: number;
    title: string;
    slug: string;
    published_at: string | null;
    is_featured: boolean;
};

type Props = {
    stats: Stats;
    recentDonations: Donation[];
    recentMessages: Message[];
    recentPosts: Post[];
};

function formatCurrency(pesewas: number): string {
    return `GHS ${(pesewas / 100).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`;
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

const statCards = [
    { key: 'totalDonations', label: 'Total Donations', icon: CircleDollarSign, format: (v: number) => formatCurrency(v), color: 'text-emerald-600 bg-emerald-50' },
    { key: 'donationCount', label: 'Donations', icon: Heart, format: (v: number) => v.toLocaleString(), color: 'text-rose-600 bg-rose-50' },
    { key: 'subscriberCount', label: 'Subscribers', icon: Users, format: (v: number) => v.toLocaleString(), color: 'text-blue-600 bg-blue-50' },
    { key: 'unreadMessages', label: 'Unread Messages', icon: Mail, format: (v: number) => v.toLocaleString(), color: 'text-amber-600 bg-amber-50' },
    { key: 'projectCount', label: 'Projects', icon: FileText, format: (v: number) => v.toLocaleString(), color: 'text-purple-600 bg-purple-50' },
    { key: 'postCount', label: 'Published Posts', icon: Newspaper, format: (v: number) => v.toLocaleString(), color: 'text-cyan-600 bg-cyan-50' },
] as const;

export default function Dashboard({ stats, recentDonations, recentMessages, recentPosts }: Props) {
    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 lg:p-6">
                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        const value = stats[card.key];
                        return (
                            <div key={card.key} className="rounded-xl border border-sidebar-border/70 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                                    <div className={`rounded-lg p-2 ${card.color}`}>
                                        <Icon className="size-4" />
                                    </div>
                                </div>
                                <p className="mt-2 text-2xl font-bold tracking-tight">{card.format(value)}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Donations */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <h2 className="font-semibold">Recent Donations</h2>
                        </div>
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {recentDonations.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-muted-foreground">No donations yet.</p>
                            ) : (
                                recentDonations.map((donation) => (
                                    <div key={donation.id} className="flex items-center justify-between px-5 py-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">
                                                {donation.is_anonymous ? 'Anonymous Donor' : donation.donor_name}
                                            </p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {donation.programme || 'General Fund'} &middot; {timeAgo(donation.created_at)}
                                            </p>
                                        </div>
                                        <span className="ml-3 shrink-0 text-sm font-bold text-emerald-600">
                                            {formatCurrency(donation.amount)}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Messages */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <h2 className="font-semibold">Recent Messages</h2>
                        </div>
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {recentMessages.length === 0 ? (
                                <p className="px-5 py-8 text-center text-sm text-muted-foreground">No messages yet.</p>
                            ) : (
                                recentMessages.map((msg) => (
                                    <div key={msg.id} className="flex items-start gap-3 px-5 py-3">
                                        {!msg.is_read && (
                                            <span className="mt-1.5 inline-block size-2 shrink-0 rounded-full bg-blue-500" />
                                        )}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-medium">{msg.subject}</p>
                                            <p className="truncate text-xs text-muted-foreground">
                                                {msg.name} ({msg.email}) &middot; {timeAgo(msg.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Posts */}
                <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
                    <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                        <h2 className="font-semibold">Recent Posts</h2>
                    </div>
                    <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                        {recentPosts.length === 0 ? (
                            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No posts yet.</p>
                        ) : (
                            recentPosts.map((post) => (
                                <div key={post.id} className="flex items-center justify-between px-5 py-3">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="truncate text-sm font-medium">{post.title}</p>
                                            {post.is_featured && (
                                                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {post.published_at
                                                ? new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : 'Draft'}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/news/${post.slug}`}
                                        className="ml-3 shrink-0 text-xs font-medium text-blue-600 hover:underline"
                                    >
                                        View
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
