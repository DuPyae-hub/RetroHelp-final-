<?php

return [

    /*
    | After the clinic accepts a request, the patient must tap "I'm on my way"
    | within this many hours. Otherwise the booking is cancelled automatically.
    */
    'booking_respond_after_accept_hours' => (int) env('BOOKING_RESPOND_AFTER_ACCEPT_HOURS', 48),

    /*
    | Optional: seed one admin with AdminUserSeeder (php artisan db:seed --class=AdminUserSeeder).
    | Sign in on Profile → Staff tab, enable "Administrator", use this full name and password.
    | Change RETROHELP_ADMIN_PASSWORD in production.
    */
    'admin_full_name' => env('RETROHELP_ADMIN_FULL_NAME', 'RetroHelp Admin'),

    'admin_password' => env('RETROHELP_ADMIN_PASSWORD', ''),
];
