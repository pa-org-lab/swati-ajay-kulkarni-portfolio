"use client";

import { Manrope } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { FiArrowLeft, FiEye, FiEyeOff, FiLoader } from "react-icons/fi";
import { login } from "@/backend/actions/auth.action";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await login({ email: data.email, password: data.password });
      setSuccessMessage(res?.message ?? "");
      if (res?.success) {
        router.push("/admin");
      } else if (!res?.success && res?.message) {
        setErrorMessage(res.message);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during sign in.";
      setErrorMessage(message);
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
        <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0px_20px_40px_rgba(26,26,27,0.06)] rounded-[24px] p-8 md:p-12 flex flex-col items-center transform transition-transform duration-500 hover:scale-[1.01]">
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
            <div
              role="alert"
              className="w-full mb-6 p-3.5 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/20 text-[#93000a] text-xs leading-relaxed flex items-center gap-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a] shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <output className="w-full mb-6 p-3.5 rounded-xl bg-[#e2bae3]/30 border border-[#725174]/20 text-[#2c1030] text-xs leading-relaxed flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#725174] shrink-0" />
              <span>{successMessage}</span>
            </output>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full space-y-8"
            noValidate
          >
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
                  type="email"
                  autoComplete="username"
                  enterKeyHint="next"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="w-full bg-transparent border-0 border-b border-[#dcc1b6] px-0 py-3 text-[16px] leading-[26px] text-[#1b1b1c] placeholder:text-[#dcc1b6] outline-none transition-all duration-300 ease-out focus:border-b-[#974314] focus:bg-white/55 focus:rounded-md focus:px-4 focus:shadow-[0_4px_12px_-2px_rgba(151,67,20,0.08)] focus:ring-0"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-[#ba1a1a]">
                  {errors.email.message}
                </p>
              )}
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
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  enterKeyHint="done"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                  })}
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
              {errors.password && (
                <p className="mt-1.5 text-xs text-[#ba1a1a]">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-full bg-[#BE6030] text-[#ffffff] text-[12px] leading-[16px] font-semibold tracking-[0.1em] uppercase hover:bg-[#b75a2b] hover:shadow-[0_12px_24px_-6px_rgba(183,90,43,0.35)] active:scale-[0.99] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[#974314] focus-visible:outline-none"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader
                      className="animate-spin text-base"
                      aria-hidden="true"
                    />
                    <span>Signing In...</span>
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
            className="inline-flex items-center gap-2 text-[16px] leading-[26px] text-[#55433b] hover:text-[#974314] transition-colors opacity-80 hover:opacity-100 group font-medium focus-visible:outline-none focus-visible:underline"
          >
            <FiArrowLeft className="text-sm transform group-hover:-translate-x-1 transition-transform" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
