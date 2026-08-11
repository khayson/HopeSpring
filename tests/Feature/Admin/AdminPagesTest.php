<?php

use App\Enums\UserRole;
use App\Models\ContactMessage;
use App\Models\Donation;
use App\Models\Inquiry;
use App\Models\NewsletterSubscriber;
use App\Models\User;

test('donations index includes modern stats and filters', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    Donation::factory()->create(['status' => 'success', 'amount' => 10000, 'donor_name' => 'Ama Mensah']);
    Donation::factory()->create(['status' => 'pending', 'amount' => 5000]);
    Donation::factory()->create(['status' => 'failed', 'amount' => 2000]);

    $this->actingAs($admin)
        ->get(route('admin.donations.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/donations/index')
            ->where('stats.raised', 10000)
            ->where('stats.successful', 1)
            ->where('stats.pending', 1)
            ->where('stats.failed', 1));

    $this->actingAs($admin)
        ->get(route('admin.donations.index', ['search' => 'Ama']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('donations.data', 1));
});

test('inquiries index includes stats search and filters', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    Inquiry::factory()->create(['status' => 'new', 'type' => 'volunteer', 'name' => 'Kojo Boateng']);
    Inquiry::factory()->create(['status' => 'reviewed', 'type' => 'partner']);
    Inquiry::factory()->create(['status' => 'converted', 'type' => 'volunteer']);

    $this->actingAs($admin)
        ->get(route('admin.inquiries.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/inquiries/index')
            ->where('stats.total', 3)
            ->where('stats.new', 1)
            ->where('stats.reviewed', 1)
            ->where('stats.converted', 1));

    $this->actingAs($admin)
        ->get(route('admin.inquiries.index', ['search' => 'Kojo', 'status' => 'new']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('inquiries.data', 1)
            ->where('inquiries.data.0.name', 'Kojo Boateng'));
});

test('messages index includes unread stats and filters', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    ContactMessage::factory()->create(['is_read' => false, 'subject' => 'Need water help']);
    ContactMessage::factory()->create(['is_read' => true, 'subject' => 'Thank you']);

    $this->actingAs($admin)
        ->get(route('admin.messages.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/messages/index')
            ->where('stats.total', 2)
            ->where('stats.unread', 1)
            ->where('stats.read', 1));

    $this->actingAs($admin)
        ->get(route('admin.messages.index', ['status' => 'unread', 'search' => 'water']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('messages.data', 1));
});

test('newsletter index includes subscriber stats and filters', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    NewsletterSubscriber::factory()->create([
        'email' => 'active@example.com',
        'unsubscribed_at' => null,
    ]);
    NewsletterSubscriber::factory()->create([
        'email' => 'gone@example.com',
        'unsubscribed_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('admin.newsletter.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/newsletter/index')
            ->where('stats.total', 2)
            ->where('stats.active', 1)
            ->where('stats.unsubscribed', 1));

    $this->actingAs($admin)
        ->get(route('admin.newsletter.index', ['status' => 'active', 'search' => 'active@']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('subscribers.data', 1));
});

test('users index includes stats and role filters', function () {
    $admin = User::factory()->create([
        'role' => UserRole::Admin,
        'email_verified_at' => now(),
    ]);
    User::factory()->create([
        'role' => UserRole::Editor,
        'email_verified_at' => null,
        'name' => 'Pending Editor',
    ]);

    $this->actingAs($admin)
        ->get(route('admin.users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/users/index')
            ->where('stats.total', 2)
            ->where('stats.pending', 1)
            ->where('stats.active', 1)
            ->has('roles'));

    $this->actingAs($admin)
        ->get(route('admin.users.index', ['status' => 'pending', 'search' => 'Pending']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Pending Editor'));
});

test('settings page loads for admins', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    $this->actingAs($admin)
        ->get(route('admin.settings.edit'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/settings/index')
            ->has('settings')
            ->has('impactStats'));
});
