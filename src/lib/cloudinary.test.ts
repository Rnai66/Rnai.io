/**
 * Cloudinary Integration Tests
 * Run tests with: bun test src/lib/cloudinary.test.ts
 */

import { describe, test, expect, beforeAll, afterAll } from "bun:test";
import { uploadToCloudinary, getCloudinaryUrl, deleteFromCloudinary } from "./cloudinary";

// Simple 1x1 red PNG for testing (base64)
const TEST_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

describe("Cloudinary Integration", () => {
  let uploadedPublicId: string | null = null;

  beforeAll(() => {
    // Verify environment variables are set
    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.warn("⚠️  Cloudinary credentials not configured. Tests will be skipped.");
    }
  });

  test("uploadToCloudinary - upload with base64 buffer", async () => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.log("⏭️  Skipping: Cloudinary not configured");
      return;
    }

    const buffer = Buffer.from(TEST_PNG_BASE64, "base64");
    const response = await uploadToCloudinary(buffer, "test-image.png", "rnai-io/test");

    expect(response).toBeDefined();
    expect(response.secure_url).toBeDefined();
    expect(response.public_id).toBeDefined();
    expect(response.width).toBeGreaterThan(0);
    expect(response.height).toBeGreaterThan(0);

    uploadedPublicId = response.public_id;
  });

  test("uploadToCloudinary - upload with data URL", async () => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.log("⏭️  Skipping: Cloudinary not configured");
      return;
    }

    const dataUrl = `data:image/png;base64,${TEST_PNG_BASE64}`;
    const response = await uploadToCloudinary(dataUrl, "test-image-2.png", "rnai-io/test");

    expect(response.secure_url).toBeDefined();
    expect(response.public_id).toBeDefined();

    // Store for cleanup
    uploadedPublicId = response.public_id;
  });

  test("getCloudinaryUrl - generate transformation URL", async () => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
      console.log("⏭️  Skipping: Cloudinary not configured");
      return;
    }

    const publicId = "rnai-io/test/sample";
    const url = getCloudinaryUrl(publicId, {
      width: 200,
      height: 200,
      quality: "auto",
    });

    expect(url).toBeDefined();
    expect(url).toContain("cloudinary.com");
    expect(url).toContain("w_200");
    expect(url).toContain("h_200");
    expect(url).toContain("q_auto");
  });

  test("getCloudinaryUrl - without transformations", async () => {
    const publicId = "rnai-io/generations/sample";
    const url = getCloudinaryUrl(publicId);

    expect(url).toBeDefined();
    expect(url).toContain("cloudinary.com");
    expect(url).toContain(publicId);
  });

  test("deleteFromCloudinary - delete uploaded image", async () => {
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !uploadedPublicId) {
      console.log("⏭️  Skipping: Cloudinary not configured or no image uploaded");
      return;
    }

    // This should not throw
    await expect(deleteFromCloudinary(uploadedPublicId)).resolves.toBeUndefined();
  });

  afterAll(() => {
    console.log("✅ Cloudinary integration tests completed");
  });
});

/**
 * Manual Integration Test
 * Run this to test the full flow:
 *
 * import { uploadToStorage } from "@/lib/storage";
 *
 * // In a test API route:
 * const buffer = Buffer.from("..."); // Your image buffer
 * const url = await uploadToStorage(buffer, "test-ref-123", "png");
 * console.log("Generated URL:", url); // Should be Cloudinary URL
 *
 * Expected output:
 * Generated URL: https://res.cloudinary.com/duxwa4io4/image/upload/...
 */
