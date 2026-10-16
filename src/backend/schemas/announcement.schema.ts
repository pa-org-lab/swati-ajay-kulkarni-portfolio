import { z } from "zod";

export const AnnouncementTypeEnum = z.enum([
  "classes-workshops",
  "exhibitions",
  "community",
  "general",
]);

export const AnnouncementStatusEnum = z.enum([
  "published",
  "draft",
  "archived",
]);

export const AnnouncementFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),
  type: AnnouncementTypeEnum,
  content: z.string().trim().min(5, "Content must be at least 5 characters"),
  summary: z
    .string()
    .trim()
    .max(500, "Summary cannot exceed 500 characters")
    .optional()
    .or(z.literal("")),
  coverImage: z.string().trim().optional().or(z.literal("")),
  eventDate: z.string().optional().or(z.literal("")),
  location: z
    .string()
    .trim()
    .max(200, "Location cannot exceed 200 characters")
    .optional()
    .or(z.literal("")),
  link: z.string().trim().optional().or(z.literal("")),
  linkText: z
    .string()
    .trim()
    .max(50, "Link text cannot exceed 50 characters")
    .optional()
    .or(z.literal("")),
  status: AnnouncementStatusEnum.default("published"),
  isPinned: z.boolean().default(false),
});

export type AnnouncementFormData = z.infer<typeof AnnouncementFormSchema>;
