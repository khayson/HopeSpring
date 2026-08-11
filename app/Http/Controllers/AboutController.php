<?php

namespace App\Http\Controllers;

use App\Models\ImpactStat;
use App\Models\Milestone;
use App\Models\Partner;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class AboutController extends Controller
{
    public function __invoke(): Response
    {
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
                'about_partners_eyebrow',
                'about_partners_heading',
                'about_partners_intro',
                'about_partners_empty_title',
                'about_partners_empty_message',
                'about_partners_cta_label',
            ])->pluck('value', 'key'),
        ]);
    }
}
