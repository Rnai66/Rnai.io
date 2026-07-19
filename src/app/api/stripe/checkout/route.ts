import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { tierForPack } from "@/lib/products";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const PACKS: Record<string, { price: number, credits: number }> = {
  "pack_5": { price: 500, credits: 600 },
  "pack_20": { price: 2000, credits: 2500 },
  "pack_100": { price: 10000, credits: 13500 },
};

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { packId } = await req.json();
    const pack = PACKS[packId];
    if (!pack) {
      return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Rnai - ${pack.credits.toLocaleString()} Credits`,
              description: "Pay-as-you-go AI credits",
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}/dashboard/billing?topup=success`,
      cancel_url: `${appUrl}/dashboard/billing?topup=cancelled`,
      metadata: {
        uid,
        credits: pack.credits.toString(),
        tier: tierForPack(packId),
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
