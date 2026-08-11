<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Support\PublicImage;
use App\Support\RichText;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->toString(),
            'status' => $request->string('status')->trim()->toString(),
            'category' => $request->string('category')->trim()->toString(),
        ];

        $posts = Post::query()
            ->with('author:id,name')
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('title', 'like', '%'.$filters['search'].'%')
                        ->orWhere('excerpt', 'like', '%'.$filters['search'].'%');
                });
            })
            ->when($filters['status'] === 'published', fn ($query) => $query->published())
            ->when($filters['status'] === 'draft', fn ($query) => $query->whereNull('published_at'))
            ->when($filters['status'] === 'featured', fn ($query) => $query->where('is_featured', true))
            ->when(
                in_array($filters['category'], ['education', 'healthcare', 'community', 'relief'], true),
                fn ($query) => $query->where('category', $filters['category']),
            )
            ->latest()
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Post $post): array => [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $post->excerpt,
                'featured_image' => $post->featured_image,
                'category' => $post->category,
                'published_at' => $post->published_at,
                'is_featured' => $post->is_featured,
                'is_published' => $post->published_at !== null && $post->published_at->lte(now()),
                'author' => [
                    'name' => $post->author->name,
                ],
            ]);

        return Inertia::render('admin/posts/index', [
            'posts' => $posts,
            'filters' => $filters,
            'stats' => [
                'total' => Post::query()->count(),
                'published' => Post::query()->published()->count(),
                'drafts' => Post::query()->whereNull('published_at')->count(),
                'featured' => Post::query()->where('is_featured', true)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/posts/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $validated['slug'] = $this->uniqueSlug($validated['title']);
        $validated['author_id'] = $request->user()->id;
        $validated['body'] = $this->sanitizeRequiredBody($validated['body']);
        $validated['featured_image'] = PublicImage::store($request->file('featured_image'), 'posts');

        unset($validated['remove_featured_image']);

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
        $validated['slug'] = $this->uniqueSlug($validated['title'], $post);
        $validated['body'] = $this->sanitizeRequiredBody($validated['body']);

        if ($request->boolean('remove_featured_image')) {
            PublicImage::delete($post->featured_image);
            $validated['featured_image'] = null;
        } elseif ($request->hasFile('featured_image')) {
            PublicImage::delete($post->featured_image);
            $validated['featured_image'] = PublicImage::store($request->file('featured_image'), 'posts');
        } else {
            unset($validated['featured_image']);
        }

        unset($validated['remove_featured_image']);

        $post->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post updated.')]);

        return to_route('admin.posts.index');
    }

    public function destroy(Post $post): RedirectResponse
    {
        PublicImage::delete($post->featured_image);
        $post->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Post deleted.')]);

        return to_route('admin.posts.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $request->merge([
            'published_at' => $request->filled('published_at')
                ? $request->string('published_at')->toString()
                : null,
            'is_featured' => $request->boolean('is_featured'),
            'remove_featured_image' => $request->boolean('remove_featured_image'),
        ]);

        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'excerpt' => ['required', 'string', 'max:500'],
            'body' => ['required', 'string'],
            'featured_image' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'remove_featured_image' => ['boolean'],
            'category' => ['required', 'in:education,healthcare,community,relief'],
            'is_featured' => ['boolean'],
            'published_at' => ['nullable', 'date'],
        ]);
    }

    private function sanitizeRequiredBody(string $body): string
    {
        $clean = RichText::sanitize($body);

        if ($clean === null) {
            throw ValidationException::withMessages([
                'body' => __('The body field is required.'),
            ]);
        }

        return $clean;
    }

    private function uniqueSlug(string $title, ?Post $ignore = null): string
    {
        $base = Str::slug($title) ?: 'post';
        $slug = $base;
        $suffix = 1;

        while (
            Post::query()
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
