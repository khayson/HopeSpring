<?php

namespace App\Http\Controllers;

use App\Models\GalleryImage;
use App\Models\GalleryImageLike;
use App\Support\GalleryVisitor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class GalleryImageLikeController extends Controller
{
    public function store(Request $request, GalleryImage $galleryImage): RedirectResponse
    {
        $token = GalleryVisitor::token($request);

        $existing = GalleryImageLike::query()
            ->where('gallery_image_id', $galleryImage->id)
            ->where('visitor_token', $token)
            ->first();

        if ($existing) {
            $existing->delete();
        } else {
            GalleryImageLike::query()->create([
                'gallery_image_id' => $galleryImage->id,
                'visitor_token' => $token,
            ]);
        }

        return back();
    }
}
