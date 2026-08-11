<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GalleryVisitor
{
    public static function token(Request $request): string
    {
        if (! $request->session()->has('gallery_visitor_token')) {
            $request->session()->put('gallery_visitor_token', (string) Str::uuid());
        }

        return (string) $request->session()->get('gallery_visitor_token');
    }
}
