"use server";

import { revalidatePath } from "next/cache";
import slugify from "slugify";
import dbConnect from "@/backend/config/dbConnect";
import {
  Announcement,
  type AnnouncementDocument,
  type AnnouncementStatus,
  type AnnouncementType,
} from "@/backend/models/announcement.model";
import { Setting } from "@/backend/models/setting.model";
import { AnnouncementFormSchema } from "@/backend/schemas/announcement.schema";

export interface AnnouncementItemData {
  _id: string;
  title: string;
  slug: string;
  type: AnnouncementType;
  content: string;
  summary: string;
  coverImage: string;
  eventDate: string | null;
  location: string;
  link: string;
  linkText: string;
  status: AnnouncementStatus;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  classesWorkshops: number;
  exhibitions: number;
  community: number;
}

export interface GetAnnouncementsParams {
  type?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  onlyPublished?: boolean;
}

export interface GetAnnouncementsResult {
  success: boolean;
  announcements?: AnnouncementItemData[];
  stats?: AnnouncementStats;
  pagination?: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
  error?: string;
}

/**
 * Format MongoDB document into a clean, serialized JSON object
 */
function formatAnnouncement(
  doc: AnnouncementDocument | Record<string, unknown>,
): AnnouncementItemData {
  return {
    _id: String(doc._id || ""),
    title: String(doc.title || ""),
    slug: String(doc.slug || ""),
    type: (doc.type as AnnouncementType) || "general",
    content: String(doc.content || ""),
    summary: String(doc.summary || ""),
    coverImage: String(doc.coverImage || ""),
    eventDate: doc.eventDate
      ? new Date(String(doc.eventDate)).toISOString()
      : null,
    location: String(doc.location || ""),
    link: String(doc.link || ""),
    linkText: String(doc.linkText || "Learn More"),
    status: (doc.status as AnnouncementStatus) || "published",
    isPinned: Boolean(doc.isPinned),
    createdAt: doc.createdAt
      ? new Date(String(doc.createdAt)).toISOString()
      : new Date().toISOString(),
    updatedAt: doc.updatedAt
      ? new Date(String(doc.updatedAt)).toISOString()
      : new Date().toISOString(),
  };
}

/**
 * Generate a unique slug for the announcement
 */
async function generateUniqueSlug(
  title: string,
  excludeId?: string,
): Promise<string> {
  const baseSlug =
    slugify(title, { lower: true, strict: true, trim: true }) ||
    `announcement-${Date.now().toString().slice(-6)}`;

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await Announcement.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
      .select("_id")
      .lean();

    if (!existing) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Public & Admin: Fetch announcements with filtering and pagination
 */
export async function getAnnouncementsAction({
  type,
  status,
  search,
  page = 1,
  limit = 20,
  onlyPublished = false,
}: GetAnnouncementsParams = {}): Promise<GetAnnouncementsResult> {
  try {
    await dbConnect();

    const query: Record<string, unknown> = {};

    if (onlyPublished) {
      query.status = "published";
    } else if (status && status !== "all") {
      query.status = status;
    }

    if (type && type !== "all") {
      query.type = type;
    }

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { title: regex },
        { summary: regex },
        { location: regex },
        { content: regex },
      ];
    }

    const skip = (page - 1) * limit;

    // Pinned announcements come first, then sort by eventDate or createdAt
    const [docs, totalCount, statsData] = await Promise.all([
      Announcement.find(query)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Announcement.countDocuments(query),
      Announcement.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            published: {
              $sum: { $cond: [{ $eq: ["$status", "published"] }, 1, 0] },
            },
            draft: {
              $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
            },
            archived: {
              $sum: { $cond: [{ $eq: ["$status", "archived"] }, 1, 0] },
            },
            classesWorkshops: {
              $sum: {
                $cond: [{ $eq: ["$type", "classes-workshops"] }, 1, 0],
              },
            },
            exhibitions: {
              $sum: { $cond: [{ $eq: ["$type", "exhibitions"] }, 1, 0] },
            },
            community: {
              $sum: { $cond: [{ $eq: ["$type", "community"] }, 1, 0] },
            },
          },
        },
      ]),
    ]);

    const statsRaw = statsData[0] || {};
    const stats: AnnouncementStats = {
      total: statsRaw.total || 0,
      published: statsRaw.published || 0,
      draft: statsRaw.draft || 0,
      archived: statsRaw.archived || 0,
      classesWorkshops: statsRaw.classesWorkshops || 0,
      exhibitions: statsRaw.exhibitions || 0,
      community: statsRaw.community || 0,
    };

    return {
      success: true,
      announcements: docs.map((doc) => formatAnnouncement(doc)),
      stats,
      pagination: {
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
        totalCount,
      },
    };
  } catch (error) {
    console.error("Error in getAnnouncementsAction:", error);
    return {
      success: false,
      error: "Failed to load announcements. Please try again.",
    };
  }
}

