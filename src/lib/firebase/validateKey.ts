import { createHash } from "crypto";
import { adminDb } from "./admin";

export async function validateApiKey(key: string): Promise<string | null> {
  if (!key?.startsWith("rnai_sk_")) return null;

  const keyHash = createHash("sha256").update(key).digest("hex");

  const snap = await adminDb
    .collection("apiKeys")
    .where("keyHash", "==", keyHash)
    .where("isActive", "==", true)
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];
  await doc.ref.update({ lastUsedAt: new Date() });
  return doc.id;
}
