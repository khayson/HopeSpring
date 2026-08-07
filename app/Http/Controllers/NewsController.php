<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NewsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Post::published()->with('author:id,name')->latest('published_at');

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        return Inertia::render('public/news/index', [
            'posts' => $query->paginate(9, ['id', 'author_id', 'title', 'slug', 'excerpt', 'featured_image', 'category', 'is_featured', 'published_at']),
            'featuredPost' => Post::published()->featured()->latest('published_at')
                ->first(['id', 'title', 'slug', 'excerpt', 'featured_image', 'category', 'published_at']),
            'categories' => Post::published()->distinct()->pluck('category'),
            'currentCategory' => $request->input('category'),
        ]);
    }

    public function show(Post $post): Response
    {
        abort_unless($post->published_at && $post->published_at->lte(now()), 404);

        return Inertia::render('public/news/show', [
            'post' => $post->load('author:id,name'),
            'relatedPosts' => Post::published()
                ->where('category', $post->category)
                ->where('id', '!=', $post->id)
                ->latest('published_at')
                ->take(3)
                ->get(['id', 'title', 'slug', 'excerpt', 'featured_image', 'category', 'published_at']),
        ]);
    }
}
