<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

/**
 * If a valid Bearer Sanctum token is present, authenticate the user for this request only.
 * Does not abort when missing or invalid.
 */
class OptionalSanctumAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        if ($token !== null && $token !== '') {
            $accessToken = PersonalAccessToken::findToken($token);
            if ($accessToken !== null) {
                $user = $accessToken->tokenable;
                if ($user !== null) {
                    Auth::guard('sanctum')->setUser($user);
                }
            }
        }

        return $next($request);
    }
}
