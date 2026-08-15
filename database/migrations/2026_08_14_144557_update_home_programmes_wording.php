<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Align home programme labels with the rest of the public site.
     */
    public function up(): void
    {
        $updates = [
            'home_programmes_eyebrow' => 'Our Programmes',
            'home_programmes_cta_label' => 'View All Programmes',
        ];

        foreach ($updates as $key => $value) {
            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $previous = [
            'home_programmes_eyebrow' => 'Our Programs',
            'home_programmes_cta_label' => 'View All Programs',
        ];

        foreach ($previous as $key => $value) {
            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }
    }
};
