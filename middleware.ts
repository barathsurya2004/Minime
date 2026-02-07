import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("authKey"); // Check for the token in cookies
    const { pathname } = req.nextUrl;

    // If the user is trying to access the auth route
    if (pathname === "/auth") {
        // If the token exists, redirect to the gift page
        if (token) {
            const url = req.nextUrl.clone();
            url.pathname = "/gift";
            return NextResponse.redirect(url);
        }
        return NextResponse.next(); // Allow access to the auth page
    }

    // If the user is trying to access the main page or gift page
    if (pathname === "/" || pathname === "/gift") {
        // If the token does not exist, redirect to the auth page
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/auth";
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next(); // Allow access to other routes
}

export const config = {
    matcher: ["/", "/gift", "/auth"], // Apply middleware to these routes
};