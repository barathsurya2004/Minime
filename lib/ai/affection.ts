import fs from "fs";
import path from "path";

/**
 * Affection is a persistent emotional state.
 * It is ONLY mutated via functions in this file.
 */

const AFFECTION_PATH = path.join(process.cwd(), "data/affection.json");

type AffectionState = {
    value: number;
    lastInteraction: string;
    lastDecayBucket: string | null;
};

const DEFAULT_STATE: AffectionState = {
    value: 60,
    lastInteraction: new Date().toISOString(),
    lastDecayBucket: null,
};

/* ---------------------------------- */
/* Internal Helpers (PRIVATE)          */
/* ---------------------------------- */

function readState(): AffectionState {
    if (!fs.existsSync(AFFECTION_PATH)) {
        return DEFAULT_STATE;
    }

    return JSON.parse(fs.readFileSync(AFFECTION_PATH, "utf-8"));
}

function writeState(state: AffectionState) {
    fs.writeFileSync(AFFECTION_PATH, JSON.stringify(state, null, 2));
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
    if (typeof delta !== "number" || delta === 0) {
        return getAffection();
    }

    const state = readState();

    // Safety clamp (AI can never break the system)
    const safeDelta = clamp(delta, -5, 5);

    state.value = clamp(state.value + safeDelta);
    state.lastInteraction = new Date().toISOString();
    state.lastDecayBucket = null; // reset decay on interaction

    writeState(state);
    return state.value;
}

/**
 * 2️⃣ registerInteraction
 * Used when the user sends ANY message,
 * even if affection_delta is 0.
 *
 * This prevents decay from triggering incorrectly.
 */
export function registerInteraction() {
    const state = readState();

    state.lastInteraction = new Date().toISOString();
    state.lastDecayBucket = null;

    writeState(state);
}

/**
 * 3️⃣ checkAffectionDecay
 * Used on app open (or periodically).
 * Applies gentle decay ONLY ONCE per time bucket.
 */
export function checkAffectionDecay(): number {
    const state = readState();

    const now = Date.now();
    const last = new Date(state.lastInteraction).getTime();
    const hoursSince = (now - last) / (1000 * 60 * 60);

    const bucket = getDecayBucket(hoursSince);

    // No decay needed
    if (!bucket || bucket === state.lastDecayBucket) {
        return state.value;
    }

    const decay = getDecayAmount(bucket);
    state.value = clamp(state.value + decay);
    state.lastDecayBucket = bucket;

    writeState(state);
    return state.value;
}

/**
 * 4️⃣ getAffection
 * Read-only access for AI context.
 */
export function getAffection(): number {
    return readState().value;
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
