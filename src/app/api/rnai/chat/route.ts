import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { validateApiKey } from "@/lib/firebase/validateKey";
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

type Turn = { role: "user" | "assistant"; content: string };

// Keep prior-turn context bounded — protects both the request payload and
// the token/quota cost of a single call from growing without limit.
const MAX_HISTORY_TURNS = 12; // ~6 back-and-forth exchanges
const MAX_HISTORY_CHARS = 4000; // per stored turn

/** Pull a sane, capped `history` array out of an untrusted request body. */
function parseHistory(raw: unknown): Turn[] {
  if (!Array.isArray(raw)) return [];
  const turns: Turn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    if (!content.trim()) continue;
    turns.push({ role, content: content.slice(0, MAX_HISTORY_CHARS) });
  }
  return turns.slice(-MAX_HISTORY_TURNS);
}

async function callGemini(message: string, history: Turn[] = []) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  const contents = [
    ...history.map((t) => ({ role: t.role === "assistant" ? "model" : "user", parts: [{ text: t.content }] })),
    { role: "user", parts: [{ text: message }] },
  ];
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({ contents }),
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
    const authHeader = req.headers.get("authorization");

    // Accept API-key auth (rnai_sk_...) in addition to the website's
    // session-cookie / ID-token auth — lets Rnai-CLI's default chat route
    // through here (and through the same paying-member quota + free-Gemini
    // fallback) using the long-lived key it mints on `rnai login`.
    let uid: string | null = null;
    if (authHeader?.startsWith("Bearer rnai_sk_")) {
      const keyData = await validateApiKey(authHeader.slice(7));
      uid = keyData?.userId || null;
    } else {
      const sessionCookie = req.cookies.get("__session")?.value;
      uid = await verifyToken(authHeader, sessionCookie);
    }

    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success } = await ratelimit.limit(`rnai:${uid}`);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Request body must be valid JSON" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Request body must be a JSON object" }, { status: 400 });
    }
    const rawMessage = (body as { message?: unknown }).message;
    const message = typeof rawMessage === "string" ? rawMessage.trim() : "";
    if (!message || message.length < 1 || message.length > 12000) {
      return NextResponse.json({ error: "message is required (1-12000 characters)" }, { status: 400 });
    }
    // Optional prior turns (client-supplied) so multi-turn context survives —
    // e.g. Rnai-CLI's Cowork UI sends the running conversation for a session.
    const history = parseHistory((body as { history?: unknown }).history);

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
        // ตัดการรอ Rnai LLM ที่ 45 วิ (กัน Vercel FUNCTION_INVOCATION_TIMEOUT ที่ 60 วิ)
        // — เหลือเวลา ~15 วิ ให้ fallback Gemini ตอบทัน ข้อความแรกหลังโมเดลหลับจะได้
        // Gemini + request นี้ปลุก Modal ให้ตื่น ข้อความถัดไปจะได้ Rnai LLM ตามปกติ
        const res = await fetch(`${base!.replace(/\/+$/, "")}/v1/chat/completions`, {
          method: "POST",
          signal: AbortSignal.timeout(45_000),
          headers: {
            "Content-Type": "application/json",
            ...(process.env.SELF_API_KEY ? { Authorization: `Bearer ${process.env.SELF_API_KEY}` } : {}),
          },
          body: JSON.stringify({
            model: process.env.SELF_VLLM_MODEL ?? "rnai-llm",
            messages: [
              { role: "system", content: SYSTEM },
              ...history,
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
    const geminiText = await callGemini(message, history);
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
