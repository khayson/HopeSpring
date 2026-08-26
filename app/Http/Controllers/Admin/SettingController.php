<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ImpactStat;
use App\Models\SiteSetting;
use App\Support\PublicImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/settings/index', [
            'settings' => SiteSetting::query()
                ->orderBy('group')
                ->orderBy('key')
                ->get()
                ->groupBy('group')
                ->map(fn ($settings) => $settings->pluck('value', 'key')),
            'impactStats' => ImpactStat::query()
                ->orderBy('sort_order')
                ->get(['id', 'label', 'value', 'suffix', 'sort_order']),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $imageKeys = $this->imageSettingKeys();

        $validated = $request->validate([
            'settings' => ['required', 'array'],
            'settings.*' => ['nullable', 'string', 'max:5000'],
            'images' => ['nullable', 'array'],
            'images.*' => ['nullable', 'image', 'mimes:jpeg,jpg,png,webp,gif', 'max:5120'],
            'remove_images' => ['nullable', 'array'],
            'remove_images.*' => ['boolean'],
            'impact_stats' => ['nullable', 'array'],
            'impact_stats.*.id' => ['required', 'integer', Rule::exists('impact_stats', 'id')],
            'impact_stats.*.label' => ['required', 'string', 'max:255'],
            'impact_stats.*.value' => ['required', 'integer', 'min:0'],
            'impact_stats.*.suffix' => ['nullable', 'string', 'max:10'],
        ]);

        foreach ($validated['settings'] as $key => $value) {
            if (in_array($key, $imageKeys, true)) {
                continue;
            }

            SiteSetting::query()->where('key', $key)->update(['value' => $value]);
        }

        foreach ($imageKeys as $key) {
            $setting = SiteSetting::query()->where('key', $key)->first();

            if ($setting === null) {
                continue;
            }

            if ($request->boolean('remove_images.'.$key)) {
                PublicImage::delete($setting->value);
                $setting->update(['value' => null]);

                continue;
            }

            if ($request->hasFile('images.'.$key)) {
                PublicImage::delete($setting->value);
                $setting->update([
                    'value' => PublicImage::store($request->file('images.'.$key), 'settings'),
                ]);
            }
        }

        foreach ($validated['impact_stats'] ?? [] as $stat) {
            ImpactStat::query()->whereKey($stat['id'])->update([
                'label' => $stat['label'],
                'value' => $stat['value'],
                'suffix' => $stat['suffix'] ?: null,
            ]);
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Settings updated.')]);

        return to_route('admin.settings.edit');
    }

    /**
     * @return list<string>
     */
    private function imageSettingKeys(): array
    {
        return SiteSetting::query()
            ->pluck('key')
            ->filter(fn (string $key): bool => str_ends_with($key, '_image')
                || str_ends_with($key, '_photo')
                || str_ends_with($key, '_logo'))
            ->values()
            ->all();
    }
}
