<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterSubscriberController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/newsletter/index', [
            'subscribers' => NewsletterSubscriber::query()->latest('subscribed_at')->paginate(30),
            'activeCount' => NewsletterSubscriber::whereNull('unsubscribed_at')->count(),
        ]);
    }

    public function destroy(NewsletterSubscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Subscriber removed.')]);

        return to_route('admin.newsletter.index');
    }
}
