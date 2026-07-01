/**
 * RNAI Points rewards — prize tables & period helpers.
 * Rules: see REWARDS_PROGRAM.md
 */

/** Monthly prizes, rank 1 → 10 (credits). Total = 5,000. */
export const MONTHLY_PRIZES = [1500, 1000, 700, 400, 400, 200, 200, 200, 200, 200];

/** Max monthly pool (credits). */
export const MONTHLY_POOL_CAP = MONTHLY_PRIZES.reduce((a, b) => a + b, 0); // 5000

/** Pool = min(cap, POOL_REVENUE_RATIO × credits sold in the month). */
export const POOL_REVENUE_RATIO = 0.25;

/** Eligibility */
export const MIN_POINTS = 100;            // must have spent ≥100 credits in the period
export const MIN_ACCOUNT_AGE_DAYS = 7;    // account created ≥7 days before period end

/** "YYYY-MM" for a date (UTC+7 — Thai time governs periods). */
export function periodOf(date: Date): string {
  const thai = new Date(date.getTime() + 7 * 3600 * 1000);
  return `${thai.getUTCFullYear()}-${String(thai.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** Current period (Thai time). */
export function currentPeriod(): string {
  return periodOf(new Date());
}

/** Previous month period (Thai time). */
export function previousPeriod(): string {
  const now = new Date(Date.now() + 7 * 3600 * 1000);
  const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return `${prev.getUTCFullYear()}-${String(prev.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** UTC start/end instants of a "YYYY-MM" period in Thai time. */
export function periodRange(period: string): { start: Date; end: Date } {
  const [y, m] = period.split("-").map(Number);
  // Thai midnight = UTC 17:00 previous day
  const start = new Date(Date.UTC(y, m - 1, 1, -7));
  const end = new Date(Date.UTC(y, m, 1, -7));
  return { start, end };
}

/** Scale prizes proportionally to a smaller pool (floor, keep order). */
export function scaledPrizes(pool: number): number[] {
  if (pool >= MONTHLY_POOL_CAP) return [...MONTHLY_PRIZES];
  if (pool <= 0) return MONTHLY_PRIZES.map(() => 0);
  const ratio = pool / MONTHLY_POOL_CAP;
  return MONTHLY_PRIZES.map((p) => Math.floor(p * ratio));
}

/** Mask an email for public leaderboards: somebody@gmail.com → s******@gmail.com */
export function maskEmail(email: string | null | undefined): string {
  if (!email || !email.includes("@")) return "anonymous";
  const [name, domain] = email.split("@");
  const head = name.slice(0, 1);
  return `${head}${"*".repeat(Math.max(3, Math.min(name.length - 1, 8)))}@${domain}`;
}
