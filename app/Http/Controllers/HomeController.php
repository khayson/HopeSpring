<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\ImpactStat;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Programme;
use App\Models\Project;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('public/home', [
            'programmes' => Programme::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug', 'description', 'icon', 'photo']),
            'featuredProjects' => Project::where('is_featured', true)
                ->with('programme:id,title')
                ->latest()
                ->take(3)
                ->get(['id', 'programme_id', 'title', 'slug', 'description', 'location', 'photo']),
            'stats' => ImpactStat::orderBy('sort_order')->get(['label', 'value', 'suffix']),
            'latestPosts' => Post::published()
                ->latest('published_at')
                ->take(3)
                ->get(['id', 'title', 'slug', 'excerpt', 'featured_image', 'category', 'published_at']),
            'upcomingEvents' => Event::upcoming()
                ->take(2)
                ->get(['id', 'title', 'slug', 'description', 'location', 'starts_at']),
            'partners' => Partner::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['name', 'logo', 'url']),
            'settings' => SiteSetting::whereIn('key', [
                'site_tagline', 'about_mission',
            ])->pluck('value', 'key'),
        ]);
    }
}
