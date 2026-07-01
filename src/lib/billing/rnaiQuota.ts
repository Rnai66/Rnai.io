import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

// Free monthly RnaiLLM allowance for paying members (tokens = prompt + completion).
export const RNAI_MONTHLY_TOKENS = Number(process.env.RNAI_FREE_MONTHLY_TOKENS || "250000");

/** Current billing month key, e.g. "2026-07" (UTC). */
export function currentMonth(d: Date = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function toDate(v: unknown): Date | null {
  if (!v) return null;
  if (v instanceof Date) return v;
  if (typeof v === "object") {
    const secs = (v as any)._seconds ?? (v as any).seconds;
    if (secs != null) return new Date(secs * 1000);
    if (typeof (v as any).toDate === "function") return (v as any).toDate();
  }
  const d = new Date(v as string | number);
  return isNaN(d.getTime()) ? null : d;
}

/** A member is eligible for the free RnaiLLM quota if they topped up this month. */
export function isPaidThisMonth(userData: Record<string, unknown> | undefined): boolean {
  const last = toDate(userData?.lastTopupAt);
  if (!last) return false;
  return currentMonth(last) === currentMonth();
}

/** How many free RnaiLLM tokens the user has used this month (resets monthly). */
export function usedThisMonth(userData: Record<string, unknown> | undefined): number {
  if (!userData) return 0;
  if (userData.rnaiTokensMonth !== currentMonth()) return 0;
  return (userData.rnaiTokensUsed as number) || 0;
}

/** Record RnaiLLM token usage, resetting the counter when a new month starts. */
export async function addRnaiTokens(uid: string, tokens: number): Promise<void> {
  if (!(tokens > 0)) return;
  const db = getAdminDb();
  const userRef = db.collection("users").doc(uid);
  const month = currentMonth();
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    const data = snap.data() || {};
    if (data.rnaiTokensMonth === month) {
      tx.update(userRef, { rnaiTokensUsed: FieldValue.increment(tokens) });
    } else {
      tx.update(userRef, { rnaiTokensMonth: month, rnaiTokensUsed: tokens });
    }
  });
}
