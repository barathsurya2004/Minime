"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RemoveAuthKey() {
    const router = useRouter();

    useEffect(() => {
        // Remove the authKey from local storage
        localStorage.removeItem("authKey");

        // Remove the authKey from cookies
        document.cookie = "authKey=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

        alert("authKey has been removed from local storage and cookies.");

        // Redirect to the home page after removal
        router.push("/");
    }, [router]);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <h1>Removing authKey...</h1>
        </div>
    );
}