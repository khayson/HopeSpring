<?php

use App\Models\Programme;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Give Clean Water a distinct programme detail separate from the hero tagline.
     */
    public function up(): void
    {
        Programme::query()
            ->where('slug', 'clean-water-initiative')
            ->update([
                'long_description' => 'Across the communities we serve, families often walk long distances each day to collect water from streams and open sources — water that is frequently shared with livestock and unsafe to drink. Women and children spend hours carrying heavy buckets home instead of being in school or at work. Our clean water work brings safe, reliable sources closer to where people live.',
            ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Programme::query()
            ->where('slug', 'clean-water-initiative')
            ->update([
                'long_description' => 'Providing clean and safe water to underserved communities.',
            ]);
    }
};
