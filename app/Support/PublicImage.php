<?php

namespace App\Support;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PublicImage
{
    public static function store(?UploadedFile $file, string $directory): ?string
    {
        if ($file === null) {
            return null;
        }

        return '/storage/'.$file->store($directory, 'public');
    }

    public static function delete(?string $url): void
    {
        if ($url === null || $url === '') {
            return;
        }

        $path = parse_url($url, PHP_URL_PATH) ?: $url;

        if (! is_string($path) || ! str_starts_with($path, '/storage/')) {
            return;
        }

        Storage::disk('public')->delete(ltrim(substr($path, strlen('/storage/')), '/'));
    }
}
