<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupportChatController extends Controller
{
    private const GROQ_API_HOST = 'https://api.groq.com';

    /**
     * General RetroHelp support assistant (Groq chat completions).
     * Not medical advice. Rate-limited per IP / user.
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'messages' => ['required', 'array', 'min:1', 'max:24'],
            'messages.*.role' => ['required', 'string', 'in:user,assistant'],
            'messages.*.content' => ['required', 'string', 'max:4000'],
        ]);

        $user = Auth::guard('sanctum')->user();
        $userHint = $user !== null
            ? 'The visitor is signed in to RetroHelp'.($user->nickname !== null && $user->nickname !== '' ? " (nickname: {$user->nickname})." : '.')
            : 'The visitor may be anonymous or not signed in.';

        $system = <<<'SYS'
You are RetroHelp Assistant, a warm, concise support guide for a community HIV/ART care navigation app called RetroHelp.
You help with: finding verified clinics, how the app works, privacy (nicknames), visit requests, and emotional support in a neutral, non-judgmental tone.
You are NOT a doctor: never diagnose, prescribe, or give personal medical instructions. Always encourage following their clinician for medical decisions.
Keep answers short (about 2–6 sentences) unless the user asks for detail. If asked in Burmese, reply helpfully in Burmese when you can.
SYS;

        $system .= "\n{$userHint}";

        $rows = $validated['messages'];
        while (! empty($rows) && $rows[0]['role'] === 'assistant') {
            array_shift($rows);
        }
        if ($rows === []) {
            return response()->json([
                'message' => 'Send at least one user message.',
            ], 422);
        }

        $contents = [];
        foreach ($rows as $row) {
            $role = $row['role'] === 'assistant' ? 'model' : 'user';
            $contents[] = [
                'role' => $role,
                'parts' => [['text' => $row['content']]],
            ];
        }

        $groqConfigured = trim((string) config('services.groq.api_key', '')) !== '';
        $ollamaEnabled = (bool) config('services.ollama.enabled', false);

        $text = $this->chatWithProvider($system, $contents);
        if ($text === null || $text === '') {
            if ($groqConfigured || $ollamaEnabled) {
                return response()->json([
                    'message' => 'Could not reach the AI service. Try again in a moment.',
                ], 502);
            }

            return response()->json([
                'message' => 'AI support is not configured. Set GROQ_API_KEY, or enable local OLLAMA (OLLAMA_ENABLED=true).',
            ], 503);
        }

        return response()->json([
            'data' => [
                'message' => trim($text),
            ],
        ]);
    }

    /**
     * @param  array<int, array{role: string, parts: array<int, array{text: string}>}>  $contents
     */
    private function chatWithProvider(string $system, array $contents): ?string
    {
        $groqApiKey = (string) config('services.groq.api_key', '');
        if (trim($groqApiKey) !== '') {
            return $this->chatWithGroq($groqApiKey, $system, $contents);
        }

        $ollamaEnabled = (bool) config('services.ollama.enabled', false);
        if ($ollamaEnabled) {
            return $this->chatWithOllama($system, $contents);
        }

        return null;
    }

    /**
     * @param  array<int, array{role: string, parts: array<int, array{text: string}>}>  $contents
     */
    private function chatWithGroq(string $apiKey, string $system, array $contents): ?string
    {
        $model = (string) config('services.groq.model', 'llama-3.1-8b-instant');
        $url = self::GROQ_API_HOST.'/openai/v1/chat/completions';
        $messages = [['role' => 'system', 'content' => $system]];
        foreach ($contents as $row) {
            $messages[] = [
                'role' => $row['role'] === 'model' ? 'assistant' : 'user',
                'content' => (string) data_get($row, 'parts.0.text', ''),
            ];
        }

        try {
            $response = Http::timeout(90)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer '.$apiKey,
                ])
                ->post($url, [
                    'model' => $model,
                    'messages' => $messages,
                    'temperature' => 0.45,
                    'max_tokens' => 900,
                ]);
        } catch (\Throwable $e) {
            Log::warning('support.chat.groq.transport', ['error' => $e->getMessage()]);

            return null;
        }

        if (! $response->successful()) {
            Log::warning('support.chat.groq', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        }

        return $this->extractGroqText($response->json());
    }

    /**
     * @param  array<int, array{role: string, parts: array<int, array{text: string}>}>  $contents
     */
    private function chatWithOllama(string $system, array $contents): ?string
    {
        $baseUrl = rtrim((string) config('services.ollama.base_url', 'http://127.0.0.1:11434'), '/');
        $model = (string) config('services.ollama.model', 'llama3.2');
        $url = $baseUrl.'/api/chat';

        $messages = [['role' => 'system', 'content' => $system]];
        foreach ($contents as $row) {
            $role = $row['role'] === 'model' ? 'assistant' : 'user';
            $messages[] = [
                'role' => $role,
                'content' => (string) data_get($row, 'parts.0.text', ''),
            ];
        }

        try {
            $response = Http::timeout(120)->post($url, [
                'model' => $model,
                'messages' => $messages,
                'stream' => false,
                'options' => [
                    'temperature' => 0.45,
                ],
            ]);
        } catch (\Throwable $e) {
            Log::warning('support.chat.ollama.transport', ['error' => $e->getMessage()]);

            return null;
        }

        if (! $response->successful()) {
            Log::warning('support.chat.ollama', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        }

        $content = data_get($response->json(), 'message.content');

        return is_string($content) ? trim($content) : null;
    }

    /**
     * @param  array<string, mixed>|null  $json
     */
    private function extractGroqText(?array $json): ?string
    {
        if ($json === null) {
            return null;
        }

        $content = data_get($json, 'choices.0.message.content');

        return is_string($content) ? trim($content) : null;
    }
}
