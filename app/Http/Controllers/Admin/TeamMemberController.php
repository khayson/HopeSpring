<?php

namespace App\Http\Controllers\Admin;

use App\Enums\TeamMemberType;
use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use App\Support\PublicImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->toString(),
            'type' => $request->string('type')->trim()->toString(),
            'status' => $request->string('status')->trim()->toString(),
        ];

        $members = TeamMember::query()
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('name', 'like', '%'.$filters['search'].'%')
                        ->orWhere('role', 'like', '%'.$filters['search'].'%');
                });
            })
            ->when(
                in_array($filters['type'], array_column(TeamMemberType::cases(), 'value'), true),
                fn ($query) => $query->where('type', $filters['type']),
            )
            ->when($filters['status'] === 'active', fn ($query) => $query->where('is_active', true))
            ->when($filters['status'] === 'hidden', fn ($query) => $query->where('is_active', false))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (TeamMember $member): array => [
                'id' => $member->id,
                'name' => $member->name,
                'role' => $member->role,
                'photo' => $member->photo,
                'type' => $member->type->value,
                'type_label' => $member->type->label(),
                'sort_order' => $member->sort_order,
                'is_active' => $member->is_active,
            ]);

        return Inertia::render('admin/team/index', [
            'members' => $members,
            'filters' => $filters,
            'stats' => [
                'total' => TeamMember::query()->count(),
                'leadership' => TeamMember::query()->where('type', TeamMemberType::Leadership)->count(),
                'staff' => TeamMember::query()->where('type', TeamMemberType::Staff)->count(),
                'board' => TeamMember::query()->where('type', TeamMemberType::Board)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/team/create', [
            'types' => $this->types(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $validated['photo'] = PublicImage::store($request->file('photo'), 'team');
        unset($validated['remove_photo']);

        TeamMember::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team member created.')]);

        return to_route('admin.team.index');
    }

    public function edit(TeamMember $teamMember): Response
    {
        return Inertia::render('admin/team/edit', [
            'member' => [
                'id' => $teamMember->id,
                'name' => $teamMember->name,
                'role' => $teamMember->role,
                'photo' => $teamMember->photo,
                'bio' => $teamMember->bio,
                'email' => $teamMember->email,
                'linkedin' => $teamMember->linkedin,
                'type' => $teamMember->type->value,
                'sort_order' => $teamMember->sort_order,
                'is_active' => $teamMember->is_active,
            ],
            'types' => $this->types(),
        ]);
    }

    public function update(Request $request, TeamMember $teamMember): RedirectResponse
    {
        $validated = $this->validated($request);

        if ($request->boolean('remove_photo')) {
            PublicImage::delete($teamMember->photo);
            $validated['photo'] = null;
        } elseif ($request->hasFile('photo')) {
            PublicImage::delete($teamMember->photo);
            $validated['photo'] = PublicImage::store($request->file('photo'), 'team');
        } else {
            unset($validated['photo']);
        }

        unset($validated['remove_photo']);

        $teamMember->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team member updated.')]);

        return to_route('admin.team.index');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        PublicImage::delete($teamMember->photo);
        $teamMember->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Team member deleted.')]);

        return to_route('admin.team.index');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function types(): array
    {
        return array_map(
            fn (TeamMemberType $type): array => [
                'value' => $type->value,
                'label' => $type->label(),
            ],
            TeamMemberType::cases(),
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $request->merge([
            'bio' => $request->filled('bio') ? $request->string('bio')->toString() : null,
            'email' => $request->filled('email') ? $request->string('email')->toString() : null,
            'linkedin' => $request->filled('linkedin') ? $request->string('linkedin')->toString() : null,
            'is_active' => $request->boolean('is_active'),
            'remove_photo' => $request->boolean('remove_photo'),
        ]);

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'role' => ['required', 'string', 'max:255'],
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'remove_photo' => ['boolean'],
            'bio' => ['nullable', 'string', 'max:2000'],
            'email' => ['nullable', 'email', 'max:255'],
            'linkedin' => ['nullable', 'url', 'max:2048'],
            'type' => ['required', Rule::enum(TeamMemberType::class)],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['boolean'],
        ]);
    }
}
