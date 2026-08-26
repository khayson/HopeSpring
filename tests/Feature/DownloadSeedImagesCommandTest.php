<?php

use App\Console\Commands\DownloadSeedImages;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    Storage::fake('public');
});

test('downloads seed images into public storage', function () {
    Http::fake([
        'picsum.photos/*' => Http::response('fake-image-bytes', 200, ['Content-Type' => 'image/jpeg']),
    ]);

    $this->artisan('app:download-seed-images')
        ->assertSuccessful();

    $manifest = DownloadSeedImages::manifest();

    expect(count($manifest))->toBeGreaterThan(30)
        ->and($manifest)->not->toHaveKey('gallery/01.jpg');

    foreach (array_keys($manifest) as $path) {
        Storage::disk('public')->assertExists($path);
    }

    Http::assertSentCount(count($manifest));
});

test('skips existing images unless force is passed', function () {
    Storage::disk('public')->put('programmes/clean-water-initiative.jpg', 'existing');

    Http::fake([
        'picsum.photos/*' => Http::response('fake-image-bytes', 200, ['Content-Type' => 'image/jpeg']),
    ]);

    $this->artisan('app:download-seed-images')
        ->assertSuccessful();

    expect(Storage::disk('public')->get('programmes/clean-water-initiative.jpg'))->toBe('existing');

    $this->artisan('app:download-seed-images', ['--force' => true])
        ->assertSuccessful();

    expect(Storage::disk('public')->get('programmes/clean-water-initiative.jpg'))->toBe('fake-image-bytes');
});
