<?php

use App\Enums\UserRole;
use App\Models\User;
use App\Notifications\AccountInvitation;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;

test('admin can invite a new staff member', function () {
    Notification::fake();

    $admin = User::factory()->create(['role' => UserRole::Admin]);

    $this->actingAs($admin)->post('/admin/users', [
        'name' => 'New Editor',
        'email' => 'new-editor@example.com',
        'role' => 'editor',
    ])->assertRedirect('/admin/users');

    $invited = User::where('email', 'new-editor@example.com')->first();

    expect($invited)->not->toBeNull();
    expect($invited->role)->toBe(UserRole::Editor);
    expect($invited->email_verified_at)->toBeNull();

    Notification::assertSentTo($invited, AccountInvitation::class);
});

test('non-admin staff cannot invite users', function () {
    $editor = User::factory()->create(['role' => UserRole::Editor]);

    $this->actingAs($editor)->post('/admin/users', [
        'name' => 'New User',
        'email' => 'new-user@example.com',
        'role' => 'editor',
    ])->assertForbidden();
});

test('invited user can accept their invite and set a password', function () {
    $user = User::factory()->unverified()->create(['role' => UserRole::Volunteer]);

    $url = URL::temporarySignedRoute('invite.accept', now()->addDays(7), ['user' => $user->id]);

    $this->get($url)->assertOk();

    $this->post($url, [
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertRedirect(route('portal.index'));

    $this->assertAuthenticatedAs($user->fresh());
    expect($user->fresh()->email_verified_at)->not->toBeNull();
});

test('staff invite redirects to the dashboard after activation', function () {
    $user = User::factory()->unverified()->create(['role' => UserRole::Editor]);

    $url = URL::temporarySignedRoute('invite.accept', now()->addDays(7), ['user' => $user->id]);

    $this->post($url, [
        'password' => 'new-password',
        'password_confirmation' => 'new-password',
    ])->assertRedirect(route('dashboard'));
});

test('an already-activated invite link cannot be reused', function () {
    $user = User::factory()->create(); // already verified by default

    $url = URL::temporarySignedRoute('invite.accept', now()->addDays(7), ['user' => $user->id]);

    $this->get($url)->assertRedirect(route('login'));
    $this->post($url, ['password' => 'x', 'password_confirmation' => 'x'])->assertStatus(422);
});

test('an expired invite link is rejected', function () {
    $user = User::factory()->unverified()->create();

    $url = URL::temporarySignedRoute('invite.accept', now()->subDay(), ['user' => $user->id]);

    $this->get($url)->assertForbidden();
});
