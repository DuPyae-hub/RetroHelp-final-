<?php

namespace App\Http\Controllers;

use App\Models\ArtCenter;
use App\Models\Booking;
use App\Models\Navigation;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BookingController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        Booking::expireAcceptedPastDeadline();

        $user = $request->user();

        if ($user->isPatient()) {
            $bookings = Booking::query()
                ->where('user_id', $user->id)
                ->with(['artCenter:id,name,township,area,latitude,longitude', 'staff:id,full_name,nickname', 'navigation'])
                ->orderByDesc('created_at')
                ->limit(100)
                ->get();

            return response()->json(['data' => $bookings]);
        }

        $statusRule = ['nullable', 'string', 'max:32'];

        if ($user->isAdmin()) {
            $filters = $request->validate([
                'art_center_id' => ['nullable', 'integer', 'exists:art_centers,id'],
                'status' => $statusRule,
            ]);

            $q = Booking::query()
                ->with([
                    'patient:id,full_name,nickname',
                    'staff:id,full_name,nickname',
                    'navigation',
                    'artCenter:id,name,township,area',
                ]);

            if ($request->filled('art_center_id')) {
                $q->where('art_center_id', (int) $filters['art_center_id']);
            }
        } elseif ($user->isClinicStaff()) {
            $filters = $request->validate([
                'art_center_id' => ['nullable', 'integer', 'exists:art_centers,id'],
                'status' => $statusRule,
            ]);

            $centerId = $request->filled('art_center_id')
                ? (int) $filters['art_center_id']
                : ($user->art_center_id !== null ? (int) $user->art_center_id : 0);

            if ($centerId < 1) {
                return response()->json([
                    'message' => 'Your account is not linked to a clinic yet, or pass art_center_id to list bookings.',
                ], 422);
            }

            if ($user->art_center_id !== null && $centerId !== (int) $user->art_center_id) {
                abort(403, 'You can only view bookings for your linked clinic.');
            }

            $q = Booking::query()
                ->where('art_center_id', $centerId)
                ->with(['patient:id,full_name,nickname', 'staff:id,full_name,nickname', 'navigation']);
        } else {
            abort(403, 'Forbidden.');
        }

        if (! empty($filters['status'])) {
            $q->where('status', $filters['status']);
        }

        return response()->json([
            'data' => $q->orderByDesc('created_at')->limit(200)->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'art_center_id' => ['required', 'integer', 'exists:art_centers,id'],
            'patient_note' => ['nullable', 'string', 'max:2000'],
        ]);

        $booking = Booking::query()->create([
            'user_id' => $request->user()->id,
            'art_center_id' => $data['art_center_id'],
            'status' => Booking::STATUS_REQUESTED,
            'patient_note' => $data['patient_note'] ?? null,
        ]);

        $booking->load(['artCenter:id,name,township,area', 'navigation']);

        return response()->json([
            'message' => 'Booking requested.',
            'data' => $booking,
        ], 201);
    }

    public function show(Request $request, Booking $booking): JsonResponse
    {
        Booking::expireAcceptedPastDeadline();

        $this->authorizeView($request, $booking);
        $booking->load(['artCenter:id,name,township,area,latitude,longitude', 'staff:id,full_name,nickname', 'navigation', 'review']);

        return response()->json(['data' => $booking]);
    }

    public function accept(Request $request, Booking $booking): JsonResponse
    {
        $this->authorizeStaffForCenter($request, $booking);
        $this->ensureStaffCenterMatchesBooking($request->user(), $booking);

        if ($booking->status !== Booking::STATUS_REQUESTED) {
            return response()->json(['message' => 'Booking is not awaiting acceptance.'], 422);
        }

        $hours = max(1, (int) config('retrohelp.booking_respond_after_accept_hours', 48));
        $now = now();

        $payload = [
            'status' => Booking::STATUS_ACCEPTED,
            'staff_id' => $request->user()->id,
        ];

        if (Schema::hasColumn('bookings', 'accepted_at')) {
            $payload['accepted_at'] = $now;
        }
        if (Schema::hasColumn('bookings', 'respond_by_at')) {
            $payload['respond_by_at'] = $now->copy()->addHours($hours);
        }
        if (Schema::hasColumn('bookings', 'cancelled_at')) {
            $payload['cancelled_at'] = null;
        }
        if (Schema::hasColumn('bookings', 'cancellation_reason')) {
            $payload['cancellation_reason'] = null;
        }

        $booking->update($payload);
        $booking->load(['artCenter:id,name,township,area,latitude,longitude', 'staff:id,full_name,nickname', 'navigation']);

        return response()->json([
            'message' => 'Booking accepted.',
            'data' => $booking,
        ]);
    }

    public function onMyWay(Request $request, Booking $booking): JsonResponse
    {
        $this->authorizePatientOwner($request, $booking);

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return response()->json(['message' => 'This request was cancelled.'], 422);
        }

        if ($booking->status !== Booking::STATUS_ACCEPTED) {
            return response()->json(['message' => 'Clinic must accept before you can start navigation.'], 422);
        }

        if (Schema::hasColumn('bookings', 'respond_by_at')
            && $booking->respond_by_at !== null
            && $booking->respond_by_at->isPast()) {
            Booking::expireAcceptedPastDeadline();
            $booking->refresh();

            if ($booking->status === Booking::STATUS_CANCELLED) {
                return response()->json(['message' => 'This request was cancelled because you did not confirm you were coming in time.'], 422);
            }
        }

        $data = $request->validate([
            'start_location' => ['nullable', 'string', 'max:255'],
            'navigation_id' => ['nullable', 'integer', 'exists:navigations,navigation_id'],
        ]);

        $navigationId = $data['navigation_id'] ?? null;

        if ($navigationId === null) {
            $center = ArtCenter::query()->findOrFail($booking->art_center_id);
            $navigation = Navigation::query()->create([
                'user_id' => $request->user()->id,
                'start_location' => $data['start_location'] ?? null,
                'destination' => $center->name,
                'art_center_id' => $center->id,
            ]);
            $navigationId = $navigation->navigation_id;
        } else {
            $navigation = Navigation::query()->where('navigation_id', $navigationId)->firstOrFail();
            if ((int) $navigation->user_id !== (int) $request->user()->id) {
                return response()->json(['message' => 'Navigation does not belong to you.'], 403);
            }
            if ($navigation->art_center_id !== null && (int) $navigation->art_center_id !== (int) $booking->art_center_id) {
                return response()->json(['message' => 'Navigation destination does not match this booking.'], 422);
            }
        }

        $booking->update([
            'status' => Booking::STATUS_ON_MY_WAY,
            'navigation_id' => $navigationId,
        ]);
        $booking->load(['artCenter:id,name,township,area,latitude,longitude', 'staff:id,full_name,nickname', 'navigation']);

        return response()->json([
            'message' => 'Status updated: on my way. Use clinic coordinates for directions.',
            'data' => $booking,
        ]);
    }

    public function arrived(Request $request, Booking $booking): JsonResponse
    {
        $this->authorizePatientOwner($request, $booking);

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return response()->json(['message' => 'This request was cancelled.'], 422);
        }

        if ($booking->status !== Booking::STATUS_ON_MY_WAY) {
            return response()->json(['message' => 'You must be on your way before marking arrived.'], 422);
        }

        $booking->update(['status' => Booking::STATUS_ARRIVED]);
        $booking->load(['artCenter:id,name,township,area,latitude,longitude', 'staff:id,full_name,nickname', 'navigation']);

        return response()->json([
            'message' => 'Marked as arrived.',
            'data' => $booking,
        ]);
    }

    public function pillGiven(Request $request, Booking $booking): JsonResponse
    {
        $this->authorizeStaffForCenter($request, $booking);
        $this->ensureStaffCenterMatchesBooking($request->user(), $booking);

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return response()->json(['message' => 'This request was cancelled.'], 422);
        }

        if ($booking->status !== Booking::STATUS_ARRIVED) {
            return response()->json(['message' => 'Patient must be marked arrived first.'], 422);
        }

        DB::transaction(function () use ($booking): void {
            $booking->update(['status' => Booking::STATUS_PILL_GIVEN]);
            $this->deductPillStockOnce($booking);
        });

        $booking->refresh()->load([
            'patient:id,full_name,nickname',
            'artCenter:id,name,township,area,art_pills_available,art_pills_count',
            'navigation',
        ]);

        return response()->json([
            'message' => 'Recorded: arrived and pill given.',
            'data' => $booking,
        ]);
    }

    public function complete(Request $request, Booking $booking): JsonResponse
    {
        $this->authorizePatientOwner($request, $booking);

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return response()->json(['message' => 'This request was cancelled.'], 422);
        }

        if ($booking->status !== Booking::STATUS_PILL_GIVEN) {
            return response()->json(['message' => 'Clinic must record pill given before you can complete.'], 422);
        }

        $data = $request->validate([
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:5000'],
        ]);

        if (isset($data['rating']) && $booking->review()->exists()) {
            return response()->json(['message' => 'A review was already submitted for this booking.'], 422);
        }

        DB::transaction(function () use ($booking, $request, $data): void {
            $booking->update(['status' => Booking::STATUS_COMPLETED]);
            $this->deductPillStockOnce($booking);

            if (isset($data['rating'])) {
                Review::query()->create([
                    'user_id' => $request->user()->id,
                    'clinic_id' => $booking->art_center_id,
                    'booking_id' => $booking->id,
                    'rating' => $data['rating'],
                    'comment' => $data['comment'] ?? null,
                ]);

                $this->syncClinicRatingFromReviews($booking->art_center_id);
            }
        });

        $booking->refresh()->load([
            'artCenter:id,name,township,area,latitude,longitude,art_pills_available,art_pills_count',
            'review',
            'navigation',
        ]);

        return response()->json([
            'message' => 'Visit completed.',
            'data' => $booking,
        ]);
    }

    /**
     * Patient or clinic staff: cancel a booking in any in-flight status (not completed / not already cancelled).
     */
    public function cancel(Request $request, Booking $booking): JsonResponse
    {
        $user = $request->user();

        if ($booking->status === Booking::STATUS_CANCELLED) {
            return response()->json(['message' => 'This booking is already cancelled.'], 422);
        }

        if ($booking->status === Booking::STATUS_COMPLETED) {
            return response()->json(['message' => 'Completed visits cannot be cancelled.'], 422);
        }

        if ($user->isPatient()) {
            $this->authorizePatientOwner($request, $booking);
            $reason = Booking::CANCELLED_BY_PATIENT;
        } elseif ($user->isClinicStaff() || $user->isAdmin()) {
            $this->authorizeStaffForCenter($request, $booking);
            $this->ensureStaffCenterMatchesBooking($user, $booking);
            $reason = Booking::CANCELLED_BY_CLINIC;
        } else {
            abort(403, 'Forbidden.');
        }

        $payload = [
            'status' => Booking::STATUS_CANCELLED,
            'cancellation_reason' => $reason,
        ];

        if (Schema::hasColumn('bookings', 'cancelled_at')) {
            $payload['cancelled_at'] = now();
        }
        if (Schema::hasColumn('bookings', 'respond_by_at')) {
            $payload['respond_by_at'] = null;
        }

        $booking->update($payload);
        $booking->refresh()->load(['artCenter:id,name,township,area', 'staff:id,full_name,nickname', 'navigation']);

        return response()->json([
            'message' => 'Booking cancelled.',
            'data' => $booking,
        ]);
    }

    private function authorizePatientOwner(Request $request, Booking $booking): void
    {
        if (! $request->user()->isPatient() || (int) $booking->user_id !== (int) $request->user()->id) {
            abort(403, 'Forbidden.');
        }
    }

    private function authorizeStaffForCenter(Request $request, Booking $booking): void
    {
        if (! $request->user()->isClinicStaff() && ! $request->user()->isAdmin()) {
            abort(403, 'Forbidden.');
        }
    }

    private function ensureStaffCenterMatchesBooking(?User $user, Booking $booking): void
    {
        if ($user === null || $user->isAdmin()) {
            return;
        }
        if (! $user->isClinicStaff() || $user->art_center_id === null) {
            return;
        }
        if ((int) $user->art_center_id !== (int) $booking->art_center_id) {
            abort(403, 'This booking belongs to a different clinic.');
        }
    }

    private function authorizeView(Request $request, Booking $booking): void
    {
        $user = $request->user();
        if ($user->isPatient() && (int) $booking->user_id === (int) $user->id) {
            return;
        }
        if ($user->isClinicStaff() || $user->isAdmin()) {
            return;
        }
        abort(403, 'Forbidden.');
    }

    private function syncClinicRatingFromReviews(int $clinicId): void
    {
        $center = ArtCenter::query()->findOrFail($clinicId);
        $row = Review::query()
            ->where('clinic_id', $clinicId)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as cnt')
            ->first();

        $center->update([
            'rating_avg' => round((float) ($row->avg_rating ?? 0), 2),
            'total_reviews' => (int) ($row->cnt ?? 0),
        ]);
    }

    /**
     * Lower clinic pill supply once per booking (pill given or visit completed).
     */
    private function deductPillStockOnce(Booking $booking): void
    {
        $booking->refresh();

        if (Schema::hasColumn('bookings', 'pill_stock_deducted') && $booking->pill_stock_deducted) {
            return;
        }

        $center = ArtCenter::query()
            ->whereKey($booking->art_center_id)
            ->lockForUpdate()
            ->first();

        if ($center === null) {
            return;
        }

        $center->decrementPillSupply();

        if (Schema::hasColumn('bookings', 'pill_stock_deducted')) {
            $booking->update(['pill_stock_deducted' => true]);
        }
    }
}
