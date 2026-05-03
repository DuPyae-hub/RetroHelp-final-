<?php

namespace App\Http\Controllers;

use App\Models\PillDispense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PillDispenseController extends Controller
{
    /**
     * Staff: pending dispenses assigned to this user (patient identified by nickname only).
     */
    public function pendingForStaff(Request $request): JsonResponse
    {
        $rows = PillDispense::query()
            ->select(['dispense_id', 'patient_id', 'staff_id', 'status', 'created_at', 'art_center_id'])
            ->with([
                'patient:id,nickname,role_id',
                'artCenter:id,name',
            ])
            ->where('staff_id', $request->user()->id)
            ->where('status', 'Pending')
            ->orderByDesc('created_at')
            ->get();

        $data = $rows->map(static function (PillDispense $d): array {
            return [
                'dispense_id' => $d->dispense_id,
                'status' => $d->status,
                'created_at' => $d->created_at,
                'community_member_display' => $d->patient?->nickname ?? '—',
                'art_center_name' => $d->artCenter?->name,
            ];
        });

        return response()->json(['data' => $data]);
    }

    /**
     * Community member: dispenses waiting for receipt confirmation.
     */
    public function awaitingReceipt(Request $request): JsonResponse
    {
        $rows = PillDispense::query()
            ->select(['dispense_id', 'status', 'dispense_date', 'art_center_id'])
            ->with(['artCenter:id,name'])
            ->where('patient_id', $request->user()->id)
            ->where('status', 'Given')
            ->orderByDesc('dispense_date')
            ->get();

        $data = $rows->map(static function (PillDispense $d): array {
            return [
                'dispense_id' => $d->dispense_id,
                'status' => $d->status,
                'dispense_date' => $d->dispense_date,
                'art_center_name' => $d->artCenter?->name,
            ];
        });

        return response()->json(['data' => $data]);
    }

    public function markGiven(Request $request, PillDispense $pillDispense): JsonResponse
    {
        if ((int) $pillDispense->staff_id !== (int) $request->user()->id) {
            abort(403, 'Only the assigned staff member can mark this dispense as given.');
        }

        if ($pillDispense->status !== 'Pending') {
            return response()->json([
                'message' => 'Only dispenses in Pending status can be marked as Given.',
            ], 422);
        }

        $pillDispense->update([
            'status' => 'Given',
            'dispense_date' => now(),
        ]);

        return response()->json([
            'message' => 'Dispense marked as Given.',
            'data' => [
                'dispense_id' => $pillDispense->dispense_id,
                'status' => $pillDispense->fresh()->status,
                'dispense_date' => $pillDispense->dispense_date,
            ],
        ]);
    }

    public function markReceived(Request $request, PillDispense $pillDispense): JsonResponse
    {
        if ((int) $pillDispense->patient_id !== (int) $request->user()->id) {
            abort(403, 'Only the community member on this record can confirm receipt.');
        }

        if ($pillDispense->status !== 'Given') {
            return response()->json([
                'message' => 'Only dispenses in Given status can be marked as Received.',
            ], 422);
        }

        $pillDispense->update([
            'status' => 'Received',
        ]);

        return response()->json([
            'message' => 'Receipt confirmed.',
            'data' => [
                'dispense_id' => $pillDispense->dispense_id,
                'status' => $pillDispense->fresh()->status,
            ],
        ]);
    }
}
