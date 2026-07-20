import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { getAdminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    // Allow API-key auth (rnai_sk_...) in addition to the existing
    // session-cookie / Firebase ID-token auth — same key type already
    // used by /api/v1/* skill endpoints. Lets tools like Rnai-CLI check
    // credit balance without a browser session.
    let uid: string | null = null;
    if (authHeader?.startsWith("Bearer rnai_sk_")) {
      const keyData = await validateApiKey(authHeader.slice(7));
      uid = keyData?.userId || null;
    } else {
      const sessionCookie = req.cookies.get("__session")?.value;
      uid = await verifyToken(authHeader, sessionCookie);
    }

    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userDoc = await getAdminDb().collection("users").doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ freeCreditsRemaining: 0, paidCreditsBalance: 0 });
    }

    const data = userDoc.data()!;
    return NextResponse.json({
      freeCreditsRemaining: data.freeCreditsRemaining || 0,
      paidCreditsBalance: data.paidCreditsBalance || 0,
      autoRechargeEnabled: data.autoRechargeEnabled || false,
      tier: data.tier || "free",
    });
  } catch (err) {
    console.error("API /billing/me error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
