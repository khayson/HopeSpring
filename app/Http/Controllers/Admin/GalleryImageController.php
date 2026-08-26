<?php

namespace App\Http\Controllers\Admin;

use App\Enums\GalleryMediaType;
use App\Http\Controllers\Controller;
use App\Models\GalleryImage;
use App\Support\GalleryMedia;
use App\Support\PublicImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GalleryImageController extends Controller
{
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->trim()->toString(),
            'category' => $request->string('category')->trim()->toString(),
            'type' => $request->string('type')->trim()->toString(),
        ];

        $images = GalleryImage::query()
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('alt', 'like', '%'.$filters['search'].'%')
                        ->orWhere('caption', 'like', '%'.$filters['search'].'%');
                });
            })
            ->when(
                in_array($filters['category'], GalleryMedia::CATEGORIES, true),
                fn ($query) => $query->where('category', $filters['category']),
            )
            ->when(
                in_array($filters['type'], ['image', 'video'], true),
                fn ($query) => $query->where('media_type', $filters['type']),
            )
            ->orderBy('sort_order')
            ->orderByDesc('id')
            ->paginate(24)
            ->withQueryString()
            ->through(fn (GalleryImage $image): array => [
                ...$image->toPublicArray(),
                'sort_order' => $image->sort_order,
            ]);

        return Inertia::render('admin/gallery/index', [
            'images' => $images,
            'filters' => $filters,
            'categories' => GalleryMedia::CATEGORIES,
            'stats' => [
                'total' => GalleryImage::query()->count(),
                'images' => GalleryImage::query()->where('media_type', GalleryMediaType::Image)->count(),
                'videos' => GalleryImage::query()->where('media_type', GalleryMediaType::Video)->count(),
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/gallery/create', [
            'categories' => GalleryMedia::CATEGORIES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validated($request, creating: true);
        $files = $request->file('files', []);

        if ($files instanceof UploadedFile) {
            $files = [$files];
        }

        $sortOrder = (int) GalleryImage::query()->max('sort_order');

        foreach ($files as $file) {
            $sortOrder++;
            $stored = GalleryMedia::store($file);

            GalleryImage::create([
                'src' => $stored['src'],
                'media_type' => $stored['media_type'],
                'alt' => $validated['alt'],
                'caption' => $validated['caption'],
                'category' => $validated['category'],
                'sort_order' => $sortOrder,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Gallery items added.')]);

        return to_route('admin.gallery.index');
    }

    public function edit(GalleryImage $galleryImage): Response
    {
        return Inertia::render('admin/gallery/edit', [
            'image' => [
                ...$galleryImage->toPublicArray(),
                'sort_order' => $galleryImage->sort_order,
            ],
            'categories' => GalleryMedia::CATEGORIES,
        ]);
    }

    public function update(Request $request, GalleryImage $galleryImage): RedirectResponse
    {
        $validated = $this->validated($request, creating: false);

        if ($request->hasFile('file')) {
            PublicImage::delete($galleryImage->src);
            $stored = GalleryMedia::store($request->file('file'));
            $validated['src'] = $stored['src'];
            $validated['media_type'] = $stored['media_type'];
        }

        unset($validated['file'], $validated['files']);

        $galleryImage->update($validated);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Gallery item updated.')]);

        return to_route('admin.gallery.index');
    }

    public function destroy(GalleryImage $galleryImage): RedirectResponse
    {
        PublicImage::delete($galleryImage->src);
        $galleryImage->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Gallery item deleted.')]);

        return to_route('admin.gallery.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request, bool $creating): array
    {
        $request->merge([
            'caption' => $request->filled('caption') ? $request->string('caption')->toString() : null,
            'category' => $request->filled('category') ? $request->string('category')->toString() : null,
        ]);

        $fileRules = ['file', 'max:'.GalleryMedia::MAX_KILOBYTES, 'mimes:'.GalleryMedia::mimesRule()];

        return $request->validate([
            ...($creating ? [
                'files' => ['required', 'array', 'min:1', 'max:80'],
                'files.*' => $fileRules,
            ] : [
                'file' => ['nullable', ...$fileRules],
                'sort_order' => ['required', 'integer', 'min:0', 'max:65535'],
            ]),
            'alt' => ['required', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', Rule::in(GalleryMedia::CATEGORIES)],
        ]);
    }
}
