<?php

namespace App\Http\Controllers;

use App\Models\Donation;
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
    public function __invoke(): Response
    {
        return Inertia::render('public/donate', [
            'programmes' => Programme::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'title', 'slug']),
            'settings' => SiteSetting::whereIn('key', [
                'paystack_public_key', 'donation_goal',
            ])->pluck('value', 'key'),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'donor_name' => ['required', 'string', 'max:255'],
            'donor_email' => ['required', 'email', 'max:255'],
            'donor_phone' => ['nullable', 'string', 'max:20'],
            'amount' => ['required', 'integer', 'min:100'],
            'programme' => ['nullable', 'string', 'max:255'],
            'message' => ['nullable', 'string', 'max:1000'],
            'is_anonymous' => ['boolean'],
        ]);

        $reference = 'HS-'.strtoupper(Str::random(12));

        $donation = Donation::create([
            ...$validated,
            'currency' => 'GHS',
            'reference' => $reference,
            'method' => 'card',
            'status' => 'pending',
        ]);

        $paystackKey = config('services.paystack.secret')
            ?: SiteSetting::getValue('paystack_secret_key', '');

        $response = Http::withToken($paystackKey)
            ->post('https://api.paystack.co/transaction/initialize', [
                'email' => $validated['donor_email'],
                'amount' => $validated['amount'],
                'reference' => $reference,
                'currency' => 'GHS',
                'callback_url' => route('donate.callback'),
                'metadata' => [
                    'donation_id' => $donation->id,
                    'donor_name' => $validated['donor_name'],
                    'programme' => $validated['programme'] ?? null,
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
