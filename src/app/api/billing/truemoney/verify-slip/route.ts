import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { addPaidCredits } from "@/lib/billing/credits";
import { verifySlipImage, SlipError } from "@/lib/payments/slip";

// POST /api/billing/truemoney/verify-slip   (multipart: field "slip" = image)
// Auth via Firebase session cookie. Verifies a transfer slip with the slip
// provider (SlipOK), then credits the user. Idempotent on the slip's transRef.

export const maxDuration = 30;

const CREDITS_PER_BAHT = Number(process.env.TRUEMONEY_CREDITS_PER_BAHT || "3");
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) {
      return NextResponse.json({ error: "Unauthorized", message: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const { success } = await ratelimit.limit(`slip:${uid}`);
    if (!success) {
      return NextResponse.json({ error: "Rate limit", message: "ลองใหม่อีกครั้งในอีกสักครู่" }, { status: 429 });
    }

    let file: File | null = null;
    try {
      const form = await req.formData();
      const f = form.get("slip");
      if (f instanceof File) file = f;
    } catch {
      // fall through
    }
    if (!file) {
      return NextResponse.json({ error: "No file", message: "กรุณาแนบรูปสลิป" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "Too large", message: "ไฟล์ใหญ่เกินไป (เกิน 8MB)" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Bad type", message: "รองรับเฉพาะไฟล์รูปภาพ" }, { status: 400 });
    }

    let amountBaht: number;
    let transRef: string;
    try {
      ({ amountBaht, transRef } = await verifySlipImage(file));
    } catch (err) {
      if (err instanceof SlipError) {
        if (err.code === "NOT_CONFIGURED") {
          return NextResponse.json(
            { error: "Not configured", message: "ระบบตรวจสลิปยังไม่พร้อมใช้งาน" },
            { status: 503 }
          );
        }
        const status = err.code === "TIMEOUT" || err.code === "NETWORK" ? 502 : 400;
        return NextResponse.json({ error: err.code, message: err.message }, { status });
      }
      throw err;
    }

    const credits = Math.round(amountBaht * CREDITS_PER_BAHT);
    const ref = `slip_${transRef}`;

    const result = await addPaidCredits(uid, credits, ref, {
      source: "truemoney-slip",
      amountBaht,
      transRef,
    });

    if (!result.added && result.alreadyProcessed) {
      return NextResponse.json({ error: "Already used", message: "สลิปนี้ถูกใช้ไปแล้ว" }, { status: 400 });
    }

    await getAdminDb().collection("usageLogs").doc(ref).set({
      uid,
      skill: "payments/truemoney-slip",
      status: "success",
      amountBaht,
      creditsAdded: credits,
      createdAt: new Date(),
    });

    return NextResponse.json({
      amount_baht: amountBaht,
      credits_added: credits,
      transaction_id: transRef,
      balance_after: result.balanceAfter,
    });
  } catch (err) {
    console.error("API /billing/truemoney/verify-slip error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
