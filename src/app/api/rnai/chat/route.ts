import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { requiredString, validateJson } from "@/lib/api/validation";
import { ratelimit } from "@/lib/ratelimit";

// Free chat with the self-hosted Rnai LLM (the fine-tuned Qwen2.5-7B served on
// Modal via vLLM). Signed-in users only. Mirrors /api/gemini/chat.

const SYSTEM =
  "You are Rnai, the friendly AI assistant of Rnai.io. Always reply in the user's language. Be concise, warm, and accurate.";

// Allow time for a cold-start of the scale-to-zero Modal container.
export const maxDuration = 60;

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

    const base = process.env.SELF_VLLM_URL;
    if (!base) {
      return NextResponse.json({ error: "Rnai model is not configured" }, { status: 503 });
    }

    const res = await fetch(`${base.replace(/\/+$/, "")}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.SELF_API_KEY ? { Authorization: `Bearer ${process.env.SELF_API_KEY}` } : {}),
      },
      body: JSON.stringify({
        model: process.env.SELF_VLLM_MODEL ?? "rnai-llm",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: parsed.data.message },
        ],
        temperature: 0.6,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      console.error("Rnai chat error:", (await res.text()).slice(0, 300));
      return NextResponse.json({ error: "Rnai chat failed" }, { status: 502 });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ text: text || "No response returned.", model: "rnai-llm", free: true });
  } catch (error) {
    console.error("API /rnai/chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
