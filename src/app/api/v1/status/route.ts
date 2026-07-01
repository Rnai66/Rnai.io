import { NextResponse } from "next/server";
import { selfHostedConfig } from "@/lib/ai/providers/selfhosted";

/**
 * Public service status — no auth, no secrets. Reports which AI providers are
 * configured and whether the self-hosted backup endpoints are reachable.
 * The mobile app can poll this to show a real "API status" instead of a
 * hardcoded label.
 */

async function reachable(url: string | undefined, path = ""): Promise<boolean> {
  if (!url) return false;
  const base = url.replace(/\/+$/, "");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const headers: Record<string, string> = {};
    if (process.env.SELF_API_KEY) headers.Authorization = `Bearer ${process.env.SELF_API_KEY}`;
    const res = await fetch(`${base}${path}`, { method: "GET", headers, signal: controller.signal });
    return res.status < 500; // any HTTP response = the host is up
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  const cfg = selfHostedConfig();

  const providers = {
    openrouter: !!process.env.OPENROUTER_API_KEY,
    together: !!process.env.TOGETHER_API_KEY,
    huggingface: !!(process.env.HUGGINGFACE_API_TOKEN || process.env.HF_TOKEN),
    gemini: !!process.env.GEMINI_API_KEY,
  };

  const [llmUp, imageUp, ttsUp, sttUp] = await Promise.all([
    reachable(process.env.SELF_VLLM_URL, "/health"),
    reachable(process.env.SELF_SDXL_URL, "/health"),
    reachable(process.env.SELF_TTS_URL),
    reachable(process.env.SELF_STT_URL),
  ]);

  const backup = {
    configured: cfg,
    reachable: { llm: llmUp, image: imageUp, tts: ttsUp, stt: sttUp },
  };

  // "operational" if at least one external text provider is configured OR a
  // self-hosted backup is reachable.
  const operational =
    providers.openrouter || providers.together || providers.gemini || llmUp || imageUp || ttsUp || sttUp;

  return NextResponse.json({
    status: operational ? "operational" : "degraded",
    providers,
    backup,
    timestamp: new Date().toISOString(),
  });
}
