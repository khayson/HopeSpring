<?php

use App\Models\SiteSetting;

test('contact page exposes the foundation address and phone numbers', function () {
    SiteSetting::query()->updateOrCreate(
        ['key' => 'contact_address'],
        ['value' => 'Tema Golf City, Samuel Narh Street', 'group' => 'contact'],
    );
    SiteSetting::query()->updateOrCreate(
        ['key' => 'contact_phone'],
        ['value' => '0501265688 / 0208664519', 'group' => 'contact'],
    );

    $this->get(route('contact'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/contact')
            ->where('settings.contact_address', 'Tema Golf City, Samuel Narh Street')
            ->where('settings.contact_phone', '0501265688 / 0208664519'));
});

test('footer contact details use the updated site settings', function () {
    SiteSetting::query()->updateOrCreate(
        ['key' => 'contact_address'],
        ['value' => 'Tema Golf City, Samuel Narh Street', 'group' => 'contact'],
    );
    SiteSetting::query()->updateOrCreate(
        ['key' => 'contact_phone'],
        ['value' => '0501265688 / 0208664519', 'group' => 'contact'],
    );

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('contact.address', 'Tema Golf City, Samuel Narh Street')
            ->where('contact.phone', '0501265688 / 0208664519'));
});
