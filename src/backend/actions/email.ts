"use server";

import { Resend } from "resend";
import { generateAdminEmailHtml } from "@/backend/util/AdminEmailHtml";
import { generateUserEmailHtml } from "@/backend/util/UserEmailHtml";

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FROM =
  process.env.RESEND_FROM_EMAIL ||
  "Swati Ajay Kulkarni <support@swatiajaykulkarni.com>";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "swatiakulkarni@gmail.com";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

/**
 * Generic email sender using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  replyTo,
  from = DEFAULT_FROM,
}: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
      text,
      replyTo,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends notification emails to both the Admin and the User simultaneously
 */
export async function sendContactNotificationEmails(data: ContactData) {
  const [adminResult, userResult] = await Promise.allSettled([
    // 1. Send alert to Admin
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `[Portfolio Inquiry] ${data.subject} (from ${data.name})`,
      html: generateAdminEmailHtml({ ...data, submittedAt: new Date() }),
      replyTo: data.email,
    }),

    // 2. Send confirmation to User
    sendEmail({
      to: data.email,
      subject: `Thank you for contacting Swati Ajay Kulkarni: ${data.subject}`,
      html: generateUserEmailHtml(data),
      replyTo: ADMIN_EMAIL,
    }),
  ]);

  return {
    adminSent: adminResult.status === "fulfilled" && adminResult.value.success,
    userSent: userResult.status === "fulfilled" && userResult.value.success,
  };
}
