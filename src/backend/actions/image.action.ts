"use server";

import dbConnect from "@/backend/config/dbConnect";
import { ImageCategory } from "@/backend/models/imageCategory.model";
import { Image } from "@/backend/models/images.model";

export interface ImageData {
  _id: string;
  title: string;
  url: string;
  categoryId: string;
  position: number;
  description?: string;
  createdAt?: string;
}

export async function getImagesByCategoryAction(categoryId: string): Promise<{
  success: boolean;
  images?: ImageData[];
  error?: string;
}> {
  try {
    if (!categoryId) {
      return { success: false, error: "Category ID is required" };
    }

    await dbConnect();

    // Uses compound index { categoryId: 1, position: 1 }
    const images = await Image.find({ categoryId })
      .sort({ position: 1 })
      .lean();

    return {
      success: true,
      images: images.map((img) => ({
        _id: img._id.toString(),
        title: img.title || "",
        url: img.url,
        categoryId: img.categoryId.toString(),
        position: img.position,
        description: img.description || "",
        createdAt: img.createdAt?.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch images",
    };
  }
}

export async function saveUploadedImagesAction(
  categoryId: string,
  imagesToSave: { url: string; title?: string; description?: string }[]
): Promise<{
  success: boolean;
  images?: ImageData[];
  error?: string;
}> {
  try {
    if (!categoryId || !imagesToSave || !imagesToSave.length) {
      return { success: false, error: "Invalid upload parameters" };
    }

    await dbConnect();

    const category = await ImageCategory.findById(categoryId).select("_id");
    if (!category) {
      return { success: false, error: "Category not found" };
    }

    // Covered query using index { categoryId: 1, position: 1 } in reverse
    const lastImage = await Image.findOne({ categoryId })
      .sort({ position: -1 })
      .select("position")
      .lean();
    const startPosition = lastImage ? lastImage.position + 1 : 0;

    const docs = imagesToSave.map((img, index) => ({
      categoryId,
      url: img.url,
      title: img.title?.trim() || "",
      description: img.description?.trim() || "",
      position: startPosition + index,
    }));

    const inserted = await Image.insertMany(docs);

    return {
      success: true,
      images: inserted.map((img) => ({
        _id: img._id.toString(),
        title: img.title || "",
        url: img.url,
        categoryId: img.categoryId.toString(),
        position: img.position,
        description: img.description || "",
        createdAt: img.createdAt?.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error saving uploaded images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save images",
    };
  }
}

export async function updateImageAction(
  imageId: string,
  data: { title?: string; description?: string }
): Promise<{
  success: boolean;
  image?: ImageData;
  error?: string;
}> {
  try {
    if (!imageId) {
      return { success: false, error: "Image ID is required" };
    }

    await dbConnect();

    const updated = await Image.findByIdAndUpdate(
      imageId,
      {
        title: data.title?.trim() || "",
        description: data.description?.trim() || "",
      },
      { new: true }
    );

    if (!updated) {
      return { success: false, error: "Image not found" };
    }

    return {
      success: true,
      image: {
        _id: updated._id.toString(),
        title: updated.title || "",
        url: updated.url,
        categoryId: updated.categoryId.toString(),
        position: updated.position,
        description: updated.description || "",
        createdAt: updated.createdAt?.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update image",
    };
  }
}

export async function reorderImagesAction(
  categoryId: string,
  orderedIds: string[]
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!categoryId || !orderedIds || !orderedIds.length) {
      return { success: true };
    }

    await dbConnect();

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id, categoryId },
        update: { $set: { position: index } },
      },
    }));

    await Image.bulkWrite(bulkOps);

    return { success: true };
  } catch (error) {
    console.error("Error reordering images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder images",
    };
  }
}

export async function deleteImageAction(imageId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!imageId) {
      return { success: false, error: "Image ID is required" };
    }

    await dbConnect();

    await Image.findByIdAndDelete(imageId);

    return { success: true };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}
