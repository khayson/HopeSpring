<?php

namespace App\Http\Controllers;

use App\Models\Programme;
use Inertia\Inertia;
use Inertia\Response;

class ProgrammeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/programmes/index', [
            'programmes' => Programme::where('is_active', true)
                ->withCount('projects')
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function show(Programme $programme): Response
    {
        return Inertia::render('public/programmes/show', [
            'programme' => $programme->load(['projects' => function ($query) {
                $query->latest()->select(['id', 'programme_id', 'title', 'slug', 'description', 'location', 'photo', 'status']);
            }]),
        ]);
    }
}