/**
 * Public: Fetch a single announcement by slug
 */
export async function getAnnouncementBySlugAction(slug: string) {
  try {
    await dbConnect();

    const doc = await Announcement.findOne({
      slug,
      status: "published",
    }).lean();
    if (!doc) {
      return { success: false, error: "Announcement not found" };
    }

    return {
      success: true,
      announcement: formatAnnouncement(doc),
    };
  } catch (error) {
    console.error("Error in getAnnouncementBySlugAction:", error);
    return {
      success: false,
      error: "Failed to fetch announcement details.",
    };
  }
}

/**
 * Admin: Create a new announcement
 */
export async function createAnnouncementAction(data: unknown) {
  try {
    const validation = AnnouncementFormSchema.safeParse(data);
    if (!validation.success) {
      const error =
        validation.error.issues[0]?.message || "Invalid announcement data";
      return { success: false, error };
    }

    await dbConnect();

    const {
      title,
      type,
      content,
      summary,
      coverImage,
      eventDate,
      location,
      link,
      linkText,
      status,
      isPinned,
    } = validation.data;

    const slug = await generateUniqueSlug(title);

    const announcement = await Announcement.create({
      title,
      slug,
      type,
      content,
      summary: summary || "",
      coverImage: coverImage || "",
      eventDate: eventDate ? new Date(eventDate) : undefined,
      location: location || "",
      link: link || "",
      linkText: linkText || "Learn More",
      status,
      isPinned,
    });

    revalidatePath("/announcements");
    revalidatePath("/admin/announcements");

    return {
      success: true,
      message: "Announcement published successfully!",
      announcement: formatAnnouncement(announcement),
    };
  } catch (error) {
    console.error("Error in createAnnouncementAction:", error);
    return {
      success: false,
      error: "Failed to create announcement. Please try again.",
    };
  }
}

/**
 * Admin: Update an existing announcement
 */
export async function updateAnnouncementAction(id: string, data: unknown) {
  try {
    if (!id) {
      return { success: false, error: "Announcement ID is required" };
    }

    const validation = AnnouncementFormSchema.safeParse(data);
    if (!validation.success) {
      const error =
        validation.error.issues[0]?.message || "Invalid announcement data";
      return { success: false, error };
    }

    await dbConnect();

    const existing = await Announcement.findById(id);
    if (!existing) {
      return { success: false, error: "Announcement not found" };
    }

    const {
      title,
      type,
      content,
      summary,
      coverImage,
      eventDate,
      location,
      link,
      linkText,
      status,
      isPinned,
    } = validation.data;

    let slug = existing.slug;
    if (title !== existing.title) {
      slug = await generateUniqueSlug(title, id);
    }

    const updated = await Announcement.findByIdAndUpdate(
      id,
      {
        title,
        slug,
        type,
        content,
        summary: summary || "",
        coverImage: coverImage || "",
        eventDate: eventDate ? new Date(eventDate) : null,
        location: location || "",
        link: link || "",
        linkText: linkText || "Learn More",
        status,
        isPinned,
      },
      { new: true },
    );

    revalidatePath("/announcements");
    revalidatePath("/admin/announcements");

    return {
      success: true,
      message: "Announcement updated successfully!",
      announcement: updated ? formatAnnouncement(updated) : undefined,
    };
  } catch (error) {
    console.error("Error in updateAnnouncementAction:", error);
    return {
      success: false,
      error: "Failed to update announcement. Please try again.",
    };
  }
}

