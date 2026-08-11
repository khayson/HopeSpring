<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterSubscriberController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->toString(),
            'status' => $request->string('status')->trim()->toString(),
        ];

        $subscribers = NewsletterSubscriber::query()
            ->when($filters['search'] !== '', fn ($query) => $query->where('email', 'like', '%'.$filters['search'].'%'))
            ->when($filters['status'] === 'active', fn ($query) => $query->whereNull('unsubscribed_at'))
            ->when($filters['status'] === 'unsubscribed', fn ($query) => $query->whereNotNull('unsubscribed_at'))
            ->latest('subscribed_at')
            ->paginate(30)
            ->withQueryString();

        return Inertia::render('admin/newsletter/index', [
            'subscribers' => $subscribers,
            'filters' => $filters,
            'stats' => [
                'total' => NewsletterSubscriber::query()->count(),
                'active' => NewsletterSubscriber::query()->whereNull('unsubscribed_at')->count(),
                'unsubscribed' => NewsletterSubscriber::query()->whereNotNull('unsubscribed_at')->count(),
            ],
        ]);
    }

    public function destroy(NewsletterSubscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Subscriber removed.')]);

        return to_route('admin.newsletter.index');
    }
}
