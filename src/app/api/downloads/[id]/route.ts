import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { getAdminDb } from "@/lib/firebase/admin";
import { getProduct, type Platform } from "@/lib/products";

// Gated download endpoint.
//   GET /api/downloads/[id]?platform=android
// - Requires the user to be signed in (tier "free" = any member).
// - For "pro"/"enterprise" products, also checks the user has paid credits.
// - Redirects (302) to the real installer URL configured in src/lib/products.ts.

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = getProduct(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Must be signed in.
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("next", `/products`);
      return NextResponse.redirect(loginUrl);
    }

    // Tier gate (default "free" = any signed-in member; tighten per-product later).
    if (product.tier !== "free") {
      const userDoc = await getAdminDb().collection("users").doc(uid).get();
      const data = userDoc.data() || {};
      const entitled =
        (data.paidCreditsBalance || 0) > 0 ||
        data.plan === product.tier ||
        data.plan === "enterprise";
      if (!entitled) {
        const upgradeUrl = new URL("/pricing", req.url);
        upgradeUrl.searchParams.set("product", id);
        return NextResponse.redirect(upgradeUrl);
      }
    }

    // Pick platform.
    const requested = req.nextUrl.searchParams.get("platform") as Platform | null;
    const platform =
      requested && product.downloads[requested]
        ? requested
        : (Object.keys(product.downloads)[0] as Platform | undefined);

    const url = platform ? product.downloads[platform] : undefined;
    if (!url) {
      return NextResponse.json(
        { error: "No download available yet for this product/platform" },
        { status: 404 }
      );
    }

    return NextResponse.redirect(url, 302);
  } catch (error) {
    console.error("API /downloads/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
