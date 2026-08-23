// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./backend/lib/jwt";

export async function proxy(req: NextRequest) {
    const token = req.cookies.get("auth-token")?.value
    
    if (!token) {
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }

    const payload = await verifyToken(token);
    
    if (!payload) {
        const response = NextResponse.redirect(
            new URL("/login", req.url)
        );
        response.cookies.delete("auth-token");
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
