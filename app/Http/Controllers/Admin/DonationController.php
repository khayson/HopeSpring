<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DonationController extends Controller
{
    public function index(Request $request): Response
    {
        $donations = Donation::query()
            ->when($request->string('status')->toString(), fn ($query, $status) => $query->where('status', $status))
            ->when($request->string('search')->toString(), function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('donor_name', 'like', "%{$search}%")
                        ->orWhere('donor_email', 'like', "%{$search}%")
                        ->orWhere('reference', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/donations/index', [
            'donations' => $donations,
            'filters' => $request->only(['status', 'search']),
            'totals' => [
                'successful' => Donation::where('status', 'success')->sum('amount'),
                'count' => Donation::where('status', 'success')->count(),
            ],
        ]);
    }

    public function show(Donation $donation): Response
    {
        return Inertia::render('admin/donations/show', [
            'donation' => $donation,
        ]);
    }
}
