import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { computeLeaderboard } from "@/lib/rewards/leaderboard";
import { currentPeriod, scaledPrizes, maskEmail, MIN_POINTS } from "@/lib/rewards/config";

/**
 * GET /api/rewards/leaderboard?period=YYYY-MM
 * Signed-in users get the top-10 standings (masked emails) + their own rank.
 */
export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const period = req.nextUrl.searchParams.get("period") || currentPeriod();
    if (!/^\d{4}-\d{2}$/.test(period)) {
      return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    const board = await computeLeaderboard(period);
    const prizes = scaledPrizes(board.pool);

    const top = board.rows
      .filter((row) => row.eligible)
      .slice(0, 10)
      .map((row, i) => ({
        rank: i + 1,
        name: maskEmail(row.email),
        points: row.points,
        prize: prizes[i] ?? 0,
        isMe: row.uid === uid,
      }));

    const myIndex = board.rows.findIndex((row) => row.uid === uid);
    const me = myIndex >= 0
      ? {
          rank: board.rows[myIndex].eligible
            ? board.rows.filter((r) => r.eligible).findIndex((r) => r.uid === uid) + 1
            : null,
          points: board.rows[myIndex].points,
          eligible: board.rows[myIndex].eligible,
          minPoints: MIN_POINTS,
        }
      : { rank: null, points: 0, eligible: false, minPoints: MIN_POINTS };

    return NextResponse.json({
      period,
      pool: board.pool,
      creditsSold: board.creditsSold,
      top,
      me,
    });
  } catch (err) {
    console.error("API /rewards/leaderboard error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
