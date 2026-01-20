export function parseAIResponse(raw: string) {
    if (!raw || typeof raw !== "string") {
        throw new Error("Empty AI response");
    }

    // Try to extract JSON block anywhere
    const jsonMatch = raw.match(/<json>\s*([\s\S]*?)\s*<\/json>/i);
    const messageMatch = raw.match(/<message>\s*([\s\S]*?)\s*<\/message>/i);

    // If both blocks exist → ideal case
    if (jsonMatch && messageMatch) {
        try {
            const meta = JSON.parse(jsonMatch[1].trim());
            const message = messageMatch[1].trim();
            return { meta, message };
        } catch (err) {
            throw new Error("Failed to parse JSON block");
        }
    }

    // -------------------------------
    // 🛟 FALLBACK MODE (CRITICAL)
    // -------------------------------
    // Groq sometimes ignores formatting.
    // We recover gracefully.

    return {
        meta: {
            mood: "neutral",
            tone: "warm",
            intent: "chat",
            affection_delta: 0,
            is_reminder: false,
            memory_suggestion: {
                store: false,
                key: null,
                value: null,
            },
        },
        message: raw.trim(),
        recovered: true,
    };
}
