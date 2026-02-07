// Shared enum-like constants for activity state
// Using Object.freeze to simulate enums across runtime and types
export const Activity = Object.freeze({
    IDLE: "idle",
    SLEEPING: "sleeping",
    GAMING: "gaming",
    WORKING: "working",
    STUDYING: "studying",
    GYMMING: "gymming",
    LISTENING: "listening",
    TALKING: "talking",
} as const);

export type ActivityState = (typeof Activity)[keyof typeof Activity];

export type Mood =
    | "happy"
    | "sad"
    | "cheerful"
    | "neutral"
    ;

export function getActivityState(
    hour: number,
    isUserTalking: boolean
): ActivityState {
    if (hour >= 0 && hour < 7) return Activity.SLEEPING;
    if (isUserTalking) return Activity.LISTENING;
    if (hour >= 9 && hour < 17) return Activity.WORKING;
    if (hour >= 18 && hour < 22) return Activity.GAMING;
    return Activity.IDLE;
}
