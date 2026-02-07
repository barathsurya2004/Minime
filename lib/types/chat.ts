import type { ActivityState } from "@/lib/ai/activity";
export type ChatMessage = {
    role: "user" | "assistant";
    content: string;
};

export type AIState = {
    activity: ActivityState;
    emotion: string;
};

export type AIRequestPayload = {
    message: string;
    chatHistory?: ChatMessage[];
    inferredMood?: string;
    affectionLevel?: number;
    interactionGapHours?: number;
};

export type AIResponseData = {
    message: string;
    meta?: {
        mood?: string;
        reminding?: "active" | "completed" | "none";
        affection_delta?: number;
        memory_suggestion?: {
            store?: boolean;
            key?: string;
            value?: string;
        };
    };
    state?: AIState;
};
