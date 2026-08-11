<?php

namespace App\Support;

use App\Enums\UserRole;
use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\Event;
use App\Models\Inquiry;
use App\Models\NewsletterSubscriber;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\User;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class AdminDashboard
{
    /**
     * @return array<string, mixed>
     */
    public static function for(User $user): array
    {
        $role = $user->role;
        $canSeeFinances = in_array($role, [UserRole::Admin, UserRole::Finance], true);
        $isAdmin = $role === UserRole::Admin;
        $canManageContent = in_array($role, [UserRole::Admin, UserRole::Editor], true);

        $now = now();
        $startOfMonth = $now->copy()->startOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();
        $thirtyDaysAgo = $now->copy()->subDays(29)->startOfDay();

        return [
            'user' => [
                'name' => $user->name,
                'role' => $role->value,
                'roleLabel' => $role->label(),
            ],
            'stats' => self::stats($canSeeFinances, $isAdmin, $canManageContent, $startOfMonth, $startOfLastMonth, $endOfLastMonth),
            'donationTrend' => $canSeeFinances ? self::donationTrend($thirtyDaysAgo) : [],
            'donationBreakdown' => $canSeeFinances ? self::donationBreakdown() : null,
            'topProgrammes' => $canSeeFinances ? self::topProgrammes() : [],
            'inquiryBreakdown' => $isAdmin ? self::inquiryBreakdown() : null,
            'contentHealth' => $canManageContent ? self::contentHealth() : null,
            'goal' => $canSeeFinances ? self::donationGoal() : null,
            'upcomingEvents' => $canManageContent ? self::upcomingEvents() : [],
            'attention' => self::attention($canSeeFinances, $isAdmin, $canManageContent),
            'activity' => self::activity($canSeeFinances, $isAdmin, $canManageContent),
            'recentDonations' => $canSeeFinances
                ? Donation::query()
                    ->where('status', 'success')
                    ->latest()
                    ->take(6)
                    ->get(['id', 'donor_name', 'amount', 'programme', 'is_anonymous', 'created_at', 'method', 'status'])
                : [],
            'recentMessages' => $isAdmin
                ? ContactMessage::query()
                    ->latest()
                    ->take(6)
                    ->get(['id', 'name', 'email', 'subject', 'is_read', 'created_at'])
                : [],
            'recentInquiries' => $isAdmin
                ? Inquiry::query()
                    ->latest()
                    ->take(6)
                    ->get(['id', 'type', 'name', 'organisation', 'status', 'created_at'])
                : [],
            'recentPosts' => $canManageContent
                ? Post::query()
                    ->latest('published_at')
                    ->take(6)
                    ->get(['id', 'title', 'slug', 'published_at', 'is_featured', 'category'])
                : [],
            'draftPosts' => $canManageContent
                ? Post::query()
                    ->whereNull('published_at')
                    ->latest()
                    ->take(5)
                    ->get(['id', 'title', 'updated_at'])
                : [],
        ];
    }

    /**
     * @return array<string, int|float|null>
     */
    private static function stats(
        bool $canSeeFinances,
        bool $isAdmin,
        bool $canManageContent,
        CarbonInterface $startOfMonth,
        CarbonInterface $startOfLastMonth,
        CarbonInterface $endOfLastMonth,
    ): array {
        $monthRaised = $canSeeFinances
            ? (int) Donation::query()->where('status', 'success')->where('created_at', '>=', $startOfMonth)->sum('amount')
            : null;
        $lastMonthRaised = $canSeeFinances
            ? (int) Donation::query()->where('status', 'success')->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->sum('amount')
            : null;

        return [
            'totalDonations' => $canSeeFinances ? (int) Donation::query()->where('status', 'success')->sum('amount') : null,
            'donationCount' => $canSeeFinances ? Donation::query()->where('status', 'success')->count() : null,
            'monthRaised' => $monthRaised,
            'lastMonthRaised' => $lastMonthRaised,
            'monthChangePct' => self::percentChange($monthRaised, $lastMonthRaised),
            'pendingDonations' => $canSeeFinances ? Donation::query()->where('status', 'pending')->count() : null,
            'failedDonations' => $canSeeFinances ? Donation::query()->where('status', 'failed')->count() : null,
            'avgDonation' => $canSeeFinances ? (int) round((float) Donation::query()->where('status', 'success')->avg('amount')) : null,
            'subscriberCount' => $isAdmin ? NewsletterSubscriber::query()->whereNull('unsubscribed_at')->count() : null,
            'unreadMessages' => $isAdmin ? ContactMessage::query()->where('is_read', false)->count() : null,
            'openInquiries' => $isAdmin ? Inquiry::query()->where('status', 'new')->count() : null,
            'reviewedInquiries' => $isAdmin ? Inquiry::query()->where('status', 'reviewed')->count() : null,
            'projectCount' => Project::query()->count(),
            'ongoingProjects' => Project::query()->where('status', 'ongoing')->count(),
            'postCount' => $canManageContent ? Post::query()->published()->count() : null,
            'draftCount' => $canManageContent ? Post::query()->whereNull('published_at')->count() : null,
            'upcomingEvents' => $canManageContent ? Event::query()->upcoming()->count() : null,
            'activePartners' => $canManageContent ? Partner::query()->where('is_active', true)->count() : null,
        ];
    }

    private static function percentChange(?int $current, ?int $previous): ?float
    {
        if ($current === null || $previous === null) {
            return null;
        }

        if ($previous === 0) {
            return $current > 0 ? 100.0 : 0.0;
        }

        return round((($current - $previous) / $previous) * 100, 1);
    }

    /**
     * @return list<array{date: string, label: string, amount: int, count: int}>
     */
    private static function donationTrend(CarbonInterface $from): array
    {
        $rows = Donation::query()
            ->where('status', 'success')
            ->where('created_at', '>=', $from)
            ->selectRaw('DATE(created_at) as day, SUM(amount) as total, COUNT(*) as total_count')
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->keyBy('day');

        $trend = [];

        for ($i = 0; $i < 30; $i++) {
            $day = $from->copy()->addDays($i);
            $key = $day->toDateString();
            $row = $rows->get($key);

            $trend[] = [
                'date' => $key,
                'label' => $day->format('j M'),
                'amount' => (int) ($row->total ?? 0),
                'count' => (int) ($row->total_count ?? 0),
            ];
        }

        return $trend;
    }

    /**
     * @return array{success: int, pending: int, failed: int, methods: array{card: int, momo: int}}
     */
    private static function donationBreakdown(): array
    {
        return [
            'success' => Donation::query()->where('status', 'success')->count(),
            'pending' => Donation::query()->where('status', 'pending')->count(),
            'failed' => Donation::query()->where('status', 'failed')->count(),
            'methods' => [
                'card' => Donation::query()->where('status', 'success')->where('method', 'card')->count(),
                'momo' => Donation::query()->where('status', 'success')->where('method', 'momo')->count(),
            ],
        ];
    }

    /**
     * @return list<array{name: string, amount: int, count: int}>
     */
    private static function topProgrammes(): array
    {
        return Donation::query()
            ->where('status', 'success')
            ->whereNotNull('programme')
            ->where('programme', '!=', '')
            ->selectRaw('programme as name, SUM(amount) as amount, COUNT(*) as count')
            ->groupBy('programme')
            ->orderByDesc('amount')
            ->take(5)
            ->get()
            ->map(fn ($row): array => [
                'name' => (string) $row->name,
                'amount' => (int) $row->amount,
                'count' => (int) $row->count,
            ])
            ->all();
    }

    /**
     * @return array{volunteer: int, partner: int, byStatus: array{new: int, reviewed: int, converted: int}}
     */
    private static function inquiryBreakdown(): array
    {
        return [
            'volunteer' => Inquiry::query()->where('type', 'volunteer')->count(),
            'partner' => Inquiry::query()->where('type', 'partner')->count(),
            'byStatus' => [
                'new' => Inquiry::query()->where('status', 'new')->count(),
                'reviewed' => Inquiry::query()->where('status', 'reviewed')->count(),
                'converted' => Inquiry::query()->where('status', 'converted')->count(),
            ],
        ];
    }

    /**
     * @return array{published: int, drafts: int, featured: int, projectsOngoing: int, projectsCompleted: int, projectsUpcoming: int}
     */
    private static function contentHealth(): array
    {
        return [
            'published' => Post::query()->published()->count(),
            'drafts' => Post::query()->whereNull('published_at')->count(),
            'featured' => Post::query()->published()->featured()->count(),
            'projectsOngoing' => Project::query()->where('status', 'ongoing')->count(),
            'projectsCompleted' => Project::query()->where('status', 'completed')->count(),
            'projectsUpcoming' => Project::query()->where('status', 'upcoming')->count(),
        ];
    }

    /**
     * @return array{target: int, raised: int, progress: float}|null
     */
    private static function donationGoal(): ?array
    {
        $targetCedis = (int) (SiteSetting::query()->where('key', 'donation_goal')->value('value') ?: 0);

        if ($targetCedis <= 0) {
            return null;
        }

        $target = $targetCedis * 100;
        $raised = (int) Donation::query()->where('status', 'success')->sum('amount');
        $progress = min(100, round(($raised / $target) * 100, 1));

        return [
            'target' => $target,
            'raised' => $raised,
            'progress' => $progress,
        ];
    }

    /**
     * @return list<array{id: int, title: string, slug: string, location: string, starts_at: string}>
     */
    private static function upcomingEvents(): array
    {
        return Event::query()
            ->upcoming()
            ->take(5)
            ->get(['id', 'title', 'slug', 'location', 'starts_at'])
            ->map(fn (Event $event): array => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'location' => $event->location,
                'starts_at' => $event->starts_at->toIso8601String(),
            ])
            ->all();
    }

    /**
     * @return list<array{label: string, href: string, tone: string}>
     */
    private static function attention(bool $canSeeFinances, bool $isAdmin, bool $canManageContent): array
    {
        $items = [];

        if ($isAdmin) {
            $unread = ContactMessage::query()->where('is_read', false)->count();
            if ($unread > 0) {
                $items[] = [
                    'label' => $unread.' unread message'.($unread === 1 ? '' : 's'),
                    'href' => '/admin/messages',
                    'tone' => 'amber',
                ];
            }

            $open = Inquiry::query()->where('status', 'new')->count();
            if ($open > 0) {
                $items[] = [
                    'label' => $open.' new inquir'.($open === 1 ? 'y' : 'ies'),
                    'href' => '/admin/inquiries',
                    'tone' => 'sky',
                ];
            }
        }

        if ($canSeeFinances) {
            $pending = Donation::query()->where('status', 'pending')->count();
            if ($pending > 0) {
                $items[] = [
                    'label' => $pending.' pending donation'.($pending === 1 ? '' : 's'),
                    'href' => '/admin/donations?status=pending',
                    'tone' => 'gold',
                ];
            }
        }

        if ($canManageContent) {
            $drafts = Post::query()->whereNull('published_at')->count();
            if ($drafts > 0) {
                $items[] = [
                    'label' => $drafts.' draft stor'.($drafts === 1 ? 'y' : 'ies'),
                    'href' => '/admin/posts',
                    'tone' => 'navy',
                ];
            }

            if (Partner::query()->where('is_active', true)->count() === 0) {
                $items[] = [
                    'label' => 'No active partners on About page',
                    'href' => '/admin/partners/create',
                    'tone' => 'green',
                ];
            }
        }

        return $items;
    }

    /**
     * @return list<array{type: string, title: string, meta: string, href: string, at: string}>
     */
    private static function activity(bool $canSeeFinances, bool $isAdmin, bool $canManageContent): array
    {
        /** @var Collection<int, array{type: string, title: string, meta: string, href: string, at: string}> $items */
        $items = collect();

        if ($canSeeFinances) {
            Donation::query()->latest()->take(8)->get(['id', 'donor_name', 'amount', 'status', 'is_anonymous', 'created_at'])
                ->each(function (Donation $donation) use ($items): void {
                    $items->push([
                        'type' => 'donation',
                        'title' => ($donation->is_anonymous ? 'Anonymous' : $donation->donor_name).' · '.self::money($donation->amount),
                        'meta' => ucfirst($donation->status).' donation',
                        'href' => '/admin/donations/'.$donation->id,
                        'at' => $donation->created_at->toIso8601String(),
                    ]);
                });
        }

        if ($isAdmin) {
            ContactMessage::query()->latest()->take(6)->get(['id', 'name', 'subject', 'created_at'])
                ->each(function (ContactMessage $message) use ($items): void {
                    $items->push([
                        'type' => 'message',
                        'title' => $message->subject,
                        'meta' => 'Message from '.$message->name,
                        'href' => '/admin/messages/'.$message->id,
                        'at' => $message->created_at->toIso8601String(),
                    ]);
                });

            Inquiry::query()->latest()->take(6)->get(['id', 'name', 'type', 'status', 'created_at'])
                ->each(function (Inquiry $inquiry) use ($items): void {
                    $items->push([
                        'type' => 'inquiry',
                        'title' => $inquiry->name,
                        'meta' => ucfirst($inquiry->type).' inquiry · '.$inquiry->status,
                        'href' => '/admin/inquiries/'.$inquiry->id,
                        'at' => $inquiry->created_at->toIso8601String(),
                    ]);
                });
        }

        if ($canManageContent) {
            Post::query()->latest()->take(6)->get(['id', 'title', 'published_at', 'updated_at'])
                ->each(function (Post $post) use ($items): void {
                    $items->push([
                        'type' => 'post',
                        'title' => $post->title,
                        'meta' => $post->published_at ? 'Published story' : 'Draft story',
                        'href' => '/admin/posts/'.$post->id.'/edit',
                        'at' => ($post->published_at ?? $post->updated_at)->toIso8601String(),
                    ]);
                });
        }

        return $items
            ->sortByDesc('at')
            ->take(12)
            ->values()
            ->all();
    }

    private static function money(int $pesewas): string
    {
        return 'GHS '.number_format($pesewas / 100, 2);
    }
}
