<?php

use App\Enums\UserRole;
use App\Models\User;

test('guests cannot reach any admin route', function () {
    $this->get('/admin/donations')->assertRedirect('/login');
    $this->get('/admin/events')->assertRedirect('/login');
    $this->get('/admin/users')->assertRedirect('/login');
});

test('volunteers and partners are redirected from the staff dashboard to the portal', function () {
    $volunteer = User::factory()->create(['role' => UserRole::Volunteer]);

    $this->actingAs($volunteer)
        ->get(route('dashboard'))
        ->assertRedirect(route('portal.index'));
});

test('volunteers and partners cannot access admin routes', function () {
    $volunteer = User::factory()->create(['role' => UserRole::Volunteer]);

    $this->actingAs($volunteer)->get('/admin/donations')->assertForbidden();
    $this->actingAs($volunteer)->get('/admin/events')->assertForbidden();
    $this->actingAs($volunteer)->get('/admin/users')->assertForbidden();
});

test('staff cannot access the volunteer/partner portal', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    $this->actingAs($admin)->get(route('portal.index'))->assertForbidden();
});

test('editors can manage events and posts but not donations, messages, or users', function () {
    $editor = User::factory()->create(['role' => UserRole::Editor]);

    $this->actingAs($editor)->get('/admin/events')->assertOk();
    $this->actingAs($editor)->get('/admin/posts')->assertOk();
    $this->actingAs($editor)->get('/admin/partners')->assertOk();
    $this->actingAs($editor)->get('/admin/donations')->assertForbidden();
    $this->actingAs($editor)->get('/admin/messages')->assertForbidden();
    $this->actingAs($editor)->get('/admin/users')->assertForbidden();
});

test('finance can view donations but not events, posts, or users', function () {
    $finance = User::factory()->create(['role' => UserRole::Finance]);

    $this->actingAs($finance)->get('/admin/donations')->assertOk();
    $this->actingAs($finance)->get('/admin/events')->assertForbidden();
    $this->actingAs($finance)->get('/admin/users')->assertForbidden();
});

test('admin can access everything', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    $this->actingAs($admin)->get('/admin/donations')->assertOk();
    $this->actingAs($admin)->get('/admin/events')->assertOk();
    $this->actingAs($admin)->get('/admin/posts')->assertOk();
    $this->actingAs($admin)->get('/admin/partners')->assertOk();
    $this->actingAs($admin)->get('/admin/messages')->assertOk();
    $this->actingAs($admin)->get('/admin/newsletter')->assertOk();
    $this->actingAs($admin)->get('/admin/users')->assertOk();
    $this->actingAs($admin)->get('/admin/inquiries')->assertOk();
    $this->actingAs($admin)->get('/admin/settings')->assertOk();
});

test('public registration is disabled', function () {
    $this->get('/register')->assertNotFound();
    $this->post('/register', [
        'name' => 'Nobody',
        'email' => 'nobody@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ])->assertNotFound();
});
