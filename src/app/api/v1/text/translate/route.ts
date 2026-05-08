import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { textTranslateSkill } from "@/lib/ai/skills/text-translate";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCost } from "@/lib/billing/pricing";
import { chargeCredits, runWithCreditRefund } from "@/lib/billing/credits";
import { requiredString, validateJson } from "@/lib/api/validation";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer rnai_sk_")) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

    const keyData = await validateApiKey(auth.slice(7));
    if (!keyData) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

    const { success } = await ratelimit.limit(keyData.id);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const parsed = await validateJson<{ text: string; targetLanguage: string }>(req, {
      text: requiredString({ min: 1, max: 50000 }),
      targetLanguage: requiredString({ min: 2, max: 80 }),
    });
    if (parsed.response) return parsed.response;
    const { text: inputText, targetLanguage } = parsed.data;

    const cost = getCost("text/translate");
    const refId = `req_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    const { text, provider, latencyMs } = await runWithCreditRefund(
      keyData.userId,
      cost,
      refId,
      async () => {
        const startTime = Date.now();
        const { result: text, provider } = await textTranslateSkill(inputText, targetLanguage);
        const latencyMs = Date.now() - startTime;
        return { text, provider, latencyMs };
      }
    );

    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "text/translate",
      provider: provider,
      latencyMs,
      status: "success",
      createdAt: new Date(),
    });

    return NextResponse.json({ text });
  } catch (err) {
    console.error("API /v1/text/translate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
