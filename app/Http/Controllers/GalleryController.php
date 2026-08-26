<?php

namespace App\Http\Controllers;

use App\Models\GalleryImage;
use App\Support\GalleryDonationDestination;
use App\Support\GalleryVisitor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = GalleryImage::query()->orderBy('sort_order')->orderBy('id');

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        return Inertia::render('public/gallery/index', [
            'images' => $query->get()->map->toPublicArray()->values(),
            'categories' => GalleryImage::query()->distinct()->whereNotNull('category')->pluck('category'),
            'currentCategory' => $request->input('category'),
        ]);
    }

    public function show(Request $request, GalleryImage $galleryImage): Response
    {
        $ordered = GalleryImage::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $index = $ordered->search(fn (GalleryImage $image): bool => $image->id === $galleryImage->id);
        $previous = $index !== false && $index > 0 ? $ordered[$index - 1] : null;
        $next = $index !== false && $index < $ordered->count() - 1 ? $ordered[$index + 1] : null;

        $relatedQuery = GalleryImage::query()
            ->where('id', '!=', $galleryImage->id);

        if ($galleryImage->category) {
            $relatedQuery->orderByRaw('CASE WHEN category = ? THEN 0 ELSE 1 END', [$galleryImage->category]);
        }

        $related = $relatedQuery
            ->orderBy('sort_order')
            ->take(20)
            ->get()
            ->map->toPublicArray()
            ->values();

        $visitorToken = GalleryVisitor::token($request);

        return Inertia::render('public/gallery/show', [
            'image' => $galleryImage->toPublicArray(),
            'related' => $related,
            'previous' => $previous?->toPublicArray(),
            'next' => $next?->toPublicArray(),
            'position' => $index === false ? 1 : $index + 1,
            'total' => $ordered->count(),
            'likesCount' => $galleryImage->likes()->count(),
            'liked' => $galleryImage->likes()->where('visitor_token', $visitorToken)->exists(),
            'comments' => $galleryImage->comments()
                ->latest()
                ->take(30)
                ->get(['id', 'name', 'body', 'created_at']),
            'donateProgrammeSlug' => GalleryDonationDestination::programmeSlugForCategory($galleryImage->category),
        ]);
    }
}
