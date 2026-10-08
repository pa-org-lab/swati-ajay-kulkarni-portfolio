"use server";

import mongoose from "mongoose";
import slugify from "slugify";
import dbConnect from "@/backend/config/dbConnect";
import { getPublicImageUrl } from "@/backend/lib/publicImageUrl";
import { ImageAlbum } from "@/backend/models/imageAlbum.model";
import { Image } from "@/backend/models/images.model";

export interface AlbumData {
  _id: string;
  name: string;
  slug: string;
  categoryId: string;
  position: number;
  description?: string;
  count: number;
  img: string;
}

export interface PublicAlbumData extends AlbumData {
  categoryName: string;
  categorySlug: string;
}

// Joins the album's images so the cover image and count can be projected
const lookupAlbumImages: mongoose.PipelineStage = {
  $lookup: {
    from: "images",
    localField: "_id",
    foreignField: "albumId",
    pipeline: [{ $sort: { position: 1, _id: 1 } }, { $project: { url: 1 } }],
    as: "images",
  },
};

const projectAlbum: mongoose.PipelineStage = {
  $project: {
    _id: { $toString: "$_id" },
    name: 1,
    slug: 1,
    categoryId: { $toString: "$categoryId" },
    position: 1,
    description: { $ifNull: ["$description", ""] },
    count: { $size: "$images" },
    img: { $ifNull: [{ $arrayElemAt: ["$images.url", 0] }, ""] },
  },
};

async function generateUniqueSlug(name: string, excludeId?: string) {
  const base =
    slugify(name, { lower: true, strict: true }) ||
    `album-${Date.now().toString().slice(-6)}`;
  const existing = await ImageAlbum.findOne({
    slug: base,
    ...(excludeId ? { _id: { $ne: excludeId } } : {}),
  })
    .select("_id")
    .lean();
  return existing ? `${base}-${Date.now().toString().slice(-4)}` : base;
}

// Albums of a category, with cover image and image count
export async function getAlbumsByCategoryAction(categoryId: string) {
  try {
    if (!categoryId)
      return { success: false, error: "Category ID is required", albums: [] };

    await dbConnect();
    const albums: AlbumData[] = await ImageAlbum.aggregate([
      { $match: { categoryId: new mongoose.Types.ObjectId(categoryId) } },
      { $sort: { position: 1, _id: 1 } },
      lookupAlbumImages,
      projectAlbum,
    ]);

    return {
      success: true,
      albums: albums.map((a) => ({ ...a, img: getPublicImageUrl(a.img) })),
    };
  } catch (error) {
    console.error("Error fetching albums:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch albums",
      albums: [],
    };
  }
}

export async function createAlbumAction(
  categoryId: string,
  name: string,
  description?: string,
) {
  try {
    const trimmed = name?.trim();
    if (!categoryId || !trimmed) {
      return { success: false, error: "Category and album name are required" };
    }

    await dbConnect();

    const duplicate = await ImageAlbum.findOne({ categoryId, name: trimmed })
      .collation({ locale: "en", strength: 2 })
      .select("_id")
      .lean();
    if (duplicate) {
      return {
        success: false,
        error: "An album with this name already exists",
      };
    }

    const slug = await generateUniqueSlug(trimmed);
    const last = await ImageAlbum.findOne({ categoryId })
      .sort({ position: -1 })
      .select("position")
      .lean();

    const created = await ImageAlbum.create({
      categoryId,
      name: trimmed,
      slug,
      position: last ? last.position + 1 : 0,
      description: description?.trim() || "",
    });

    return {
      success: true,
      album: {
        _id: created._id.toString(),
        name: created.name,
        slug: created.slug,
        categoryId: created.categoryId.toString(),
        position: created.position,
        description: created.description || "",
        count: 0,
        img: "",
      } satisfies AlbumData,
    };
  } catch (error) {
    console.error("Error creating album:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create album",
    };
  }
}

