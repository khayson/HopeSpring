<?php

namespace App\Http\Controllers;

use App\Support\AdminDashboard;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response|RedirectResponse
    {
        $user = Auth::user();

        if (! $user->isStaff()) {
            return to_route('portal.index');
        }

        return Inertia::render('dashboard', AdminDashboard::for($user));
    }
}
