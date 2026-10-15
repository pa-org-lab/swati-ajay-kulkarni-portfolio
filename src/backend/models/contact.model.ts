import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface ContactDocument extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "replied" | "archived";
  emailSentToAdmin: boolean;
  emailSentToUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<ContactDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^\S+@\S+\.\S+$/,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
      index: true,
    },
    emailSentToAdmin: {
      type: Boolean,
      default: false,
    },
    emailSentToUser: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

ContactSchema.index({ createdAt: -1 });

export const Contact: Model<ContactDocument> =
  mongoose.models.Contact ||
  mongoose.model<ContactDocument>("Contact", ContactSchema);
