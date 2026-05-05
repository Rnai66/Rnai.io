import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { textRewriteSkill } from "@/lib/ai/skills/text-rewrite";
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

    const { text: inputText, tone } = await req.json();
    if (!inputText) return NextResponse.json({ error: "text is required" }, { status: 400 });

    const cost = getCost("text/rewrite");
    const refId = `req_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    const startTime = Date.now();
    const { result: text, provider } = await textRewriteSkill(inputText, tone);
    const latencyMs = Date.now() - startTime;

    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "text/rewrite",
      provider: provider,
      latencyMs,
      status: "success",
      createdAt: new Date(),
    });

    return NextResponse.json({ text });
  } catch (err) {
    console.error("API /v1/text/rewrite error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
