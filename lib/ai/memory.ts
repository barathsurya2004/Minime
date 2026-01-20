import fs from "fs";
import path from "path";

const MEMORY_PATH = path.join(process.cwd(), "data/memory.json");

type MemoryItem = {
    key: string;
    value: string;
};

function readMemory(): MemoryItem[] {
    if (!fs.existsSync(MEMORY_PATH)) return [];
    const raw = fs.readFileSync(MEMORY_PATH, "utf-8");
    return JSON.parse(raw || "[]");
}

function writeMemory(memories: MemoryItem[]) {
    fs.writeFileSync(MEMORY_PATH, JSON.stringify(memories, null, 2));
}

export function store_data(key: string, value: string) {
    const memories = readMemory();
    const existing = memories.find(m => m.key === key);

    if (existing) {
        existing.value = value;
    } else {
        memories.push({ key, value });
    }

    writeMemory(memories);
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
    writeMemory(filtered);
}

export function deleteLatestReminder() {
    const memories = readMemory();
    const idx = [...memories].reverse().findIndex(m =>
        m.key.startsWith("reminder:")
    );

    if (idx === -1) return;

    const realIndex = memories.length - 1 - idx;
    memories.splice(realIndex, 1);
    writeMemory(memories);
}
