import { useState, useCallback, act } from "react";
import type { ActivityState, Mood } from "@/lib/ai/activity";
import type { ChatMessage, AIState } from "@/lib/types/chat";
import { sendToAI, checkAffection } from "@/lib/api/client";
import { useGlobal } from "@/app/providers";
import { playRunning } from "@/data/models/RoomAnimationController";
const FALLBACK_MESSAGES = {
    start: "Hey… I'm here. Something glitched but I've got you 🫂",
    error: "I'm still here. Try again, okay?",
};

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const { activity, setActivity, emotion, setEmotion } = useGlobal();

    const normalizeMood = (value: string): Mood => {
        const allowed: Mood[] = [
            "happy",
            "sad",
            "neutral",
            "cheerful"
        ];

        if (allowed.includes(value as Mood)) {
            return value as Mood;
        }

        return "neutral";
    };

    const startInteraction = useCallback(async () => {
        if (loading) return;

        setLoading(true);
        setStarted(true);
        playRunning();

        try {
            await checkAffection();

            const data = await sendToAI({
                message:
                    "Hey. I just opened the app. If there's anything important I should remember today, remind me. If not, just say something sweet to start the day.",
                chatHistory: [],
            });

            setMessages([{ role: "assistant", content: data.message }]);

            if (data.state) {
                setActivity(data.state.activity);
                setEmotion(normalizeMood(data.state.emotion));
            }
        } catch (err) {
            console.error("Start interaction error:", err);
            setMessages([
                { role: "assistant", content: FALLBACK_MESSAGES.start },
            ]);
        } finally {
            setLoading(false);
        }
    }, [loading, setActivity, setEmotion]);

    const sendMessage = useCallback(
        async (content: string) => {
            if (!content.trim() || loading) return;

            const userMessage: ChatMessage = { role: "user", content };
            const updatedMessages = [...messages, userMessage];

            setMessages(updatedMessages);
            setLoading(true);

            try {
                const data = await sendToAI({
                    message: content,
                    chatHistory: updatedMessages,
                });

                setMessages([
                    ...updatedMessages,
                    { role: "assistant", content: data.message },
                ]);

                if (data.state) {
                    setActivity(data.state.activity);
                    setEmotion(normalizeMood(data.state.emotion));
                }
            } catch (err) {
                console.error("Send message error:", err);
                setMessages([
                    ...updatedMessages,
                    { role: "assistant", content: FALLBACK_MESSAGES.error },
                ]);
            } finally {
                setLoading(false);
            }
        },
        [messages, loading, setActivity, setEmotion]
    );

    return {
        messages,
        loading,
        started,
        activity,
        emotion,
        startInteraction,
        sendMessage,
    };
}
