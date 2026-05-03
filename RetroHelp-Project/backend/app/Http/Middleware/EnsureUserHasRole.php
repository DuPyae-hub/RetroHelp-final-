<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Restrict access to users whose role_id is in the comma-separated list (e.g. role:1 or role:2,3).
     */
    public function handle(Request $request, Closure $next, string $rolesCsv): Response
    {
        $user = $request->user();
        if ($user === null) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        $allowed = array_values(array_filter(array_map(
            static fn (string $id): int => (int) trim($id),
            explode(',', $rolesCsv)
        ), static fn (int $id): bool => $id > 0));

        if (! in_array((int) $user->role_id, $allowed, true)) {
            abort(Response::HTTP_FORBIDDEN, 'This action is not allowed for your role.');
        }

        return $next($request);
    }
}
