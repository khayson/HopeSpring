<?php

use App\Models\GalleryImage;
use App\Models\GalleryImageComment;
use App\Models\GalleryImageLike;

test('a visitor can like and unlike a gallery image', function () {
    $image = GalleryImage::factory()->create();

    $this->post(route('gallery.like', $image))
        ->assertRedirect();

    expect(GalleryImageLike::query()->where('gallery_image_id', $image->id)->count())->toBe(1);

    $this->get(route('gallery.show', $image))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('liked', true)
            ->where('likesCount', 1));

    $this->post(route('gallery.like', $image))
        ->assertRedirect();

    expect(GalleryImageLike::query()->where('gallery_image_id', $image->id)->count())->toBe(0);
});

test('a visitor can comment on a gallery image', function () {
    $image = GalleryImage::factory()->create();

    $this->post(route('gallery.comments.store', $image), [
        'name' => 'Ama',
        'body' => 'Beautiful work in Bongo.',
    ])->assertRedirect();

    $this->assertDatabaseHas('gallery_image_comments', [
        'gallery_image_id' => $image->id,
        'name' => 'Ama',
        'body' => 'Beautiful work in Bongo.',
    ]);

    $this->get(route('gallery.show', $image))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('comments', 1)
            ->where('comments.0.name', 'Ama'));
});

test('gallery comments require a name and body', function () {
    $image = GalleryImage::factory()->create();

    $this->post(route('gallery.comments.store', $image), [
        'name' => '',
        'body' => '',
    ])->assertSessionHasErrors(['name', 'body']);
});

test('gallery show includes engagement props', function () {
    $image = GalleryImage::factory()->create();
    GalleryImageComment::factory()->count(2)->create(['gallery_image_id' => $image->id]);
    GalleryImageLike::factory()->create([
        'gallery_image_id' => $image->id,
        'visitor_token' => 'test-token',
    ]);

    $this->get(route('gallery.show', $image))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('likesCount', 1)
            ->where('liked', false)
            ->has('comments', 2));
});
