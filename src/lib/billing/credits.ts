import { getAdminDb } from "@/lib/firebase/admin";

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
