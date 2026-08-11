import { Head, Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    ArrowDownRight,
    ArrowRight,
    ArrowUpRight,
    Building2,
    CalendarDays,
    CircleDollarSign,
    FileText,
    Handshake,
    Heart,
    Mail,
    Newspaper,
    Plus,
    Sparkles,
    TrendingUp,
    Users,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';

type Stats = {
    totalDonations: number | null;
    donationCount: number | null;
    monthRaised: number | null;
    lastMonthRaised: number | null;
    monthChangePct: number | null;
    pendingDonations: number | null;
    failedDonations: number | null;
    avgDonation: number | null;
    subscriberCount: number | null;
    unreadMessages: number | null;
    openInquiries: number | null;
    reviewedInquiries: number | null;
    projectCount: number;
    ongoingProjects: number;
    postCount: number | null;
    draftCount: number | null;
    upcomingEvents: number | null;
    activePartners: number | null;
};

type TrendPoint = {
    date: string;
    label: string;
    amount: number;
    count: number;
};

type Props = {
    user: { name: string; role: string; roleLabel: string };
    stats: Stats;
    donationTrend: TrendPoint[];
    donationBreakdown: {
        success: number;
        pending: number;
        failed: number;
        methods: { card: number; momo: number };
    } | null;
    topProgrammes: Array<{ name: string; amount: number; count: number }>;
    inquiryBreakdown: {
        volunteer: number;
        partner: number;
        byStatus: { new: number; reviewed: number; converted: number };
    } | null;
    contentHealth: {
        published: number;
        drafts: number;
        featured: number;
        projectsOngoing: number;
        projectsCompleted: number;
        projectsUpcoming: number;
    } | null;
    goal: { target: number; raised: number; progress: number } | null;
    upcomingEvents: Array<{
        id: number;
        title: string;
        slug: string;
        location: string;
        starts_at: string;
    }>;
    attention: Array<{ label: string; href: string; tone: string }>;
    activity: Array<{
        type: string;
        title: string;
        meta: string;
        href: string;
        at: string;
    }>;
    recentDonations: Array<{
        id: number;
        donor_name: string;
        amount: number;
        programme: string | null;
        is_anonymous: boolean;
        created_at: string;
        method: string;
        status: string;
    }>;
    recentMessages: Array<{
        id: number;
        name: string;
        email: string;
        subject: string;
        is_read: boolean;
        created_at: string;
    }>;
    recentInquiries: Array<{
        id: number;
        type: string;
        name: string;
        organisation: string | null;
        status: string;
        created_at: string;
    }>;
    recentPosts: Array<{
        id: number;
        title: string;
        slug: string;
        published_at: string | null;
        is_featured: boolean;
        category: string;
    }>;
    draftPosts: Array<{ id: number; title: string; updated_at: string }>;
};

function money(pesewas: number): string {
    return `GHS ${(pesewas / 100).toLocaleString('en-GH', {
        minimumFractionDigits: 2,
    })}`;
}

function compactMoney(pesewas: number): string {
    const value = pesewas / 100;

    if (value >= 1000) {
        return `GHS ${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
    }

    return `GHS ${value.toLocaleString('en-GH', { maximumFractionDigits: 0 })}`;
}

function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) {
        return 'just now';
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m ago`;
    }

    if (seconds < 86400) {
        return `${Math.floor(seconds / 3600)}h ago`;
    }

    if (seconds < 604800) {
        return `${Math.floor(seconds / 86400)}d ago`;
    }

    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function greetingForHour(hour: number): string {
    if (hour < 12) {
        return 'Good morning';
    }

    if (hour < 17) {
        return 'Good afternoon';
    }

    return 'Good evening';
}

function Panel({
    title,
    href,
    children,
    empty = false,
    action,
}: {
    title: string;
    href?: string;
    children: ReactNode;
    empty?: boolean;
    action?: ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-neutral-900">
            <div className="flex items-center justify-between gap-3 border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                <h2 className="font-serif text-lg font-semibold text-navy dark:text-foreground">
                    {title}
                </h2>
                <div className="flex items-center gap-3">
                    {action}
                    {href && (
                        <Link
                            href={href}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:underline"
                        >
                            View all
                            <ArrowRight className="size-3.5" />
                        </Link>
                    )}
                </div>
            </div>
            {empty ? (
                <p className="px-5 py-10 text-center text-sm text-muted-foreground">
                    Nothing here yet.
                </p>
            ) : (
                children
            )}
        </section>
    );
}

function Kpi({
    label,
    value,
    href,
    icon: Icon,
    hint,
    tone,
}: {
    label: string;
    value: string;
    href?: string;
    icon: LucideIcon;
    hint?: ReactNode;
    tone: string;
}) {
    const body = (
        <>
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-muted-foreground">
                    {label}
                </p>
                <div className={cn('rounded-lg p-2', tone)}>
                    <Icon className="size-4" />
                </div>
            </div>
            <p className="mt-3 font-serif text-2xl font-bold tracking-tight text-navy dark:text-foreground">
                {value}
            </p>
            {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                className="rounded-2xl border border-sidebar-border/70 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-green/40 hover:shadow-md dark:border-sidebar-border dark:bg-neutral-900"
            >
                {body}
            </Link>
        );
    }

    return (
        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
            {body}
        </div>
    );
}

function TrendChart({ points }: { points: TrendPoint[] }) {
    const max = Math.max(...points.map((point) => point.amount), 1);
    const total = points.reduce((sum, point) => sum + point.amount, 0);
    const gifts = points.reduce((sum, point) => sum + point.count, 0);

    return (
        <div className="p-5">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
                        Last 30 days
                    </p>
                    <p className="mt-1 font-serif text-2xl font-bold text-navy dark:text-foreground">
                        {money(total)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {gifts.toLocaleString()} successful gift
                        {gifts === 1 ? '' : 's'}
                    </p>
                </div>
            </div>
            <div className="flex h-40 items-end gap-1">
                {points.map((point) => {
                    const height = Math.max(4, (point.amount / max) * 100);

                    return (
                        <div
                            key={point.date}
                            className="group relative flex min-w-0 flex-1 flex-col items-center justify-end"
                            title={`${point.label}: ${money(point.amount)} (${point.count})`}
                        >
                            <div
                                className="w-full rounded-t-sm bg-brand-green/80 transition group-hover:bg-brand-green"
                                style={{ height: `${height}%` }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                <span>{points[0]?.label}</span>
                <span>{points[Math.floor(points.length / 2)]?.label}</span>
                <span>{points[points.length - 1]?.label}</span>
            </div>
        </div>
    );
}

function MeterRow({
    label,
    value,
    max,
    display,
}: {
    label: string;
    value: number;
    max: number;
    display: string;
}) {
    const width = max > 0 ? Math.max(4, (value / max) * 100) : 0;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
                <span className="truncate font-medium">{label}</span>
                <span className="shrink-0 text-muted-foreground">{display}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div
                    className="h-full rounded-full bg-brand-green"
                    style={{ width: `${width}%` }}
                />
            </div>
        </div>
    );
}

const toneClasses: Record<string, string> = {
    amber: 'bg-amber-50 text-amber-800 hover:bg-amber-100',
    sky: 'bg-sky-50 text-sky-800 hover:bg-sky-100',
    gold: 'bg-brand-gold/15 text-navy hover:bg-brand-gold/25',
    navy: 'bg-navy/10 text-navy hover:bg-navy/15',
    green: 'bg-brand-green/10 text-brand-green-dark hover:bg-brand-green/20',
};

const activityIcons: Record<string, LucideIcon> = {
    donation: CircleDollarSign,
    message: Mail,
    inquiry: Handshake,
    post: Newspaper,
};

export default function Dashboard({
    user,
    stats,
    donationTrend,
    donationBreakdown,
    topProgrammes,
    inquiryBreakdown,
    contentHealth,
    goal,
    upcomingEvents,
    attention,
    activity,
    recentDonations,
    recentMessages,
    recentInquiries,
    recentPosts,
    draftPosts,
}: Props) {
    const firstName = user.name.split(' ')[0] ?? user.name;
    const greeting = greetingForHour(new Date().getHours());
    const today = new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const change = stats.monthChangePct;
    const changeUp = (change ?? 0) >= 0;

    const quickActions = [
        {
            title: 'New story',
            description: 'Publish a community update',
            href: '/admin/posts/create',
            icon: Plus,
            roles: ['admin', 'editor'],
        },
        {
            title: 'New event',
            description: 'Schedule the next gathering',
            href: '/admin/events/create',
            icon: Sparkles,
            roles: ['admin', 'editor'],
        },
        {
            title: 'Add partner',
            description: 'Update the About logo strip',
            href: '/admin/partners/create',
            icon: Building2,
            roles: ['admin', 'editor'],
        },
        {
            title: 'Review inquiries',
            description: 'Volunteer & partner requests',
            href: '/admin/inquiries',
            icon: Handshake,
            roles: ['admin'],
        },
        {
            title: 'Donations ledger',
            description: 'Successful, pending & failed',
            href: '/admin/donations',
            icon: CircleDollarSign,
            roles: ['admin', 'finance'],
        },
        {
            title: 'Inbox',
            description: 'Contact form messages',
            href: '/admin/messages',
            icon: Mail,
            roles: ['admin'],
        },
    ].filter((action) => action.roles.includes(user.role));

    const programmeMax = Math.max(
        ...topProgrammes.map((programme) => programme.amount),
        1,
    );

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4 lg:p-6">
                <section className="relative overflow-hidden rounded-2xl bg-navy px-6 py-7 text-white md:px-8">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{
                            background:
                                'radial-gradient(circle at top right, oklch(0.65 0.16 145 / 0.45), transparent 45%), radial-gradient(circle at bottom left, oklch(0.82 0.14 75 / 0.18), transparent 40%)',
                        }}
                    />
                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs font-bold tracking-[0.18em] text-brand-green-light uppercase">
                                {user.roleLabel} command center
                            </p>
                            <h1 className="mt-2 font-serif text-3xl font-bold md:text-4xl">
                                {greeting}, {firstName}
                            </h1>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/75">
                                {today}. Live operations across donations,
                                content, inquiries, and partnerships.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button
                                asChild
                                className="bg-brand-green font-bold hover:bg-brand-green-dark"
                            >
                                <Link href="/">View public site</Link>
                            </Button>
                            {quickActions[0] && (
                                <Button
                                    asChild
                                    variant="outline"
                                    className="border-white/30 bg-transparent font-bold text-white hover:bg-white/10 hover:text-white"
                                >
                                    <Link href={quickActions[0].href}>
                                        {quickActions[0].title}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </section>

                {attention.length > 0 && (
                    <section className="rounded-2xl border border-amber-200/80 bg-amber-50/70 px-5 py-4 dark:border-amber-900/40 dark:bg-amber-950/20">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-xs font-bold tracking-[0.16em] text-amber-800 uppercase dark:text-amber-300">
                                Needs attention
                            </p>
                            <span className="text-xs text-amber-800/70 dark:text-amber-300/70">
                                {attention.length} item
                                {attention.length === 1 ? '' : 's'}
                            </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {attention.map((item) => (
                                <Link
                                    key={item.href + item.label}
                                    href={item.href}
                                    className={cn(
                                        'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition',
                                        toneClasses[item.tone] ??
                                            toneClasses.amber,
                                    )}
                                >
                                    {item.label}
                                    <ArrowRight className="size-3.5" />
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {stats.totalDonations !== null && (
                        <Kpi
                            label="Lifetime raised"
                            value={money(stats.totalDonations)}
                            href="/admin/donations"
                            icon={CircleDollarSign}
                            tone="bg-brand-green/10 text-brand-green"
                            hint={
                                stats.donationCount !== null
                                    ? `${stats.donationCount.toLocaleString()} successful gifts`
                                    : undefined
                            }
                        />
                    )}
                    {stats.monthRaised !== null && (
                        <Kpi
                            label="This month"
                            value={money(stats.monthRaised)}
                            href="/admin/donations"
                            icon={TrendingUp}
                            tone="bg-emerald-50 text-emerald-700"
                            hint={
                                change !== null ? (
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1 font-semibold',
                                            changeUp
                                                ? 'text-brand-green'
                                                : 'text-rose-600',
                                        )}
                                    >
                                        {changeUp ? (
                                            <ArrowUpRight className="size-3.5" />
                                        ) : (
                                            <ArrowDownRight className="size-3.5" />
                                        )}
                                        {Math.abs(change)}% vs last month
                                    </span>
                                ) : undefined
                            }
                        />
                    )}
                    {stats.avgDonation !== null && (
                        <Kpi
                            label="Average gift"
                            value={money(stats.avgDonation)}
                            href="/admin/donations"
                            icon={Heart}
                            tone="bg-rose-50 text-rose-600"
                            hint={
                                stats.pendingDonations !== null
                                    ? `${stats.pendingDonations} pending`
                                    : undefined
                            }
                        />
                    )}
                    {stats.unreadMessages !== null && (
                        <Kpi
                            label="Unread messages"
                            value={stats.unreadMessages.toLocaleString()}
                            href="/admin/messages"
                            icon={Mail}
                            tone="bg-amber-50 text-amber-700"
                        />
                    )}
                    {stats.openInquiries !== null && (
                        <Kpi
                            label="New inquiries"
                            value={stats.openInquiries.toLocaleString()}
                            href="/admin/inquiries"
                            icon={Handshake}
                            tone="bg-sky-50 text-sky-700"
                            hint={
                                stats.reviewedInquiries !== null
                                    ? `${stats.reviewedInquiries} under review`
                                    : undefined
                            }
                        />
                    )}
                    {stats.postCount !== null && (
                        <Kpi
                            label="Published stories"
                            value={stats.postCount.toLocaleString()}
                            href="/admin/posts"
                            icon={Newspaper}
                            tone="bg-navy/10 text-navy"
                            hint={
                                stats.draftCount !== null
                                    ? `${stats.draftCount} draft${stats.draftCount === 1 ? '' : 's'}`
                                    : undefined
                            }
                        />
                    )}
                    {stats.upcomingEvents !== null && (
                        <Kpi
                            label="Upcoming events"
                            value={stats.upcomingEvents.toLocaleString()}
                            href="/admin/events"
                            icon={CalendarDays}
                            tone="bg-brand-gold/15 text-brand-gold"
                        />
                    )}
                    {stats.activePartners !== null && (
                        <Kpi
                            label="Active partners"
                            value={stats.activePartners.toLocaleString()}
                            href="/admin/partners"
                            icon={Building2}
                            tone="bg-emerald-50 text-emerald-700"
                        />
                    )}
                    {stats.subscriberCount !== null && (
                        <Kpi
                            label="Newsletter"
                            value={stats.subscriberCount.toLocaleString()}
                            href="/admin/newsletter"
                            icon={Users}
                            tone="bg-blue-50 text-blue-700"
                        />
                    )}
                    <Kpi
                        label="Projects"
                        value={stats.projectCount.toLocaleString()}
                        href="/projects"
                        icon={FileText}
                        tone="bg-secondary text-navy"
                        hint={`${stats.ongoingProjects} ongoing`}
                    />
                </section>

                {goal && (
                    <section className="rounded-2xl border border-sidebar-border/70 bg-white p-5 dark:border-sidebar-border dark:bg-neutral-900">
                        <div className="flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
                                    Fundraising goal
                                </p>
                                <p className="mt-1 font-serif text-2xl font-bold text-navy dark:text-foreground">
                                    {money(goal.raised)}{' '}
                                    <span className="text-base font-medium text-muted-foreground">
                                        of {money(goal.target)}
                                    </span>
                                </p>
                            </div>
                            <p className="text-sm font-bold text-brand-green">
                                {goal.progress}%
                            </p>
                        </div>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-secondary">
                            <div
                                className="h-full rounded-full bg-brand-green transition-all"
                                style={{ width: `${goal.progress}%` }}
                            />
                        </div>
                    </section>
                )}

                <div className="grid gap-6 xl:grid-cols-3">
                    {donationTrend.length > 0 && (
                        <div className="xl:col-span-2">
                            <Panel title="Donation trend" href="/admin/donations">
                                <TrendChart points={donationTrend} />
                            </Panel>
                        </div>
                    )}

                    {(donationBreakdown || inquiryBreakdown || contentHealth) && (
                        <Panel title="Breakdowns">
                            <div className="space-y-6 p-5">
                                {donationBreakdown && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                            Donation status
                                        </p>
                                        <MeterRow
                                            label="Successful"
                                            value={donationBreakdown.success}
                                            max={Math.max(
                                                donationBreakdown.success +
                                                    donationBreakdown.pending +
                                                    donationBreakdown.failed,
                                                1,
                                            )}
                                            display={String(
                                                donationBreakdown.success,
                                            )}
                                        />
                                        <MeterRow
                                            label="Pending"
                                            value={donationBreakdown.pending}
                                            max={Math.max(
                                                donationBreakdown.success +
                                                    donationBreakdown.pending +
                                                    donationBreakdown.failed,
                                                1,
                                            )}
                                            display={String(
                                                donationBreakdown.pending,
                                            )}
                                        />
                                        <MeterRow
                                            label="Failed"
                                            value={donationBreakdown.failed}
                                            max={Math.max(
                                                donationBreakdown.success +
                                                    donationBreakdown.pending +
                                                    donationBreakdown.failed,
                                                1,
                                            )}
                                            display={String(
                                                donationBreakdown.failed,
                                            )}
                                        />
                                        <div className="flex gap-4 pt-1 text-xs text-muted-foreground">
                                            <span>
                                                Card:{' '}
                                                {donationBreakdown.methods.card}
                                            </span>
                                            <span>
                                                MoMo:{' '}
                                                {donationBreakdown.methods.momo}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {inquiryBreakdown && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                            Inquiries
                                        </p>
                                        <MeterRow
                                            label="Volunteer"
                                            value={inquiryBreakdown.volunteer}
                                            max={Math.max(
                                                inquiryBreakdown.volunteer +
                                                    inquiryBreakdown.partner,
                                                1,
                                            )}
                                            display={String(
                                                inquiryBreakdown.volunteer,
                                            )}
                                        />
                                        <MeterRow
                                            label="Partner"
                                            value={inquiryBreakdown.partner}
                                            max={Math.max(
                                                inquiryBreakdown.volunteer +
                                                    inquiryBreakdown.partner,
                                                1,
                                            )}
                                            display={String(
                                                inquiryBreakdown.partner,
                                            )}
                                        />
                                        <div className="flex flex-wrap gap-3 pt-1 text-xs text-muted-foreground">
                                            <span>
                                                New:{' '}
                                                {inquiryBreakdown.byStatus.new}
                                            </span>
                                            <span>
                                                Reviewed:{' '}
                                                {
                                                    inquiryBreakdown.byStatus
                                                        .reviewed
                                                }
                                            </span>
                                            <span>
                                                Converted:{' '}
                                                {
                                                    inquiryBreakdown.byStatus
                                                        .converted
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {contentHealth && (
                                    <div className="space-y-3">
                                        <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                            Content health
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-xl bg-secondary/60 p-3">
                                                <p className="text-xs text-muted-foreground">
                                                    Published
                                                </p>
                                                <p className="font-serif text-xl font-bold text-navy dark:text-foreground">
                                                    {contentHealth.published}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-secondary/60 p-3">
                                                <p className="text-xs text-muted-foreground">
                                                    Drafts
                                                </p>
                                                <p className="font-serif text-xl font-bold text-navy dark:text-foreground">
                                                    {contentHealth.drafts}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-secondary/60 p-3">
                                                <p className="text-xs text-muted-foreground">
                                                    Featured
                                                </p>
                                                <p className="font-serif text-xl font-bold text-navy dark:text-foreground">
                                                    {contentHealth.featured}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-secondary/60 p-3">
                                                <p className="text-xs text-muted-foreground">
                                                    Ongoing projects
                                                </p>
                                                <p className="font-serif text-xl font-bold text-navy dark:text-foreground">
                                                    {
                                                        contentHealth.projectsOngoing
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Panel>
                    )}
                </div>

                {quickActions.length > 0 && (
                    <section>
                        <h2 className="mb-3 font-serif text-lg font-semibold text-navy dark:text-foreground">
                            Quick actions
                        </h2>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {quickActions.map((action) => {
                                const Icon = action.icon;

                                return (
                                    <Link
                                        key={action.href}
                                        href={action.href}
                                        className="group flex items-start gap-4 rounded-2xl border border-sidebar-border/70 bg-white p-4 transition hover:border-brand-green/40 hover:shadow-md dark:border-sidebar-border dark:bg-neutral-900"
                                    >
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-brand-green-light">
                                            <Icon className="size-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-navy transition group-hover:text-brand-green dark:text-foreground">
                                                {action.title}
                                            </p>
                                            <p className="mt-0.5 text-sm text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        {stats.totalDonations !== null && (
                            <Panel
                                title="Recent donations"
                                href="/admin/donations"
                                empty={recentDonations.length === 0}
                            >
                                <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                    {recentDonations.map((donation) => (
                                        <Link
                                            key={donation.id}
                                            href={`/admin/donations/${donation.id}`}
                                            className="flex items-center justify-between px-5 py-3 transition hover:bg-secondary/40"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {donation.is_anonymous
                                                        ? 'Anonymous Donor'
                                                        : donation.donor_name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {donation.programme ||
                                                        'General Fund'}{' '}
                                                    · {donation.method} ·{' '}
                                                    {timeAgo(
                                                        donation.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <span className="ml-3 shrink-0 text-sm font-bold text-brand-green">
                                                {money(donation.amount)}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </Panel>
                        )}

                        {stats.unreadMessages !== null && (
                            <Panel
                                title="Inbox"
                                href="/admin/messages"
                                empty={recentMessages.length === 0}
                            >
                                <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                    {recentMessages.map((msg) => (
                                        <Link
                                            key={msg.id}
                                            href={`/admin/messages/${msg.id}`}
                                            className="flex items-start gap-3 px-5 py-3 transition hover:bg-secondary/40"
                                        >
                                            <span
                                                className={cn(
                                                    'mt-1.5 size-2 shrink-0 rounded-full',
                                                    msg.is_read
                                                        ? 'bg-transparent'
                                                        : 'bg-brand-green',
                                                )}
                                            />
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {msg.subject}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {msg.name} ·{' '}
                                                    {timeAgo(msg.created_at)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </Panel>
                        )}

                        {stats.openInquiries !== null && (
                            <Panel
                                title="Inquiries"
                                href="/admin/inquiries"
                                empty={recentInquiries.length === 0}
                            >
                                <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                    {recentInquiries.map((inquiry) => (
                                        <Link
                                            key={inquiry.id}
                                            href={`/admin/inquiries/${inquiry.id}`}
                                            className="flex items-center justify-between gap-3 px-5 py-3 transition hover:bg-secondary/40"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {inquiry.name}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {inquiry.type}
                                                    {inquiry.organisation
                                                        ? ` · ${inquiry.organisation}`
                                                        : ''}{' '}
                                                    ·{' '}
                                                    {timeAgo(
                                                        inquiry.created_at,
                                                    )}
                                                </p>
                                            </div>
                                            <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold tracking-wide text-navy uppercase">
                                                {inquiry.status}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </Panel>
                        )}

                        {stats.postCount !== null && (
                            <Panel
                                title="Stories"
                                href="/admin/posts"
                                empty={
                                    recentPosts.length === 0 &&
                                    draftPosts.length === 0
                                }
                            >
                                <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                    {recentPosts.map((post) => (
                                        <div
                                            key={post.id}
                                            className="flex items-center justify-between px-5 py-3"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-medium">
                                                        {post.title}
                                                    </p>
                                                    {post.is_featured && (
                                                        <span className="rounded bg-brand-gold/20 px-1.5 py-0.5 text-[10px] font-bold text-brand-gold uppercase">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    {post.category}
                                                    {post.published_at
                                                        ? ` · ${new Date(post.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
                                                        : ' · Draft'}
                                                </p>
                                            </div>
                                            <Link
                                                href={`/admin/posts/${post.id}/edit`}
                                                className="ml-3 shrink-0 text-xs font-semibold text-brand-green hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    ))}
                                    {draftPosts.length > 0 && (
                                        <div className="bg-secondary/30 px-5 py-3">
                                            <p className="mb-2 text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
                                                Drafts waiting
                                            </p>
                                            <div className="space-y-2">
                                                {draftPosts.map((draft) => (
                                                    <Link
                                                        key={draft.id}
                                                        href={`/admin/posts/${draft.id}/edit`}
                                                        className="block text-sm font-medium text-navy hover:text-brand-green dark:text-foreground"
                                                    >
                                                        {draft.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Panel>
                        )}
                    </div>

                    <div className="space-y-6">
                        {topProgrammes.length > 0 && (
                            <Panel title="Top programmes" href="/admin/donations">
                                <div className="space-y-4 p-5">
                                    {topProgrammes.map((programme) => (
                                        <MeterRow
                                            key={programme.name}
                                            label={programme.name}
                                            value={programme.amount}
                                            max={programmeMax}
                                            display={`${compactMoney(programme.amount)} · ${programme.count}`}
                                        />
                                    ))}
                                </div>
                            </Panel>
                        )}

                        {upcomingEvents.length > 0 && (
                            <Panel title="Coming up" href="/admin/events">
                                <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                    {upcomingEvents.map((event) => (
                                        <Link
                                            key={event.id}
                                            href={`/admin/events/${event.id}/edit`}
                                            className="block px-5 py-3 transition hover:bg-secondary/40"
                                        >
                                            <p className="text-sm font-medium">
                                                {event.title}
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {new Date(
                                                    event.starts_at,
                                                ).toLocaleDateString('en-GB', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}{' '}
                                                · {event.location}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </Panel>
                        )}

                        <Panel
                            title="Activity feed"
                            empty={activity.length === 0}
                        >
                            <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                                {activity.map((item, index) => {
                                    const Icon =
                                        activityIcons[item.type] ?? Sparkles;

                                    return (
                                        <Link
                                            key={`${item.href}-${index}`}
                                            href={item.href}
                                            className="flex items-start gap-3 px-5 py-3 transition hover:bg-secondary/40"
                                        >
                                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                                                <Icon className="size-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium">
                                                    {item.title}
                                                </p>
                                                <p className="truncate text-xs text-muted-foreground">
                                                    {item.meta} ·{' '}
                                                    {timeAgo(item.at)}
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </Panel>
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
