import type { AIRequestPayload, AIResponseData } from "@/lib/types/chat";

/**
 * Send a message to the AI models API endpoint
 */
export async function sendToAI(
    payload: AIRequestPayload
): Promise<AIResponseData> {
    const response = await fetch("/api/ai-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`AI request failed: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Check affection level
 */
export async function checkAffection(): Promise<void> {
    await fetch("/api/affection/check", { method: "POST" });
}
