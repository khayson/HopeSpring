<?php

use App\Enums\UserRole;
use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\Inquiry;
use App\Models\Partner;
use App\Models\Post;
use App\Models\SiteSetting;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated staff can visit the dashboard', function () {
    $user = User::factory()->create(['role' => UserRole::Admin]);

    $this->actingAs($user)->get(route('dashboard'))->assertOk();
});

test('admin dashboard includes advanced analytics payload', function () {
    $admin = User::factory()->create([
        'name' => 'Akosua Mensah',
        'role' => UserRole::Admin,
    ]);

    SiteSetting::query()->updateOrCreate(
        ['key' => 'donation_goal'],
        ['value' => '500000', 'group' => 'payment'],
    );

    Donation::factory()->successful()->create([
        'amount' => 25000,
        'donor_name' => 'Kwame Boateng',
        'programme' => 'Clean Water Initiative',
        'method' => 'card',
        'created_at' => now()->subDays(2),
    ]);

    Donation::factory()->create([
        'status' => 'pending',
        'amount' => 10000,
    ]);

    ContactMessage::factory()->create([
        'is_read' => false,
        'subject' => 'Need support info',
    ]);

    Inquiry::factory()->create([
        'status' => 'new',
        'type' => 'volunteer',
        'name' => 'Ama Owusu',
    ]);

    Partner::factory()->create([
        'name' => 'WaterAid',
        'is_active' => true,
    ]);

    Post::factory()->create([
        'title' => 'Draft Story',
        'published_at' => null,
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('user.name', 'Akosua Mensah')
            ->where('user.role', 'admin')
            ->where('stats.donationCount', 1)
            ->where('stats.pendingDonations', 1)
            ->where('stats.unreadMessages', 1)
            ->where('stats.openInquiries', 1)
            ->where('stats.activePartners', 1)
            ->where('stats.draftCount', 1)
            ->has('donationTrend', 30)
            ->where('donationBreakdown.success', 1)
            ->where('donationBreakdown.pending', 1)
            ->has('topProgrammes', 1)
            ->where('topProgrammes.0.name', 'Clean Water Initiative')
            ->where('goal.progress', 0.1)
            ->has('attention')
            ->has('activity')
            ->has('recentDonations', 1)
            ->has('recentMessages', 1)
            ->has('recentInquiries', 1)
            ->has('draftPosts', 1));
});

test('finance dashboard hides content management analytics', function () {
    $finance = User::factory()->create(['role' => UserRole::Finance]);

    Donation::factory()->successful()->create(['amount' => 10000]);
    ContactMessage::factory()->create(['is_read' => false]);

    $this->actingAs($finance)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('user.role', 'finance')
            ->where('stats.donationCount', 1)
            ->where('stats.unreadMessages', null)
            ->where('stats.openInquiries', null)
            ->where('stats.postCount', null)
            ->where('contentHealth', null)
            ->where('inquiryBreakdown', null)
            ->where('recentMessages', [])
            ->where('recentInquiries', [])
            ->has('donationTrend', 30));
});
