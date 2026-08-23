import mongoose, { Schema, Document, Model } from "mongoose";

export interface User extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^\S+@\S+\.\S+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // 🔥 hides password by default
    },

  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot reload
export const User: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema);