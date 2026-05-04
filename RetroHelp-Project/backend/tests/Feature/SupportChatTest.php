<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SupportChatTest extends TestCase
{
    public function test_chat_returns_503_when_api_key_missing(): void
    {
        config(['services.openai.api_key' => '']);

        $response = $this->postJson('/api/support/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Hello'],
            ],
        ]);

        $response->assertStatus(503);
        $this->assertStringContainsString('OPENAI_API_KEY', (string) $response->json('message'));
    }

    public function test_chat_returns_assistant_message_when_openai_succeeds(): void
    {
        config(['services.openai.api_key' => 'sk-test']);
        config(['services.openai.chat_model' => 'gpt-4o-mini']);
        config(['services.openai.api_base' => 'https://api.openai.com/v1']);

        Http::fake([
            'https://api.openai.com/v1/chat/completions' => Http::response([
                'choices' => [
                    [
                        'message' => [
                            'content' => 'Here is a helpful reply.',
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/support/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Where do I find clinics?'],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.message', 'Here is a helpful reply.');
    }
}
