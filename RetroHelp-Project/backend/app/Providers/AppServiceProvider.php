<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('support-chat', function (Request $request) {
            $id = Auth::guard('sanctum')->id();
            $key = $id !== null ? 'user:'.$id : 'ip:'.$request->ip();

            return Limit::perMinute(20)->by($key);
        });
    }
}
