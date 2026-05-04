<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupportChatController extends Controller
{
    private const GEMINI_API_HOST = 'https://generativelanguage.googleapis.com';

    /**
     * General RetroHelp support assistant (Google Gemini generateContent).
     * Not medical advice. Rate-limited per IP / user.
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'messages' => ['required', 'array', 'min:1', 'max:24'],
            'messages.*.role' => ['required', 'string', 'in:user,assistant'],
            'messages.*.content' => ['required', 'string', 'max:4000'],
        ]);

        $apiKey = config('services.gemini.api_key');
        if ($apiKey === null || $apiKey === '') {
            return response()->json([
                'message' => 'AI support is not configured. Set GEMINI_API_KEY on the server.',
            ], 503);
        }

        $model = (string) config('services.gemini.model', 'gemini-2.0-flash');

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

        $url = self::GEMINI_API_HOST.'/v1beta/models/'.rawurlencode($model).':generateContent';

        $body = [
            'systemInstruction' => [
                'parts' => [['text' => $system]],
            ],
            'contents' => $contents,
            'generationConfig' => [
                'maxOutputTokens' => 900,
                'temperature' => 0.45,
            ],
        ];

        try {
            $response = Http::timeout(90)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                    'x-goog-api-key' => $apiKey,
                ])
                ->post($url, $body);
        } catch (\Throwable $e) {
            Log::warning('support.chat.transport', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Could not reach the AI service. Try again in a moment.',
            ], 502);
        }

        if (! $response->successful()) {
            Log::warning('support.chat.gemini', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return response()->json([
                'message' => 'The AI service returned an error. Please try again later.',
            ], 502);
        }

        $json = $response->json();
        $text = $this->extractGeminiText($json);
        if ($text === null || $text === '') {
            Log::warning('support.chat.gemini.empty', ['json' => $json]);

            return response()->json([
                'message' => 'Unexpected response from the AI service.',
            ], 502);
        }

        return response()->json([
            'data' => [
                'message' => trim($text),
            ],
        ]);
    }

    /**
     * @param  array<string, mixed>|null  $json
     */
    private function extractGeminiText(?array $json): ?string
    {
        if ($json === null) {
            return null;
        }
        $candidates = $json['candidates'] ?? null;
        if (! is_array($candidates) || $candidates === []) {
            return null;
        }
        $first = $candidates[0];
        if (! is_array($first)) {
            return null;
        }
        $content = $first['content'] ?? null;
        if (! is_array($content)) {
            return null;
        }
        $parts = $content['parts'] ?? null;
        if (! is_array($parts) || $parts === []) {
            return null;
        }
        $texts = [];
        foreach ($parts as $part) {
            if (is_array($part) && isset($part['text']) && is_string($part['text'])) {
                $texts[] = $part['text'];
            }
        }

        return $texts === [] ? null : implode("\n", $texts);
    }
}
