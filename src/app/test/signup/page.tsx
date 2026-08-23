"use client"
import { signup } from "@/backend/actions/auth.action";

export default function Signup() {
    async function handleSubmit() {
        const data = {
            name: "Swati ajay kulkarni",
            email: "swatiajaykulkarni@gmail.com",
            password: "12345678",
        };
        const response = await signup(data);
        console.log(response);
    }
    return (
        <div className="bg-black h-screen w-screen text-amber-50">
            <button className="px-4 py-2 bg-primary text-white" onClick={handleSubmit}>Test</button>
        </div>
    );
}