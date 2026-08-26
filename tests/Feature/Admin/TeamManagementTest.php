<?php

use App\Enums\TeamMemberType;
use App\Enums\UserRole;
use App\Models\TeamMember;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('admins and editors can list team members with stats', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $editor = User::factory()->create(['role' => UserRole::Editor]);

    TeamMember::factory()->leadership()->create(['name' => 'Melina Diamond']);
    TeamMember::factory()->staff()->create(['name' => 'Abiba Mahama']);
    TeamMember::factory()->board()->create(['name' => 'Prof. Naana Agyemang']);

    $this->actingAs($admin)
        ->get(route('admin.team.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/team/index')
            ->has('members.data', 3)
            ->where('stats.total', 3)
            ->where('stats.leadership', 1)
            ->where('stats.staff', 1)
            ->where('stats.board', 1));

    $this->actingAs($editor)->get(route('admin.team.index'))->assertOk();
});

test('admin can filter team members by type status and search', function () {
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    TeamMember::factory()->leadership()->create([
        'name' => 'Melina Diamond',
        'role' => 'Founder & Executive Director',
        'is_active' => true,
    ]);
    TeamMember::factory()->board()->create([
        'name' => 'Samuel Quartey',
        'role' => 'Board Treasurer',
        'is_active' => false,
    ]);

    $this->actingAs($admin)
        ->get(route('admin.team.index', ['type' => 'leadership']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('members.data', 1)
            ->where('members.data.0.type', 'leadership')
            ->where('filters.type', 'leadership'));

    $this->actingAs($admin)
        ->get(route('admin.team.index', ['status' => 'hidden']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('members.data', 1)
            ->where('members.data.0.name', 'Samuel Quartey'));

    $this->actingAs($admin)
        ->get(route('admin.team.index', ['search' => 'Founder']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('members.data', 1)
            ->where('members.data.0.name', 'Melina Diamond'));
});

test('finance cannot manage the team', function () {
    $finance = User::factory()->create(['role' => UserRole::Finance]);

    $this->actingAs($finance)->get(route('admin.team.index'))->assertForbidden();
});

test('admin can create a team member with an uploaded photo', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $photo = UploadedFile::fake()->image('melina.jpg', 600, 750);

    $this->actingAs($admin)
        ->post(route('admin.team.store'), [
            'name' => 'Melina Diamond',
            'role' => 'Founder & Executive Director',
            'photo' => $photo,
            'bio' => 'Founder of HopeSpring Foundation.',
            'email' => 'melina@hopespringfoundation.org',
            'linkedin' => '',
            'type' => TeamMemberType::Leadership->value,
            'sort_order' => 1,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.team.index'));

    $member = TeamMember::query()->where('name', 'Melina Diamond')->first();

    expect($member)->not->toBeNull()
        ->and($member->photo)->toStartWith('/storage/team/')
        ->and($member->type)->toBe(TeamMemberType::Leadership)
        ->and($member->role)->toBe('Founder & Executive Director')
        ->and($member->is_active)->toBeTrue();

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $member->photo));
});

test('admin can update replace photo and delete a team member', function () {
    Storage::fake('public');

    $admin = User::factory()->create(['role' => UserRole::Admin]);
    $original = UploadedFile::fake()->image('original.jpg');
    $path = $original->store('team', 'public');

    $member = TeamMember::factory()->staff()->create([
        'name' => 'Abiba Mahama',
        'role' => 'Education Programme Coordinator',
        'photo' => '/storage/'.$path,
        'is_active' => true,
        'sort_order' => 4,
    ]);

    $replacement = UploadedFile::fake()->image('replacement.png');

    $this->actingAs($admin)
        ->put(route('admin.team.update', $member), [
            'name' => 'Abiba Mahama',
            'role' => 'Education Lead',
            'photo' => $replacement,
            'bio' => 'Coordinates scholarships.',
            'email' => 'abiba@hopespringfoundation.org',
            'linkedin' => '',
            'type' => TeamMemberType::Staff->value,
            'sort_order' => 5,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.team.index'));

    $member->refresh();

    expect($member)
        ->role->toBe('Education Lead')
        ->photo->toStartWith('/storage/team/')
        ->photo->not->toBe('/storage/'.$path)
        ->sort_order->toBe(5);

    Storage::disk('public')->assertExists(str_replace('/storage/', '', $member->photo));

    $this->actingAs($admin)
        ->delete(route('admin.team.destroy', $member))
        ->assertRedirect(route('admin.team.index'));

    expect(TeamMember::query()->find($member->id))->toBeNull();
});

test('inactive team members are hidden from the about page', function () {
    TeamMember::factory()->leadership()->create([
        'name' => 'Visible Leader',
        'is_active' => true,
        'sort_order' => 1,
    ]);

    TeamMember::factory()->board()->create([
        'name' => 'Hidden Director',
        'is_active' => false,
        'sort_order' => 2,
    ]);

    $this->get(route('about'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/about')
            ->has('team', 1)
            ->where('team.0.name', 'Visible Leader')
            ->where('team.0.type', 'leadership'));
});
