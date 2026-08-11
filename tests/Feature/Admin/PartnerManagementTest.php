<?php

use App\Enums\UserRole;
use App\Models\Partner;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admins and editors can list partners with stats', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $editor = User::factory()->create(['role' => UserRole::Editor]);

    Partner::factory()->create(['name' => 'WaterAid', 'is_active' => true]);
    Partner::factory()->create(['name' => 'Hidden Org', 'is_active' => false]);

    $this->actingAs($admin)->get(route('admin.partners.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/partners/index')
            ->has('partners.data', 2)
            ->where('stats.total', 2)
            ->where('stats.active', 1)
            ->where('stats.hidden', 1));

    $this->actingAs($editor)->get(route('admin.partners.index'))->assertOk();
});

test('admin can filter partners by status and search', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    Partner::factory()->create([
        'name' => 'WaterAid',
        'url' => 'https://wateraid.org',
        'is_active' => true,
    ]);
    Partner::factory()->create([
        'name' => 'Hidden Partner',
        'url' => 'https://hidden.example',
        'is_active' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.partners.index', ['status' => 'active']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('partners.data', 1)
            ->where('partners.data.0.name', 'WaterAid')
            ->where('filters.status', 'active'));

    $this->actingAs($admin)
        ->get(route('admin.partners.index', ['search' => 'hidden.example']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('partners.data', 1)
            ->where('partners.data.0.name', 'Hidden Partner')
            ->where('filters.search', 'hidden.example'));
});

test('finance cannot manage partners', function () {
    $finance = User::factory()->create(['role' => UserRole::Finance]);

    $this->actingAs($finance)->get(route('admin.partners.index'))->assertForbidden();
});

test('admin can create a partner with uploaded logo', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $logo = UploadedFile::fake()->image('unicef.jpg', 400, 200);

    $this->actingAs($admin)
        ->post(route('admin.partners.store'), [
            'name' => 'UNICEF Ghana',
            'logo' => $logo,
            'url' => 'https://www.unicef.org/ghana',
            'sort_order' => 1,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.partners.index'));

    $partner = Partner::query()->where('name', 'UNICEF Ghana')->first();

    expect($partner)->not->toBeNull()
        ->and($partner->logo)->toStartWith('/storage/partners/')
        ->and($partner->url)->toBe('https://www.unicef.org/ghana')
        ->and($partner->sort_order)->toBe(1)
        ->and($partner->is_active)->toBeTrue();

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $partner->logo));
});

test('admin can update replace and delete a partner', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $original = UploadedFile::fake()->image('original.jpg');
    $path = $original->store('partners', 'public');

    $partner = Partner::factory()->create([
        'name' => 'World Vision',
        'logo' => '/storage/'.$path,
        'is_active' => true,
        'sort_order' => 2,
    ]);

    $replacement = UploadedFile::fake()->image('replacement.png');

    $this->actingAs($admin)
        ->put(route('admin.partners.update', $partner), [
            'name' => 'World Vision Ghana',
            'logo' => $replacement,
            'url' => '',
            'sort_order' => 3,
            'is_active' => false,
        ])
        ->assertRedirect(route('admin.partners.index'));

    $partner->refresh();

    expect($partner)
        ->name->toBe('World Vision Ghana')
        ->logo->toStartWith('/storage/partners/')
        ->logo->not->toBe('/storage/'.$path)
        ->url->toBeNull()
        ->sort_order->toBe(3)
        ->is_active->toBeFalse();

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $partner->logo));

    $this->actingAs($admin)
        ->delete(route('admin.partners.destroy', $partner))
        ->assertRedirect(route('admin.partners.index'));

    $this->assertDatabaseMissing('partners', ['id' => $partner->id]);
});

test('inactive partners are hidden from the about page', function () {
    Partner::factory()->create([
        'name' => 'Visible Partner',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    Partner::factory()->create([
        'name' => 'Hidden Partner',
        'is_active' => false,
        'sort_order' => 2,
    ]);

    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/about')
            ->has('partners', 1)
            ->where('partners.0.name', 'Visible Partner'));
});
