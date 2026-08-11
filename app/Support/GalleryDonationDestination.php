<?php

namespace App\Support;

class GalleryDonationDestination
{
    /**
     * Map a gallery image category to a programme slug for directed donations.
     */
    public static function programmeSlugForCategory(?string $category): ?string
    {
        return match ($category) {
            'water' => 'clean-water-initiative',
            'education' => 'education-for-all',
            'healthcare' => 'healthcare-outreach',
            'community' => 'community-development',
            default => null,
        };
    }
}
