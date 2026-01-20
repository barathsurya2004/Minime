import { NextRequest, NextResponse } from "next/server";
import "server-only";

import { Groq } from "groq-sdk";

import { CORE_SYSTEM_PROMPT } from "@/lib/ai/prompt";
import { buildContextPrompt } from "@/lib/ai/context";
import {
    adjustAffection,
    registerInteraction,
    getAffection,
    getAffectionBand,
} from "@/lib/ai/affection";
import { parseAIResponse } from "@/lib/ai/parse";
import { getActivityState } from "@/lib/ai/activity";
import { store_data, delete_data } from "@/lib/ai/memory";


// Initialize Groq client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const affectionLevel = getAffection();
        const affectionBand = getAffectionBand(affectionLevel);

        const hour = new Date().getHours();

        const {
            message,
            chatHistory = [],
            inferredMood,
            interactionGapHours,

        } = body;

        if (!message) {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        /* ---------------------------------- */
        /* 1️⃣ Build System + Context Prompt   */
        /* ---------------------------------- */

        const contextPrompt = buildContextPrompt({
            inferredMood,
            affectionLevel,
            interactionGapHours,
            affectionBand
        });

        const systemPrompt = `${CORE_SYSTEM_PROMPT}\n\n${contextPrompt}`;

        /* ---------------------------------- */
        /* 2️⃣ Build Messages for Groq         */
        /* ---------------------------------- */

        const messages = [
            {
                role: "system",
                content: systemPrompt,
            },
            ...chatHistory.map((msg: any) => ({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content,
            })),
            {
                role: "user",
                content: message,
            },
        ];

        /* ---------------------------------- */
        /* 3️⃣ Call Groq                      */
        /* ---------------------------------- */

        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages,
            temperature: 0.9,
            top_p: 1,
            max_completion_tokens: 800,
            reasoning_effort: "medium",
        });

        const rawReply =
            completion.choices[0]?.message?.content ?? "";
        const parsed = parseAIResponse(rawReply);
        console.log("🚀 AI Response Meta:", parsed.meta);
        console.log("🚀 AI Response Message:", parsed.message);

        if ((parsed as any).recovered) {
            console.warn("⚠️ AI response recovered (format violated):", rawReply);
        }


        /* ---------------------------------- */
        /* 4️⃣ Parse AI Output                 */
        /* ---------------------------------- */

        const { meta, message: aiMessage } = parsed;

        /* ---------------------------------- */
        /* 5️⃣ Update Affection (SERVER ONLY)  */
        /* ---------------------------------- */

        registerInteraction();

        // ACTIVE REMINDER → STORE OR UPDATE
        if (meta.reminding === "active" && meta.memory_suggestion?.store) {
            store_data(
                `reminder:${meta.memory_suggestion.key ?? Date.now()}`,
                meta.memory_suggestion.value
            );
        }

        // COMPLETED REMINDER → REMOVE
        if (meta.reminding === "completed") {
            if (meta.memory_suggestion?.key) {
                delete_data(`reminder:${meta.memory_suggestion.key}`);
            } else {
                // fallback: remove latest reminder
            }
        }

        if (typeof meta.affection_delta === "number") {
            adjustAffection(meta.affection_delta);
        }

        /* ---------------------------------- */
        /* 6️⃣ Compute Character States        */
        /* ---------------------------------- */

        const activityState = getActivityState(hour, true);
        const emotionState = meta.mood;

        /* ---------------------------------- */
        /* 7️⃣ Respond to Client               */
        /* ---------------------------------- */

        return NextResponse.json({
            message: aiMessage,
            meta,
            state: {
                activity: activityState,
                emotion: emotionState,
            },
        });
    } catch (err) {
        console.error("GROQ AI ERROR:", err);
        return NextResponse.json(
            { error: "AI generation failed" },
            { status: 500 }
        );
    }
}
