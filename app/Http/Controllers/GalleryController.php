<?php

namespace App\Http\Controllers;

use App\Models\GalleryImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GalleryController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $query = GalleryImage::orderBy('sort_order');

        if ($request->filled('category')) {
            $query->where('category', $request->input('category'));
        }

        return Inertia::render('public/gallery', [
            'images' => $query->get(['id', 'src', 'alt', 'caption', 'category']),
            'categories' => GalleryImage::distinct()->whereNotNull('category')->pluck('category'),
            'currentCategory' => $request->input('category'),
        ]);
    }
}
