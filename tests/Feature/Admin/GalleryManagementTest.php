<?php

use App\Enums\GalleryMediaType;
use App\Enums\UserRole;
use App\Models\GalleryImage;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admins and editors can list gallery items with stats', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $editor = User::factory()->create(['role' => UserRole::Editor]);

    GalleryImage::factory()->create(['caption' => 'Anweem visit', 'category' => 'community']);
    GalleryImage::factory()->video()->create(['caption' => 'Orphanage donation', 'category' => 'community']);

    $this->actingAs($admin)
        ->get(route('admin.gallery.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/gallery/index')
            ->has('images.data', 2)
            ->where('stats.total', 2)
            ->where('stats.images', 1)
            ->where('stats.videos', 1));

    $this->actingAs($editor)->get(route('admin.gallery.index'))->assertOk();
});

test('admin can filter gallery items by type category and search', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    GalleryImage::factory()->create([
        'caption' => 'Anweem visit',
        'alt' => 'People of Anweem',
        'category' => 'community',
    ]);
    GalleryImage::factory()->video()->create([
        'caption' => 'Orphanage donation',
        'alt' => 'Save Them Young',
        'category' => 'education',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.gallery.index', ['type' => 'video']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('images.data', 1)
            ->where('images.data.0.media_type', 'video')
            ->where('filters.type', 'video'));

    $this->actingAs($admin)
        ->get(route('admin.gallery.index', ['category' => 'community']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('images.data', 1)
            ->where('images.data.0.category', 'community'));

    $this->actingAs($admin)
        ->get(route('admin.gallery.index', ['search' => 'Anweem']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('images.data', 1)
            ->where('images.data.0.caption', 'Anweem visit'));
});

test('finance cannot manage the gallery', function () {
    $finance = User::factory()->create(['role' => UserRole::Finance]);

    $this->actingAs($finance)->get(route('admin.gallery.index'))->assertForbidden();
});

test('admin can upload photos and videos to the gallery', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $photo = UploadedFile::fake()->image('anweem.jpg', 800, 600);
    $video = UploadedFile::fake()->create('orphanage.mp4', 400, 'video/mp4');

    $this->actingAs($admin)
        ->post(route('admin.gallery.store'), [
            'files' => [$photo, $video],
            'alt' => 'HopeSpring visit to Anweem',
            'caption' => 'Visit to Anweem, Komenda District',
            'category' => 'community',
        ])
        ->assertRedirect(route('admin.gallery.index'));

    expect(GalleryImage::query()->count())->toBe(2)
        ->and(GalleryImage::query()->where('media_type', GalleryMediaType::Video)->count())->toBe(1)
        ->and(GalleryImage::query()->where('category', 'community')->count())->toBe(2);
});

test('admin can update and delete a gallery item', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $image = GalleryImage::factory()->create([
        'caption' => 'Old caption',
        'category' => 'events',
        'src' => '/storage/gallery/old.jpg',
    ]);

    Storage::disk('public')->put('gallery/old.jpg', 'old-bytes');

    $this->actingAs($admin)
        ->put(route('admin.gallery.update', $image), [
            'alt' => 'Updated alt',
            'caption' => 'Donation to Save Them Young Orphanage',
            'category' => 'community',
            'sort_order' => 12,
        ])
        ->assertRedirect(route('admin.gallery.index'));

    $image->refresh();

    expect($image->caption)->toBe('Donation to Save Them Young Orphanage')
        ->and($image->category)->toBe('community')
        ->and($image->sort_order)->toBe(12);

    $this->actingAs($admin)
        ->delete(route('admin.gallery.destroy', $image))
        ->assertRedirect(route('admin.gallery.index'));

    expect(GalleryImage::query()->find($image->id))->toBeNull();
    Storage::disk('public')->assertMissing('gallery/old.jpg');
});
