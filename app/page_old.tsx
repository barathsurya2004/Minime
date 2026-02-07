"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/lib/hooks/useChat";
import { ChatWindow } from "./components/ChatWindow";
import { ChatInput } from "./components/ChatInput";
import { StateIndicator } from "./components/StateIndicator";

export default function HomePage() {
  const {
    messages,
    loading,
    started,
    activity,
    emotion,
    startInteraction,
    sendMessage,
  } = useChat();

  const [input, setInput] = useState("");

  useEffect(() => {
    if (messages.length > 0) {
      console.log("Chat Messages:", messages);
    }
  }, [messages]);

  async function startInteraction() {
    if (loading) return;


    setLoading(true);
    setStarted(true);

    try {
      await fetch("/api/affection/check", { method: "POST" });

      const res = await fetch("/api/ai-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            "Hey. I just opened the app. If there’s anything important I should remember today, remind me. If not, just say something sweet to start the day.",
          chatHistory: [],
          inferredMood: "neutral",
          affectionLevel: 60,
          interactionGapHours: 8,
        }),
      });

      const data = await res.json();
      console.log("Start Interaction Data:", data);
      setMessages([
        { role: "assistant", content: data.message },
      ]);
      if (data.state) {
        setActivity(data.state.activity);
        setEmotion(data.state.emotion);
      }

    } catch (err) {
      console.error(err);
      setMessages([
        {
          role: "assistant",
          content: "Hey… I’m here. Something glitched but I’ve got you 🫂",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-models", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          chatHistory: updatedMessages,
          inferredMood: "neutral",
          affectionLevel: 60,
          interactionGapHours: 1,
        }),
      });

      const data = await res.json();
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.message },
      ]);
      if (data.state) {
        setActivity(data.state.activity);
        setEmotion(data.state.emotion);
      }
    } catch (err) {
      console.error(err);
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "I’m still here. Try again, okay?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Mini-Barath</h2>

      {!started && (
        <button
          onClick={startInteraction}
          style={{
            padding: "12px 18px",
            borderRadius: 8,
            border: "none",
            background: "#111",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Tap to check in
        </button>
      )}

      {started && (
        <>
          <div
            style={{
              marginBottom: 12,
              padding: 8,
              borderRadius: 6,
              background: "#f3f4f6",
              fontSize: 14,
            }}
          >
            <strong>Mini-Barath</strong> is currently{" "}
            <em>{activity}</em> and feels{" "}
            <em>{emotion}</em>.
          </div>

          <div
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 12,
              height: 400,
              overflowY: "auto",
              marginBottom: 12,
              marginTop: 16,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  textAlign: msg.role === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 10px",
                    borderRadius: 6,
                    background:
                      msg.role === "user" ? "#dbeafe" : "#fce7f3",
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ))}

            {loading && (
              <div style={{ fontStyle: "italic", opacity: 0.6 }}>
                Mini-Barath is typing…
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Say something…"
              style={{
                flex: 1,
                padding: 8,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: "none",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </>
      )}
    </main>
  );
}
