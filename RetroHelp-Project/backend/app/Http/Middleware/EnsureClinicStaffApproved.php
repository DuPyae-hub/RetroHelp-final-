<?php

namespace App\Http\Middleware;

use App\Support\RoleId;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureClinicStaffApproved
{
    /**
     * Clinic staff must be admin-approved (is_verified). Admins always pass.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user === null) {
            return $next($request);
        }

        if ((int) $user->role_id === RoleId::Admin) {
            return $next($request);
        }

        if ((int) $user->role_id === RoleId::ClinicStaff && ! $user->is_verified) {
            abort(Response::HTTP_FORBIDDEN, 'Clinic staff account is pending administrator approval.');
        }

        return $next($request);
    }
}
