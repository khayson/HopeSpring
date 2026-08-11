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
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->toString(),
            'role' => $request->string('role')->trim()->toString(),
            'status' => $request->string('status')->trim()->toString(),
        ];

        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'email_verified_at', 'created_at'])
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('name', 'like', '%'.$filters['search'].'%')
                        ->orWhere('email', 'like', '%'.$filters['search'].'%');
                });
            })
            ->when(
                in_array($filters['role'], array_column(UserRole::cases(), 'value'), true),
                fn ($query) => $query->where('role', $filters['role']),
            )
            ->when($filters['status'] === 'pending', fn ($query) => $query->whereNull('email_verified_at'))
            ->when($filters['status'] === 'active', fn ($query) => $query->whereNotNull('email_verified_at'))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/users/index', [
            'users' => $users,
            'filters' => $filters,
            'stats' => [
                'total' => User::query()->count(),
                'active' => User::query()->whereNotNull('email_verified_at')->count(),
                'pending' => User::query()->whereNull('email_verified_at')->count(),
                'staff' => User::query()->whereIn('role', [
                    UserRole::Admin->value,
                    UserRole::Editor->value,
                    UserRole::Finance->value,
                ])->count(),
            ],
            'roles' => array_map(
                fn (UserRole $role) => ['value' => $role->value, 'label' => $role->label()],
                UserRole::cases(),
            ),
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
