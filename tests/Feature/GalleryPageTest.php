<?php

use App\Models\GalleryImage;

test('gallery page renders seeded images', function () {
    GalleryImage::create([
        'src' => '/storage/gallery/01.jpg',
        'alt' => 'Children collecting water from a new borehole',
        'caption' => 'First water from the Soe borehole',
        'category' => 'water',
        'sort_order' => 1,
    ]);

    GalleryImage::create([
        'src' => '/storage/gallery/05.jpg',
        'alt' => 'Girls studying in the scholarship programme',
        'caption' => 'Yendi scholarship recipients',
        'category' => 'education',
        'sort_order' => 2,
    ]);

    $this->get(route('gallery.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/gallery/index')
            ->has('images', 2)
            ->has('categories', 2)
            ->where('currentCategory', null)
            ->where('images.0.src', '/storage/gallery/01.jpg')
            ->where('images.0.caption', 'First water from the Soe borehole')
            ->where('images.0.category', 'water'));
});

test('gallery page filters by category', function () {
    GalleryImage::create([
        'src' => '/storage/gallery/01.jpg',
        'alt' => 'Water photo',
        'caption' => 'Borehole',
        'category' => 'water',
        'sort_order' => 1,
    ]);

    GalleryImage::create([
        'src' => '/storage/gallery/05.jpg',
        'alt' => 'Education photo',
        'caption' => 'Classroom',
        'category' => 'education',
        'sort_order' => 2,
    ]);

    $this->get(route('gallery.index', ['category' => 'education']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/gallery/index')
            ->has('images', 1)
            ->where('currentCategory', 'education')
            ->where('images.0.category', 'education'));
});

test('gallery show page displays image details and related images', function () {
    $image = GalleryImage::create([
        'src' => '/storage/gallery/01.jpg',
        'alt' => 'Children collecting water from a new borehole',
        'caption' => 'First water from the Soe borehole',
        'category' => 'water',
        'sort_order' => 1,
    ]);

    $nextImage = GalleryImage::create([
        'src' => '/storage/gallery/02.jpg',
        'alt' => 'WASH committee training',
        'caption' => 'WASH committee at Bongo',
        'category' => 'water',
        'sort_order' => 2,
    ]);

    GalleryImage::create([
        'src' => '/storage/gallery/05.jpg',
        'alt' => 'Classroom photo',
        'caption' => 'Assin Fosu classrooms',
        'category' => 'education',
        'sort_order' => 3,
    ]);

    $this->get(route('gallery.show', $image))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/gallery/show')
            ->where('image.id', $image->id)
            ->where('image.caption', 'First water from the Soe borehole')
            ->where('image.category', 'water')
            ->has('related', 2)
            ->where('related.0.category', 'water')
            ->where('position', 1)
            ->where('total', 3)
            ->where('previous', null)
            ->where('next.id', $nextImage->id)
            ->where('donateProgrammeSlug', 'clean-water-initiative'));
});

test('gallery show prioritises same-category related images', function () {
    $image = GalleryImage::create([
        'src' => '/storage/gallery/01.jpg',
        'alt' => 'Water A',
        'caption' => 'Water A',
        'category' => 'water',
        'sort_order' => 1,
    ]);

    GalleryImage::create([
        'src' => '/storage/gallery/05.jpg',
        'alt' => 'Education',
        'caption' => 'Education',
        'category' => 'education',
        'sort_order' => 2,
    ]);

    GalleryImage::create([
        'src' => '/storage/gallery/02.jpg',
        'alt' => 'Water B',
        'caption' => 'Water B',
        'category' => 'water',
        'sort_order' => 3,
    ]);

    $this->get(route('gallery.show', $image))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('related.0.category', 'water')
            ->where('related.0.caption', 'Water B'));
});

test('gallery show provides previous and next navigation', function () {
    $first = GalleryImage::create([
        'src' => '/storage/gallery/01.jpg',
        'alt' => 'First',
        'caption' => 'First',
        'category' => 'water',
        'sort_order' => 1,
    ]);

    $second = GalleryImage::create([
        'src' => '/storage/gallery/02.jpg',
        'alt' => 'Second',
        'caption' => 'Second',
        'category' => 'water',
        'sort_order' => 2,
    ]);

    $third = GalleryImage::create([
        'src' => '/storage/gallery/03.jpg',
        'alt' => 'Third',
        'caption' => 'Third',
        'category' => 'water',
        'sort_order' => 3,
    ]);

    $this->get(route('gallery.show', $second))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('position', 2)
            ->where('total', 3)
            ->where('previous.id', $first->id)
            ->where('next.id', $third->id));
});
