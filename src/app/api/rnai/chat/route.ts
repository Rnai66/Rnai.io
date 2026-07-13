import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { requiredString, validateJson } from "@/lib/api/validation";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import {
  RNAI_MONTHLY_TOKENS,
  isPaidThisMonth,
  usedThisMonth,
  addRnaiTokens,
} from "@/lib/billing/rnaiQuota";

// Primary free chat = the self-hosted Rnai LLM (fine-tuned Qwen2.5-7B on Modal).
// Paying members (topped up this month) get RNAI_MONTHLY_TOKENS free tokens/month.
// When the quota is exhausted — or the user isn't a paying member this month —
// the request transparently falls back to free Gemini so chat never breaks.

// ต้องตรงกับ system prompt ที่ใช้เทรน rnai-llm v3.1 — มีผลต่อคุณภาพคำตอบมาก
const SYSTEM =
  "คุณคือ Rnai ผู้ช่วยส่วนตัวอัจฉริยะ พูดภาษาไทยเป็นธรรมชาติ ตอบตรงประเด็น คิดเป็นขั้นตอนเมื่อโจทย์ซับซ้อน และซื่อสัตย์เมื่อไม่แน่ใจ";

// Allow time for a cold-start of the scale-to-zero Modal container.
export const maxDuration = 60;

async function callGemini(message: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: message }] }] }),
    }
  );
  if (!res.ok) {
    console.error("Rnai chat → Gemini fallback error:", (await res.text()).slice(0, 300));
    return null;
  }
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text || "")
    .join("")
    .trim();
  return text || "No response returned.";
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success } = await ratelimit.limit(`rnai:${uid}`);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const parsed = await validateJson<{ message: string }>(req, {
      message: requiredString({ min: 1, max: 12000 }),
    });
    if (parsed.response) return parsed.response;
    const message = parsed.data.message;

    // Eligibility + monthly quota (single user-doc read).
    const userSnap = await getAdminDb().collection("users").doc(uid).get();
    const userData = userSnap.data();
    // RNAI_TEST_UIDS: รายชื่อ uid (คั่น comma) ที่ใช้ Rnai LLM ได้เสมอ — สำหรับเจ้าของ/ทีมทดสอบ
    const testUids = (process.env.RNAI_TEST_UIDS || "").split(",").map(s => s.trim()).filter(Boolean);
    const eligible = isPaidThisMonth(userData) || testUids.includes(uid);
    const used = usedThisMonth(userData);
    const remaining = Math.max(0, RNAI_MONTHLY_TOKENS - used);

    const base = process.env.SELF_VLLM_URL;
    const canUseRnai = eligible && remaining > 0 && !!base;

    if (canUseRnai) {
      try {
        const res = await fetch(`${base!.replace(/\/+$/, "")}/v1/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(process.env.SELF_API_KEY ? { Authorization: `Bearer ${process.env.SELF_API_KEY}` } : {}),
          },
          body: JSON.stringify({
            model: process.env.SELF_VLLM_MODEL ?? "rnai-llm",
            messages: [
              { role: "system", content: SYSTEM },
              { role: "user", content: message },
            ],
            temperature: 0.6,
            max_tokens: 1024,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data?.choices?.[0]?.message?.content?.trim();
          const totalTokens: number =
            data?.usage?.total_tokens ?? Math.ceil((message.length + (text?.length || 0)) / 4);
          await addRnaiTokens(uid, totalTokens);
          return NextResponse.json({
            text: text || "No response returned.",
            model: "rnai-llm",
            free: true,
            quota: {
              limit: RNAI_MONTHLY_TOKENS,
              used: used + totalTokens,
              remaining: Math.max(0, RNAI_MONTHLY_TOKENS - used - totalTokens),
            },
          });
        }
        console.error("Rnai LLM error, falling back to Gemini:", (await res.text()).slice(0, 200));
      } catch (e) {
        console.error("Rnai LLM unreachable, falling back to Gemini:", e);
      }
    }

    // Fallback → free Gemini (quota exhausted, not a paying member, or model down).
    const geminiText = await callGemini(message);
    if (geminiText == null) {
      return NextResponse.json({ error: "Chat is temporarily unavailable" }, { status: 503 });
    }
    return NextResponse.json({
      text: geminiText,
      model: "gemini-2.5-flash",
      free: true,
      fallback: true,
      reason: !eligible ? "not-member" : remaining <= 0 ? "quota-exhausted" : "model-unavailable",
      quota: { limit: RNAI_MONTHLY_TOKENS, used, remaining },
    });
  } catch (error) {
    console.error("API /rnai/chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
