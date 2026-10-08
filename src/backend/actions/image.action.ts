"use server";

import dbConnect from "@/backend/config/dbConnect";
import { getPublicImageUrl } from "@/backend/lib/publicImageUrl";
import { Image, type Images } from "@/backend/models/images.model";
import mongoose from "mongoose";
import { ImageCategory } from "../models/imageCategory.model";

export interface ImageData {
  _id: string;
  title: string;
  url: string;
  categoryId: string;
  albumId?: string | null;
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
    albumId: record.albumId ? String(record.albumId) : null,
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
  albumId?: string | null,
) {
  try {
    if (!categoryId)
      return { success: false, error: "Category ID is required" };

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.max(1, Number(limit) || 12);
    const skip = (pageNum - 1) * limitNum;
    const filter = { categoryId, albumId: albumId || null };

    await dbConnect();
    const [images, total] = await Promise.all([
      Image.find(filter)
        .sort({ position: 1, _id: 1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Image.countDocuments(filter),
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
  albumId?: string | null,
) {
  try {
    if (!categoryId || !imagesToSave?.length) {
      return { success: false, error: "Invalid upload parameters" };
    }

    await dbConnect();

    // const category = await ImageCategory.findById(categoryId).select("_id");
    // if (!category) return { success: false, error: "Category not found" };

    const lastImage = await Image.findOne({ categoryId, albumId: albumId || null })
      .sort({ position: -1 })
      .select("position")
      .lean();
    const startPosition = lastImage ? lastImage.position + 1 : 0;

    const docs = imagesToSave.map((img, index) => ({
      categoryId,
      albumId: albumId || null,
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
  orderedIds: string[],
  albumId?: string | null
) {
  try {
    if (!categoryId || !orderedIds?.length) return { success: true };

    await dbConnect();

    await Image.bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, categoryId, albumId: albumId || null },
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

export interface PublicGalleryImageItem {
  _id: string;
  title: string;
  url: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  description?: string;
  createdAt?: string;
}

// Fetch public gallery images with category details
export async function getPublicGalleryImagesAction(filter?: {
  categorySlug?: string;
  sort?: "newest" | "oldest" | "title";
}) {
  try {
    await dbConnect();

    const pipeline: mongoose.PipelineStage[] = [
      { $match: { albumId: null } },
      {
        $lookup: {
          from: "imagecategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          "category.slug": { $nin: ["hero-section", "hero", "herosection"] },
          "category.name": { $not: { $regex: /^hero/i } },
        },
      },
    ];

    if (filter?.categorySlug && filter.categorySlug !== "all") {
      pipeline.push({
        $match: {
          "category.slug": { $regex: new RegExp(`^${filter.categorySlug}$`, "i") },
        },
      });
    }


    let sortStage: Record<string, 1 | -1> = { position: 1, _id: 1 };
    if (filter?.sort === "newest") {
      sortStage = { createdAt: -1, _id: -1 };
    } else if (filter?.sort === "oldest") {
      sortStage = { createdAt: 1, _id: 1 };
    } else if (filter?.sort === "title") {
      sortStage = { title: 1 };
    }

    pipeline.push({ $sort: sortStage });

    const rawImages = await Image.aggregate(pipeline);

    const images: PublicGalleryImageItem[] = rawImages.map((record) => {
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
        categoryId: record.categoryId ? String(record.categoryId) : "",
        categoryName: record.category?.name || "Portfolio",
        categorySlug: record.category?.slug || "portfolio",
        description: typeof record.description === "string" ? record.description : "",
        createdAt: createdAtStr,
      };
    });

    return {
      success: true,
      images,
    };
  } catch (error) {
    console.error("Error fetching public gallery images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch gallery images",
      images: [],
    };
  }
}

export interface HeroImageItem {
  title: string;
  description: string;
  position: number;
  url: string;
} 

export async function getHeroImagesAction() {
  try {
    await dbConnect();

    const heroImages = await ImageCategory.aggregate<HeroImageItem>([
      {
        $match: { slug: "hero-section" },
      },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "categoryId",
          pipeline: [
            { $sort: { position: 1 } },
            {
              $project: {
                _id: 0,
                url: 1,
                title: 1,
                description: 1,
                position: 1,
              },
            },
          ],
          as: "images",
        },
      },
      { $unwind: "$images" },
      { $replaceRoot: { newRoot: "$images" } },
    ]);

    return {
      success: true,
      images: heroImages.map((img) => ({
        ...img,
        url: getPublicImageUrl(img.url),
      })),
    };
  } catch (error) {
    console.error("Error fetching hero images:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch hero images",
      images: [],
    };
  }
}


export interface GalleryGlimpseItem {
  id: string;
  url: string;
  title: string;
}

// fetch the public home page gallery glimpse section 
export async function getGalleryGlimpseAction() {
  try {
    await dbConnect();

    const glimpseImages = await ImageCategory.aggregate<GalleryGlimpseItem>([
      {
        $match: {
          slug: { $nin: ["hero-section"] },
        },
      },
      { $sort: { position: 1, _id: 1 } },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "categoryId",
          pipeline: [
            { $sort: { position: 1, _id: 1 } },
            { $limit: 5 },
            {
              $project: {
                _id: 0,
                id: { $toString: "$_id" },
                url: 1,
                title: 1,
              },
            },
          ],
          as: "images",
        },
      },
      { $unwind: "$images" },
      { $replaceRoot: { newRoot: "$images" } },
    ]);

    return {
      success: true,
      images: glimpseImages.map((img) => ({
        id: String(img.id),
        url: getPublicImageUrl(img.url),
        title: typeof img.title === "string" ? img.title : "",
      })),
    };
  } catch (error) {
    console.error("Error fetching gallery glimpse images:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch gallery glimpse images",
      images: [],
    };
  }
}