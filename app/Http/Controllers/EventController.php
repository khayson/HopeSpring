<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/events/index', [
            'upcomingEvents' => Event::upcoming()
                ->get(['id', 'title', 'slug', 'description', 'location', 'photo', 'starts_at', 'ends_at']),
            'pastEvents' => Event::past()
                ->take(6)
                ->get(['id', 'title', 'slug', 'description', 'location', 'photo', 'starts_at']),
        ]);
    }

    public function show(Event $event): Response
    {
        return Inertia::render('public/events/show', [
            'event' => $event,
        ]);
    }
}
