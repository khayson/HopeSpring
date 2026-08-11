<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/events/index', [
            'events' => Event::query()->orderByDesc('starts_at')->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/events/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        $validated['slug'] = Str::slug($validated['title']);

        Event::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event created.')]);

        return to_route('admin.events.index');
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('admin/events/edit', [
            'event' => $event,
        ]);
    }

    public function update(Request $request, Event $event): RedirectResponse
    {
        $validated = $this->validated($request);

        $validated['slug'] = Str::slug($validated['title']);

        $event->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event updated.')]);

        return to_route('admin.events.index');
    }

    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event deleted.')]);

        return to_route('admin.events.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'long_description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'string', 'max:2048'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_featured' => ['boolean'],
        ]);
    }
}
