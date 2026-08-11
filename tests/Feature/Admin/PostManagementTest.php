<?php

use App\Enums\UserRole;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admins and editors can list posts with stats', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $editor = User::factory()->create(['role' => UserRole::Editor]);

    Post::factory()->published()->create([
        'title' => 'Published Story',
        'is_featured' => false,
    ]);
    Post::factory()->draft()->create([
        'title' => 'Draft Story',
        'is_featured' => false,
    ]);
    Post::factory()->featured()->create([
        'title' => 'Featured Story',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.posts.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/posts/index')
            ->has('posts.data', 3)
            ->where('stats.total', 3)
            ->where('stats.published', 2)
            ->where('stats.drafts', 1)
            ->where('stats.featured', 1));

    $this->actingAs($editor)->get(route('admin.posts.index'))->assertOk();
});

test('admin can filter posts by status category and search', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    Post::factory()->published()->create([
        'title' => 'Education Scholarship',
        'excerpt' => 'Scholarships for secondary school',
        'category' => 'education',
        'is_featured' => false,
    ]);
    Post::factory()->draft()->create([
        'title' => 'Clinic Draft',
        'excerpt' => 'Healthcare draft notes',
        'category' => 'healthcare',
        'is_featured' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.posts.index', ['status' => 'draft']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('posts.data', 1)
            ->where('posts.data.0.title', 'Clinic Draft')
            ->where('filters.status', 'draft'));

    $this->actingAs($admin)
        ->get(route('admin.posts.index', ['category' => 'education']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('posts.data', 1)
            ->where('posts.data.0.category', 'education')
            ->where('filters.category', 'education'));

    $this->actingAs($admin)
        ->get(route('admin.posts.index', ['search' => 'Scholarship']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('posts.data', 1)
            ->where('posts.data.0.title', 'Education Scholarship'));
});

test('finance cannot manage posts', function () {
    $finance = User::factory()->create(['role' => UserRole::Finance]);

    $this->actingAs($finance)->get(route('admin.posts.index'))->assertForbidden();
});

test('admin can create a post with uploaded image and rich text body', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $image = UploadedFile::fake()->image('cover.jpg', 1200, 800);

    $this->actingAs($admin)
        ->post(route('admin.posts.store'), [
            'title' => 'Clean Water Wins',
            'excerpt' => 'A short summary of the project.',
            'body' => '<p>Villagers now have <strong>safe water</strong>.</p><script>alert(1)</script>',
            'featured_image' => $image,
            'category' => 'community',
            'is_featured' => true,
            'published_at' => now()->format('Y-m-d\\TH:i'),
        ])
        ->assertRedirect(route('admin.posts.index'));

    $post = Post::query()->where('title', 'Clean Water Wins')->first();

    expect($post)->not->toBeNull()
        ->and($post->slug)->toBe('clean-water-wins')
        ->and($post->author_id)->toBe($admin->id)
        ->and($post->is_featured)->toBeTrue()
        ->and($post->body)->toBe('<p>Villagers now have <strong>safe water</strong>.</p>')
        ->and($post->featured_image)->toStartWith('/storage/posts/');

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $post->featured_image));
});

test('admin can update replace and remove a featured image', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $original = UploadedFile::fake()->image('original.jpg');
    $path = $original->store('posts', 'public');

    $post = Post::factory()->create([
        'title' => 'Original Title',
        'slug' => 'original-title',
        'featured_image' => '/storage/'.$path,
        'is_featured' => false,
        'published_at' => null,
    ]);

    $replacement = UploadedFile::fake()->image('replacement.png');

    $this->actingAs($admin)
        ->put(route('admin.posts.update', $post), [
            'title' => 'Updated Title',
            'excerpt' => 'Updated excerpt for the story.',
            'body' => '<p>Updated body</p>',
            'featured_image' => $replacement,
            'category' => 'education',
            'is_featured' => true,
            'published_at' => now()->format('Y-m-d\\TH:i'),
        ])
        ->assertRedirect(route('admin.posts.index'));

    $post->refresh();

    expect($post)
        ->title->toBe('Updated Title')
        ->slug->toBe('updated-title')
        ->category->toBe('education')
        ->is_featured->toBeTrue()
        ->body->toBe('<p>Updated body</p>');

    Storage::disk('public')->assertMissing($path);
    Storage::disk('public')->assertExists(str_replace('/storage/', '', $post->featured_image));

    $this->actingAs($admin)
        ->put(route('admin.posts.update', $post), [
            'title' => 'Updated Title',
            'excerpt' => 'Updated excerpt for the story.',
            'body' => '<p>Updated body</p>',
            'remove_featured_image' => true,
            'category' => 'education',
            'is_featured' => true,
            'published_at' => now()->format('Y-m-d\\TH:i'),
        ])
        ->assertRedirect(route('admin.posts.index'));

    expect($post->fresh()->featured_image)->toBeNull();

    $this->actingAs($admin)
        ->delete(route('admin.posts.destroy', $post))
        ->assertRedirect(route('admin.posts.index'));

    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
});

test('creating a post with a duplicate title gets a unique slug', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    Post::factory()->create([
        'title' => 'Community Day',
        'slug' => 'community-day',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.posts.store'), [
            'title' => 'Community Day',
            'excerpt' => 'Another community story.',
            'body' => '<p>Details about the day.</p>',
            'category' => 'community',
            'is_featured' => false,
        ])
        ->assertRedirect(route('admin.posts.index'));

    $this->assertDatabaseHas('posts', [
        'title' => 'Community Day',
        'slug' => 'community-day-1',
    ]);
});

test('public news page renders sanitized rich text body', function () {
    $post = Post::factory()->published()->create([
        'title' => 'Open Day',
        'slug' => 'open-day',
        'body' => '<p>Join us for <em>impact</em>.</p>',
        'featured_image' => '/storage/posts/open-day.jpg',
    ]);

    $this->get(route('news.show', $post))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/news/show')
            ->where('post.featured_image', '/storage/posts/open-day.jpg')
            ->where('post.body', '<p>Join us for <em>impact</em>.</p>'));
});
