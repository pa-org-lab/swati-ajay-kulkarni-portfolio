"use server";

import dbConnect from "@/backend/config/dbConnect";
import { getPublicImageUrl } from "@/backend/lib/publicImageUrl";
import { Image, type Images } from "@/backend/models/images.model";

export interface ImageData {
  _id: string;
  title: string;
  url: string;
  categoryId: string;
  position: number;
  description?: string;
  createdAt?: string;
}

// Helper to format MongoDB document into ImageData
function formatImage(img: Images | Record<string, unknown>): ImageData {
  const record = img as Record<string, unknown>;
  const rawCreatedAt = record.createdAt;
  const createdAtStr =
    rawCreatedAt instanceof Date
      ? rawCreatedAt.toISOString()
      : typeof rawCreatedAt === "string"
        ? rawCreatedAt
        : undefined;

  return {
    _id: String(record._id),
    title: typeof record.title === "string" ? record.title : "",
    url: getPublicImageUrl(typeof record.url === "string" ? record.url : ""),
    categoryId: String(record.categoryId),
    position: typeof record.position === "number" ? record.position : 0,
    description:
      typeof record.description === "string" ? record.description : "",
    createdAt: createdAtStr,
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

// Fetch images for a category with pagination
export async function getImagesByCategoryAction(
  categoryId: string,
  page: number = 1,
  limit: number = 12,
) {
  try {
    if (!categoryId)
      return { success: false, error: "Category ID is required" };

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 12);
    const skip = (pageNum - 1) * limitNum;

    await dbConnect();
    const [images, total] = await Promise.all([
      Image.find({ categoryId })
        .sort({ position: 1, _id: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Image.countDocuments({ categoryId }),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    const hasMore = pageNum < totalPages;

    return {
      success: true,
      images: images.map(formatImage),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasMore,
      },
    };
  } catch (error) {
    console.error("Error fetching images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch images",
    };
  }
}

// Save newly uploaded images
export async function saveUploadedImagesAction(
  categoryId: string,
  imagesToSave: { url: string; title?: string; description?: string }[],
) {
  try {
    if (!categoryId || !imagesToSave?.length) {
      return { success: false, error: "Invalid upload parameters" };
    }

    await dbConnect();

    // const category = await ImageCategory.findById(categoryId).select("_id");
    // if (!category) return { success: false, error: "Category not found" };

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
      images: inserted.map(formatImage),
    };
  } catch (error) {
    console.error("Error saving uploaded images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save images",
    };
  }
}

// Update image details (title/description)
export async function updateImageAction(
  imageId: string,
  data: { title?: string; description?: string },
) {
  try {
    if (!imageId) return { success: false, error: "Image ID is required" };

    await dbConnect();

    const updated = await Image.findByIdAndUpdate(
      imageId,
      {
        title: data.title?.trim() || "",
        description: data.description?.trim() || "",
      },
      { new: true },
    ).lean();

    if (!updated) return { success: false, error: "Image not found" };

    return {
      success: true,
      image: formatImage(updated),
    };
  } catch (error) {
    console.error("Error updating image:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update image",
    };
  }
}

// Reorder images within a category
export async function reorderImagesAction(
  categoryId: string,
  orderedIds: string[]
) {
  try {
    if (!categoryId || !orderedIds?.length) return { success: true };

    await dbConnect();

    await Image.bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, categoryId },
          update: { $set: { position: index } },
        },
      }))
    );

    return { success: true };
  } catch (error) {
    console.error("Error reordering images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder images",
    };
  }
}

// Delete image
export async function deleteImageAction(imageId: string) {
  try {
    if (!imageId) return { success: false, error: "Image ID is required" };

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

