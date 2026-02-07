"use client";

import { useState, useEffect } from "react";
import MiniB from "./components/MiniB";
import ChatDisplay from "./components/ChatDisplay";
import AnimationDebugPanel from "./components/AnimationDebugPanel";
import { useChat } from "@/lib/hooks/useChat";
import { Activity } from "@/lib/ai/activity";
import { useGlobal } from "./providers";
import { useAnimalese } from "@/lib/hooks/useAnimalese";
export default function HomePage() {
  const [input, setInput] = useState("");
  const [recentMessage, setRecentMessage] = useState<string | null>(null);
  const { speak, isSpeaking } = useAnimalese("/models/animalese.wav")
  // Use the actual chat hook
  const {
    messages,
    loading,
    started,
    activity,
    emotion,
    startInteraction,
    sendMessage: sendChatMessage,
  } = useChat();

  const { setActivity } = useGlobal();

  // Update recent message when a new AI message arrives
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      setRecentMessage(lastMessage.content);
      speak(lastMessage.content);

      const timeout = setTimeout(() => {
        // setRecentMessage(null);
      }, 20000);

      return () => clearTimeout(timeout);
    }
  }, [messages]);

  useEffect(() => {
    if (isSpeaking) {
      setActivity(Activity.TALKING)
    } else {
      setActivity(Activity.LISTENING)
    }
  }, [isSpeaking])



  /* ------------------------------ */
  /* SEND MESSAGE                    */
  /* ------------------------------ */
  async function handleSendMessage() {
    if (!started || !input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    await sendChatMessage(userMessage);
  }

  /* ------------------------------ */
  /* RENDER                          */
  /* ------------------------------ */
  return (
    <main
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* <AnimationDebugPanel /> */}
      {/* Background 3D */}
      <MiniB
        activityState={activity}
        mood={emotion}
        currentHour={new Date().getHours()}
        onInitActivity={setActivity}
      />

      {/* TOP INPUT BAR */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: 12,
          zIndex: 10,
          backdropFilter: "blur(6px)",
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          disabled={!started || loading}
          onChange={(e) => {
            const value = e.target.value;
            setInput(value);

            if (!started || loading) return;

            if (value.trim().length > 0) {
              setActivity(Activity.LISTENING);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            started ? "Say something…" : "Start the interaction first"
          }
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #070000",
            fontSize: 22,
            opacity: started ? 1 : 0.6,
            color: "#000",
          }}
        />

        {!started && (
          <button
            onClick={() => {
              startInteraction();
            }}
            style={{
              padding: "0 14px",
              borderRadius: 10,
              border: "none",
              background: "#111",
              color: "#de0606",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            Start
          </button>
        )}
      </div>

      {/* DIALOGUE BOX - Only show when there's a recent message or loading */}
      <ChatDisplay currentMessage={recentMessage} isLoading={loading} />

      {/* DEBUG PANEL - Remove before production */}
    </main>
  );
}
