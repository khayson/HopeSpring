<?php

use App\Models\Programme;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Give remaining programmes distinct detail copy separate from hero taglines.
     */
    public function up(): void
    {
        $descriptions = [
            'education-for-all' => 'Too many children miss school because fees, uniforms, or the distance to a classroom are simply out of reach. When a girl stays home to fetch water or a boy leaves after primary, the whole community loses future teachers, nurses, and leaders. We support learning with scholarships, better classrooms, and teachers who stay.',
            'healthcare-outreach' => 'In many rural districts the nearest clinic is hours away on foot, so malaria, pregnancy complications, and childhood illness go untreated until it is too late. Our outreach brings screening, maternal care, and essential medicines closer to people — and restocks the small health posts that serve them every day.',
            'community-development' => 'Strong communities need more than one-off gifts. They need places to meet, skills to earn, and local groups that can manage resources after we leave. We invest in savings groups, shared facilities, and practical training so neighbours can keep progress going together.',
            'youth-women-empowerment' => 'Young people and women often carry the heaviest unpaid work yet have the least access to credit, mentoring, and fair work. Without skills and a first opportunity, talent stays locked at home. We open pathways through training, mentorship, and support for small enterprises.',
            'emergency-relief' => 'Floods, fire, and sudden displacement leave families without shelter, food, or clean water overnight. Relief must arrive quickly and respectfully — covering immediate needs while helping people regain footing. We mobilise supplies, coordinate with local authorities, and stay until the acute crisis eases.',
        ];

        foreach ($descriptions as $slug => $longDescription) {
            Programme::query()
                ->where('slug', $slug)
                ->update(['long_description' => $longDescription]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $descriptions = [
            'education-for-all' => 'Empowering children through access to quality education.',
            'healthcare-outreach' => 'Improving health and well-being through medical support.',
            'community-development' => 'Building stronger communities through sustainable projects.',
            'youth-women-empowerment' => 'Equipping youth and women with skills and opportunities.',
            'emergency-relief' => 'Providing urgent support in times of crisis and disasters.',
        ];

        foreach ($descriptions as $slug => $longDescription) {
            Programme::query()
                ->where('slug', $slug)
                ->update(['long_description' => $longDescription]);
        }
    }
};
