"use server";

import { s3 } from "@/backend/config/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function getUploadUrl(filename: string, type: string) {
    if (!filename || !type) {
        return {
            success: false,
            error: "Missing filename or type",
        };
    }

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (!allowedTypes.includes(type)) {
        return {
            success: false,
            error: "Invalid file type",
        };
    }

    const safeFilename = filename.replace(
        /[^a-zA-Z0-9.-]/g,
        "-"
    );

    const uniqueKey = `${uuidv4().slice(0, 8)}-${safeFilename}`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: uniqueKey,
        ContentType: type,
    });

    const uploadUrl = await getSignedUrl(
        s3,
        command,
        {
            expiresIn: 300,
        }
    );

    const publicUrl =
        `${process.env.R2_PUBLIC_BASE_URL}/${uniqueKey}`;

    return {
        success: true,
        uploadUrl,
        publicUrl,
        key: uniqueKey,
    };
}