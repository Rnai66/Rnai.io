import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { getAdminDb } from "@/lib/firebase/admin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const ref = getAdminDb().collection("apiKeys").doc(id);
    const doc = await ref.get();

    if (!doc.exists || doc.data()?.userId !== uid) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await ref.update({ isActive: false });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /keys/[id] DELETE error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
