import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { editImageSkill } from "@/lib/ai/skills/image-edit";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCost } from "@/lib/billing/pricing";
import { chargeCredits, runWithCreditRefund } from "@/lib/billing/credits";
import { uploadToStorage } from "@/lib/storage";
import { base64ImageRule, requiredString, validateJson } from "@/lib/api/validation";

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

    const parsed = await validateJson<{ image: string; mask: string; prompt: string }>(req, {
      image: base64ImageRule,
      mask: base64ImageRule,
      prompt: requiredString({ min: 1, max: 2000 }),
    });
    if (parsed.response) return parsed.response;
    const { image, mask, prompt } = parsed.data;

    const cost = getCost("image/edit");
    const refId = `req_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    const { provider, latencyMs, url } = await runWithCreditRefund(
      keyData.userId,
      cost,
      refId,
      async () => {
        const startTime = Date.now();
        const { result: buf, provider } = await editImageSkill(image, mask, prompt);
        const latencyMs = Date.now() - startTime;
        const url = await uploadToStorage(buf, refId, "png");
        return { provider, latencyMs, url };
      }
    );

    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "image/edit",
      model: "sdxl-1.0-inpainting",
      provider: provider,
      latencyMs,
      status: "success",
      outputUrl: url,
      createdAt: new Date(),
    });

    return NextResponse.json({ url, format: "png" });
  } catch (err) {
    console.error("API /v1/edit error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
