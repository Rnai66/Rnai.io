import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { adminDb } from "@/lib/firebase/admin";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const uid = await verifyToken(req.headers.get("authorization"));
  if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const ref = adminDb.collection("apiKeys").doc(id);
  const doc = await ref.get();

  if (!doc.exists || doc.data()?.userId !== uid) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await ref.update({ isActive: false });
  return NextResponse.json({ success: true });
}
