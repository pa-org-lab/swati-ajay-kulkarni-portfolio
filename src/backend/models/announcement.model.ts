import mongoose, { type Document, type Model, Schema } from "mongoose";

export type AnnouncementType =
  | "classes-workshops"
  | "exhibitions"
  | "community"
  | "general";

export type AnnouncementStatus = "published" | "draft" | "archived";

export interface AnnouncementDocument extends Document {
  title: string;
  slug: string;
  type: AnnouncementType;
  content: string; // Markdown formatted body
  summary?: string; // Optional short summary/excerpt
  coverImage?: string; // Optional banner or poster image URL
  eventDate?: Date | null; // Optional event date/time for workshops/exhibitions
  location?: string; // Optional physical or online location
  link?: string; // Optional external registration/RSVP link
  linkText?: string; // Optional text for link button, defaults to "Learn More"
  status: AnnouncementStatus;
  isPinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<AnnouncementDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["classes-workshops", "exhibitions", "community", "general"],
      default: "general",
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    summary: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    coverImage: {
      type: String,
      trim: true,
      default: "",
    },
    eventDate: {
      type: Date,
      default: null,
      index: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    link: {
      type: String,
      trim: true,
      default: "",
    },
    linkText: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "Learn More",
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published",
      index: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// Compound index for querying public announcements by pinned and recency
AnnouncementSchema.index({ status: 1, isPinned: -1, createdAt: -1 });
AnnouncementSchema.index({ status: 1, type: 1, createdAt: -1 });

export const Announcement: Model<AnnouncementDocument> =
  mongoose.models.Announcement ||
  mongoose.model<AnnouncementDocument>("Announcement", AnnouncementSchema);
