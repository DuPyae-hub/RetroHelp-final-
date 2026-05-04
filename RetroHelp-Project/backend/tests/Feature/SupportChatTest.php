<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SupportChatTest extends TestCase
{
    public function test_chat_returns_503_when_api_key_missing(): void
    {
        config(['services.gemini.api_key' => '']);

        $response = $this->postJson('/api/support/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Hello'],
            ],
        ]);

        $response->assertStatus(503);
        $this->assertStringContainsString('GEMINI_API_KEY', (string) $response->json('message'));
    }

    public function test_chat_returns_assistant_message_when_gemini_succeeds(): void
    {
        config(['services.gemini.api_key' => 'test-key']);
        config(['services.gemini.model' => 'gemini-2.0-flash']);

        Http::fake(function (\Illuminate\Http\Client\Request $request) {
            if (! str_contains($request->url(), 'generativelanguage.googleapis.com')) {
                return Http::response('not found', 404);
            }

            return Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                ['text' => 'Here is a helpful reply.'],
                            ],
                        ],
                    ],
                ],
            ], 200);
        });

        $response = $this->postJson('/api/support/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Where do I find clinics?'],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.message', 'Here is a helpful reply.');
    }
}