export async function updateAlbumAction(
  id: string,
  name: string,
  description?: string,
) {
  try {
    const trimmed = name?.trim();
    if (!id || !trimmed)
      return { success: false, error: "Album ID and name are required" };

    await dbConnect();

    const album = await ImageAlbum.findById(id).select("categoryId").lean();
    if (!album) return { success: false, error: "Album not found" };

    const duplicate = await ImageAlbum.findOne({
      categoryId: album.categoryId,
      name: trimmed,
      _id: { $ne: id },
    })
      .collation({ locale: "en", strength: 2 })
      .select("_id")
      .lean();
    if (duplicate) {
      return {
        success: false,
        error: "An album with this name already exists",
      };
    }

    const updated = await ImageAlbum.findByIdAndUpdate(
      id,
      {
        name: trimmed,
        slug: await generateUniqueSlug(trimmed, id),
        ...(description !== undefined
          ? { description: description.trim() }
          : {}),
      },
      { new: true },
    ).lean();
    if (!updated) return { success: false, error: "Album not found" };

    const [count, cover] = await Promise.all([
      Image.countDocuments({ albumId: id }),
      Image.findOne({ albumId: id }).sort({ position: 1 }).select("url").lean(),
    ]);

    return {
      success: true,
      album: {
        _id: updated._id.toString(),
        name: updated.name,
        slug: updated.slug,
        categoryId: updated.categoryId.toString(),
        position: updated.position,
        description: updated.description || "",
        count,
        img: getPublicImageUrl(cover?.url),
      } satisfies AlbumData,
    };
  } catch (error) {
    console.error("Error updating album:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update album",
    };
  }
}

// Delete an album together with the images inside it
export async function deleteAlbumAction(id: string) {
  try {
    if (!id) return { success: false, error: "Album ID is required" };

    await dbConnect();
    await Promise.all([
      ImageAlbum.findByIdAndDelete(id),
      Image.deleteMany({ albumId: id }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error deleting album:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete album",
    };
  }
}

export async function reorderAlbumsAction(
  categoryId: string,
  orderedIds: string[],
) {
  try {
    if (!categoryId || !orderedIds?.length) return { success: true };

    await dbConnect();
    await ImageAlbum.bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id, categoryId },
          update: { $set: { position: index } },
        },
      })),
    );

    return { success: true };
  } catch (error) {
    console.error("Error reordering albums:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reorder albums",
    };
  }
}

// Public: every album outside the hero section, for the gallery folder grid
export async function getPublicAlbumsAction() {
  try {
    await dbConnect();

    const albums: PublicAlbumData[] = await ImageAlbum.aggregate([
      {
        $lookup: {
          from: "imagecategories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },
      {
        $match: {
          "category.slug": { $nin: ["hero-section", "hero", "herosection"] },
          "category.name": { $not: { $regex: /^hero/i } },
        },
      },
      { $sort: { position: 1, _id: 1 } },
      lookupAlbumImages,
      {
        $project: {
          _id: { $toString: "$_id" },
          name: 1,
          slug: 1,
          categoryId: { $toString: "$categoryId" },
          position: 1,
          description: { $ifNull: ["$description", ""] },
          count: { $size: "$images" },
          img: { $ifNull: [{ $arrayElemAt: ["$images.url", 0] }, ""] },
          categoryName: "$category.name",
          categorySlug: "$category.slug",
        },
      },
    ]);

    return {
      success: true,
      albums: albums.map((a) => ({ ...a, img: getPublicImageUrl(a.img) })),
    };
  } catch (error) {
    console.error("Error fetching public albums:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch albums",
      albums: [],
    };
  }
}

export interface AlbumImageItem {
  _id: string;
  title: string;
  url: string;
  description?: string;
}

export interface PublicAlbumDetail {
  _id: string;
  name: string;
  slug: string;
  description: string;
  categoryName: string;
  categorySlug: string;
  images: AlbumImageItem[];
}

// Public: a single album with all of its images, for the album route
export async function getPublicAlbumBySlugAction(slug: string) {
  try {
    if (!slug) return { success: false, error: "Album slug is required" };

    await dbConnect();

    const album = await ImageAlbum.findOne({ slug })
      .populate<{ categoryId: { name: string; slug: string } }>(
        "categoryId",
        "name slug",
      )
      .lean();
    if (!album) return { success: false, error: "Album not found" };

    const images = await Image.find({ albumId: album._id })
      .sort({ position: 1, _id: 1 })
      .select("title url description")
      .lean();

    return {
      success: true,
      album: {
        _id: album._id.toString(),
        name: album.name,
        slug: album.slug,
        description: album.description || "",
        categoryName: album.categoryId?.name || "",
        categorySlug: album.categoryId?.slug || "",
        images: images.map((img) => ({
          _id: img._id.toString(),
          title: img.title || "",
          url: getPublicImageUrl(img.url),
          description: img.description || "",
        })),
      } satisfies PublicAlbumDetail,
    };
  } catch (error) {
    console.error("Error fetching album:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch album",
    };
  }
}
