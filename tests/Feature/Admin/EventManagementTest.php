<?php

use App\Enums\UserRole;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admins and editors can list events with stats', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $editor = User::factory()->create(['role' => UserRole::Editor]);

    Event::factory()->upcoming()->create(['title' => 'Water Clinic Day', 'is_featured' => false]);
    Event::factory()->past()->create(['title' => 'Past Fundraiser', 'is_featured' => false]);
    Event::factory()->upcoming()->featured()->create(['title' => 'Featured Gala']);

    $this->actingAs($admin)
        ->get(route('admin.events.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/events/index')
            ->has('events.data', 3)
            ->where('stats.total', 3)
            ->where('stats.upcoming', 2)
            ->where('stats.past', 1)
            ->where('stats.featured', 1));

    $this->actingAs($editor)->get(route('admin.events.index'))->assertOk();
});

test('admin can filter events by status and search', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    Event::factory()->upcoming()->create([
        'title' => 'Accra Health Fair',
        'location' => 'Accra Mall',
    ]);
    Event::factory()->past()->create([
        'title' => 'Kumasi Reading Week',
        'location' => 'Kumasi Library',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.events.index', ['status' => 'upcoming']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('events.data', 1)
            ->where('events.data.0.title', 'Accra Health Fair')
            ->where('filters.status', 'upcoming'));

    $this->actingAs($admin)
        ->get(route('admin.events.index', ['search' => 'Kumasi']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('events.data', 1)
            ->where('events.data.0.title', 'Kumasi Reading Week')
            ->where('filters.search', 'Kumasi'));
});

test('finance cannot manage events', function () {
    $finance = User::factory()->create(['role' => UserRole::Finance]);

    $this->actingAs($finance)->get(route('admin.events.index'))->assertForbidden();
});

test('admin can create an event with uploaded photo and rich text', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $photo = UploadedFile::fake()->image('summit.jpg', 1200, 800);

    $this->actingAs($admin)
        ->post(route('admin.events.store'), [
            'title' => 'HopeSpring Youth Summit',
            'description' => 'A day of mentoring and skills workshops.',
            'long_description' => '<p>Full <strong>agenda</strong> for the summit.</p><script>alert(1)</script>',
            'location' => 'University of Ghana, Legon',
            'photo' => $photo,
            'starts_at' => now()->addWeek()->format('Y-m-d\\TH:i'),
            'ends_at' => now()->addWeek()->addHours(4)->format('Y-m-d\\TH:i'),
            'is_featured' => true,
        ])
        ->assertRedirect(route('admin.events.index'));

    $event = Event::query()->where('title', 'HopeSpring Youth Summit')->first();

    expect($event)->not->toBeNull()
        ->and($event->slug)->toBe('hopespring-youth-summit')
        ->and($event->is_featured)->toBeTrue()
        ->and($event->long_description)->toBe('<p>Full <strong>agenda</strong> for the summit.</p>')
        ->and($event->photo)->toStartWith('/storage/events/')
        ->and($event->photo)->not->toContain('<script>');

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $event->photo));
});

test('admin can update replace and remove an event photo', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $original = UploadedFile::fake()->image('original.jpg');
    $path = $original->store('events', 'public');

    $event = Event::factory()->create([
        'title' => 'Original Title',
        'slug' => 'original-title',
        'photo' => '/storage/'.$path,
        'is_featured' => false,
    ]);

    $replacement = UploadedFile::fake()->image('replacement.png');

    $this->actingAs($admin)
        ->put(route('admin.events.update', $event), [
            'title' => 'Updated Title',
            'description' => 'Updated short description.',
            'long_description' => '<p>Updated body</p>',
            'location' => 'Cape Coast',
            'photo' => $replacement,
            'starts_at' => now()->addDays(3)->format('Y-m-d\\TH:i'),
            'ends_at' => '',
            'is_featured' => true,
        ])
        ->assertRedirect(route('admin.events.index'));

    $event->refresh();

    expect($event)
        ->title->toBe('Updated Title')
        ->slug->toBe('updated-title')
        ->location->toBe('Cape Coast')
        ->ends_at->toBeNull()
        ->is_featured->toBeTrue()
        ->long_description->toBe('<p>Updated body</p>');

    Storage::disk('public')->assertMissing($path);
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $event->photo));

    $this->actingAs($admin)
        ->put(route('admin.events.update', $event), [
            'title' => 'Updated Title',
            'description' => 'Updated short description.',
            'long_description' => '<p>Updated body</p>',
            'location' => 'Cape Coast',
            'remove_photo' => true,
            'starts_at' => now()->addDays(3)->format('Y-m-d\\TH:i'),
            'is_featured' => true,
        ])
        ->assertRedirect(route('admin.events.index'));

    expect($event->fresh()->photo)->toBeNull();

    $this->actingAs($admin)
        ->delete(route('admin.events.destroy', $event))
        ->assertRedirect(route('admin.events.index'));

    $this->assertDatabaseMissing('events', ['id' => $event->id]);
});

test('creating an event with a duplicate title gets a unique slug', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    Event::factory()->create([
        'title' => 'Community Day',
        'slug' => 'community-day',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.events.store'), [
            'title' => 'Community Day',
            'description' => 'Another community gathering.',
            'location' => 'Tamale',
            'starts_at' => now()->addMonth()->format('Y-m-d\\TH:i'),
            'is_featured' => false,
        ])
        ->assertRedirect(route('admin.events.index'));

    $this->assertDatabaseHas('events', [
        'title' => 'Community Day',
        'slug' => 'community-day-1',
    ]);
});

test('public event page renders sanitized rich text and cover photo', function () {
    $event = Event::factory()->upcoming()->create([
        'title' => 'Open Day',
        'slug' => 'open-day',
        'photo' => '/storage/events/open-day.jpg',
        'long_description' => '<p>Join us for <em>impact</em>.</p>',
    ]);

    $this->get(route('events.show', $event))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/events/show')
            ->where('event.photo', '/storage/events/open-day.jpg')
            ->where('event.long_description', '<p>Join us for <em>impact</em>.</p>'));
});
