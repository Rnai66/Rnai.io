import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { getAdminDb } from "@/lib/firebase/admin";

function serializeDate(value: any): string | null {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate().toISOString();
  if (value instanceof Date) return value.toISOString();
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limitParam = Number(req.nextUrl.searchParams.get("limit") || "20");
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 20;

    const snap = await getAdminDb()
      .collection("usageLogs")
      .where("uid", "==", uid)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    const usage = snap.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        apiKeyId: data.apiKeyId || null,
        skill: data.skill || "unknown",
        provider: data.provider || null,
        model: data.model || null,
        status: data.status || "unknown",
        latencyMs: data.latencyMs || null,
        outputUrl: data.outputUrl || null,
        createdAt: serializeDate(data.createdAt),
      };
    });

    return NextResponse.json({ usage });
  } catch (error) {
    console.error("API /usage GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
