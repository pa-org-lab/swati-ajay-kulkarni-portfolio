import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface SettingDocument extends Document {
  key: string;
  value: unknown;
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<SettingDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true },
);

export const Setting: Model<SettingDocument> =
  mongoose.models.Setting ||
  mongoose.model<SettingDocument>("Setting", SettingSchema);
