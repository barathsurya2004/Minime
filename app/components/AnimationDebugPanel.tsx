"use client";

import { useState } from "react";
import {
    playGaming,
    stopGaming,
    playGymming,
    stopGymming,
    playSleeping,
    stopSleeping,
    playTalking,
    stopTalking,
    playIdle,
    stopIdle,
    playHappy,
    stopHappy,
    playRunning,
    stopRunning,
    playWorking,
    stopWorking,
} from "../../data/models/RoomAnimationController";

const ANIMATIONS = [
    { name: "Gaming", play: playGaming, stop: stopGaming },
    { name: "Gymming", play: playGymming, stop: stopGymming },
    { name: "Sleeping", play: playSleeping, stop: stopSleeping },
    { name: "Talking", play: playTalking, stop: stopTalking },
    { name: "Idle", play: playIdle, stop: stopIdle },
    { name: "Happy", play: playHappy, stop: stopHappy },
    { name: "Running", play: playRunning, stop: stopRunning },
    { name: "Working", play: playWorking, stop: stopWorking },
];

export default function AnimationDebugPanel() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                position: "fixed",
                zIndex: 1000,
                fontFamily: "monospace",
            }}
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: "10px 16px",
                    borderRadius: 8,
                    border: "none",
                    background: "#FF6B6B",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "bold",
                    cursor: "pointer",
                    marginBottom: isOpen ? 12 : 0,
                }}
            >
                {isOpen ? "Hide Debug" : "Show Debug"}
            </button>

            {/* Debug Panel */}
            {isOpen && (
                <div
                    style={{
                        background: "#1a1a1a",
                        border: "2px solid #FF6B6B",
                        borderRadius: 12,
                        padding: 16,
                        maxHeight: "80vh",
                        overflowY: "auto",
                        color: "#fff",
                        minWidth: 400,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                    }}
                >
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: "bold",
                            marginBottom: 16,
                            color: "#FF6B6B",
                            borderBottom: "1px solid #FF6B6B",
                            paddingBottom: 8,
                        }}
                    >
                        🎬 Animation Controller Debug
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 12,
                        }}
                    >
                        {ANIMATIONS.map((anim) => (
                            <div
                                key={anim.name}
                                style={{
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        minWidth: 80,
                                        fontSize: 12,
                                        fontWeight: 500,
                                    }}
                                >
                                    {anim.name}
                                </div>

                                <button
                                    onClick={() => anim.play()}
                                    style={{
                                        padding: "6px 12px",
                                        fontSize: 11,
                                        borderRadius: 4,
                                        border: "1px solid #4CAF50",
                                        background: "#4CAF50",
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        (e.target as HTMLButtonElement).style.background = "#45a049";
                                    }}
                                    onMouseOut={(e) => {
                                        (e.target as HTMLButtonElement).style.background = "#4CAF50";
                                    }}
                                >
                                    ▶ Play
                                </button>

                                <button
                                    onClick={() => anim.stop()}
                                    style={{
                                        padding: "6px 12px",
                                        fontSize: 11,
                                        borderRadius: 4,
                                        border: "1px solid #f44336",
                                        background: "#f44336",
                                        color: "#fff",
                                        cursor: "pointer",
                                        fontWeight: "bold",
                                        transition: "all 0.2s",
                                    }}
                                    onMouseOver={(e) => {
                                        (e.target as HTMLButtonElement).style.background = "#da190b";
                                    }}
                                    onMouseOut={(e) => {
                                        (e.target as HTMLButtonElement).style.background = "#f44336";
                                    }}
                                >
                                    ⏹ Stop
                                </button>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: 16,
                            paddingTop: 12,
                            borderTop: "1px solid #444",
                            fontSize: 11,
                            color: "#999",
                        }}
                    >
                        <p>💡 Click Play/Stop buttons to test animations</p>
                        <p>📝 Check console for animation logs</p>
                    </div>
                </div>
            )}
        </div>
    );
}
