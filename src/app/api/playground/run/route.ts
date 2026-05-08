import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { ratelimit } from "@/lib/ratelimit";
import { base64AudioRule, base64ImageRule, optionalString, requiredString, validateJson, type JsonSchema } from "@/lib/api/validation";
import { getCost, type SkillName } from "@/lib/billing/pricing";
import { chargeCredits, runWithCreditRefund } from "@/lib/billing/credits";
import { getAdminDb } from "@/lib/firebase/admin";
import { uploadToStorage } from "@/lib/storage";
import { generateImageSkill } from "@/lib/ai/skills/image-generate";
import { editImageSkill } from "@/lib/ai/skills/image-edit";
import { removeBackgroundSkill } from "@/lib/ai/skills/image-remove-bg";
import { upscaleImageSkill } from "@/lib/ai/skills/image-upscale";
import { stylizeImageSkill } from "@/lib/ai/skills/image-stylize";
import { textGenerateSkill } from "@/lib/ai/skills/text-generate";
import { textSummarizeSkill } from "@/lib/ai/skills/text-summarize";
import { textTranslateSkill } from "@/lib/ai/skills/text-translate";
import { textRewriteSkill } from "@/lib/ai/skills/text-rewrite";
import { textExtractSkill } from "@/lib/ai/skills/text-extract";
import { audioTTSSkill } from "@/lib/ai/skills/audio-tts";
import { audioSTTSkill } from "@/lib/ai/skills/audio-stt";
import { websiteGenerateSkill } from "@/lib/ai/skills/website-generate";

type PlaygroundSkill = SkillName;

const schemas: Record<PlaygroundSkill, JsonSchema> = {
  "image/generate": { skill: requiredString(), prompt: requiredString({ min: 1, max: 2000 }) },
  "image/edit": { skill: requiredString(), image: base64ImageRule, mask: base64ImageRule, prompt: requiredString({ min: 1, max: 2000 }) },
  "image/remove-background": { skill: requiredString(), image: base64ImageRule },
  "image/upscale": { skill: requiredString(), image: base64ImageRule },
  "image/stylize": { skill: requiredString(), image: base64ImageRule, prompt: requiredString({ min: 1, max: 2000 }) },
  "text/generate": { skill: requiredString(), prompt: requiredString({ min: 1, max: 12000 }) },
  "text/summarize": { skill: requiredString(), text: requiredString({ min: 1, max: 50000 }) },
  "text/translate": { skill: requiredString(), text: requiredString({ min: 1, max: 50000 }), targetLanguage: requiredString({ min: 2, max: 80 }) },
  "text/rewrite": { skill: requiredString(), text: requiredString({ min: 1, max: 50000 }), tone: optionalString({ max: 80, defaultValue: "professional" }) },
  "text/extract": { skill: requiredString(), text: requiredString({ min: 1, max: 50000 }), schema: requiredString({ min: 1, max: 4000 }) },
  "audio/tts": { skill: requiredString(), text: requiredString({ min: 1, max: 5000 }) },
  "audio/stt": { skill: requiredString(), audio: base64AudioRule },
  "website/generate": { skill: requiredString(), websiteName: requiredString({ min: 1, max: 100 }), websiteType: requiredString({ min: 1, max: 50 }), template: requiredString({ min: 1, max: 50 }), description: requiredString({ min: 1, max: 5000 }) },
};

function isPlaygroundSkill(skill: string): skill is PlaygroundSkill {
  return skill in schemas;
}

async function executeSkill(skill: PlaygroundSkill, data: Record<string, string>, refId: string) {
  switch (skill) {
    case "image/generate": {
      const { result: buf, provider } = await generateImageSkill(data.prompt);
      const url = await uploadToStorage(buf, refId, "png");
      return { response: { url, format: "png" }, provider, outputUrl: url };
    }
    case "image/edit": {
      const { result: buf, provider } = await editImageSkill(data.image, data.mask, data.prompt);
      const url = await uploadToStorage(buf, refId, "png");
      return { response: { url, format: "png" }, provider, outputUrl: url };
    }
    case "image/remove-background": {
      const { result: buf, provider } = await removeBackgroundSkill(data.image);
      const url = await uploadToStorage(buf, refId, "png");
      return { response: { url, format: "png" }, provider, outputUrl: url };
    }
    case "image/upscale": {
      const { result: buf, provider } = await upscaleImageSkill(data.image);
      const url = await uploadToStorage(buf, refId, "png");
      return { response: { url, format: "png" }, provider, outputUrl: url };
    }
    case "image/stylize": {
      const { result: buf, provider } = await stylizeImageSkill(data.image, data.prompt);
      const url = await uploadToStorage(buf, refId, "png");
      return { response: { url, format: "png" }, provider, outputUrl: url };
    }
    case "text/generate": {
      const { result: text, provider } = await textGenerateSkill(data.prompt);
      return { response: { text }, provider };
    }
    case "text/summarize": {
      const { result: text, provider } = await textSummarizeSkill(data.text);
      return { response: { text }, provider };
    }
    case "text/translate": {
      const { result: text, provider } = await textTranslateSkill(data.text, data.targetLanguage);
      return { response: { text }, provider };
    }
    case "text/rewrite": {
      const { result: text, provider } = await textRewriteSkill(data.text, data.tone);
      return { response: { text }, provider };
    }
    case "text/extract": {
      const { result: text, provider } = await textExtractSkill(data.text, data.schema);
      return { response: { text }, provider };
    }
    case "audio/tts": {
      const { result: buf, provider } = await audioTTSSkill(data.text);
      const url = await uploadToStorage(buf, refId, "mp3");
      return { response: { url, format: "mp3" }, provider, outputUrl: url };
    }
    case "audio/stt": {
      const { result: text, provider } = await audioSTTSkill(data.audio);
      return { response: { text }, provider };
    }
    case "website/generate": {
      const { result, provider } = await websiteGenerateSkill({
        websiteName: data.websiteName,
        websiteType: data.websiteType,
        template: data.template,
        description: data.description,
        language: "th",
      });
      return { response: { text: result.html, format: "html" }, provider };
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.clone().json().catch(() => null);
    const skill = body?.skill;
    if (typeof skill !== "string" || !isPlaygroundSkill(skill)) {
      return NextResponse.json({ error: "Unsupported skill" }, { status: 400 });
    }

    const parsed = await validateJson<Record<string, string>>(req, schemas[skill]);
    if (parsed.response) return parsed.response;

    const { success } = await ratelimit.limit(`playground:${uid}`);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const cost = getCost(skill);
    const refId = `dash_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const charged = await chargeCredits(uid, cost, refId);
    if (!charged) return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });

    const startTime = Date.now();
    const result = await runWithCreditRefund(uid, cost, refId, () => executeSkill(skill, parsed.data, refId));
    const latencyMs = Date.now() - startTime;

    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid,
      apiKeyId: "dashboard",
      skill,
      provider: result.provider,
      latencyMs,
      status: "success",
      outputUrl: result.outputUrl || null,
      createdAt: new Date(),
    });

    return NextResponse.json({
      ...result.response,
      skill,
      provider: result.provider,
      creditsCharged: cost,
    });
  } catch (error) {
    console.error("API /playground/run error:", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message.includes("does not have permission")
      ? 403
      : message.includes("token is not configured")
        ? 503
        : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
