import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) throw new Error("Missing stripe signature or secret");
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook Error:", err.message);
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const uid = session.metadata?.uid;
    const creditsStr = session.metadata?.credits;
    
    if (uid && creditsStr) {
      const credits = parseInt(creditsStr, 10);
      const db = getAdminDb();
      const userRef = db.collection("users").doc(uid);
      
      try {
        await db.runTransaction(async (transaction) => {
          const userDoc = await transaction.get(userRef);
          if (!userDoc.exists) return;

          const currentPaid = userDoc.data()!.paidCreditsBalance || 0;
          const newBalance = currentPaid + credits;

          transaction.update(userRef, {
            paidCreditsBalance: FieldValue.increment(credits),
            lastTopupAt: new Date()
          });

          const ledgerRef = db.collection("ledgerEntries").doc();
          transaction.set(ledgerRef, {
            uid,
            type: "topup",
            credits: credits,
            balanceAfter: (userDoc.data()!.freeCreditsRemaining || 0) + newBalance,
            ref: session.id,
            createdAt: new Date()
          });
        });
      } catch (error) {
        console.error("Error processing checkout.session.completed:", error);
        return NextResponse.json({ error: "Failed to process transaction" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
