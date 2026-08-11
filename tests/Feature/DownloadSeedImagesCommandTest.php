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

    expect(count($manifest))->toBeGreaterThan(50);

    foreach (array_keys($manifest) as $path) {
        Storage::disk('public')->assertExists($path);
    }

    Http::assertSentCount(count($manifest));
});

test('skips existing images unless force is passed', function () {
    Storage::disk('public')->put('gallery/01.jpg', 'existing');

    Http::fake([
        'picsum.photos/*' => Http::response('fake-image-bytes', 200, ['Content-Type' => 'image/jpeg']),
    ]);

    $this->artisan('app:download-seed-images')
        ->assertSuccessful();

    expect(Storage::disk('public')->get('gallery/01.jpg'))->toBe('existing');

    $this->artisan('app:download-seed-images', ['--force' => true])
        ->assertSuccessful();

    expect(Storage::disk('public')->get('gallery/01.jpg'))->toBe('fake-image-bytes');
});
