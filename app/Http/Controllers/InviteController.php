<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class InviteController extends Controller
{
    public function show(Request $request, User $user): Response|RedirectResponse
    {
        if ($user->email_verified_at !== null) {
            return to_route('login')->with('status', 'This invite has already been used. Please log in.');
        }

        return Inertia::render('auth/accept-invite', [
            'name' => $user->name,
            'email' => $user->email,
            'acceptUrl' => $request->fullUrl(),
        ]);
    }

    public function store(Request $request, User $user): RedirectResponse
    {
        abort_if($user->email_verified_at !== null, 422, 'This invite has already been used.');

        $validated = $request->validate([
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        $user->password = $validated['password'];
        $user->email_verified_at = now();
        $user->save();

        Auth::login($user);

        return $user->isStaff() ? to_route('dashboard') : to_route('portal.index');
    }
}
