import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { addPaidCredits } from "@/lib/billing/credits";
import { requiredString, validateJson } from "@/lib/api/validation";
import {
  redeemVoucher,
  extractVoucherHash,
  TrueMoneyError,
} from "@/lib/payments/truemoney";

// POST /api/v1/payments/truemoney/redeem
// Body: { voucher_hash: string }   (full gift URL also accepted)
// Auth: Bearer rnai_sk_...
// Returns: { amount_baht, credits_added, transaction_id }

// Allow a moment for the upstream TrueMoney call.
export const maxDuration = 30;

// Credits granted per THB. Base pack is $5 → 600 credits ≈ 3 credits/baht.
const CREDITS_PER_BAHT = Number(process.env.TRUEMONEY_CREDITS_PER_BAHT || "3");

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer rnai_sk_")) {
      return NextResponse.json({ error: "Missing API key" }, { status: 401 });
    }
    const keyData = await validateApiKey(auth.slice(7));
    if (!keyData) {
      return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401 });
    }

    const { success } = await ratelimit.limit(`tmn:${keyData.id}`);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded", message: "ลองใหม่อีกครั้งในอีกสักครู่" }, { status: 429 });
    }

    const parsed = await validateJson<{ voucher_hash: string }>(req, {
      voucher_hash: requiredString({ min: 6, max: 256 }),
    });
    if (parsed.response) return parsed.response;

    const phone = process.env.TRUEMONEY_PHONE;
    if (!phone) {
      console.error("TRUEMONEY_PHONE not configured");
      return NextResponse.json(
        { error: "Not configured", message: "ระบบเติมเงินยังไม่พร้อมใช้งาน" },
        { status: 503 }
      );
    }

    let voucherHash: string;
    try {
      voucherHash = extractVoucherHash(parsed.data.voucher_hash);
    } catch {
      return NextResponse.json(
        { error: "Bad voucher", message: "รหัสบัตรหรือลิงก์ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    // Redeem with TrueMoney (this is what actually moves the money).
    let amountBaht: number;
    let voucherId: string;
    try {
      ({ amountBaht, voucherId } = await redeemVoucher(voucherHash, phone));
    } catch (err) {
      if (err instanceof TrueMoneyError) {
        const status = err.code === "TIMEOUT" || err.code === "NETWORK" || err.code === "INTERNAL_ERROR" ? 502 : 400;
        return NextResponse.json({ error: err.code, message: err.message }, { status });
      }
      throw err;
    }

    const credits = Math.round(amountBaht * CREDITS_PER_BAHT);
    const ref = `tmn_${voucherId}`;

    const result = await addPaidCredits(keyData.userId, credits, ref, {
      source: "truemoney",
      amountBaht,
      voucherId,
    });

    if (!result.added && result.alreadyProcessed) {
      return NextResponse.json(
        { error: "Already redeemed", message: "บัตรนี้ถูกใช้ไปแล้ว" },
        { status: 400 }
      );
    }

    await getAdminDb().collection("usageLogs").doc(ref).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "payments/truemoney",
      status: "success",
      amountBaht,
      creditsAdded: credits,
      createdAt: new Date(),
    });

    return NextResponse.json({
      amount_baht: amountBaht,
      credits_added: credits,
      transaction_id: voucherId,
      balance_after: result.balanceAfter,
    });
  } catch (err) {
    console.error("API /v1/payments/truemoney/redeem error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
