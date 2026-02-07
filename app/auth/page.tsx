"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    const [key, setKey] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Check if the key is already in local storage
        const storedKey = localStorage.getItem("authKey");
        if (storedKey) {
            router.push("/"); // Redirect to home if key exists
        }
    }, [router]);

    const FIXED_UUID = "9df15d78-05ec-48fc-ac1c-99cdd9f3bc3c"; // Fixed UUID for validation

    const handleSubmit = () => {
        if (key.trim() === FIXED_UUID) {
            localStorage.setItem("authKey", key.trim()); // Store the key in local storage
            document.cookie = `authKey=${key.trim()}; path=/`; // Store the key in cookies
            router.push("/gift"); // Redirect to gift page
        } else {
            alert("Wrong key. Please enter the correct key.");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <h1>Authentication</h1>
            <input
                type="text"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your key"
                style={{ padding: "10px", marginBottom: "10px", fontSize: "16px" }}
            />
            <button
                onClick={handleSubmit}
                style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
            >
                Submit
            </button>
        </div>
    );
}