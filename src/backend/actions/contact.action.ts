"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/backend/config/dbConnect";
import { Contact } from "@/backend/models/contact.model";
import { ContactFormSchema } from "@/backend/schemas/contact.schema";
import { sendContactNotificationEmails, sendEmail } from "./email";

export interface ContactItemData {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  emailSentToAdmin: boolean;
  emailSentToUser: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactStats {
  total: number;
  unread: number;
  today: number;
}

export interface GetContactsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface GetContactsResult {
  success: boolean;
  contacts?: ContactItemData[];
  stats?: ContactStats;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
  error?: string;
}

/**
 * Format MongoDB document into serialized ContactItemData
 */
function formatContact(doc: Record<string, unknown>): ContactItemData {
  return {
    _id: String(doc._id || ""),
    name: String(doc.name || ""),
    email: String(doc.email || ""),
    subject: String(doc.subject || ""),
    message: String(doc.message || ""),
    status: (doc.status as ContactItemData["status"]) || "unread",
    emailSentToAdmin: Boolean(doc.emailSentToAdmin),
    emailSentToUser: Boolean(doc.emailSentToUser),
    createdAt: doc.createdAt
      ? new Date(String(doc.createdAt)).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(String(doc.updatedAt)).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Public action: Validate form, save to DB, and send notifications to admin & user
 */
export async function submitContactFormAction(data: unknown) {
  const validation = ContactFormSchema.safeParse(data);
  if (!validation.success) {
    const error =
      validation.error.issues[0]?.message || "Invalid contact form data";
    return { success: false, error };
  }

  const { name, email, subject, message } = validation.data;

  try {
    await dbConnect();

    // 1. Save submission to MongoDB
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      status: "unread",
    });

    // 2. Send dual notification emails in parallel
    const emailResult = await sendContactNotificationEmails({
      name,
      email,
      subject,
      message,
    });

    // 3. Record email transmission status
    await Contact.findByIdAndUpdate(contact._id, {
      emailSentToAdmin: emailResult.adminSent,
      emailSentToUser: emailResult.userSent,
    });

    revalidatePath("/admin/messages");

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
      contactId: contact._id.toString(),
    };
  } catch (error) {
    console.error("Submit contact form error:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again later.",
    };
  }
}

/**
 * Admin action: Query paginated contact messages and overview metrics
 */
export async function getContactsAction({
  page = 1,
  limit = 20,
  status,
  search,
}: GetContactsParams = {}): Promise<GetContactsResult> {
  try {
    await dbConnect();

    const query: Record<string, unknown> = {};
    if (status && status !== "all") {
      query.status = status;
    }

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { name: regex },
        { email: regex },
        { subject: regex },
        { message: regex },
      ];
    }

    // Midnight local time for today's submissions
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [total, unread, today, totalCount, docs] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: "unread" }),
      Contact.countDocuments({ createdAt: { $gte: startOfToday } }),
      Contact.countDocuments(query),
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
    ]);

    return {
      success: true,
      contacts: (docs as unknown as Array<Record<string, unknown>>).map(
        formatContact,
      ),
      stats: { total, unread, today },
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
      },
    };
  } catch (error) {
    console.error("Get contacts error:", error);
    return { success: false, error: "Failed to retrieve messages" };
  }
}

/**
 * Admin action: Get single message details and optionally mark as read
 */
export async function getContactByIdAction(id: string, autoMarkAsRead = true) {
  try {
    await dbConnect();
    const doc = await Contact.findById(id);
    if (!doc) {
      return { success: false, error: "Message not found" };
    }

    if (autoMarkAsRead && doc.status === "unread") {
      doc.status = "read";
      await doc.save();
    }

    return {
      success: true,
      contact: formatContact(
        doc.toObject() as unknown as Record<string, unknown>,
      ),
    };
  } catch (error) {
    console.error("Get contact by id error:", error);
    return { success: false, error: "Failed to load message" };
  }
}

/**
 * Admin action: Update status of a message
 */
export async function updateContactStatusAction(
  id: string,
  status: "unread" | "read" | "replied" | "archived",
) {
  try {
    await dbConnect();
    const updated = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!updated) {
      return { success: false, error: "Message not found" };
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Update contact status error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

/**
 * Admin action: Delete a single contact submission
 */
export async function deleteContactAction(id: string) {
  try {
    await dbConnect();
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Message not found" };
    }

    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Delete contact error:", error);
    return { success: false, error: "Failed to delete message" };
  }
}

/**
 * Admin action: Bulk delete contact submissions
 */
export async function deleteMultipleContactsAction(ids: string[]) {
  try {
    await dbConnect();
    await Contact.deleteMany({ _id: { $in: ids } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error) {
    console.error("Bulk delete contacts error:", error);
    return { success: false, error: "Failed to delete messages" };
  }
}

/**
 * Admin action: Send a reply email to a contact inquiry
 */
export async function replyToContactAction(
  id: string,
  replyText: string,
  customSubject?: string,
) {
  if (!replyText?.trim()) {
    return { success: false, error: "Reply message cannot be empty" };
  }

  try {
    await dbConnect();
    const contact = await Contact.findById(id);
    if (!contact) {
      return { success: false, error: "Message not found" };
    }

    const subject = customSubject?.trim() || `Re: ${contact.subject}`;

    const safeReply = replyText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\n/g, "<br/>");

    const emailHtml = `<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f3f0; margin: 0; padding: 24px; color: #2b1f18;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e8dfd8; overflow: hidden; box-shadow: 0 4px 20px rgba(43,31,24,0.06);">
    <tr>
      <td style="background-color: #a8522e; height: 5px;"></td>
    </tr>
    <tr>
      <td style="padding: 32px 32px 16px 32px; border-bottom: 1px solid #f0e8e2;">
        <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #a8522e; text-transform: uppercase; letter-spacing: 0.15em;">
          Studio of Swati Ajay Kulkarni
        </p>
        <h1 style="margin: 0; font-family: Georgia, serif; font-size: 22px; font-weight: normal; color: #2b1f18;">
          Response to Your Inquiry
        </h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 32px;">
        <p style="margin: 0 0 16px 0; font-size: 14.5px; color: #2b1f18;">
          Dear <strong>${contact.name}</strong>,
        </p>
        <div style="background-color: #faf6f2; border-left: 3px solid #a8522e; padding: 18px 20px; font-size: 14px; line-height: 1.65; color: #3b2e25; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
          ${safeReply}
        </div>
        <p style="margin: 0; font-size: 13.5px; color: #6b5a50; line-height: 1.5;">
          Best regards,<br>
          <strong style="color: #2b1f18;">Dr. Swati Ajay Kulkarni</strong><br>
          <span style="font-size: 12px; color: #8e7a6f;">Artist &bull; Photographer &bull; Pune, India</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailResult = await sendEmail({
      to: contact.email,
      subject,
      html: emailHtml,
      text: replyText,
      replyTo: process.env.ADMIN_EMAIL || "swatiakulkarni@gmail.com",
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: emailResult.error || "Failed to deliver email through provider",
      };
    }

    contact.status = "replied";
    await contact.save();
    try {
      revalidatePath("/admin/messages");
    } catch {
      // non-blocking
    }

    return { success: true, message: "Reply sent successfully!" };
  } catch (error: unknown) {
    console.error("Reply to contact error:", error);
    const errMessage =
      error instanceof Error ? error.message : "Failed to send reply";
    return { success: false, error: errMessage };
  }
}
