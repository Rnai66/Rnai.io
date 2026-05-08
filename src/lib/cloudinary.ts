/**
 * Cloudinary Image Upload Utility
 * Handles image uploads to Cloudinary for image generation outputs
 */

interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  folder: string;
  original_filename: string;
}

/**
 * Upload an image to Cloudinary using a base64 data URL or file path
 * @param imageData - Base64 encoded image data or file buffer
 * @param fileName - Optional file name for the image
 * @param folder - Optional folder path in Cloudinary (e.g., "rnai-io/generated")
 * @returns Promise with Cloudinary response containing URL and metadata
 */
export async function uploadToCloudinary(
  imageData: string | Buffer,
  fileName?: string,
  folder: string = "rnai-io/generated"
): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured in environment variables");
  }

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  // Handle different input types
  let fileData: string;
  if (typeof imageData === "string" && imageData.startsWith("data:image/")) {
    // Extract base64 from data URL
    fileData = imageData.split(",")[1];
  } else if (imageData instanceof Buffer) {
    // Convert Buffer to base64
    fileData = imageData.toString("base64");
  } else if (typeof imageData === "string") {
    // Assume it's already base64
    fileData = imageData;
  } else {
    throw new Error("Invalid image data format");
  }

  // Prepare form data for upload
  const params = new URLSearchParams();
  params.append("file", `data:image/png;base64,${fileData}`);
  params.append("folder", folder);
  params.append("tags", "rnai-io,generated-image");
  params.append("timestamp", Math.floor(Date.now() / 1000).toString());

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

  try {
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
      },
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(`Cloudinary upload failed: ${error.error?.message || response.statusText}`);
    }

    const data = (await response.json()) as CloudinaryUploadResponse;
    return data;
  } catch (error) {
    throw new Error(`Failed to upload image to Cloudinary: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get a Cloudinary image URL with optional transformations
 * @param publicId - The public ID returned from upload
 * @param options - Optional transformations (width, height, quality, etc.)
 * @returns Full Cloudinary image URL
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    throw new Error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not configured");
  }

  let url = `https://res.cloudinary.com/${cloudName}/image/upload/`;

  // Add transformations if provided
  if (options) {
    const transforms: string[] = [];

    if (options.width) transforms.push(`w_${options.width}`);
    if (options.height) transforms.push(`h_${options.height}`);
    if (options.quality) transforms.push(`q_${options.quality}`);
    if (options.crop) transforms.push(`c_${options.crop}`);
    if (options.format) transforms.push(`f_${options.format}`);

    if (transforms.length > 0) {
      url += transforms.join(",") + "/";
    }
  }

  url += publicId;

  return url;
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }

  const deleteUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`;

  const params = new URLSearchParams();
  params.append("public_id", publicId);
  params.append("timestamp", Math.floor(Date.now() / 1000).toString());

  try {
    const response = await fetch(deleteUrl, {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": authHeader,
      },
    });

    if (!response.ok) {
      const error = await response.json() as { error?: { message?: string } };
      throw new Error(`Cloudinary delete failed: ${error.error?.message || response.statusText}`);
    }
  } catch (error) {
    throw new Error(`Failed to delete image from Cloudinary: ${error instanceof Error ? error.message : String(error)}`);
  }
}
