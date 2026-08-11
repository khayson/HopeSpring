<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Support\PublicImage;
use App\Support\RichText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->toString(),
            'status' => $request->string('status')->trim()->toString(),
        ];

        $events = Event::query()
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('title', 'like', '%'.$filters['search'].'%')
                        ->orWhere('location', 'like', '%'.$filters['search'].'%');
                });
            })
            ->when($filters['status'] === 'upcoming', fn ($query) => $query->where('starts_at', '>=', now()))
            ->when($filters['status'] === 'past', fn ($query) => $query->where('starts_at', '<', now()))
            ->when($filters['status'] === 'featured', fn ($query) => $query->where('is_featured', true))
            ->orderByDesc('starts_at')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Event $event): array => [
                'id' => $event->id,
                'title' => $event->title,
                'slug' => $event->slug,
                'location' => $event->location,
                'photo' => $event->photo,
                'starts_at' => $event->starts_at,
                'ends_at' => $event->ends_at,
                'is_featured' => $event->is_featured,
                'is_upcoming' => $event->starts_at->gte(now()),
            ]);

        return Inertia::render('admin/events/index', [
            'events' => $events,
            'filters' => $filters,
            'stats' => [
                'total' => Event::query()->count(),
                'upcoming' => Event::query()->where('starts_at', '>=', now())->count(),
                'past' => Event::query()->where('starts_at', '<', now())->count(),
                'featured' => Event::query()->where('is_featured', true)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/events/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $validated['slug'] = $this->uniqueSlug($validated['title']);
        $validated['long_description'] = RichText::sanitize($validated['long_description'] ?? null);
        $validated['photo'] = PublicImage::store($request->file('photo'), 'events');

        unset($validated['remove_photo']);

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
        $validated['slug'] = $this->uniqueSlug($validated['title'], $event);
        $validated['long_description'] = RichText::sanitize($validated['long_description'] ?? null);

        if ($request->boolean('remove_photo')) {
            PublicImage::delete($event->photo);
            $validated['photo'] = null;
        } elseif ($request->hasFile('photo')) {
            PublicImage::delete($event->photo);
            $validated['photo'] = PublicImage::store($request->file('photo'), 'events');
        } else {
            unset($validated['photo']);
        }

        unset($validated['remove_photo']);

        $event->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event updated.')]);

        return to_route('admin.events.index');
    }

    public function destroy(Event $event): RedirectResponse
    {
        PublicImage::delete($event->photo);
        $event->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event deleted.')]);

        return to_route('admin.events.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $request->merge([
            'long_description' => $request->filled('long_description')
                ? $request->string('long_description')->toString()
                : null,
            'ends_at' => $request->filled('ends_at') ? $request->string('ends_at')->toString() : null,
            'is_featured' => $request->boolean('is_featured'),
            'remove_photo' => $request->boolean('remove_photo'),
        ]);

        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:1000'],
            'long_description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'remove_photo' => ['boolean'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'is_featured' => ['boolean'],
        ]);
    }

    private function uniqueSlug(string $title, ?Event $ignore = null): string
    {
        $base = Str::slug($title) ?: 'event';
        $slug = $base;
        $suffix = 1;

        while (
            Event::query()
                ->when($ignore !== null, fn ($query) => $query->where('id', '!=', $ignore->id))
                ->where('slug', $slug)
                ->exists()
        ) {
            $slug = $base.'-'.$suffix;
            $suffix++;
        }

        return $slug;
    }
}
