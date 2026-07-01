import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { getAdminDb } from "@/lib/firebase/admin";
import { getProduct, hasAccess, type Platform, type Tier } from "@/lib/products";

// Gated download endpoint.
//   GET /api/downloads/[id]?platform=android
// - Requires the user to be signed in.
// - Membership-tier gate: the user's tier must be >= the product's required tier
//   (Starter < Pro < Enterprise). Tier is set on the user doc when they buy a pack.
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

    // Membership-tier gate.
    if (product.tier !== "free") {
      const userDoc = await getAdminDb().collection("users").doc(uid).get();
      const data = userDoc.data() || {};
      const userTier = (data.tier as Tier) || "free";
      if (!hasAccess(userTier, product.tier)) {
        const upgradeUrl = new URL("/dashboard/billing", req.url);
        upgradeUrl.searchParams.set("upgrade", product.tier);
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
