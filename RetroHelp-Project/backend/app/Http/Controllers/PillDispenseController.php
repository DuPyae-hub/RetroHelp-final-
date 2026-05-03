<?php

namespace App\Http\Controllers;

use App\Models\PillDispense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PillDispenseController extends Controller
{
    /**
     * Staff or admin marks a dispense as Given and records when the medication was handed out.
     */
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
            'pill_dispense' => $pillDispense->fresh(),
        ]);
    }

    /**
     * Patient confirms they received the medication.
     */
    public function markReceived(Request $request, PillDispense $pillDispense): JsonResponse
    {
        if ((int) $pillDispense->patient_id !== (int) $request->user()->id) {
            abort(403, 'Only the patient on this record can mark it as received.');
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
            'message' => 'Dispense marked as Received.',
            'pill_dispense' => $pillDispense->fresh(),
        ]);
    }
}
