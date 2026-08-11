<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->toString(),
            'status' => $request->string('status')->trim()->toString(),
        ];

        $messages = ContactMessage::query()
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('name', 'like', '%'.$filters['search'].'%')
                        ->orWhere('email', 'like', '%'.$filters['search'].'%')
                        ->orWhere('subject', 'like', '%'.$filters['search'].'%');
                });
            })
            ->when($filters['status'] === 'unread', fn ($query) => $query->where('is_read', false))
            ->when($filters['status'] === 'read', fn ($query) => $query->where('is_read', true))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/messages/index', [
            'messages' => $messages,
            'filters' => $filters,
            'stats' => [
                'total' => ContactMessage::query()->count(),
                'unread' => ContactMessage::query()->where('is_read', false)->count(),
                'read' => ContactMessage::query()->where('is_read', true)->count(),
            ],
        ]);
    }

    public function show(ContactMessage $message): Response
    {
        if (! $message->is_read) {
            $message->update(['is_read' => true]);
        }

        return Inertia::render('admin/messages/show', [
            'message' => $message->fresh(),
        ]);
    }

    public function destroy(ContactMessage $message): RedirectResponse
    {
        $message->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Message deleted.')]);

        return to_route('admin.messages.index');
    }
}
