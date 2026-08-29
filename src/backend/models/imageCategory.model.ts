import mongoose, { Schema, Document, Model } from "mongoose";

export interface ImageCategory extends Document {
    name: string;
    slug: string;
    position: number;
    createdAt: Date;
    updatedAt: Date;
}


const ImageCategorySchema = new Schema<ImageCategory>(
    {
        name: {
            type: String,
            required: true,
            trim:true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        position: {
            type: Number,
            required: true,
            min:0,
        },
    },
    { timestamps: true }
);

ImageCategorySchema.index({ position: 1 });

export const ImageCategory: Model<ImageCategory> = mongoose.models.ImageCategory || mongoose.model<ImageCategory>("ImageCategory", ImageCategorySchema); 