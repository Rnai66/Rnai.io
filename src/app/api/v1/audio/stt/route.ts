import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { audioSTTSkill } from "@/lib/ai/skills/audio-stt";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCost } from "@/lib/billing/pricing";
import { chargeCredits, runWithCreditRefund } from "@/lib/billing/credits";
import { base64AudioRule, validateJson } from "@/lib/api/validation";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer rnai_sk_")) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    const keyData = await validateApiKey(auth.slice(7));
    if (!keyData) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const { success } = await ratelimit.limit(keyData.id);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const parsed = await validateJson<{ audio: string }>(req, {
      audio: base64AudioRule,
    });
    if (parsed.response) return parsed.response;
    const { audio } = parsed.data;

    const cost = getCost("audio/stt");
    const refId = `req_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    const { text, provider, latencyMs } = await runWithCreditRefund(
      keyData.userId,
      cost,
      refId,
      async () => {
        const startTime = Date.now();
        const { result: text, provider } = await audioSTTSkill(audio);
        const latencyMs = Date.now() - startTime;
        return { text, provider, latencyMs };
      }
    );

    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "audio/stt",
      provider: provider,
      latencyMs,
      status: "success",
      createdAt: new Date(),
    });

    return NextResponse.json({ text });
  } catch (err) {
    console.error("API /v1/audio/stt error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
