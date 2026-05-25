<?php

namespace Tests\Feature;

use App\Models\ArtCenter;
use App\Models\Booking;
use App\Models\Role;
use App\Models\User;
use App\Support\RoleId;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
use Tests\TestCase;

class BookingReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_patient_can_store_review_and_it_appears_on_recent_endpoint(): void
    {
        if (! Schema::hasTable('reviews')) {
            $this->markTestSkipped('reviews table not migrated in test database.');
        }

        Role::query()->create(['id' => RoleId::Patient, 'role_name' => 'patient']);
        $patient = User::factory()->create([
            'role_id' => RoleId::Patient,
            'nickname' => 'TestNick',
        ]);

        $center = ArtCenter::query()->create([
            'name' => 'Test ART Center',
            'role_id' => RoleId::Patient,
            'is_verified' => true,
            'art_pills_available' => true,
            'art_pills_count' => 5,
        ]);

        $booking = Booking::query()->create([
            'user_id' => $patient->id,
            'art_center_id' => $center->id,
            'status' => Booking::STATUS_PILL_GIVEN,
        ]);

        $token = $patient->createToken('test')->plainTextToken;

        $response = $this->postJson("/api/bookings/{$booking->id}/review", [
            'rating' => 5,
            'comment' => 'Friendly staff and clear directions.',
        ], [
            'Authorization' => "Bearer {$token}",
        ]);

        $response->assertCreated();

        $this->assertDatabaseHas('reviews', [
            'user_id' => $patient->id,
            'clinic_id' => $center->id,
            'booking_id' => $booking->id,
            'rating' => 5,
        ]);

        $booking->refresh();
        $this->assertSame(Booking::STATUS_COMPLETED, $booking->status);

        $recent = $this->getJson('/api/reviews/recent?limit=5');
        $recent->assertOk();
        $recent->assertJsonPath('data.0.rating', 5);
        $recent->assertJsonPath('data.0.comment', 'Friendly staff and clear directions.');
        $recent->assertJsonPath('data.0.author_label', 'TestNick');
        $recent->assertJsonPath('data.0.clinic.name', 'Test ART Center');

        $center->refresh();
        $this->assertSame(1, (int) $center->total_reviews);
    }
}
