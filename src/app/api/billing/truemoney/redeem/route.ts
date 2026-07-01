import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { addPaidCredits } from "@/lib/billing/credits";
import {
  redeemVoucher,
  extractVoucherHash,
  TrueMoneyError,
} from "@/lib/payments/truemoney";

// Web (dashboard) TrueMoney gift-voucher redeem. Auth via Firebase session
// cookie (same as the rest of the billing pages). Mirrors the API-key route
// at /api/v1/payments/truemoney/redeem but for signed-in web users.
// Body: { voucher: string }  (full gift URL or raw code)

export const maxDuration = 30;

const CREDITS_PER_BAHT = Number(process.env.TRUEMONEY_CREDITS_PER_BAHT || "3");

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized", message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { success } = await ratelimit.limit(`tmn:web:${uid}`);
    if (!success) {
      return NextResponse.json({ error: "Rate limit", message: "ลองใหม่อีกครั้งในอีกสักครู่" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const voucher = typeof body?.voucher === "string" ? body.voucher : "";
    if (!voucher) {
      return NextResponse.json({ error: "Bad request", message: "กรุณาวางลิงก์หรือรหัสอังเปา" }, { status: 400 });
    }

    const phone = process.env.TRUEMONEY_PHONE;
    if (!phone) {
      return NextResponse.json(
        { error: "Not configured", message: "ระบบเติมเงินยังไม่พร้อมใช้งาน" },
        { status: 503 }
      );
    }

    let voucherHash: string;
    try {
      voucherHash = extractVoucherHash(voucher);
    } catch {
      return NextResponse.json({ error: "Bad voucher", message: "รหัสบัตรหรือลิงก์ไม่ถูกต้อง" }, { status: 400 });
    }

    let amountBaht: number;
    let voucherId: string;
    try {
      ({ amountBaht, voucherId } = await redeemVoucher(voucherHash, phone));
    } catch (err) {
      if (err instanceof TrueMoneyError) {
        const status =
          err.code === "TIMEOUT" || err.code === "NETWORK" || err.code === "INTERNAL_ERROR" ? 502 : 400;
        return NextResponse.json({ error: err.code, message: err.message }, { status });
      }
      throw err;
    }

    const credits = Math.round(amountBaht * CREDITS_PER_BAHT);
    const ref = `tmn_${voucherId}`;

    const result = await addPaidCredits(uid, credits, ref, {
      source: "truemoney",
      amountBaht,
      voucherId,
    });

    if (!result.added && result.alreadyProcessed) {
      return NextResponse.json({ error: "Already redeemed", message: "บัตรนี้ถูกใช้ไปแล้ว" }, { status: 400 });
    }

    await getAdminDb().collection("usageLogs").doc(ref).set({
      uid,
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
    console.error("API /billing/truemoney/redeem error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
