import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { getAdminDb } from "@/lib/firebase/admin";
import { createHash, randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const snap = await getAdminDb()
      .collection("apiKeys")
      .where("userId", "==", uid)
      .where("isActive", "==", true)
      .orderBy("createdAt", "desc")
      .get();

    const keys = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ keys });
  } catch (error) {
    console.error("API /keys GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

    const rawKey = `rnai_sk_${randomBytes(24).toString("base64url")}`;
    const keyHash = createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.slice(0, 16) + "...";

    await getAdminDb().collection("apiKeys").add({
      userId: uid,
      name,
      keyHash,
      keyPrefix,
      isActive: true,
      createdAt: new Date(),
      lastUsedAt: null,
    });

    return NextResponse.json({ key: rawKey, keyPrefix }, { status: 201 });
  } catch (error) {
    console.error("API /keys POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
