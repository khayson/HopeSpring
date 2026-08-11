<?php

use App\Models\Post;

test('news index renders featured and latest stories', function () {
    $featured = Post::factory()->featured()->create([
        'title' => 'Featured borehole story',
        'category' => 'community',
    ]);

    $latest = Post::factory()->published()->create([
        'title' => 'Classroom opening update',
        'category' => 'education',
        'is_featured' => false,
        'published_at' => now()->subDay(),
    ]);

    $this->get(route('news.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/news/index')
            ->where('featuredPost.id', $featured->id)
            ->where('featuredPost.title', 'Featured borehole story')
            ->has('posts.data', 1)
            ->where('posts.data.0.id', $latest->id)
            ->where('currentCategory', null)
            ->has('categories'));
});

test('news index filters by category and hides featured block', function () {
    Post::factory()->featured()->create([
        'title' => 'Featured healthcare story',
        'category' => 'healthcare',
    ]);

    Post::factory()->published()->create([
        'title' => 'Education scholarship story',
        'category' => 'education',
        'is_featured' => false,
    ]);

    $this->get(route('news.index', ['category' => 'education']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/news/index')
            ->where('featuredPost', null)
            ->where('currentCategory', 'education')
            ->has('posts.data', 1)
            ->where('posts.data.0.category', 'education'));
});

test('news show page renders a published story with related posts', function () {
    $post = Post::factory()->published()->create([
        'title' => 'Water committee training',
        'slug' => 'water-committee-training',
        'category' => 'community',
        'featured_image' => '/images/news-hero.jpg',
        'excerpt' => 'Communities learning to care for new water points.',
    ]);

    $related = Post::factory()->published()->create([
        'title' => 'WASH training follow-up',
        'category' => 'community',
        'is_featured' => false,
        'published_at' => now()->subDays(2),
    ]);

    Post::factory()->published()->create([
        'title' => 'Scholarship update',
        'category' => 'education',
        'is_featured' => false,
    ]);

    $this->get(route('news.show', $post))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/news/show')
            ->where('post.title', 'Water committee training')
            ->where('post.slug', 'water-committee-training')
            ->where('post.featured_image', '/images/news-hero.jpg')
            ->where('shareUrl', route('news.show', $post, absolute: true))
            ->has('relatedPosts', 1)
            ->where('relatedPosts.0.id', $related->id));
});

test('draft news stories are not publicly viewable', function () {
    $post = Post::factory()->draft()->create([
        'slug' => 'unpublished-story',
    ]);

    $this->get(route('news.show', $post))->assertNotFound();
});
