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
        createdAt: new Date()
      });
      
      return true;
    });
  } catch (error) {
    console.error("Error charging credits:", error);
    return false;
  }
}
