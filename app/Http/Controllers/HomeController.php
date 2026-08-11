<?php

namespace App\Http\Controllers;

use App\Models\ImpactStat;
use App\Models\Programme;
use App\Models\SiteSetting;
use App\Support\HomePageSettings;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $homeKeys = array_column(HomePageSettings::defaults(), 'key');

        return Inertia::render('public/home', [
            'programmes' => Programme::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug', 'description', 'icon', 'photo']),
            'stats' => ImpactStat::orderBy('sort_order')->get(['label', 'value', 'suffix']),
            'settings' => SiteSetting::whereIn('key', [
                'about_mission',
                ...$homeKeys,
            ])->pluck('value', 'key'),
        ]);
    }
}
