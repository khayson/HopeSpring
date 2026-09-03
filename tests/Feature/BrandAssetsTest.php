<?php

test('public brand logo variants are available', function () {
    $files = [
        'images/brand/logo-primary.png',
        'images/brand/logo-mono.png',
        'images/brand/logo-stacked.png',
        'images/brand/logo-stacked-mono.png',
        'images/brand/mark.png',
        'images/brand/mark-mono.png',
        'images/brand/icon-32.png',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'apple-touch-icon.png',
        'android-chrome-192x192.png',
        'android-chrome-512x512.png',
        'site.webmanifest',
    ];

    foreach ($files as $file) {
        expect(public_path($file))
            ->toBeFile("Missing public brand asset: {$file}");
    }
});

test('html shell references the brand favicon and boot loader', function () {
    $this->get(route('home'))
        ->assertOk()
        ->assertSee('/favicon-32x32.png?v=20260903', false)
        ->assertSee('/apple-touch-icon.png?v=20260903', false)
        ->assertSee('/site.webmanifest?v=20260903', false)
        ->assertSee('/images/brand/mark.png', false)
        ->assertSee('id="app-boot-loader"', false)
        ->assertSee('brand-boot-loader', false)
        ->assertDontSee('favicon.svg', false)
        ->assertDontSee('#FF2D20', false);
});

test('laravel starter favicon svg is not published', function () {
    expect(public_path('favicon.svg'))->not->toBeFile();
});
