<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('public/projects/index', [
            'projects' => Project::with('programme:id,title,slug')
                ->latest()
                ->paginate(9, ['id', 'programme_id', 'title', 'slug', 'description', 'location', 'photo', 'status']),
        ]);
    }

    public function show(Project $project): Response
    {
        return Inertia::render('public/projects/show', [
            'project' => $project->load('programme:id,title,slug'),
        ]);
    }
}
