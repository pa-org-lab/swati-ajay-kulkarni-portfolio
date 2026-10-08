import mongoose, { Schema, Document, Model } from "mongoose";

export interface Images extends Document {
  title: string;
  url: string;
  categoryId: mongoose.Types.ObjectId;
  albumId?: mongoose.Types.ObjectId | null;
  position: number;
  description: string;

  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema = new Schema<Images>(
  {
    title: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "ImageCategory",
      required: true,
    },
    albumId: {
      type: Schema.Types.ObjectId,
      ref: "ImageAlbum",
      default: null,
    },
    position: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type:String,
      trim: true
    }
  },
  { timestamps: true }
);


ImageSchema.index({ categoryId: 1, position: 1 });
ImageSchema.index({ albumId: 1, position: 1 });

export const Image: Model<Images> = mongoose.models.Image || mongoose.model<Images>("Image", ImageSchema);