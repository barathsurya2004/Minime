"use client";

import { useState, useEffect } from "react";
import MiniB from "../components/MiniB";
import AnimationDebugPanel from "../components/AnimationDebugPanel";
import { useAnimalese } from "@/lib/hooks/useAnimalese";
import ChatDisplay from "../components/ChatDisplay";
import { Activity } from "@/lib/ai/activity";
import { max } from "three/tsl";
import { useRouter } from "next/navigation";

const dialogues = [
    "Click anywhere to start the surprise! 🎉",
    "Happy 7-month anniversary, my love! ❤️",
    "I'm so sorry I can't be there to hold you today. Long distance is the hardest part...",
    "But never forget: I am your miniB, and I am always with you.",
    "With Valentine's Day coming up, there is something I need to ask...",
    "I didn't want the distance to stop me from doing this properly.",
    "So...",
    "Will you be my Valentine?",
    "Tap one last time to send me your 'YES'! 💌",
    "YAY! You just made me the happiest miniB alive! Best 7 months ever. I love you! 💖"
];

export default function GiftPage() {
    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const { speak, isSpeaking } = useAnimalese("/models/animalese.wav");
    const router = useRouter();

    const handleTap = () => {
        if (!isSpeaking) {
            if (currentDialogueIndex === dialogues.length - 1) {
                router.push("/"); // Redirect to home after the last dialogue
            } else {
                setCurrentDialogueIndex((prevIndex) => prevIndex + 1);
            }
        } else {
            console.log("Already speaking, please wait...");
        }
    };

    useEffect(() => {
        if (!isSpeaking) {
            speak(dialogues[currentDialogueIndex], {
                speed: 1.2,
            });
        }
    }, [currentDialogueIndex]);

    return (
        <div onClick={handleTap} style={{ cursor: "pointer", textAlign: "center", padding: "20px" }}>
            <MiniB activityState={isSpeaking ? Activity.TALKING : Activity.IDLE} mood="CHEERFUL" />
            <ChatDisplay currentMessage={dialogues[currentDialogueIndex]} isLoading={false} />

        </div>
    );
}
