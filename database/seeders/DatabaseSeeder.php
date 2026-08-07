<?php

namespace Database\Seeders;

use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\Event;
use App\Models\GalleryImage;
use App\Models\ImpactStat;
use App\Models\Milestone;
use App\Models\NewsletterSubscriber;
use App\Models\Partner;
use App\Models\Post;
use App\Models\Programme;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'HopeSpring Admin',
            'email' => 'admin@hopespringfoundation.org',
        ]);

        $this->seedProgrammesAndProjects();
        $this->seedPosts($admin);
        $this->seedTeamMembers();
        $this->seedGalleryImages();
        $this->seedEvents();
        $this->seedDonations();
        $this->seedContactMessages();
        $this->seedNewsletterSubscribers();
        $this->seedImpactStats();
        $this->seedMilestones();
        $this->seedPartners();
        $this->seedSiteSettings();
    }

    private function seedProgrammesAndProjects(): void
    {
        $programmes = [
            ['title' => 'Clean Water Initiative', 'slug' => 'clean-water-initiative', 'description' => 'Providing safe, clean drinking water to rural communities across Ghana through borehole construction, water purification systems, and community education on water sanitation.', 'icon' => 'Droplets', 'sort_order' => 1],
            ['title' => 'Education for All', 'slug' => 'education-for-all', 'description' => 'Supporting children and young adults with scholarships, school supplies, infrastructure improvements, and teacher training programmes in underserved communities.', 'icon' => 'GraduationCap', 'sort_order' => 2],
            ['title' => 'Healthcare Outreach', 'slug' => 'healthcare-outreach', 'description' => 'Delivering essential healthcare services, medical supplies, and health education to communities with limited access to medical facilities.', 'icon' => 'HeartPulse', 'sort_order' => 3],
            ['title' => 'Community Development', 'slug' => 'community-development', 'description' => 'Empowering communities through sustainable livelihood programmes, infrastructure development, and capacity building initiatives.', 'icon' => 'Users', 'sort_order' => 4],
        ];

        foreach ($programmes as $programmeData) {
            $programme = Programme::create($programmeData);
            Project::factory()->count(3)->create(['programme_id' => $programme->id]);
        }
    }

    private function seedPosts(User $author): void
    {
        Post::factory()->count(8)->published()->create(['author_id' => $author->id]);
        Post::factory()->featured()->create(['author_id' => $author->id]);
        Post::factory()->count(2)->draft()->create(['author_id' => $author->id]);
    }

    private function seedTeamMembers(): void
    {
        $leadership = [
            ['name' => 'Kwame Asante', 'role' => 'Founder & Executive Director', 'type' => 'leadership', 'sort_order' => 1, 'bio' => 'Kwame founded HopeSpring in 2015 after witnessing the water crisis in northern Ghana. With over 15 years of experience in international development, he leads the foundation\'s vision and strategy.'],
            ['name' => 'Ama Mensah', 'role' => 'Deputy Director', 'type' => 'leadership', 'sort_order' => 2, 'bio' => 'Ama brings a decade of programme management expertise to HopeSpring. She oversees daily operations and ensures all programmes deliver measurable impact.'],
            ['name' => 'Kofi Darko', 'role' => 'Head of Programmes', 'type' => 'leadership', 'sort_order' => 3, 'bio' => 'Kofi manages all four programme areas and coordinates with field teams across the country to ensure effective implementation.'],
        ];

        foreach ($leadership as $member) {
            TeamMember::create($member);
        }

        TeamMember::factory()->count(5)->create(['type' => 'staff']);
        TeamMember::factory()->count(4)->board()->create();
    }

    private function seedGalleryImages(): void
    {
        GalleryImage::factory()->count(16)->create();
    }

    private function seedEvents(): void
    {
        Event::factory()->count(3)->upcoming()->create();
        Event::factory()->count(4)->create([
            'starts_at' => fake()->dateTimeBetween('-6 months', '-1 day'),
        ]);
    }

    private function seedDonations(): void
    {
        Donation::factory()->count(25)->successful()->create();
        Donation::factory()->count(3)->create(['status' => 'pending']);
    }

    private function seedContactMessages(): void
    {
        ContactMessage::factory()->count(10)->create();
    }

    private function seedNewsletterSubscribers(): void
    {
        NewsletterSubscriber::factory()->count(30)->create();
    }

    private function seedImpactStats(): void
    {
        $stats = [
            ['label' => 'Lives Impacted', 'value' => 25000, 'suffix' => '+', 'sort_order' => 1],
            ['label' => 'Water Projects', 'value' => 50, 'sort_order' => 2],
            ['label' => 'Children Supported', 'value' => 3000, 'suffix' => '+', 'sort_order' => 3],
            ['label' => 'Communities Served', 'value' => 100, 'sort_order' => 4],
        ];

        foreach ($stats as $stat) {
            ImpactStat::create($stat);
        }
    }

    private function seedMilestones(): void
    {
        $milestones = [
            ['year' => '2015', 'title' => 'Foundation Established', 'description' => 'HopeSpring Foundation was founded in Accra, Ghana, with a mission to transform lives through sustainable development.', 'sort_order' => 1],
            ['year' => '2016', 'title' => 'First Water Project', 'description' => 'Completed our first borehole project in the Upper East Region, providing clean water to over 500 people.', 'sort_order' => 2],
            ['year' => '2018', 'title' => 'Education Programme Launch', 'description' => 'Launched the Education for All programme, sponsoring 200 children in their first year.', 'sort_order' => 3],
            ['year' => '2020', 'title' => 'Healthcare Outreach Begins', 'description' => 'Expanded into healthcare with mobile clinics serving remote communities in the Northern Region.', 'sort_order' => 4],
            ['year' => '2023', 'title' => '10,000 Lives Milestone', 'description' => 'Reached the milestone of impacting over 10,000 lives across all programme areas.', 'sort_order' => 5],
            ['year' => '2025', 'title' => '25,000 Lives & Growing', 'description' => 'Surpassed 25,000 lives impacted with expansion into 100 communities and 50 water projects completed.', 'sort_order' => 6],
        ];

        foreach ($milestones as $milestone) {
            Milestone::create($milestone);
        }
    }

    private function seedPartners(): void
    {
        $partners = [
            ['name' => 'UNICEF Ghana', 'sort_order' => 1],
            ['name' => 'World Vision', 'sort_order' => 2],
            ['name' => 'Ghana Health Service', 'sort_order' => 3],
            ['name' => 'WaterAid', 'sort_order' => 4],
            ['name' => 'Ghana Education Service', 'sort_order' => 5],
            ['name' => 'MTN Ghana Foundation', 'sort_order' => 6],
        ];

        foreach ($partners as $partner) {
            Partner::create($partner);
        }
    }

    private function seedSiteSettings(): void
    {
        $settings = [
            ['key' => 'site_name', 'value' => 'HopeSpring Foundation', 'group' => 'general'],
            ['key' => 'site_tagline', 'value' => 'Transforming Lives, Building Futures', 'group' => 'general'],
            ['key' => 'contact_email', 'value' => 'info@hopespringfoundation.org', 'group' => 'contact'],
            ['key' => 'contact_phone', 'value' => '+233 24 123 4567', 'group' => 'contact'],
            ['key' => 'contact_address', 'value' => 'East Legon, Accra, Ghana', 'group' => 'contact'],
            ['key' => 'about_mission', 'value' => 'To empower underserved communities in Ghana through sustainable clean water, education, healthcare, and community development programmes.', 'group' => 'about'],
            ['key' => 'about_vision', 'value' => 'A Ghana where every community has access to clean water, quality education, and essential healthcare.', 'group' => 'about'],
            ['key' => 'social_facebook', 'value' => 'https://facebook.com/hopespringfoundation', 'group' => 'social'],
            ['key' => 'social_twitter', 'value' => 'https://twitter.com/hopespringgh', 'group' => 'social'],
            ['key' => 'social_instagram', 'value' => 'https://instagram.com/hopespringfoundation', 'group' => 'social'],
            ['key' => 'social_linkedin', 'value' => 'https://linkedin.com/company/hopespring-foundation', 'group' => 'social'],
            ['key' => 'paystack_public_key', 'value' => '', 'group' => 'payment'],
            ['key' => 'donation_goal', 'value' => '500000', 'group' => 'payment'],
        ];

        foreach ($settings as $setting) {
            SiteSetting::create($setting);
        }
    }
}
