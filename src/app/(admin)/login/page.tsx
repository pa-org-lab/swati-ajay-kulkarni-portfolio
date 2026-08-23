"use client";

import { Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const LOGO_URL =
  "https://lh3.googleusercontent.com/aida/AEtjO1WTPMYGKYPZn_MUhMD7A6QY-ZefsGDQtMjjpBN5S3Za4z4G7b0u2kO0QKbOQU-1w7kqdizZmc7LZY69qausXwB7jJ_S4ehk4YCyVCGiJ3NgzmNL4O0AWJHFnCKo7zPMywEC4-49S-C4RH2hK7hOvxieBiEVv_LLGqsENzBVk8yaWc1E_q-TkkkDkgGNX5qSgtuU9m5vUZJ-UNl6NZjq1HLG3h9i5JJEBEEUD9HpDB1tanA7HKz3T96icNI1";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [imageError, setImageError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      // Simulate authentication / placeholder for auth API
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!email || !password) {
        setErrorMessage("Please enter both email and password.");
        setIsLoading(false);
        return;
      }

      // Placeholder feedback
      setSuccessMessage("Authentication successful. Redirecting...");
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during sign in.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`${manrope.className} min-h-screen flex items-center justify-center p-4 md:p-8 bg-[#FBF5F4] text-[#1b1b1c] relative overflow-hidden selection:bg-[#ffdad5] selection:text-[#350f0b]`}
    >
      {/* Ambient background blur elements for organic depth */}
      <div
        className="w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-[#feb8af]/25 to-[#ffd6fe]/20 blur-[100px] pointer-events-none absolute -top-20 -left-20"
        aria-hidden="true"
      />
      <div
        className="w-[450px] h-[450px] rounded-full bg-gradient-to-br from-[#ffd6fe]/25 to-[#ffdbcc]/30 blur-[100px] pointer-events-none absolute -bottom-20 -right-20"
        aria-hidden="true"
      />

      <main className="w-full max-w-md mx-auto relative z-10">
        {/* Floating Glassmorphic Login Card */}
        <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 shadow-[0px_20px_40px_rgba(26,26,27,0.06)] rounded-[24px] p-8 md:p-12 flex flex-col items-center transform transition-transform hover:scale-[1.01] duration-500">
          {/* Logo / Monogram */}
          <div className="w-32 h-32 mb-8 flex-shrink-0 relative flex items-center justify-center">
            {imageError ? (
              <div className="w-full h-full rounded-2xl bg-[#FAF7F2] border border-[#dcc1b6]/40 shadow-sm flex flex-col items-center justify-center p-4 text-center overflow-hidden group">
                <span className="font-serif text-[18px] tracking-[0.22em] uppercase text-[#1b1b1c] font-medium transition-transform group-hover:scale-105 duration-300">
                  PORTFOLIO
                </span>
                <span className="w-6 h-[1px] bg-[#974314]/60 mt-2" />
              </div>
            ) : (
              <Image
                alt="Portfolio Wordmark"
                className="w-full h-full object-contain rounded-2xl"
                src={LOGO_URL}
                width={128}
                height={128}
                priority
                unoptimized
                onError={() => setImageError(true)}
              />
            )}
          </div>

          {/* Title */}
          <div className="text-center mb-10 w-full">
            <h1 className="text-[32px] leading-[40px] font-semibold text-[#1b1b1c] tracking-[-0.02em] mb-2">
              Admin Access
            </h1>
            <p className="text-[16px] leading-[26px] text-[#55433b] tracking-[0.01em]">
              Secure entry to creative management.
            </p>
          </div>

          {/* Error / Success Feedback */}
          {errorMessage && (
            <div className="w-full mb-6 p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-xs leading-relaxed flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="w-full mb-6 p-3.5 rounded-xl bg-[#e2bae3]/30 border border-[#725174]/20 text-[#2c1030] text-xs leading-relaxed flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#725174] flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-8" noValidate>
            {/* Email Field */}
            <div className="relative group">
              <label
                htmlFor="email"
                className="text-[12px] leading-[16px] font-semibold text-[#55433b] block mb-2 uppercase tracking-[0.1em] opacity-80 group-focus-within:opacity-100 group-focus-within:text-[#974314] transition-all"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border-0 border-b border-[#dcc1b6] px-0 py-3 text-[16px] leading-[26px] text-[#1b1b1c] placeholder:text-[#dcc1b6] outline-none transition-all duration-300 ease-out focus:border-b-[#974314] focus:bg-white/55 focus:rounded-md focus:px-4 focus:shadow-[0_4px_12px_-2px_rgba(151,67,20,0.08)] focus:ring-0"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="text-[12px] leading-[16px] font-semibold text-[#55433b] uppercase tracking-[0.1em] opacity-80 group-focus-within:opacity-100 group-focus-within:text-[#974314] transition-all"
                >
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent border-0 border-b border-[#dcc1b6] px-0 pr-10 py-3 text-[16px] leading-[26px] text-[#1b1b1c] placeholder:text-[#dcc1b6] outline-none transition-all duration-300 ease-out focus:border-b-[#974314] focus:bg-white/55 focus:rounded-md focus:px-4 focus:shadow-[0_4px_12px_-2px_rgba(151,67,20,0.08)] focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 text-[#897269] hover:text-[#974314] focus:outline-none p-1.5 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-full bg-[#BE6030] text-[#ffffff] text-[12px] leading-[16px] font-semibold tracking-[0.1em] uppercase hover:bg-[#b75a2b] hover:shadow-[0_12px_24px_-6px_rgba(183,90,43,0.35)] active:scale-[0.99] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[16px] leading-[26px] text-[#55433b] hover:text-[#974314] transition-colors opacity-80 hover:opacity-100 group font-medium"
          >
            <FiArrowLeft className="text-sm transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
