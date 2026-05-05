import { getAdminStorage } from "@/lib/firebase/admin";

export async function uploadToStorage(buffer: Buffer, refId: string, extension: string = "png"): Promise<string> {
  const bucket = getAdminStorage().bucket();
  const filename = `generations/${refId}.${extension}`;
  const file = bucket.file(filename);

  await file.save(buffer, {
    metadata: {
      contentType: `image/${extension}`,
    },
  });

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
  });

  return url;
}
