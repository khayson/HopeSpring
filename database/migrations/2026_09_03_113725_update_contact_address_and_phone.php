<?php

use App\Models\SiteSetting;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Align public contact details with the foundation's current address and phones.
     */
    public function up(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'contact_address'],
            [
                'value' => 'Tema Golf City, Samuel Narh Street',
                'group' => 'contact',
            ],
        );

        SiteSetting::query()->updateOrCreate(
            ['key' => 'contact_phone'],
            [
                'value' => '0501265688 / 0208664519',
                'group' => 'contact',
            ],
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['key' => 'contact_address'],
            [
                'value' => 'East Legon, Accra Ghana',
                'group' => 'contact',
            ],
        );

        SiteSetting::query()->updateOrCreate(
            ['key' => 'contact_phone'],
            [
                'value' => '+233 24 123 4567',
                'group' => 'contact',
            ],
        );
    }
};
