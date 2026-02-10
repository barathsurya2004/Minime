"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Activity, Mood, type ActivityState } from "@/lib/ai/activity";
import { get_initial_activity } from "@/data/models/RoomAnimationController";

export type GlobalContextValue = {
    activity: ActivityState;
    setActivity: (value: ActivityState) => void;
    emotion: Mood;
    setEmotion: (value: Mood) => void;
};

const GlobalContext = createContext<GlobalContextValue | null>(null);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [activity, setActivity] = useState<ActivityState>(get_initial_activity());
    const [emotion, setEmotion] = useState<Mood>("neutral");
    const value: GlobalContextValue = {
        activity,
        setActivity,
        emotion,
        setEmotion,
    };

    return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}

export function useGlobal() {
    const ctx = useContext(GlobalContext);
    if (!ctx) throw new Error("useGlobal must be used within GlobalProvider");
    return ctx;
}
