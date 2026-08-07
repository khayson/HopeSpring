<?php

use App\Enums\UserRole;
use App\Models\Inquiry;
use App\Models\User;
use App\Notifications\AccountInvitation;
use Illuminate\Support\Facades\Notification;

test('a visitor can submit a volunteer inquiry', function () {
    $this->post('/get-involved/volunteer', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '+233241234567',
        'message' => 'I would love to help with the water programme.',
    ])->assertRedirect();

    $this->assertDatabaseHas('inquiries', [
        'type' => 'volunteer',
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'status' => 'new',
    ]);
});

test('a partner inquiry requires an organisation name', function () {
    $this->post('/get-involved/partner', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'message' => 'We would like to partner with you.',
    ])->assertSessionHasErrors('organisation');
});

test('a partner inquiry succeeds with an organisation name', function () {
    $this->post('/get-involved/partner', [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'organisation' => 'Acme Corp',
        'message' => 'We would like to partner with you.',
    ])->assertRedirect();

    $this->assertDatabaseHas('inquiries', [
        'type' => 'partner',
        'organisation' => 'Acme Corp',
    ]);
});

test('only admins can view inquiries', function () {
    $editor = User::factory()->create(['role' => UserRole::Editor]);

    $this->actingAs($editor)->get('/admin/inquiries')->assertForbidden();
});

test('admin can convert an inquiry into an account with an invite', function () {
    Notification::fake();

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $inquiry = Inquiry::factory()->volunteer()->create(['status' => 'new']);

    $this->actingAs($admin)
        ->post("/admin/inquiries/{$inquiry->id}/invite")
        ->assertRedirect();

    $inquiry->refresh();

    expect($inquiry->status)->toBe('converted');
    expect($inquiry->converted_user_id)->not->toBeNull();

    $newUser = User::find($inquiry->converted_user_id);
    expect($newUser->role)->toBe(UserRole::Volunteer);

    Notification::assertSentTo($newUser, AccountInvitation::class);
});

test('an inquiry cannot be converted twice', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $convertedInto = User::factory()->create(['role' => UserRole::Volunteer]);
    $inquiry = Inquiry::factory()->volunteer()->create([
        'status' => 'converted',
        'converted_user_id' => $convertedInto->id,
    ]);

    $this->actingAs($admin)
        ->post("/admin/inquiries/{$inquiry->id}/invite")
        ->assertStatus(422);
});
