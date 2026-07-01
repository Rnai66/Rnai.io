import { getAdminDb } from "@/lib/firebase/admin";
import {
  periodRange, MIN_POINTS, MIN_ACCOUNT_AGE_DAYS,
  POOL_REVENUE_RATIO, MONTHLY_POOL_CAP,
} from "./config";

export interface LeaderboardRow {
  uid: string;
  points: number;       // charges minus refunds in the period (≥0)
  firstReachedAt: Date; // tie-break: earlier wins
  eligible: boolean;
  email?: string | null;
}

export interface LeaderboardResult {
  period: string;
  rows: LeaderboardRow[];      // sorted, eligible first by points desc
  creditsSold: number;         // topups in the period
  pool: number;                // min(cap, ratio × sold)
}

function toDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  return new Date(0);
}

/**
 * Compute the monthly leaderboard from ledgerEntries.
 * Points = |charges| − refunds within the period (refunded jobs don't count).
 */
export async function computeLeaderboard(period: string): Promise<LeaderboardResult> {
  const db = getAdminDb();
  const { start, end } = periodRange(period);

  const snap = await db
    .collection("ledgerEntries")
    .where("createdAt", ">=", start)
    .where("createdAt", "<", end)
    .get();

  const byUser = new Map<string, { spent: number; refunded: number; last: Date }>();
  let creditsSold = 0;

  for (const doc of snap.docs) {
    const data = doc.data();
    const uid = data.uid as string | undefined;
    const credits = Number(data.credits) || 0;
    const type = data.type as string;
    const at = toDate(data.createdAt);
    if (!uid) continue;

    if (type === "topup") creditsSold += Math.max(0, credits);

    const row = byUser.get(uid) ?? { spent: 0, refunded: 0, last: new Date(0) };
    if (type === "charge") {
      row.spent += Math.abs(credits);
      if (at > row.last) row.last = at;
    } else if (type === "refund") {
      row.refunded += Math.max(0, credits);
    }
    byUser.set(uid, row);
  }

  // Eligibility — account age (batch-read user docs)
  const uids = [...byUser.keys()];
  const userDocs = await Promise.all(uids.map((uid) => db.collection("users").doc(uid).get()));
  const ageCutoff = new Date(end.getTime() - MIN_ACCOUNT_AGE_DAYS * 86400_000);

  const rows: LeaderboardRow[] = uids.map((uid, i) => {
    const agg = byUser.get(uid)!;
    const points = Math.max(0, agg.spent - agg.refunded);
    const userData = userDocs[i].exists ? userDocs[i].data()! : null;
    const createdAt = userData ? toDate(userData.createdAt) : new Date(); // missing doc → too new
    const eligible = points >= MIN_POINTS && createdAt <= ageCutoff;
    return {
      uid,
      points,
      firstReachedAt: agg.last,
      eligible,
      email: userData?.email ?? null,
    };
  });

  rows.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    if (b.points !== a.points) return b.points - a.points;
    return a.firstReachedAt.getTime() - b.firstReachedAt.getTime(); // earlier wins ties
  });

  const pool = Math.min(MONTHLY_POOL_CAP, Math.floor(creditsSold * POOL_REVENUE_RATIO));
  return { period, rows, creditsSold, pool };
}
