import { getUploadUrl } from "@/backend/actions/upload.action";

export async function uploadSingleImage(file: File) {
    const result = await getUploadUrl(
        file.name,
        file.type
    );

    if (!result.success) {
        throw new Error(result.error);
    }

    const uploadResponse = await fetch(result.uploadUrl!, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
    });
    console.log("Upload status:", uploadResponse.status);

    console.log("Upload response:", await uploadResponse.text());

    if (!uploadResponse.ok) {
        throw new Error("Failed to upload image");
    }

    return result.key;
}