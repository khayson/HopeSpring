<?php

use App\Models\Programme;
use App\Models\SiteSetting;
use App\Support\HomePageSettings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        foreach (HomePageSettings::defaults() as $setting) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'group' => $setting['group'],
                ],
            );
        }

        $programmePhotos = [
            'clean-water-initiative' => '/images/home-programme-water.jpg',
            'education-for-all' => '/images/home-programme-education.jpg',
            'healthcare-outreach' => '/images/home-programme-healthcare.jpg',
            'community-development' => '/images/home-programme-community.jpg',
        ];

        foreach ($programmePhotos as $slug => $photo) {
            Programme::query()->where('slug', $slug)->update(['photo' => $photo]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        SiteSetting::query()
            ->whereIn('key', array_column(HomePageSettings::defaults(), 'key'))
            ->delete();
    }
};
