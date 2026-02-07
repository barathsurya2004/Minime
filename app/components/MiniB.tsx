"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Room } from '../../data/models/Room';
import { Check } from '../../data/models/Check';
import type { ActivityState } from "@/lib/ai/activity";
// import { useControls } from "leva";

type MiniBProps = {
    activityState?: ActivityState;
    mood?: string;
    currentHour?: number;
    onInitActivity?: (activity: ActivityState) => void;
};

export default function MiniB({ activityState, mood, currentHour, onInitActivity }: MiniBProps) {




    return (
        <div
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
            }}
        >
            <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} />

                <Room
                    activityState={activityState}
                    mood={mood}
                    currentHour={currentHour}
                    onInitActivity={onInitActivity}
                />

                {/* TEMP: remove later */}

            </Canvas>
        </div>
    );
}
