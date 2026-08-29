import { uploadSingleImage } from "./uploadSingleImage";

export async function uploadMultipleImages(files: File[]) {
    if (!files.length) {
        return [];
    }

    const uploadResults = await Promise.all(
        files.map((file) => uploadSingleImage(file))
    );

    return uploadResults;
}