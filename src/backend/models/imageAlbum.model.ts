import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface ImageAlbum extends Document {
  name: string;
  slug: string;
  categoryId: mongoose.Types.ObjectId;
  position: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageAlbumSchema = new Schema<ImageAlbum>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ImageCategory",
      required: true,
    },
    position: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

ImageAlbumSchema.index({ categoryId: 1, position: 1 });

export const ImageAlbum: Model<ImageAlbum> =
  mongoose.models.ImageAlbum ||
  mongoose.model<ImageAlbum>("ImageAlbum", ImageAlbumSchema);
