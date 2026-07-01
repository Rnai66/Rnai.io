import { getAdminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

/**
 * Add paid credits to a user, idempotently keyed on `ref` (e.g. a voucher id
 * or Stripe session id). If a "topup" ledger entry with the same ref already
 * exists, the call is a no-op and returns { added: false, alreadyProcessed: true }.
 * Used by top-up flows (Stripe, TrueMoney voucher redeem).
 */
export async function addPaidCredits(
  uid: string,
  credits: number,
  ref: string,
  meta: Record<string, unknown> = {}
): Promise<{ added: boolean; alreadyProcessed: boolean; balanceAfter: number }> {
  const db = getAdminDb();
  const userRef = db.collection("users").doc(uid);
  const dupQuery = db
    .collection("ledgerEntries")
    .where("uid", "==", uid)
    .where("ref", "==", ref)
    .where("type", "==", "topup")
    .limit(1);

  return await db.runTransaction(async (transaction) => {
    const [userDoc, dupSnap] = await Promise.all([
      transaction.get(userRef),
      transaction.get(dupQuery),
    ]);
    if (!userDoc.exists) throw new Error("User not found");

    const data = userDoc.data()!;
    const free = data.freeCreditsRemaining || 0;
    const paid = data.paidCreditsBalance || 0;

    if (!dupSnap.empty) {
      return { added: false, alreadyProcessed: true, balanceAfter: free + paid };
    }

    const newPaid = paid + credits;
    transaction.update(userRef, { paidCreditsBalance: FieldValue.increment(credits) });

    const ledgerRef = db.collection("ledgerEntries").doc();
    transaction.set(ledgerRef, {
      uid,
      type: "topup",
      credits,
      balanceAfter: free + newPaid,
      ref,
      createdAt: new Date(),
      ...meta,
    });

    return { added: true, alreadyProcessed: false, balanceAfter: free + newPaid };
  });
}

export async function chargeCredits(uid: string, cost: number, refId: string): Promise<boolean> {
  const db = getAdminDb();
  const userRef = db.collection("users").doc(uid);
  const ledgerRef = db.collection("ledgerEntries").doc();

  try {
    return await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      
      if (!userDoc.exists) {
        throw new Error("User not found");
      }
      
      const data = userDoc.data()!;
      let freeCredits = data.freeCreditsRemaining || 0;
      let paidCredits = data.paidCreditsBalance || 0;
      
      if (freeCredits + paidCredits < cost) {
        return false; // Insufficient funds
      }
      
      if (freeCredits >= cost) {
        freeCredits -= cost;
      } else {
        const remainingCost = cost - freeCredits;
        freeCredits = 0;
        paidCredits -= remainingCost;
      }
      
      transaction.update(userRef, {
        freeCreditsRemaining: freeCredits,
        paidCreditsBalance: paidCredits
      });
      
      transaction.set(ledgerRef, {
        uid,
        type: "charge",
        credits: -cost,
        balanceAfter: freeCredits + paidCredits,
        ref: refId,
        refunded: false,
        createdAt: new Date()
      });
      
      return true;
    });
  } catch (error) {
    console.error("Error charging credits:", error);
    return false;
  }
}

export async function refundCredits(uid: string, cost: number, refId: string, reason: string): Promise<void> {
  const db = getAdminDb();
  const userRef = db.collection("users").doc(uid);
  const chargeQuery = db.collection("ledgerEntries")
    .where("uid", "==", uid)
    .where("ref", "==", refId)
    .where("type", "==", "charge")
    .limit(1);
  const refundRef = db.collection("ledgerEntries").doc();

  await db.runTransaction(async (transaction) => {
    const userDoc = await transaction.get(userRef);
    const chargeSnap = await transaction.get(chargeQuery);

    if (!userDoc.exists || chargeSnap.empty) return;

    const chargeDoc = chargeSnap.docs[0];
    if (chargeDoc.data().refunded) return;

    const data = userDoc.data()!;
    const paidCredits = data.paidCreditsBalance || 0;
    const freeCredits = data.freeCreditsRemaining || 0;
    const newPaidBalance = paidCredits + cost;

    transaction.update(userRef, {
      paidCreditsBalance: newPaidBalance,
    });

    transaction.update(chargeDoc.ref, {
      refunded: true,
      refundedAt: new Date(),
      refundReason: reason,
    });

    transaction.set(refundRef, {
      uid,
      type: "refund",
      credits: cost,
      balanceAfter: freeCredits + newPaidBalance,
      ref: refId,
      reason,
      createdAt: new Date(),
    });
  });
}

export async function runWithCreditRefund<T>(
  uid: string,
  cost: number,
  refId: string,
  action: () => Promise<T>
): Promise<T> {
  try {
    return await action();
  } catch (error) {
    await refundCredits(
      uid,
      cost,
      refId,
      error instanceof Error ? error.message : "Provider execution failed"
    );
    throw error;
  }
}
