<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AccountInviter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/users/index', [
            'users' => User::query()
                ->select(['id', 'name', 'email', 'role', 'email_verified_at', 'created_at'])
                ->latest()
                ->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/users/create', [
            'roles' => array_map(
                fn (UserRole $role) => ['value' => $role->value, 'label' => $role->label()],
                UserRole::cases(),
            ),
        ]);
    }

    public function store(Request $request, AccountInviter $inviter): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'in:'.implode(',', array_column(UserRole::cases(), 'value'))],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => $inviter->unusablePassword(),
            'invited_by' => $request->user()->id,
        ]);

        $inviter->invite($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invite sent.')]);

        return to_route('admin.users.index');
    }

    public function resendInvite(User $user, AccountInviter $inviter): RedirectResponse
    {
        abort_if($user->email_verified_at !== null, 422, 'This user already activated their account.');

        $inviter->invite($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invite resent.')]);

        return back();
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        abort_if($user->id === $request->user()->id, 422, 'You cannot remove your own account.');

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User removed.')]);

        return to_route('admin.users.index');
    }
}
