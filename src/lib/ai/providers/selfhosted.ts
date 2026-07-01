import { Provider } from "../types";

/**
 * Self-hosted backup provider — the last link in every failover chain.
 *
 * Points at the Rnai-owned inference servers (deploy via Modal / RunPod / Docker;
 * see the mobile repo docs/reference/deploy). When the external providers
 * (HuggingFace / OpenRouter / Together) are down, the router falls through to
 * this provider so users keep working.
 *
 * Configure via env (any subset — unset capabilities simply throw and are
 * skipped by executeWithFallback):
 *   SELF_VLLM_URL    base of an OpenAI-compatible LLM server
 *                    (Modal: https://...serve.modal.run ; RunPod: https://api.runpod.ai/v2/<id>/openai)
 *   SELF_VLLM_MODEL  served model name (default "rnai-llm")
 *   SELF_SDXL_URL    image server exposing POST /generate { prompt, image? }
 *   SELF_TTS_URL     TTS server exposing POST /tts { text }
 *   SELF_REMBG_URL   (optional) background-removal server
 *   SELF_UPSCALE_URL (optional) upscale server
 *   SELF_API_KEY     (optional) Bearer token sent to all of the above (e.g. RunPod)
 *   SELF_TIMEOUT_MS  per-request timeout (default 120000)
 */

const TIMEOUT_MS = Number(process.env.SELF_TIMEOUT_MS ?? 120_000);

function requireUrl(value: string | undefined, label: string): string {
  if (!value) {
    throw new Error(`Self-hosted backup not configured: set ${label}`);
  }
  return value.replace(/\/+$/, "");
}

function authHeaders(base: Record<string, string> = {}): Record<string, string> {
  const key = process.env.SELF_API_KEY;
  return key ? { ...base, Authorization: `Bearer ${key}` } : base;
}

async function fetchWithTimeout(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } catch (err) {
    const e = err as { name?: string; message?: string };
    if (e?.name === "AbortError") throw new Error(`Self-hosted request timed out after ${TIMEOUT_MS}ms`);
    throw new Error(`Self-hosted network error: ${e?.message ?? "unknown"}`);
  } finally {
    clearTimeout(timer);
  }
}

function dataUriToBuffer(dataUri: string): Buffer {
  const comma = dataUri.indexOf(",");
  const b64 = comma >= 0 ? dataUri.slice(comma + 1) : dataUri;
  return Buffer.from(b64, "base64");
}

/** POST JSON and return binary media, tolerating either raw bytes or { url: dataURI }. */
async function postForMediaBuffer(url: string, payload: unknown): Promise<Buffer> {
  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Self-hosted error ${res.status}: ${(await res.text()).slice(0, 200)}`);

  const ct = res.headers.get("content-type") ?? "";
  if (ct.startsWith("image/") || ct.startsWith("audio/") || ct.includes("octet-stream")) {
    return Buffer.from(await res.arrayBuffer());
  }
  const data = await res.json().catch(() => ({}));
  const url2 = (data as { url?: string; output?: { url?: string } }).url
    ?? (data as { output?: { url?: string } }).output?.url;
  if (typeof url2 === "string" && url2.length > 0) return dataUriToBuffer(url2);
  throw new Error("Self-hosted returned no media");
}

export const SelfHostedProvider: Provider = {
  name: "self-hosted",

  // ── Text (vLLM, OpenAI-compatible) — generate / summarize / translate / rewrite / extract / website ──
  async generateText(prompt: string, systemPrompt?: string) {
    const base = requireUrl(process.env.SELF_VLLM_URL, "SELF_VLLM_URL");
    const messages: { role: string; content: string }[] = [];
    if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
    messages.push({ role: "user", content: prompt });

    const res = await fetchWithTimeout(`${base}/v1/chat/completions`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({
        model: process.env.SELF_VLLM_MODEL ?? "rnai-llm",
        messages,
      }),
    });
    if (!res.ok) throw new Error(`Self-hosted LLM error ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") throw new Error("Self-hosted LLM returned no content");
    return content;
  },

  // ── Images (SDXL) — generate / edit / stylize ──
  async generateImage(prompt: string) {
    const base = requireUrl(process.env.SELF_SDXL_URL, "SELF_SDXL_URL");
    return postForMediaBuffer(`${base}/generate`, { prompt });
  },

  async editImage(image: string, mask: string, prompt: string) {
    const base = requireUrl(process.env.SELF_SDXL_URL, "SELF_SDXL_URL");
    return postForMediaBuffer(`${base}/generate`, { prompt, image, mask });
  },

  async stylizeImage(image: string, prompt: string) {
    const base = requireUrl(process.env.SELF_SDXL_URL, "SELF_SDXL_URL");
    return postForMediaBuffer(`${base}/generate`, { prompt, image });
  },

  async removeBackground(image: string) {
    const base = requireUrl(process.env.SELF_REMBG_URL, "SELF_REMBG_URL");
    return postForMediaBuffer(base, { image });
  },

  async upscaleImage(image: string) {
    const base = requireUrl(process.env.SELF_UPSCALE_URL, "SELF_UPSCALE_URL");
    return postForMediaBuffer(base, { image });
  },

  // ── Audio (Piper / XTTS) ──
  async generateAudio(text: string) {
    const base = requireUrl(process.env.SELF_TTS_URL, "SELF_TTS_URL");
    return postForMediaBuffer(`${base}/tts`, { text });
  },

  // ── Speech-to-text (Whisper / faster-whisper backup) ──
  async transcribeAudio(audioBase64: string) {
    const base = requireUrl(process.env.SELF_STT_URL, "SELF_STT_URL");
    const res = await fetchWithTimeout(`${base}/transcribe`, {
      method: "POST",
      headers: authHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ audio: audioBase64 }),
    });
    if (!res.ok) throw new Error(`Self-hosted STT error ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json().catch(() => ({}));
    const text = (data as { text?: string }).text;
    if (typeof text !== "string") throw new Error("Self-hosted STT returned no text");
    return text;
  },
};

/** Which self-hosted capabilities are configured — used by /api/v1/status. */
export function selfHostedConfig() {
  return {
    llm: !!process.env.SELF_VLLM_URL,
    image: !!process.env.SELF_SDXL_URL,
    tts: !!process.env.SELF_TTS_URL,
    stt: !!process.env.SELF_STT_URL,
    removeBg: !!process.env.SELF_REMBG_URL,
    upscale: !!process.env.SELF_UPSCALE_URL,
  };
}
