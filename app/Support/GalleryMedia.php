<?php

namespace App\Support;

use App\Enums\GalleryMediaType;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class GalleryMedia
{
    public const int MAX_KILOBYTES = 51200;

    /** @var list<string> */
    public const array CATEGORIES = ['water', 'education', 'healthcare', 'community', 'events'];

    /** @var list<string> */
    public const array IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

    /** @var list<string> */
    public const array VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov'];

    /**
     * @return list<string>
     */
    public static function extensions(): array
    {
        return [...self::IMAGE_EXTENSIONS, ...self::VIDEO_EXTENSIONS];
    }

    public static function mimesRule(): string
    {
        return implode(',', self::extensions());
    }

    public static function typeFromFilename(string $filename): ?GalleryMediaType
    {
        $extension = Str::lower(pathinfo($filename, PATHINFO_EXTENSION));

        if ($extension === '') {
            $extension = Str::lower($filename);
        }

        return self::typeFromExtension($extension);
    }

    public static function typeFromExtension(string $extension): ?GalleryMediaType
    {
        $extension = Str::lower($extension);

        if (in_array($extension, self::IMAGE_EXTENSIONS, true)) {
            return GalleryMediaType::Image;
        }

        if (in_array($extension, self::VIDEO_EXTENSIONS, true)) {
            return GalleryMediaType::Video;
        }

        return null;
    }

    /**
     * @return array{src: string, media_type: GalleryMediaType}
     */
    public static function store(UploadedFile $file, string $directory = 'gallery'): array
    {
        $mediaType = self::typeFromFilename($file->getClientOriginalName())
            ?? self::typeFromExtension((string) $file->guessExtension())
            ?? GalleryMediaType::Image;

        return [
            'src' => '/storage/'.$file->store($directory, 'public'),
            'media_type' => $mediaType,
        ];
    }

    /**
     * @return array{src: string, media_type: GalleryMediaType}|null
     */
    public static function importPath(string $absolutePath, string $directory = 'gallery'): ?array
    {
        $mediaType = self::typeFromFilename($absolutePath);

        if ($mediaType === null || ! is_file($absolutePath)) {
            return null;
        }

        $contents = file_get_contents($absolutePath);

        if ($contents === false) {
            return null;
        }

        $extension = Str::lower(pathinfo($absolutePath, PATHINFO_EXTENSION));
        $relative = $directory.'/'.sha1($contents).'.'.$extension;

        Storage::disk('public')->put($relative, $contents);

        return [
            'src' => '/storage/'.$relative,
            'media_type' => $mediaType,
        ];
    }
}
