<?php

use App\Models\Milestone;
use App\Models\TeamMember;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Replace PDF founder wording with the homepage mockup story.
     */
    public function up(): void
    {
        $story = 'HopeSpring Foundation was born out of a simple act of compassion that revealed a deep need. What started with one child\'s joy has grown into a mission to bring lasting change to many lives.';

        TeamMember::query()
            ->where('name', 'Melina Diamond')
            ->update(['bio' => $story]);

        Milestone::query()
            ->where('year', '2015')
            ->where('title', 'Foundation Established')
            ->update(['description' => $story]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left blank: prior wording lived in the profile PDF alignment migration.
    }
};
