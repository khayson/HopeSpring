<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\NewsletterSubscriber;
use App\Models\Post;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $totalDonations = Donation::where('status', 'success')->sum('amount');
        $donationCount = Donation::where('status', 'success')->count();
        $subscriberCount = NewsletterSubscriber::whereNull('unsubscribed_at')->count();
        $messageCount = ContactMessage::where('is_read', false)->count();
        $projectCount = Project::count();
        $postCount = Post::published()->count();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalDonations' => $totalDonations,
                'donationCount' => $donationCount,
                'subscriberCount' => $subscriberCount,
                'unreadMessages' => $messageCount,
                'projectCount' => $projectCount,
                'postCount' => $postCount,
            ],
            'recentDonations' => Donation::where('status', 'success')
                ->latest()
                ->take(5)
                ->get(['id', 'donor_name', 'donor_email', 'amount', 'currency', 'programme', 'is_anonymous', 'created_at']),
            'recentMessages' => ContactMessage::latest()
                ->take(5)
                ->get(['id', 'name', 'email', 'subject', 'is_read', 'created_at']),
            'recentPosts' => Post::latest('published_at')
                ->take(5)
                ->get(['id', 'title', 'slug', 'published_at', 'is_featured']),
        ]);
    }
}
