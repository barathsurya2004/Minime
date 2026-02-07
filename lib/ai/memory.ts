import fs from "fs";
import path from "path";

type MemoryItem = {
    key: string;
    value: string;
};

function readMemory(): MemoryItem[] {
    return []; // Return an empty array since memory.json is removed
}

export function store_data(key: string, value: string) {
    const memories = readMemory();
    const existing = memories.find(m => m.key === key);

    if (existing) {
        existing.value = value;
    } else {
        memories.push({ key, value });
    }

    // writeMemory(memories);
}

export function get_data(key: string): string | null {
    const memories = readMemory();
    return memories.find(m => m.key === key)?.value || null;
}

export function get_recent_memories(limit = 5): string[] {
    const memories = readMemory();
    return memories.slice(-limit).map(m => m.value);
}

export function delete_data(key: string) {
    const memories = readMemory();
    const filtered = memories.filter(m => m.key !== key);
    // writeMemory(filtered);
}

export function deleteLatestReminder() {
    const memories = readMemory();
    const idx = [...memories].reverse().findIndex(m =>
        m.key.startsWith("reminder:")
    );

    if (idx === -1) return;

    const realIndex = memories.length - 1 - idx;
    memories.splice(realIndex, 1);
    // writeMemory(memories);
}
