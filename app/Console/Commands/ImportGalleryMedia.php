<?php

namespace App\Console\Commands;

use App\Models\GalleryImage;
use App\Support\GalleryMedia;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

#[Signature('gallery:import {directory : Folder of photos and videos} {--category= : Gallery category} {--caption= : Caption applied to every imported file} {--alt= : Alt text applied to every imported file}')]
#[Description('Import images and videos from a folder into the public gallery')]
class ImportGalleryMedia extends Command
{
    public function handle(): int
    {
        $directory = $this->argument('directory');

        if (! is_dir($directory)) {
            $this->error('The directory does not exist.');

            return self::FAILURE;
        }

        $category = $this->option('category');
        $caption = $this->option('caption');
        $alt = $this->option('alt');

        if (is_string($category) && $category !== '') {
            if (! in_array($category, GalleryMedia::CATEGORIES, true)) {
                $this->error('Category must be one of: '.implode(', ', GalleryMedia::CATEGORIES));

                return self::FAILURE;
            }
        } else {
            $category = null;
        }

        $caption = is_string($caption) && $caption !== '' ? $caption : null;
        $alt = is_string($alt) && $alt !== '' ? $alt : ($caption ?? 'Gallery media');

        $imported = 0;
        $skipped = 0;
        $ignored = 0;
        $sortOrder = (int) GalleryImage::query()->max('sort_order');

        foreach (File::files($directory) as $file) {
            $stored = GalleryMedia::importPath($file->getPathname());

            if ($stored === null) {
                $ignored++;
                $this->warn('Skipped unsupported file: '.$file->getFilename());

                continue;
            }

            if (GalleryImage::query()->where('src', $stored['src'])->exists()) {
                $skipped++;

                continue;
            }

            $sortOrder++;

            GalleryImage::create([
                'src' => $stored['src'],
                'media_type' => $stored['media_type'],
                'alt' => $alt,
                'caption' => $caption,
                'category' => $category,
                'sort_order' => $sortOrder,
            ]);

            $imported++;
        }

        $this->info("Imported: {$imported} · Already present: {$skipped} · Ignored: {$ignored}");

        return self::SUCCESS;
    }
}
