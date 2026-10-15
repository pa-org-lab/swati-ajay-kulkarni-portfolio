"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiBookmark,
  FiCheck,
  FiLoader,
  FiMail,
  FiMessageSquare,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { submitContactFormAction } from "@/backend/actions/contact.action";

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialValues: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const [formData, setFormData] = useState<FormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const validate = (): boolean => {
    const errs: Partial<FormValues> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Please enter your name (at least 2 characters).";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.subject.trim() || formData.subject.trim().length < 2) {
      errs.subject = "Please enter a subject (at least 2 characters).";
    }
    if (!formData.message.trim() || formData.message.trim().length < 5) {
      errs.message = "Please write a message (at least 5 characters).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields properly.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitContactFormAction(formData);

      if (res.success) {
        setIsSubmitted(true);
        setFormData(initialValues);
        toast.success(
          "Message sent! Both you and Dr. Swati Ajay Kulkarni have received an email confirmation.",
        );
      } else {
        toast.error(res.error || "Failed to send message. Please try again.");
      }
    } catch (err: unknown) {
      console.error("Submission error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again later.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative rounded-3xl bg-white border border-stone-200/90 p-7 sm:p-9 shadow-[0_4px_28px_-6px_rgba(43,31,24,0.07)]">
      <div className="flex items-center gap-3 mb-6 select-none">
        <span className="text-[10px] sm:text-[11px] font-sans font-semibold tracking-[0.28em] uppercase text-[#c2654d]">
          Send an Inquiry
        </span>
        <div className="flex-1 h-[1px] bg-stone-200/80" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal leading-tight">
        Write a Message
      </h2>
      <p className="mt-2 text-stone-500 font-sans text-xs sm:text-sm leading-relaxed">
        Inquiries regarding fine art prints, photography commissions,
        exhibitions, or academic collaborations.
      </p>

      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="mt-8 p-8 rounded-2xl bg-[#faf6f2] border border-[#ede3da] text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-[#c2654d] text-white flex items-center justify-center text-2xl shadow-[0_4px_14px_rgba(194,101,77,0.35)]">
              <FiCheck />
            </div>
            <h3 className="mt-5 font-serif text-xl sm:text-2xl text-stone-900 font-normal">
              Message Received
            </h3>
            <p className="mt-2 text-sm text-stone-600 font-sans leading-relaxed max-w-sm mx-auto">
              Thank you! An email copy has been dispatched to your inbox, and
              Dr. Swati Ajay Kulkarni has been notified.
            </p>
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="mt-6 px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-white border border-stone-300 text-stone-800 hover:border-[#c2654d] hover:text-[#c2654d] transition-all cursor-pointer shadow-sm"
            >
              Send Another Message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-7 space-y-5"
            noValidate
          >
            {/* Name & Email Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
                >
                  Your Name <span className="text-[#c2654d]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <FiUser className="text-sm" />
                  </div>
                  <input
                    type="text"
                    id="contact-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="e.g. John Doe"
                    autoComplete="name"
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-stone-50/70 border text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition-all duration-200 ${
                      errors.name
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-stone-200 focus:border-[#c2654d] focus:ring-2 focus:ring-[#c2654d]/15"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
                >
                  Email Address <span className="text-[#c2654d]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <FiMail className="text-sm" />
                  </div>
                  <input
                    type="email"
                    id="contact-email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-stone-50/70 border text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition-all duration-200 ${
                      errors.email
                        ? "border-red-400 focus:ring-2 focus:ring-red-200"
                        : "border-stone-200 focus:border-[#c2654d] focus:ring-2 focus:ring-[#c2654d]/15"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Subject <span className="text-[#c2654d]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <FiBookmark className="text-sm" />
                </div>
                <input
                  type="text"
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="e.g. Fine Art Print Purchase / Commission Inquiry"
                  className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-stone-50/70 border text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition-all duration-200 ${
                    errors.subject
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-stone-200 focus:border-[#c2654d] focus:ring-2 focus:ring-[#c2654d]/15"
                  }`}
                />
              </div>
              {errors.subject && (
                <p className="mt-1.5 text-xs text-red-500">{errors.subject}</p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5"
              >
                Your Message <span className="text-[#c2654d]">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 pointer-events-none text-stone-400">
                  <FiMessageSquare className="text-sm" />
                </div>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  placeholder="Share details regarding your request, dates, locations, or print preferences..."
                  className={`w-full pl-10 pr-4 py-3 text-sm rounded-xl bg-stone-50/70 border text-stone-900 placeholder-stone-400 focus:bg-white focus:outline-none transition-all duration-200 resize-y min-h-[120px] ${
                    errors.message
                      ? "border-red-400 focus:ring-2 focus:ring-red-200"
                      : "border-stone-200 focus:border-[#c2654d] focus:ring-2 focus:ring-[#c2654d]/15"
                  }`}
                />
              </div>
              {errors.message && (
                <p className="mt-1.5 text-xs text-red-500">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[200px] flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#c2654d] text-white font-sans text-xs sm:text-sm font-semibold tracking-wider uppercase hover:bg-[#a8522e] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_4px_18px_rgba(194,101,77,0.3)] hover:shadow-[0_6px_22px_rgba(194,101,77,0.4)] transition-all duration-200 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin text-base" />
                    <span>Sending Notification...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <FiSend className="text-sm" />
                  </>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
