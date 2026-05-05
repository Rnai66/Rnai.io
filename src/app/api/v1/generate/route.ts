import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { generateImageSkill } from "@/lib/ai/skills/image-generate";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCost } from "@/lib/billing/pricing";
import { chargeCredits } from "@/lib/billing/credits";
import { uploadToStorage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing API key" }, { status: 401 });
    }

    const keyData = await validateApiKey(auth.slice(7));
    if (!keyData) {
      return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401 });
    }

    const { success, limit, reset, remaining } = await ratelimit.limit(keyData.id);
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          },
        }
      );
    }

    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "prompt is required" }, { status: 400 });
    }

    const cost = getCost("image/generate");
    const refId = `req_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    const startTime = Date.now();
    const { result: buf, provider } = await generateImageSkill(prompt);
    const latencyMs = Date.now() - startTime;

    const url = await uploadToStorage(buf, refId, "png");

    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "image/generate",
      model: "flux.1-schnell",
      provider: provider,
      latencyMs,
      status: "success",
      outputUrl: url,
      createdAt: new Date(),
    });

    return NextResponse.json({ url, format: "png" });
  } catch (err) {
    console.error("API /v1/generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
