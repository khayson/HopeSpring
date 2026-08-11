<?php

use App\Models\SiteSetting;
use App\Support\AboutPageSettings;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        foreach (AboutPageSettings::defaults() as $setting) {
            SiteSetting::query()->updateOrCreate(
                ['key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'group' => $setting['group'],
                ],
            );
        }
    }

    public function down(): void
    {
        SiteSetting::query()
            ->whereIn('key', array_column(AboutPageSettings::defaults(), 'key'))
            ->delete();
    }
};
