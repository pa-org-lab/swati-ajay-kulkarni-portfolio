"use server";

import { User } from "../models/user.model";
import { SignupSchema, LoginSchema } from "../schemas/auth.schema";
import bcrypt from "bcryptjs";
import dbConnect from "../config/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { createToken } from "../lib/jwt";

export async function signup(data: unknown) {

    const validData = SignupSchema.safeParse(data);
    if (!validData.success) {
        return { success: false, error: validData.error.issues };
    }

    try {
        const { name, email, password } = validData.data;
        await dbConnect();

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();
        return { success: true, message: "User created successfully" }

    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            (error as any).code === 11000
        ) {
            return { success: false, message: "Email already in use" };
        }

        console.error("Signup error:", error);
        return { success: false, message: "Failed to create user" };
    }

}

export async function login(data: unknown) {
    const validData = LoginSchema.safeParse(data);
    if (!validData.success) {
        return { success: false, error: validData.error.issues };
    }

    try {
        const { email, password } = validData.data;
       await dbConnect();

        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return { success: false, error: "User not found" };
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return { success: false, error: "Invalid password" };
        }

        const token = await createToken(user._id.toString());

        const cookieStore = await cookies();

        cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 10 * 60 * 60,
        });

        return {success:true, message:"User logged in successfully"};
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Failed to login" }
    }
}

export async function logout() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("auth-token");
        return {
            success: true,
            message: "Logout successful",
        };
    } catch (error) {
        console.error("Logout error:", error);
        return {
            success: false,
            error: "Failed to logout",
        };
    }
}