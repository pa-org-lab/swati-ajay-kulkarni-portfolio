// lib/auth/jwt.ts

import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET!
);

export async function createToken(userId: string) {
    return new SignJWT({ userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("10h")
        .sign(secret);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
}