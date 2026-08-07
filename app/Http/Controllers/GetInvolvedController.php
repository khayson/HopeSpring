<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Programme;
use Inertia\Inertia;
use Inertia\Response;

class GetInvolvedController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('public/get-involved', [
            'programmes' => Programme::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug', 'description', 'icon']),
            'upcomingEvents' => Event::upcoming()
                ->take(3)
                ->get(['id', 'title', 'slug', 'description', 'location', 'starts_at']),
        ]);
    }
}
