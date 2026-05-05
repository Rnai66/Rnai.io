import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { textGenerateSkill } from "@/lib/ai/skills/text-generate";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCost } from "@/lib/billing/pricing";
import { chargeCredits } from "@/lib/billing/credits";
import { generateInputHash, getCachedResult, setCachedResult } from "@/lib/cache";

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

    const { success, limit, reset, remaining } = await ratelimit.limit(keyData.id);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "prompt is required" }, { status: 400 });

    const cost = getCost("text/generate");
    const refId = `req_${Date.now()}_${Math.floor(Math.random()*1000)}`;

    // Cache Check
    const inputHash = generateInputHash({ prompt });
    const cached = await getCachedResult<{ text: string }>("text/generate", inputHash);

    if (cached) {
      await getAdminDb().collection("usageLogs").doc(refId).set({
        uid: keyData.userId,
        apiKeyId: keyData.id,
        skill: "text/generate",
        status: "cached",
        createdAt: new Date(),
      });
      return NextResponse.json(cached);
    }
    
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    const startTime = Date.now();
    const { result: text, provider } = await textGenerateSkill(prompt);
    const latencyMs = Date.now() - startTime;

    const result = { text };
    await setCachedResult("text/generate", inputHash, result);

    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "text/generate",
      model: "gpt-4o-mini",
      provider: provider,
      latencyMs,
      status: "success",
      createdAt: new Date(),
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("API /v1/text/generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
