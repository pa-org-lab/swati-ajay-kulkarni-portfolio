import mongoose, { Schema, Document, Model } from "mongoose";

export interface Images extends Document {
    title: string;
    url: string;
    categoryId: mongoose.Types.ObjectId;
    position: number;

    createdAt: Date;
    updatedAt: Date;
}


const ImageSchema = new Schema<Images>(
  {
    title: {
      type: String,
      trim:true
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
    position: {
      type: Number,
      required: true,
      min:0,
    },  
  },
  { timestamps: true }
);


ImageSchema.index({ categoryId: 1, position: 1 });

export const Image: Model<Images> = mongoose.models.Image || mongoose.model<Images>("Image", ImageSchema);