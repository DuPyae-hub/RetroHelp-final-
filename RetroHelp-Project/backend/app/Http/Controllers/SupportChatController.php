<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SupportChatController extends Controller
{
    /**
     * General RetroHelp support assistant (OpenAI-compatible Chat Completions).
     * Not medical advice. Rate-limited per IP / user.
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'messages' => ['required', 'array', 'min:1', 'max:24'],
            'messages.*.role' => ['required', 'string', 'in:user,assistant'],
            'messages.*.content' => ['required', 'string', 'max:4000'],
        ]);

        $apiKey = config('services.openai.api_key');
        if ($apiKey === null || $apiKey === '') {
            return response()->json([
                'message' => 'AI support is not configured. Set OPENAI_API_KEY on the server.',
            ], 503);
        }

        $model = (string) config('services.openai.chat_model', 'gpt-4o-mini');
        $baseUrl = rtrim((string) config('services.openai.api_base', 'https://api.openai.com/v1'), '/');

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

        $outbound = [
            ['role' => 'system', 'content' => $system],
        ];

        foreach ($validated['messages'] as $row) {
            $outbound[] = [
                'role' => $row['role'],
                'content' => $row['content'],
            ];
        }

        try {
            $response = Http::timeout(90)
                ->withToken($apiKey)
                ->acceptJson()
                ->post("{$baseUrl}/chat/completions", [
                    'model' => $model,
                    'messages' => $outbound,
                    'max_tokens' => 900,
                    'temperature' => 0.45,
                ]);
        } catch (\Throwable $e) {
            Log::warning('support.chat.transport', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Could not reach the AI service. Try again in a moment.',
            ], 502);
        }

        if (! $response->successful()) {
            Log::warning('support.chat.openai', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return response()->json([
                'message' => 'The AI service returned an error. Please try again later.',
            ], 502);
        }

        $content = data_get($response->json(), 'choices.0.message.content');
        if (! is_string($content) || $content === '') {
            return response()->json([
                'message' => 'Unexpected response from the AI service.',
            ], 502);
        }

        return response()->json([
            'data' => [
                'message' => trim($content),
            ],
        ]);
    }
}
