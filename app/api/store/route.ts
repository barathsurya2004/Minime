import { NextRequest, NextResponse } from "next/server";
import { store_data } from "@/lib/ai/memory";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, payload } = body;

    if (!type || !payload) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    switch (type) {
      case "reminder":
        return handleReminder(payload);

      case "memory":
        return handleMemory(payload);

      default:
        return NextResponse.json(
          { error: "Unsupported data type" },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error("STORE API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to store data" },
      { status: 500 }
    );
  }
}


function handleReminder(payload: any) {
  const {
    value,        // reminder text
    dueAt = null, // optional ISO string
    meta = {},
  } = payload;

  if (!value) {
    return NextResponse.json(
      { error: "Reminder value is required" },
      { status: 400 }
    );
  }

  const reminder = {
    id: crypto.randomUUID(),
    text: value,
    dueAt,
    createdAt: new Date().toISOString(),
    completed: false,
    meta,
  };

  // Store as a collection-style key
  store_data(`reminder:${reminder.id}`, JSON.stringify(reminder));

  return NextResponse.json({
    success: true,
    reminder,
  });
}

function handleMemory(payload: any) {
  const { key, value } = payload;

  if (!key || !value) {
    return NextResponse.json(
      { error: "Memory key and value are required" },
      { status: 400 }
    );
  }

  store_data(`memory:${key}`, value);

  return NextResponse.json({
    success: true,
    key,
    value,
  });
}
