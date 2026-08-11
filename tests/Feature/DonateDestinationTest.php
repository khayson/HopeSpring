<?php

use App\Models\Donation;
use App\Models\Event;
use App\Models\GalleryImage;
use App\Models\Programme;
use App\Support\GalleryDonationDestination;
use Illuminate\Support\Facades\Http;

test('donate page preselects a programme from the query string', function () {
    $programme = Programme::factory()->create([
        'title' => 'Clean Water Initiative',
        'slug' => 'clean-water-initiative',
        'description' => 'Providing safe drinking water to rural communities.',
        'is_active' => true,
    ]);

    $this->get(route('donate', ['programme' => $programme->slug]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/donate')
            ->where('selectedProgrammeId', $programme->id)
            ->where('selectedEventId', null)
            ->where('defaultHeroImage', '/images/donate-hero.jpg')
            ->where('programmes.0.description', 'Providing safe drinking water to rural communities.'));
});

test('donate page preselects an event from the query string', function () {
    $event = Event::factory()->upcoming()->create([
        'title' => 'Annual Gala',
        'slug' => 'annual-gala',
        'description' => 'An evening of fundraising for community projects.',
    ]);

    $this->get(route('donate', ['event' => $event->slug]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/donate')
            ->where('selectedEventId', $event->id)
            ->where('selectedProgrammeId', null)
            ->where('events.0.description', 'An evening of fundraising for community projects.'));
});

test('donate page uses the dedicated donation hero image by default', function () {
    $this->get(route('donate'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('public/donate')
            ->where('defaultHeroImage', '/images/donate-hero.jpg')
            ->where('selectedProgrammeId', null)
            ->where('selectedEventId', null));
});

test('donate page prefers programme over event when both query params are present', function () {
    $programme = Programme::factory()->create([
        'slug' => 'education-for-all',
        'is_active' => true,
    ]);
    $event = Event::factory()->upcoming()->create([
        'slug' => 'stakeholder-meeting',
    ]);

    $this->get(route('donate', [
        'programme' => $programme->slug,
        'event' => $event->slug,
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('selectedProgrammeId', $programme->id)
            ->where('selectedEventId', null));
});

test('a donation can be directed to a programme', function () {
    Http::fake([
        'api.paystack.co/transaction/initialize' => Http::response([
            'status' => true,
            'data' => [
                'authorization_url' => 'https://checkout.paystack.com/test-auth',
            ],
        ]),
    ]);

    $programme = Programme::factory()->create([
        'title' => 'Healthcare Outreach',
        'slug' => 'healthcare-outreach',
        'is_active' => true,
    ]);

    $this->postJson(route('donate.store'), [
        'donor_name' => 'Ama Mensah',
        'donor_email' => 'ama@example.com',
        'amount' => 10000,
        'programme_id' => $programme->id,
        'is_anonymous' => false,
    ])
        ->assertOk()
        ->assertJsonPath('authorization_url', 'https://checkout.paystack.com/test-auth');

    $this->assertDatabaseHas('donations', [
        'donor_email' => 'ama@example.com',
        'programme_id' => $programme->id,
        'event_id' => null,
        'programme' => 'Healthcare Outreach',
        'status' => 'pending',
    ]);
});

test('a donation can be directed to an event', function () {
    Http::fake([
        'api.paystack.co/transaction/initialize' => Http::response([
            'status' => true,
            'data' => [
                'authorization_url' => 'https://checkout.paystack.com/test-auth',
            ],
        ]),
    ]);

    $event = Event::factory()->upcoming()->create([
        'title' => 'Water Walk',
        'slug' => 'water-walk',
    ]);

    $this->postJson(route('donate.store'), [
        'donor_name' => 'Kojo Asante',
        'donor_email' => 'kojo@example.com',
        'amount' => 5000,
        'event_id' => $event->id,
        'is_anonymous' => false,
    ])->assertOk();

    $this->assertDatabaseHas('donations', [
        'donor_email' => 'kojo@example.com',
        'event_id' => $event->id,
        'programme_id' => null,
        'programme' => 'Event: Water Walk',
        'status' => 'pending',
    ]);
});

test('a general donation stores without programme or event', function () {
    Http::fake([
        'api.paystack.co/transaction/initialize' => Http::response([
            'status' => true,
            'data' => [
                'authorization_url' => 'https://checkout.paystack.com/test-auth',
            ],
        ]),
    ]);

    $this->postJson(route('donate.store'), [
        'donor_name' => 'Efua Boateng',
        'donor_email' => 'efua@example.com',
        'amount' => 2500,
        'is_anonymous' => true,
    ])->assertOk();

    $donation = Donation::query()->where('donor_email', 'efua@example.com')->first();

    expect($donation)->not->toBeNull()
        ->and($donation->programme_id)->toBeNull()
        ->and($donation->event_id)->toBeNull()
        ->and($donation->programme)->toBeNull()
        ->and($donation->is_anonymous)->toBeTrue();
});

test('a donation cannot target both a programme and an event', function () {
    $programme = Programme::factory()->create(['is_active' => true]);
    $event = Event::factory()->create();

    $this->postJson(route('donate.store'), [
        'donor_name' => 'Test Donor',
        'donor_email' => 'test@example.com',
        'amount' => 1000,
        'programme_id' => $programme->id,
        'event_id' => $event->id,
    ])->assertUnprocessable();
});

test('gallery show maps category to a programme donation destination', function () {
    $image = GalleryImage::factory()->create(['category' => 'water']);

    $this->get(route('gallery.show', $image))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('donateProgrammeSlug', 'clean-water-initiative'));
});

test('gallery category mapping covers programme categories and falls back to general', function () {
    expect(GalleryDonationDestination::programmeSlugForCategory('education'))->toBe('education-for-all')
        ->and(GalleryDonationDestination::programmeSlugForCategory('healthcare'))->toBe('healthcare-outreach')
        ->and(GalleryDonationDestination::programmeSlugForCategory('community'))->toBe('community-development')
        ->and(GalleryDonationDestination::programmeSlugForCategory('events'))->toBeNull()
        ->and(GalleryDonationDestination::programmeSlugForCategory(null))->toBeNull();
});
