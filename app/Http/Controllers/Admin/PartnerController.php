<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use App\Support\PublicImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PartnerController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->toString(),
            'status' => $request->string('status')->trim()->toString(),
        ];

        $partners = Partner::query()
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('name', 'like', '%'.$filters['search'].'%')
                        ->orWhere('url', 'like', '%'.$filters['search'].'%');
                });
            })
            ->when($filters['status'] === 'active', fn ($query) => $query->where('is_active', true))
            ->when($filters['status'] === 'hidden', fn ($query) => $query->where('is_active', false))
            ->orderBy('sort_order')
            ->orderBy('name')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('admin/partners/index', [
            'partners' => $partners,
            'filters' => $filters,
            'stats' => [
                'total' => Partner::query()->count(),
                'active' => Partner::query()->where('is_active', true)->count(),
                'hidden' => Partner::query()->where('is_active', false)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/partners/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request);
        $validated['logo'] = PublicImage::store($request->file('logo'), 'partners');
        unset($validated['remove_logo']);

        Partner::create($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Partner created.')]);

        return to_route('admin.partners.index');
    }

    public function edit(Partner $partner): Response
    {
        return Inertia::render('admin/partners/edit', [
            'partner' => $partner,
        ]);
    }

    public function update(Request $request, Partner $partner): RedirectResponse
    {
        $validated = $this->validated($request);

        if ($request->boolean('remove_logo')) {
            PublicImage::delete($partner->logo);
            $validated['logo'] = null;
        } elseif ($request->hasFile('logo')) {
            PublicImage::delete($partner->logo);
            $validated['logo'] = PublicImage::store($request->file('logo'), 'partners');
        } else {
            unset($validated['logo']);
        }

        unset($validated['remove_logo']);

        $partner->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Partner updated.')]);

        return to_route('admin.partners.index');
    }

    public function destroy(Partner $partner): RedirectResponse
    {
        PublicImage::delete($partner->logo);
        $partner->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Partner deleted.')]);

        return to_route('admin.partners.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        $request->merge([
            'url' => $request->filled('url') ? $request->string('url')->toString() : null,
            'is_active' => $request->boolean('is_active'),
            'remove_logo' => $request->boolean('remove_logo'),
        ]);

        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'remove_logo' => ['boolean'],
            'url' => ['nullable', 'url', 'max:2048'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
            'is_active' => ['boolean'],
        ]);
    }
}
