<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_unless($user !== null, 403);

        $allowed = array_map(fn (string $role) => UserRole::from($role), $roles);

        abort_unless(in_array($user->role, $allowed, true), 403);

        return $next($request);
    }
}
