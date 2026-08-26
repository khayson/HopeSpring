<?php

use App\Enums\GalleryMediaType;
use App\Models\GalleryImage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

test('imports images and videos from a folder into the gallery', function () {
    Storage::fake('public');

    $directory = sys_get_temp_dir().DIRECTORY_SEPARATOR.'gallery-import-'.uniqid();
    File::ensureDirectoryExists($directory);
    file_put_contents($directory.DIRECTORY_SEPARATOR.'visit.jpg', 'jpeg-bytes');
    file_put_contents($directory.DIRECTORY_SEPARATOR.'visit.mp4', 'mp4-bytes');
    file_put_contents($directory.DIRECTORY_SEPARATOR.'notes.txt', 'ignore');

    $this->artisan('gallery:import', [
        'directory' => $directory,
        '--category' => 'community',
        '--caption' => 'Visit to Anweem, Komenda District',
        '--alt' => 'HopeSpring visit to the people of Anweem',
    ])->assertSuccessful();

    expect(GalleryImage::query()->count())->toBe(2)
        ->and(GalleryImage::query()->where('media_type', GalleryMediaType::Image)->count())->toBe(1)
        ->and(GalleryImage::query()->where('media_type', GalleryMediaType::Video)->count())->toBe(1)
        ->and(GalleryImage::query()->where('category', 'community')->count())->toBe(2);

    $this->artisan('gallery:import', [
        'directory' => $directory,
        '--category' => 'community',
        '--caption' => 'Visit to Anweem, Komenda District',
        '--alt' => 'HopeSpring visit to the people of Anweem',
    ])->assertSuccessful();

    expect(GalleryImage::query()->count())->toBe(2);

    File::deleteDirectory($directory);
});

test('rejects a missing directory and an invalid category', function () {
    $this->artisan('gallery:import', [
        'directory' => sys_get_temp_dir().DIRECTORY_SEPARATOR.'missing-gallery-folder',
    ])->assertFailed();

    $directory = sys_get_temp_dir().DIRECTORY_SEPARATOR.'gallery-import-'.uniqid();
    File::ensureDirectoryExists($directory);

    $this->artisan('gallery:import', [
        'directory' => $directory,
        '--category' => 'orphanage',
    ])->assertFailed();

    File::deleteDirectory($directory);
});
