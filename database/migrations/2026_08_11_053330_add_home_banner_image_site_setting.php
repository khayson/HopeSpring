<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'home_banner_image'],
            [
                'value' => '/images/home-banner.jpg',
                'group' => 'home',
            ],
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        SiteSetting::query()->where('key', 'home_banner_image')->delete();
    }
};
