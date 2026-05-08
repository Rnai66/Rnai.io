import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/firebase/validateKey";
import { websiteGenerateSkill } from "@/lib/ai/skills/website-generate";
import { ratelimit } from "@/lib/ratelimit";
import { getAdminDb } from "@/lib/firebase/admin";
import { getCost } from "@/lib/billing/pricing";
import { chargeCredits, runWithCreditRefund } from "@/lib/billing/credits";
import { uploadToStorage } from "@/lib/storage";
import { generateInputHash, getCachedResult, setCachedResult } from "@/lib/cache";
import { requiredString, optionalString, validateJson } from "@/lib/api/validation";

interface WebsiteGenerateRequest {
  websiteName: string;
  websiteType: string;
  template: string;
  description: string;
  language: string;
  [key: string]: string;
}

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

    const parsed = await validateJson<WebsiteGenerateRequest>(req, {
      websiteName: requiredString({ min: 1, max: 100 }),
      websiteType: requiredString({ min: 1, max: 50 }),
      template: requiredString({ min: 1, max: 50 }),
      description: requiredString({ min: 1, max: 5000 }),
      language: optionalString({ max: 50, defaultValue: "th" }),
    });

    if (parsed.response) return parsed.response;
    const { websiteName, websiteType, template, description, language } = parsed.data;

    const cost = getCost("website/generate") || 10; // Default cost if not configured
    const refId = `req_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Cache Check - use combination of inputs as key
    const cacheKey = {
      websiteName,
      websiteType,
      template,
      description: description.substring(0, 100), // Use first 100 chars for cache key
      language,
    };
    const inputHash = generateInputHash(cacheKey);
    const cached = await getCachedResult<{ html: string }>("website/generate", inputHash);

    if (cached) {
      await getAdminDb().collection("usageLogs").doc(refId).set({
        uid: keyData.userId,
        apiKeyId: keyData.id,
        skill: "website/generate",
        status: "cached",
        websiteName,
        websiteType,
        template,
        createdAt: new Date(),
      });
      return NextResponse.json({
        success: true,
        html: cached.html,
        cached: true,
        websiteName,
      });
    }

    // Charge credits
    const successCharge = await chargeCredits(keyData.userId, cost, refId);
    if (!successCharge) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 402 });
    }

    // Generate website
    const { provider, latencyMs, html } = await runWithCreditRefund(
      keyData.userId,
      cost,
      refId,
      async () => {
        const startTime = Date.now();
        const { result } = await websiteGenerateSkill({
          websiteName,
          websiteType,
          template,
          description,
          language,
        });
        const latencyMs = Date.now() - startTime;

        // Note: In a real scenario, you might want to store the HTML in Firebase Storage
        // For now, we'll return it directly
        return { html: result.html, provider: "openrouter/together", latencyMs };
      }
    );

    // Cache the result
    const result = { html };
    await setCachedResult("website/generate", inputHash, result);

    // Log usage
    await getAdminDb().collection("usageLogs").doc(refId).set({
      uid: keyData.userId,
      apiKeyId: keyData.id,
      skill: "website/generate",
      provider,
      latencyMs,
      status: "success",
      websiteName,
      websiteType,
      template,
      language,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      html,
      cached: false,
      websiteName,
      message: "Website generated successfully",
    });
  } catch (err) {
    console.error("API /v1/website/generate error:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}

// GET endpoint for testing
export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: "Website Generation API",
    method: "POST",
    endpoint: "/api/v1/website/generate",
    description: "Generate a complete HTML website based on requirements",
    required_headers: {
      authorization: "Bearer YOUR_API_KEY",
      "content-type": "application/json",
    },
    request_body: {
      websiteName: "string (required)",
      websiteType: "string - ecommerce | blog | portfolio | service | restaurant | saas (required)",
      template: "string - modern | minimal | bold | elegant (required)",
      description: "string (required)",
      language: "string - th | en (optional, default: th)",
    },
    response: {
      success: "boolean",
      html: "string (complete HTML code)",
      cached: "boolean",
      websiteName: "string",
      message: "string",
    },
  });
}
