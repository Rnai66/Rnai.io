import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { getAdminDb } from "@/lib/firebase/admin";

function serializeDate(value: unknown): string | null {
  if (!value) return null;
  if (typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  if (value instanceof Date) return value.toISOString();
  return null;
}

/**
 * GET /api/billing/ledger — the user's credit transaction history.
 * Auth: Firebase session cookie or Bearer ID token (same as /api/billing/me).
 */
export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limitParam = Number(req.nextUrl.searchParams.get("limit") || "25");
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 25;

    const snap = await getAdminDb()
      .collection("ledgerEntries")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const entries = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data.type || "unknown",          // free_grant | charge | refund | topup
        credits: Number(data.credits) || 0,     // negative = spent
        balanceAfter: Number(data.balanceAfter) || 0,
        ref: data.ref || null,
        createdAt: serializeDate(data.createdAt),
      };
    });

    // Lifetime usage (RNAI points) = total credits ever spent
    const lifetimeSpent = entries
      .filter((entry) => entry.credits < 0)
      .reduce((sum, entry) => sum + Math.abs(entry.credits), 0);

    return NextResponse.json({ entries, lifetimeSpent });
  } catch (err) {
    console.error("API /billing/ledger error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
