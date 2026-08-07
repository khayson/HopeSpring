<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/messages/index', [
            'messages' => ContactMessage::query()->latest()->paginate(20),
        ]);
    }

    public function show(ContactMessage $message): Response
    {
        if (! $message->is_read) {
            $message->update(['is_read' => true]);
        }

        return Inertia::render('admin/messages/show', [
            'message' => $message,
        ]);
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Message deleted.')]);

        return to_route('admin.messages.index');
    }
}
