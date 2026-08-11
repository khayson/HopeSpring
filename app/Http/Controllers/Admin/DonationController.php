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
        $filters = [
            'status' => $request->string('status')->trim()->toString(),
            'search' => $request->string('search')->trim()->toString(),
        ];

        $donations = Donation::query()
            ->when($filters['status'] !== '', fn ($query) => $query->where('status', $filters['status']))
            ->when($filters['search'] !== '', function ($query) use ($filters): void {
                $query->where(function ($searchQuery) use ($filters): void {
                    $searchQuery
                        ->where('donor_name', 'like', '%'.$filters['search'].'%')
                        ->orWhere('donor_email', 'like', '%'.$filters['search'].'%')
                        ->orWhere('reference', 'like', '%'.$filters['search'].'%');
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/donations/index', [
            'donations' => $donations,
            'filters' => $filters,
            'stats' => [
                'raised' => (int) Donation::query()->where('status', 'success')->sum('amount'),
                'successful' => Donation::query()->where('status', 'success')->count(),
                'pending' => Donation::query()->where('status', 'pending')->count(),
                'failed' => Donation::query()->where('status', 'failed')->count(),
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
