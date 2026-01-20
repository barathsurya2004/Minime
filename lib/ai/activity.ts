import "server-only";

export type ActivityState =
    | "idle"
    | "sleeping"
    | "gaming"
    | "studying"
    | "listening";

export function getActivityState(
    hour: number,
    isUserTalking: boolean
): ActivityState {
    if (hour >= 0 && hour < 7) return "sleeping";
    if (isUserTalking) return "listening";
    if (hour >= 9 && hour < 17) return "studying";
    if (hour >= 18 && hour < 22) return "gaming";
    return "idle";
}
