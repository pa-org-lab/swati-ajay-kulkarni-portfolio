"use client"

import { uploadSingleImage } from "@/frontend/utils/lib/uploadSingleImage";

export default function UploadImage() {

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const file = e.target.files?.[0];
            if (file) {
                const result = await uploadSingleImage(file);
                console.log("Image uploaded successfully", result);
            }
        } catch (error) {
            console.log("Image upload failed", error);
        }
    }

    return (
        <div>
            <h1 className="cursor-pointer bg-red-50 ">Upload Image</h1>
            <input type="file" onChange={handleUpload} />
        </div>
    )
}