<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SupportChatTest extends TestCase
{
    public function test_chat_returns_503_when_api_key_missing(): void
    {
        config(['services.groq.api_key' => '']);
        config(['services.ollama.enabled' => false]);

        $response = $this->postJson('/api/support/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Hello'],
            ],
        ]);

        $response->assertStatus(503);
        $this->assertStringContainsString('GROQ_API_KEY', (string) $response->json('message'));
    }

    public function test_chat_returns_assistant_message_when_groq_succeeds(): void
    {
        config(['services.groq.api_key' => 'test-key']);
        config(['services.groq.model' => 'llama-3.1-8b-instant']);

        Http::fake(function (\Illuminate\Http\Client\Request $request) {
            if (! str_contains($request->url(), 'api.groq.com/openai/v1/chat/completions')) {
                return Http::response('not found', 404);
            }

            return Http::response([
                'choices' => [
                    ['message' => ['content' => 'Here is a helpful reply.']],
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

    public function test_chat_returns_assistant_message_when_ollama_fallback_succeeds(): void
    {
        config(['services.groq.api_key' => '']);
        config(['services.ollama.enabled' => true]);
        config(['services.ollama.base_url' => 'http://127.0.0.1:11434']);
        config(['services.ollama.model' => 'llama3.2']);

        Http::fake([
            'http://127.0.0.1:11434/api/chat' => Http::response([
                'message' => [
                    'role' => 'assistant',
                    'content' => 'Hello from local Ollama.',
                ],
            ], 200),
        ]);

        $response = $this->postJson('/api/support/chat', [
            'messages' => [
                ['role' => 'user', 'content' => 'Can you help me?'],
            ],
        ]);

        $response->assertOk();
        $response->assertJsonPath('data.message', 'Hello from local Ollama.');
    }
}
