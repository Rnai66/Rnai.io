import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { audioSTTSkill } from "@/lib/ai/skills/audio-stt";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCost } from "@/lib/billing/pricing";
import { chargeCredits } from "@/lib/billing/credits";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer rnai_sk_")) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    const keyData = await validateApiKey(auth.slice(7));
    if (!keyData) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const { success } = await ratelimit.limit(keyData.id);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const { audio } = await req.json();
    if (!audio) return NextResponse.json({ error: "audio (base64) is required" }, { status: 400 });

    const cost = getCost("audio/stt");
    const refId = `req_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    const startTime = Date.now();
    const { result: text, provider } = await audioSTTSkill(audio);
    const latencyMs = Date.now() - startTime;

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
