<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Command;

class BookingsExpireStaleAcceptedCommand extends Command
{
    protected $signature = 'bookings:expire-stale-accepted';

    protected $description = 'Cancel accepted bookings where the patient did not confirm they are coming before respond_by_at.';

    public function handle(): int
    {
        $n = Booking::expireAcceptedPastDeadline();
        if ($n > 0) {
            $this->info("Cancelled {$n} accepted booking(s) (no patient coming confirmation).");
        }

        return self::SUCCESS;
    }
}
