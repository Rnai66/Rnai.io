import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { getAdminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
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
