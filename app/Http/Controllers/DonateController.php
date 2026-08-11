<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDonationRequest;
use App\Models\Donation;
use App\Models\Event;
use App\Models\Programme;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DonateController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $programmeSlug = $request->string('programme')->toString();
        $eventSlug = $request->string('event')->toString();

        $selectedProgramme = $programmeSlug !== ''
            ? Programme::query()
                ->where('is_active', true)
                ->where('slug', $programmeSlug)
                ->first(['id', 'title', 'slug', 'description', 'photo'])
            : null;

        $selectedEvent = $selectedProgramme === null && $eventSlug !== ''
            ? Event::query()
                ->where('slug', $eventSlug)
                ->first(['id', 'title', 'slug', 'description', 'photo'])
            : null;

        return Inertia::render('public/donate', [
            'programmes' => Programme::query()
                ->where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug', 'description', 'photo']),
            'events' => Event::query()
                ->upcoming()
                ->limit(20)
                ->get(['id', 'title', 'slug', 'description', 'photo', 'starts_at']),
            'selectedProgrammeId' => $selectedProgramme?->id,
            'selectedEventId' => $selectedEvent?->id,
            'defaultHeroImage' => '/images/donate-hero.jpg',
            'settings' => SiteSetting::whereIn('key', [
                'paystack_public_key', 'donation_goal',
            ])->pluck('value', 'key'),
        ]);
    }

    public function store(StoreDonationRequest $request): JsonResponse
    {
        $validated = $request->validated();

        /** @var Programme|null $programme */
        $programme = isset($validated['programme_id'])
            ? Programme::query()->find($validated['programme_id'])
            : null;

        /** @var Event|null $event */
        $event = isset($validated['event_id'])
            ? Event::query()->find($validated['event_id'])
            : null;

        $destinationLabel = $programme !== null
            ? $programme->title
            : ($event !== null ? 'Event: '.$event->title : null);

        $reference = 'HS-'.strtoupper(Str::random(12));

        $donation = Donation::create([
            'donor_name' => $validated['donor_name'],
            'donor_email' => $validated['donor_email'],
            'donor_phone' => $validated['donor_phone'] ?? null,
            'amount' => $validated['amount'],
            'programme_id' => $programme?->id,
            'event_id' => $event?->id,
            'programme' => $destinationLabel,
            'message' => $validated['message'] ?? null,
            'is_anonymous' => $validated['is_anonymous'] ?? false,
            'currency' => 'GHS',
            'reference' => $reference,
            'method' => 'card',
            'status' => 'pending',
        ]);

        $paystackKey = config('services.paystack.secret')
            ?: SiteSetting::getValue('paystack_secret_key', '');

        $response = Http::withToken($paystackKey)
            ->timeout(10)
            ->connectTimeout(3)
            ->post('https://api.paystack.co/transaction/initialize', [
                'email' => $validated['donor_email'],
                'amount' => $validated['amount'],
                'reference' => $reference,
                'currency' => 'GHS',
                'callback_url' => route('donate.callback'),
                'metadata' => [
                    'donation_id' => $donation->id,
                    'donor_name' => $validated['donor_name'],
                    'programme_id' => $programme?->id,
                    'event_id' => $event?->id,
                    'programme' => $destinationLabel,
                ],
            ]);

        if ($response->successful() && $response->json('status')) {
            return response()->json([
                'authorization_url' => $response->json('data.authorization_url'),
                'reference' => $reference,
            ]);
        }

        $donation->update(['status' => 'failed']);

        return response()->json([
            'message' => 'Unable to initialize payment. Please try again.',
        ], 422);
    }

    public function callback(Request $request): RedirectResponse
    {
        $reference = $request->query('reference');

        if (! $reference) {
            return redirect()->route('donate')->with('error', 'Invalid payment reference.');
        }

        $paystackKey = config('services.paystack.secret')
            ?: SiteSetting::getValue('paystack_secret_key', '');

        $response = Http::withToken($paystackKey)
            ->timeout(10)
            ->connectTimeout(3)
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        $donation = Donation::where('reference', $reference)->first();

        if (! $donation) {
            return redirect()->route('donate')->with('error', 'Donation not found.');
        }

        if ($response->successful() && $response->json('data.status') === 'success') {
            $donation->update([
                'status' => 'success',
                'method' => $response->json('data.channel', 'card'),
                'paystack_reference' => $response->json('data.id'),
            ]);

            return redirect()->route('donate')->with('success', 'Thank you for your generous donation!');
        }

        $donation->update(['status' => 'failed']);

        return redirect()->route('donate')->with('error', 'Payment was not successful. Please try again.');
    }
}
