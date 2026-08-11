<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGalleryImageCommentRequest;
use App\Models\GalleryImage;
use Illuminate\Http\RedirectResponse;

class GalleryImageCommentController extends Controller
{
    public function store(StoreGalleryImageCommentRequest $request, GalleryImage $galleryImage): RedirectResponse
    {
        $galleryImage->comments()->create($request->validated());

        return back()->with('success', 'Thanks for your comment.');
    }
}
