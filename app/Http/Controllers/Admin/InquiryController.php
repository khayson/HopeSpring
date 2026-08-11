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
        return Inertia::render('admin/inquiries/index', [
            'inquiries' => Inquiry::query()
                ->when($request->string('type')->toString(), fn ($query, $type) => $query->where('type', $type))
                ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
                ->latest()
                ->paginate(20)
                ->withQueryString(),
            'filters' => $request->only(['type', 'status']),
        ]);
    }

    public function show(Inquiry $inquiry): Response
    {
        if ($inquiry->status === 'new') {
            $inquiry->update(['status' => 'reviewed']);
        }

        return Inertia::render('admin/inquiries/show', [
            'inquiry' => $inquiry,
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