/**
 * Admin: Delete an announcement
 */
export async function deleteAnnouncementAction(id: string) {
  try {
    if (!id) {
      return { success: false, error: "Announcement ID is required" };
    }

    await dbConnect();

    const deleted = await Announcement.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Announcement not found" };
    }

    revalidatePath("/announcements");
    revalidatePath("/admin/announcements");

    return {
      success: true,
      message: "Announcement removed successfully.",
    };
  } catch (error) {
    console.error("Error in deleteAnnouncementAction:", error);
    return {
      success: false,
      error: "Failed to delete announcement.",
    };
  }
}

/**
 * Admin: Quick toggle pinned status
 */
export async function toggleAnnouncementPinAction(id: string) {
  try {
    await dbConnect();

    const announcement = await Announcement.findById(id);
    if (!announcement) {
      return { success: false, error: "Announcement not found" };
    }

    announcement.isPinned = !announcement.isPinned;
    await announcement.save();

    revalidatePath("/announcements");
    revalidatePath("/admin/announcements");

    return {
      success: true,
      isPinned: announcement.isPinned,
      message: announcement.isPinned
        ? "Announcement pinned to top"
        : "Announcement unpinned",
    };
  } catch (error) {
    console.error("Error in toggleAnnouncementPinAction:", error);
    return {
      success: false,
      error: "Failed to update pinned state.",
    };
  }
}

/**
 * Admin: Quick toggle status (published, draft, archived)
 */
export async function updateAnnouncementStatusAction(
  id: string,
  status: AnnouncementStatus,
) {
  try {
    await dbConnect();

    const updated = await Announcement.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!updated) {
      return { success: false, error: "Announcement not found" };
    }

    revalidatePath("/announcements");
    revalidatePath("/admin/announcements");

    return {
      success: true,
      message: `Announcement marked as ${status}`,
    };
  } catch (error) {
    console.error("Error in updateAnnouncementStatusAction:", error);
    return {
      success: false,
      error: "Failed to update status.",
    };
  }
}

/**
 * Public & Admin: Check if the announcements section is globally enabled
 */
export async function getAnnouncementsEnabledAction(): Promise<boolean> {
  try {
    await dbConnect();
    const setting = await Setting.findOne({
      key: "announcements_enabled",
    }).lean();

    if (!setting) {
      return true; // Default to enabled
    }

    return Boolean(setting.value);
  } catch (error) {
    console.error("Error in getAnnouncementsEnabledAction:", error);
    return true; // Fallback to enabled on error
  }
}

/**
 * Admin: Enable or disable the announcements section site-wide
 */
export async function setAnnouncementsEnabledAction(enabled: boolean) {
  try {
    await dbConnect();

    await Setting.findOneAndUpdate(
      { key: "announcements_enabled" },
      { value: enabled },
      { upsert: true, returnDocument: "after" },
    );

    revalidatePath("/", "layout");
    revalidatePath("/announcements");
    revalidatePath("/admin/announcements");

    return {
      success: true,
      enabled,
      message: enabled
        ? "Announcements section is now active on the public site."
        : "Announcements section is now disabled from the public site.",
    };
  } catch (error) {
    console.error("Error in setAnnouncementsEnabledAction:", error);
    return {
      success: false,
      error: "Failed to update announcements status.",
    };
  }
}
