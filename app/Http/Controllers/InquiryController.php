<?php

namespace App\Http\Controllers;

use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function volunteer(): Response
    {
        return Inertia::render('public/get-involved/volunteer');
    }

    public function partner(): Response
    {
        return Inertia::render('public/get-involved/partner');
    }

    public function store(Request $request, string $type): RedirectResponse
    {
        abort_unless(in_array($type, ['volunteer', 'partner'], true), 404);

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'message' => ['required', 'string', 'max:2000'],
        ];

        if ($type === 'partner') {
            $rules['organisation'] = ['required', 'string', 'max:255'];
        }

        $validated = $request->validate($rules);

        Inquiry::create([
            ...$validated,
            'type' => $type,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __("Thanks! We'll be in touch soon.")]);

        return back();
    }
}
