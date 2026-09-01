"use server";

import dbConnect from "@/backend/config/dbConnect";
import { ImageCategory } from "@/backend/models/imageCategory.model";
import { Image } from "@/backend/models/images.model";
import { getPublicImageUrl } from "@/backend/lib/publicImageUrl";
import slugify from "slugify";

export interface CategoryData {
  _id: string;
  name: string;
  slug: string;
  position: number;
  count: number;
  img: string;
  alt: string;
  createdAt?: string;
}

// Helper to generate a unique slug
async function generateUniqueSlug(name: string, excludeId?: string) {
  let slug = slugify(name, { lower: true, strict: true }) || `category-${Date.now().toString().slice(-6)}`;
  const existing = await ImageCategory.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
    .select("_id")
    .lean();
  return existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
}

// Get all categories with image count and first image
export async function getCategoriesAction() {
  try {
    await dbConnect();

    const categories: CategoryData[] = await ImageCategory.aggregate([
      { $sort: { position: 1 } },
      {
        $lookup: {
          from: "images",
          localField: "_id",
          foreignField: "categoryId",
          as: "images",
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          name: 1,
          slug: 1,
          position: 1,
          count: { $size: "$images" },
          img: { $ifNull: [{ $arrayElemAt: ["$images.url", 0] }, ""] },
          alt: { $concat: ["$name", " photo collection"] },
          createdAt: {
            $dateToString: {
              date: "$createdAt",
              format: "%Y-%m-%dT%H:%M:%S.%LZ",
              onNull: null,
            },
          },
        },
      },
    ]);

    return {
      success: true,
      categories: categories.map((cat) => ({
        ...cat,
        img: getPublicImageUrl(cat.img),
      })),
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

// Create new category
export async function createCategoryAction(name: string){
  try {
    const trimmed = name?.trim();
    if (!trimmed) return { success: false, error: "Category name is required" };

    await dbConnect();

    const duplicate = await ImageCategory.findOne({ name: trimmed })
      .collation({ locale: "en", strength: 2 })
      .select("_id")
      .lean();
    if (duplicate) return { success: false, error: "A category with this name already exists" };

    const slug = await generateUniqueSlug(trimmed);
    const last = await ImageCategory.findOne().sort({ position: -1 }).select("position").lean();
    const position = last ? last.position + 1 : 0;

    const newCategory = await ImageCategory.create({ name: trimmed, slug, position });

    return {
      success: true,
      category: {
        _id: newCategory._id.toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        position: newCategory.position,
        count: 0,
        img: "",
        alt: `${newCategory.name} photo collection`,
        createdAt: newCategory.createdAt?.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error creating category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create category",
    };
  }
}

// Update category name
export async function updateCategoryAction(id: string, name: string) {
  try {
    const trimmed = name?.trim();
    if (!id || !trimmed) return { success: false, error: "Category ID and name are required" };

    await dbConnect();

    const duplicate = await ImageCategory.findOne({ name: trimmed, _id: { $ne: id } })
      .collation({ locale: "en", strength: 2 })
      .select("_id")
      .lean();
    if (duplicate) return { success: false, error: "A category with this name already exists" };

    const slug = await generateUniqueSlug(trimmed, id);
    const updated = await ImageCategory.findByIdAndUpdate(
      id,
      { name: trimmed, slug },
      { new: true }
    ).lean();

    if (!updated) return { success: false, error: "Category not found" };

    const [count, firstImage] = await Promise.all([
      Image.countDocuments({ categoryId: id }),
      Image.findOne({ categoryId: id }).sort({ position: 1 }).select("url").lean(),
    ]);

    return {
      success: true,
      category: {
        _id: updated._id.toString(),
        name: updated.name,
        slug: updated.slug,
        position: updated.position,
        count,
        img: getPublicImageUrl(firstImage?.url),
        alt: `${updated.name} photo collection`,
        createdAt: updated.createdAt?.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update category",
    };
  }
}

// Delete category and all its images
export async function deleteCategoryAction(id: string) {
  try {
    if (!id) return { success: false, error: "Category ID is required" };

    await dbConnect();
    await Promise.all([
      ImageCategory.findByIdAndDelete(id),
      Image.deleteMany({ categoryId: id }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}

// Reorder categories
export async function reorderCategoriesAction(orderedIds: string[]) {
  try {
    if (!orderedIds?.length) return { success: true };

    await dbConnect();
    await ImageCategory.bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { position: index } },
        },
      }))
    );

    return { success: true };
  } catch (error) {
    console.error("Error reordering categories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reorder categories",
    };
  }
}

