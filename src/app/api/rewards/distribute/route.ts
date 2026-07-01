import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { computeLeaderboard } from "@/lib/rewards/leaderboard";
import { previousPeriod, scaledPrizes } from "@/lib/rewards/config";

/**
 * GET /api/rewards/distribute?period=YYYY-MM
 *
 * Distributes monthly rewards for the given period (default: previous month).
 * Called by Vercel Cron on the 1st of each month, or manually by an admin.
 *
 * Auth: `Authorization: Bearer ${CRON_SECRET}` (Vercel Cron sends this
 * automatically when the CRON_SECRET env var is set).
 *
 * Idempotency (two layers, mirroring the h2happ token reward design):
 *  1. Period level — rewardDistributions/monthly:<period> doc is created
 *     transactionally; re-runs of a completed period are no-ops.
 *  2. Entry level — each grant carries idempotencyKey
 *     `reward:monthly:<period>:rank<i>:<uid>`; an existing ledger entry
 *     with that key is never granted twice.
 */
export async function GET(req: NextRequest) {
  // ── Auth: cron secret only ──
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const period = req.nextUrl.searchParams.get("period") || previousPeriod();
  if (!/^\d{4}-\d{2}$/.test(period)) {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

  const db = getAdminDb();
  const distRef = db.collection("rewardDistributions").doc(`monthly:${period}`);

  try {
    // ── Layer 1: claim the period (create-if-absent, transactional) ──
    const claim = await db.runTransaction(async (tx) => {
      const doc = await tx.get(distRef);
      if (doc.exists) {
        const status = doc.data()?.status;
        if (status === "completed") return "already_completed";
        // 'processing' from a crashed run older than 1h may be retried
        const startedAt = doc.data()?.startedAt?.toDate?.() as Date | undefined;
        if (status === "processing" && startedAt && Date.now() - startedAt.getTime() < 3600_000) {
          return "in_progress";
        }
      }
      tx.set(distRef, { status: "processing", period, startedAt: new Date() }, { merge: true });
      return "claimed";
    });

    if (claim === "already_completed") {
      return NextResponse.json({ ok: true, skipped: true, message: "already_completed", period });
    }
    if (claim === "in_progress") {
      return NextResponse.json({ ok: false, message: "another_run_in_progress", period }, { status: 409 });
    }

    // ── Compute final standings ──
    const board = await computeLeaderboard(period);
    const prizes = scaledPrizes(board.pool);
    const winners = board.rows.filter((row) => row.eligible).slice(0, 10);

    const results: Array<{ rank: number; uid: string; prize: number; status: string }> = [];

    // ── Layer 2: grant each winner idempotently ──
    for (let i = 0; i < winners.length; i++) {
      const winner = winners[i];
      const prize = prizes[i] ?? 0;
      const rank = i + 1;
      const idempotencyKey = `reward:monthly:${period}:rank${rank}:${winner.uid}`;

      if (prize <= 0) {
        results.push({ rank, uid: winner.uid, prize: 0, status: "no_pool" });
        continue;
      }

      const existing = await db
        .collection("ledgerEntries")
        .where("idempotencyKey", "==", idempotencyKey)
        .limit(1)
        .get();
      if (!existing.empty) {
        results.push({ rank, uid: winner.uid, prize, status: "already_granted" });
        continue;
      }

      await db.runTransaction(async (tx) => {
        const userRef = db.collection("users").doc(winner.uid);
        const userDoc = await tx.get(userRef);
        if (!userDoc.exists) throw new Error(`user_missing:${winner.uid}`);
        const data = userDoc.data()!;
        const newFree = (Number(data.freeCreditsRemaining) || 0) + prize;
        const balanceAfter = newFree + (Number(data.paidCreditsBalance) || 0);

        tx.update(userRef, { freeCreditsRemaining: newFree });
        tx.set(db.collection("ledgerEntries").doc(), {
          uid: winner.uid,
          type: "reward",
          credits: prize,
          balanceAfter,
          ref: `monthly:${period}:rank${rank}`,
          idempotencyKey,
          createdAt: new Date(),
        });
      });

      results.push({ rank, uid: winner.uid, prize, status: "granted" });
    }

    // ── Mark period completed ──
    await distRef.set({
      status: "completed",
      period,
      completedAt: new Date(),
      pool: board.pool,
      creditsSold: board.creditsSold,
      winners: results,
    }, { merge: true });

    return NextResponse.json({
      ok: true,
      period,
      pool: board.pool,
      creditsSold: board.creditsSold,
      granted: results.filter((r) => r.status === "granted").length,
      results,
    });
  } catch (err) {
    console.error("API /rewards/distribute error:", err);
    // release the claim so a retry can run
    await distRef.set({ status: "failed", failedAt: new Date() }, { merge: true }).catch(() => {});
    return NextResponse.json({ error: "Distribution failed" }, { status: 500 });
  }
}
