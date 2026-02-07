"use client";

type ChatDisplayProps = {
    currentMessage: string | null;
    isLoading: boolean;
};

export default function ChatDisplay({ currentMessage, isLoading }: ChatDisplayProps) {
    // Don't render if there's nothing to show
    if (!currentMessage && !isLoading) {
        return null;
    }

    return (
        <div
            style={{
                position: "fixed",
                width: "100%",
                height: "50%",
                top: "50vh",
                zIndex: 10,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    width: "100%",
                    height: "50%",
                    paddingRight: 45,
                    paddingLeft: 45,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    zIndex: 10,
                }}
            >
                {currentMessage && (
                    <div
                        style={{
                            fontSize: 22,
                            lineHeight: 1.6,
                            color: "#111",
                        }}
                    >
                        {currentMessage}
                    </div>
                )}

                {isLoading && (
                    <div
                        style={{
                            fontStyle: "italic",
                            opacity: 0.7,
                            fontSize: 16,
                            color: "#555",
                        }}
                    >
                        Mini-Barath is thinking…
                    </div>
                )}
            </div>
            <img src="/dialogue.webp"
                style={{
                    position: "fixed",
                    width: "100%",
                    height: "50%",
                    top: "50vh",
                    zIndex: 0,
                }}
                alt="" />
        </div>
    );
}
