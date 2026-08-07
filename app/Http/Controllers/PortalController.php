<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PortalController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('portal/index', [
            'name' => $user->name,
            'role' => $user->role->value,
            'roleLabel' => $user->role->label(),
        ]);
    }
}
