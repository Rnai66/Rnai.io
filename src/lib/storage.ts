import { getAdminStorage } from "@/lib/firebase/admin";
import { uploadToCloudinary } from "@/lib/cloudinary";

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  mp3: "audio/mpeg",
  wav: "audio/wav",
};

export type StorageExtension = keyof typeof CONTENT_TYPES;

function getBucketCandidates() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const names = [
    process.env.FIREBASE_STORAGE_BUCKET,
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    projectId ? `${projectId}.appspot.com` : undefined,
    projectId ? `${projectId}.firebasestorage.app` : undefined,
  ];

  return [...new Set(names.filter(Boolean).map((name) => name!.trim().replace(/^gs:\/\//, "")))];
}

function isMissingBucketError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const status = (error as { status?: number })?.status || (error as { response?: { status?: number } })?.response?.status;
  return status === 404 || message.includes("bucket does not exist") || message.includes("notFound");
}

function shouldReturnDataUrlFallback() {
  return process.env.NODE_ENV !== "production" || process.env.STORAGE_FALLBACK_DATA_URL === "true";
}

function toDataUrl(buffer: Buffer, extension: StorageExtension) {
  return `data:${CONTENT_TYPES[extension]};base64,${buffer.toString("base64")}`;
}

/**
 * Upload to Cloudinary (primary method)
 * Uses Cloudinary API for reliable cloud storage
 */
async function uploadToCloudinaryStorage(buffer: Buffer, refId: string, extension: StorageExtension = "png"): Promise<string> {
  try {
    const response = await uploadToCloudinary(
      buffer,
      `${refId}.${extension}`,
      "rnai-io/generations"
    );
    return response.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw error;
  }
}

/**
 * Upload to Firebase Storage (fallback method)
 * Kept for backward compatibility
 */
async function uploadToFirebaseStorage(buffer: Buffer, refId: string, extension: StorageExtension = "png"): Promise<string> {
  const filename = `generations/${refId}.${extension}`;
  const candidates = getBucketCandidates();
  let lastError: unknown;

  for (const bucketName of candidates) {
    const bucket = getAdminStorage().bucket(bucketName);
    const file = bucket.file(filename);

    try {
      await file.save(buffer, {
        metadata: {
          contentType: CONTENT_TYPES[extension],
        },
      });

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      return url;
    } catch (error) {
      lastError = error;
      if (!isMissingBucketError(error)) throw error;
      console.warn(`Firebase Storage bucket not found: ${bucketName}`);
    }
  }

  throw new Error(
    `Firebase Storage bucket does not exist. Set FIREBASE_STORAGE_BUCKET in .env.local to the exact bucket name from Firebase Console. Tried: ${candidates.join(", ")}. ${lastError instanceof Error ? lastError.message : ""}`
  );
}

/**
 * Upload file to storage using Cloudinary (primary) with Firebase fallback
 * @param buffer - The image buffer to upload
 * @param refId - Reference ID for the file
 * @param extension - File extension (png, jpg, etc.)
 * @returns URL of the uploaded file
 */
export async function uploadToStorage(buffer: Buffer, refId: string, extension: StorageExtension = "png"): Promise<string> {
  // Try Cloudinary first if configured
  if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      return await uploadToCloudinaryStorage(buffer, refId, extension);
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      // Fall back to data URL if in development, otherwise propagate Cloudinary error
      if (shouldReturnDataUrlFallback()) {
        console.warn("Returning data URL fallback for local development.");
        return toDataUrl(buffer, extension);
      }
      throw error;
    }
  }

  // Try Firebase Storage as fallback only if Cloudinary is not configured
  try {
    return await uploadToFirebaseStorage(buffer, refId, extension);
  } catch (error) {
    console.warn("Firebase Storage upload failed:", error);
    // Fall back to data URL if in development
    if (shouldReturnDataUrlFallback()) {
      console.warn("Returning data URL fallback for local development.");
      return toDataUrl(buffer, extension);
    }
    throw error;
  }
}
