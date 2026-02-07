

type AffectionState = {
    value: number; // 0 to 100
    lastInteraction: number; // timestamp
    lastDecayBucket: string | null; // "6h", "1d", "3d", "7d", or null
};

const DEFAULT_STATE: AffectionState = {
    value: 50,
    lastInteraction: Date.now(),
    lastDecayBucket: null,
};

/**
 * Affection is a persistent emotional state.
 * It is ONLY mutated via functions in this file.
 */

let inMemoryState: AffectionState = { ...DEFAULT_STATE };

function readState(): AffectionState {
    return { ...DEFAULT_STATE }; // Always return the default state
}

function writeState(state: AffectionState) {
    // No-op: Do nothing for the dummy system
}

function clamp(value: number, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

/* ---------------------------------- */
/* PUBLIC API (USE ONLY THESE)         */
/* ---------------------------------- */

/**
 * 1️⃣ adjustAffection
 * Used when the AI explicitly signals emotional change
 * via meta.affection_delta.
 */
export function adjustAffection(delta: number): number {
    return DEFAULT_STATE.value; // Always return the default affection value
}

/**
 * 2️⃣ registerInteraction
 * Used when the user sends ANY message,
 * even if affection_delta is 0.
 *
 * This prevents decay from triggering incorrectly.
 */
export function registerInteraction() {
    // No-op: Do nothing for the dummy system
}

/**
 * 3️⃣ checkAffectionDecay
 * Used on app open (or periodically).
 * Applies gentle decay ONLY ONCE per time bucket.
 */
export function checkAffectionDecay(): number {
    return DEFAULT_STATE.value; // Always return the default affection value
}

/**
 * 4️⃣ getAffection
 * Read-only access for AI context.
 */
export function getAffection(): number {
    return DEFAULT_STATE.value; // Always return the default affection value
}

/* ---------------------------------- */
/* Decay Logic (PRIVATE)               */
/* ---------------------------------- */

function getDecayBucket(hours: number): string | null {
    if (hours < 6) return null;
    if (hours < 24) return "6h";
    if (hours < 72) return "1d";
    if (hours < 168) return "3d";
    return "7d";
}

function getDecayAmount(bucket: string): number {
    switch (bucket) {
        case "6h":
            return -1;
        case "1d":
            return -3;
        case "3d":
            return -6;
        case "7d":
            return -10;
        default:
            return 0;
    }
}
type AffectionBand =
    | "very_low"
    | "low"
    | "medium"
    | "high"
    | "very_high";



export function getAffectionBand(value: number): AffectionBand {
    if (value < 20) return "very_low";
    if (value < 40) return "low";
    if (value < 70) return "medium";
    if (value < 90) return "high";
    return "very_high";
}
