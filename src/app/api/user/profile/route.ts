import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { getAdminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const doc = await getAdminDb().collection("users").doc(uid).get();
    const data = doc.data();

    return NextResponse.json({
      phone: data?.phone || "",
      address: data?.address || "",
      city: data?.city || "",
      country: data?.country || "",
      postalCode: data?.postalCode || "",
    });
  } catch (error) {
    console.error("API /user/profile GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { phone, address, city, country, postalCode } = body;

    await getAdminDb().collection("users").doc(uid).set(
      {
        phone: phone || null,
        address: address || null,
        city: city || null,
        country: country || null,
        postalCode: postalCode || null,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API /user/profile POST error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
