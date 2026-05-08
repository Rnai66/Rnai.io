import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { audioTTSSkill } from "@/lib/ai/skills/audio-tts";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCost } from "@/lib/billing/pricing";
import { chargeCredits, runWithCreditRefund } from "@/lib/billing/credits";
import { uploadToStorage } from "@/lib/storage";
import { requiredString, validateJson } from "@/lib/api/validation";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer rnai_sk_")) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    const keyData = await validateApiKey(auth.slice(7));
    if (!keyData) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const { success } = await ratelimit.limit(keyData.id);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const parsed = await validateJson<{ text: string }>(req, {
      text: requiredString({ min: 1, max: 5000 }),
    });
    if (parsed.response) return parsed.response;
    const { text } = parsed.data;

    const cost = getCost("audio/tts");
    const refId = `req_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    const { provider, latencyMs, url } = await runWithCreditRefund(
      keyData.userId,
      cost,
      refId,
      async () => {
        const startTime = Date.now();
        const { result: buf, provider } = await audioTTSSkill(text);
        const latencyMs = Date.now() - startTime;
        const url = await uploadToStorage(buf, refId, "mp3");
        return { provider, latencyMs, url };
      }
    );

    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "audio/tts",
      provider: provider,
      latencyMs,
      status: "success",
      outputUrl: url,
      createdAt: new Date(),
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("API /v1/audio/tts error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
