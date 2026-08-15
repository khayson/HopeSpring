<?php

namespace App\Http\Controllers;

use App\Models\ImpactStat;
use App\Models\Milestone;
use App\Models\Partner;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Support\AboutPageSettings;
use App\Support\HomePageSettings;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(): Response
    {
        $homeKeys = array_values(array_filter(
            array_column(HomePageSettings::defaults(), 'key'),
            fn (string $key): bool => $key === 'home_about_body' || str_starts_with($key, 'home_value_'),
        ));

        return Inertia::render('public/about', [
            'team' => TeamMember::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'role', 'photo', 'bio', 'type']),
            'milestones' => Milestone::orderBy('sort_order')
                ->get(['year', 'title', 'description']),
            'stats' => ImpactStat::orderBy('sort_order')->get(['label', 'value', 'suffix']),
            'partners' => Partner::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'logo', 'url']),
            'settings' => SiteSetting::whereIn('key', [
                'about_mission',
                'about_vision',
                ...$homeKeys,
                ...array_column(AboutPageSettings::defaults(), 'key'),
            ])->pluck('value', 'key'),
        ]);
    }
}
