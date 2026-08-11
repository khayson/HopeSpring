<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use App\Models\User;
use App\Services\AccountInviter;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'type' => $request->string('type')->trim()->toString(),
            'status' => $request->string('status')->trim()->toString(),
            'search' => $request->string('search')->trim()->toString(),
        ];

        $inquiries = Inquiry::query()
            ->when($filters['type'] !== '', fn ($query) => $query->where('type', $filters['type']))
            ->when($filters['status'] !== '', fn ($query) => $query->where('status', $filters['status']))
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('name', 'like', '%'.$filters['search'].'%')
                        ->orWhere('email', 'like', '%'.$filters['search'].'%')
                        ->orWhere('organisation', 'like', '%'.$filters['search'].'%');
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/inquiries/index', [
            'inquiries' => $inquiries,
            'filters' => $filters,
            'stats' => [
                'total' => Inquiry::query()->count(),
                'new' => Inquiry::query()->where('status', 'new')->count(),
                'reviewed' => Inquiry::query()->where('status', 'reviewed')->count(),
                'converted' => Inquiry::query()->where('status', 'converted')->count(),
            ],
        ]);
    }

    public function show(Inquiry $inquiry): Response
    {
        if ($inquiry->status === 'new') {
            $inquiry->update(['status' => 'reviewed']);
        }

        return Inertia::render('admin/inquiries/show', [
            'inquiry' => $inquiry->fresh(),
        ]);
    }

    public function update(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => ['required', 'in:new,reviewed,converted'],
        ]);

        $inquiry->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Inquiry updated.')]);

        return back();
    }

    public function invite(Inquiry $inquiry, AccountInviter $inviter): RedirectResponse
    {
        abort_if($inquiry->converted_user_id !== null, 422, 'This inquiry has already been converted to an account.');

        $role = $inquiry->type === 'partner' ? UserRole::Partner : UserRole::Volunteer;

        $user = User::create([
            'name' => $inquiry->name,
            'email' => $inquiry->email,
            'role' => $role,
            'password' => $inviter->unusablePassword(),
        ]);

        $inviter->invite($user);

        $inquiry->update(['status' => 'converted', 'converted_user_id' => $user->id]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Account created and invite sent.')]);

        return back();
    }
}
