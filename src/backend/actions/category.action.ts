"use server";

import dbConnect from "@/backend/config/dbConnect";
import { ImageCategory } from "@/backend/models/imageCategory.model";
import { Image } from "@/backend/models/images.model";
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

export async function getCategoriesAction(): Promise<{
  success: boolean;
  categories?: CategoryData[];
  error?: string;
}> {
  try {
    await dbConnect();

    const categoriesWithStats: CategoryData[] = await ImageCategory.aggregate([
      // Uses { position: 1 } index
      { $sort: { position: 1 } },
      {
        $lookup: {
          from: Image.collection.name,
          let: { catId: "$_id" },
          pipeline: [
            // Uses compound index { categoryId: 1, position: 1 }
            { $match: { $expr: { $eq: ["$categoryId", "$$catId"] } } },
            { $sort: { position: 1 } },
            { $project: { url: 1, title: 1 } },
          ],
          as: "categoryImages",
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          name: 1,
          slug: 1,
          position: 1,
          count: { $size: "$categoryImages" },
          img: {
            $ifNull: [
              { $arrayElemAt: ["$categoryImages.url", 0] },
              "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=440&fit=crop&auto=format",
            ],
          },
          alt: {
            $ifNull: [
              { $arrayElemAt: ["$categoryImages.title", 0] },
              { $concat: ["$name", " photo collection"] },
            ],
          },
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
      categories: categoriesWithStats,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch categories",
    };
  }
}

export async function createCategoryAction(name: string): Promise<{
  success: boolean;
  category?: CategoryData;
  error?: string;
}> {
  try {
    if (!name || !name.trim()) {
      return { success: false, error: "Category name is required" };
    }

    await dbConnect();

    const trimmedName = name.trim();

    // Uses collation index { name: 1 } for fast case-insensitive uniqueness check
    const existingName = await ImageCategory.findOne({ name: trimmedName })
      .collation({ locale: "en", strength: 2 })
      .select("_id")
      .lean();

    if (existingName) {
      return {
        success: false,
        error: "A category with this name already exists",
      };
    }

    let baseSlug = slugify(trimmedName, { lower: true, strict: true });
    if (!baseSlug) {
      baseSlug = `category-${Date.now().toString().slice(-6)}`;
    }

    let finalSlug = baseSlug;
    // Uses unique index on slug
    const existingSlug = await ImageCategory.findOne({ slug: finalSlug })
      .select("_id")
      .lean();

    if (existingSlug) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    // Uses { position: 1 } index in reverse
    const lastCategory = await ImageCategory.findOne()
      .sort({ position: -1 })
      .select("position")
      .lean();
    const position = lastCategory ? lastCategory.position + 1 : 0;

    const newCategory = await ImageCategory.create({
      name: trimmedName,
      slug: finalSlug,
      position,
    });

    return {
      success: true,
      category: {
        _id: newCategory._id.toString(),
        name: newCategory.name,
        slug: newCategory.slug,
        position: newCategory.position,
        count: 0,
        img: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=440&fit=crop&auto=format",
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

export async function updateCategoryAction(
  id: string,
  name: string
): Promise<{
  success: boolean;
  category?: CategoryData;
  error?: string;
}> {
  try {
    if (!id || !name || !name.trim()) {
      return { success: false, error: "Category ID and valid name are required" };
    }

    await dbConnect();

    const trimmedName = name.trim();

    // Uses collation index { name: 1 } for case-insensitive uniqueness check
    const existingName = await ImageCategory.findOne({
      name: trimmedName,
      _id: { $ne: id },
    })
      .collation({ locale: "en", strength: 2 })
      .select("_id")
      .lean();

    if (existingName) {
      return {
        success: false,
        error: "A category with this name already exists",
      };
    }

    let baseSlug = slugify(trimmedName, { lower: true, strict: true });
    if (!baseSlug) {
      baseSlug = `category-${Date.now().toString().slice(-6)}`;
    }

    let finalSlug = baseSlug;
    // Uses unique index on slug
    const existingSlug = await ImageCategory.findOne({
      slug: finalSlug,
      _id: { $ne: id },
    })
      .select("_id")
      .lean();

    if (existingSlug) {
      finalSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;
    }

    const updated = await ImageCategory.findByIdAndUpdate(
      id,
      { name: trimmedName, slug: finalSlug },
      { new: true }
    );

    if (!updated) {
      return { success: false, error: "Category not found" };
    }

    const [categoryWithStats] = await ImageCategory.aggregate([
      { $match: { _id: updated._id } },
      {
        $lookup: {
          from: Image.collection.name,
          let: { catId: "$_id" },
          pipeline: [
            // Uses compound index { categoryId: 1, position: 1 }
            { $match: { $expr: { $eq: ["$categoryId", "$$catId"] } } },
            { $sort: { position: 1 } },
            { $project: { url: 1, title: 1 } },
          ],
          as: "categoryImages",
        },
      },
      {
        $project: {
          _id: { $toString: "$_id" },
          name: 1,
          slug: 1,
          position: 1,
          count: { $size: "$categoryImages" },
          img: {
            $ifNull: [
              { $arrayElemAt: ["$categoryImages.url", 0] },
              "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=440&fit=crop&auto=format",
            ],
          },
          alt: {
            $ifNull: [
              { $arrayElemAt: ["$categoryImages.title", 0] },
              { $concat: ["$name", " photo collection"] },
            ],
          },
        },
      },
    ]);

    return {
      success: true,
      category: categoryWithStats || {
        _id: updated._id.toString(),
        name: updated.name,
        slug: updated.slug,
        position: updated.position,
        count: 0,
        img: "https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=440&fit=crop&auto=format",
        alt: `${updated.name} photo collection`,
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

export async function deleteCategoryAction(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!id) {
      return { success: false, error: "Category ID is required" };
    }

    await dbConnect();

    await ImageCategory.findByIdAndDelete(id);
    // Uses { categoryId: 1 } index prefix on images collection
    await Image.deleteMany({ categoryId: id });

    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete category",
    };
  }
}

export async function reorderCategoriesAction(
  orderedIds: string[]
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!orderedIds || !orderedIds.length) {
      return { success: true };
    }

    await dbConnect();

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { position: index } },
      },
    }));

    await ImageCategory.bulkWrite(bulkOps);

    return { success: true };
  } catch (error) {
    console.error("Error reordering categories:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reorder categories",
    };
  }
}
