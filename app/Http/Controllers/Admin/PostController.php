<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/posts/index', [
            'posts' => Post::query()->with('author:id,name')->latest()->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author_id'] = $request->user()->id;

        Post::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post created.')]);

        return to_route('admin.posts.index');
    }

    public function edit(Post $post): Response
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post,
        ]);
    }

    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $this->validated($request);

        $validated['slug'] = Str::slug($validated['title']);

        $post->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post updated.')]);

        return to_route('admin.posts.index');
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post deleted.')]);

        return to_route('admin.posts.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string', 'max:500'],
            'body' => ['required', 'string'],
            'featured_image' => ['nullable', 'string', 'max:2048'],
            'category' => ['required', 'in:education,healthcare,community,relief'],
            'is_featured' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);
    }
}
