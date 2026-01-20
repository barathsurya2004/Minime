import { parseAIResponse } from "@/lib/ai/parse";
import { adjustAffection } from "./affection";

export async function handleAIResponse(
  rawReply: string,
  setMessages: Function,
  previousMessages: any[]
) {
  const { meta, message } = parseAIResponse(rawReply);

  // Append message
  setMessages([
    ...previousMessages,
    { role: "assistant", content: message },
  ]);


if (typeof meta.affection_delta === "number") {
  adjustAffection(meta.affection_delta);
}
  // Store reminder if needed
  if (meta.is_reminder && meta.memory_suggestion?.store) {
    await fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "reminder",
        payload: {
          value: meta.memory_suggestion.value,
        },
      }),
    });
  }

  // Store memory if needed
  if (
    meta.memory_suggestion?.store &&
    !meta.is_reminder
  ) {
    await fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "memory",
        payload: {
          key: meta.memory_suggestion.key,
          value: meta.memory_suggestion.value,
        },
      }),
    });
  }

  return meta;
}
