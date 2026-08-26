<?php

namespace App\Enums;

enum GalleryMediaType: string
{
    case Image = 'image';
    case Video = 'video';

    public function label(): string
    {
        return match ($this) {
            self::Image => 'Image',
            self::Video => 'Video',
        };
    }

    public function isVideo(): bool
    {
        return $this === self::Video;
    }
}
