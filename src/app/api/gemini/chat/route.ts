import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/firebase/verifyToken";
import { requiredString, validateJson } from "@/lib/api/validation";
import { ratelimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("__session")?.value;
    const uid = await verifyToken(req.headers.get("authorization"), sessionCookie);
    if (!uid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success } = await ratelimit.limit(`gemini:${uid}`);
    if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

    const parsed = await validateJson<{ message: string }>(req, {
      message: requiredString({ min: 1, max: 12000 }),
    });
    if (parsed.response) return parsed.response;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 503 });
    }

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: parsed.data.message }],
          },
        ],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Gemini chat error:", text);
      return NextResponse.json({ error: "Gemini chat failed" }, { status: 502 });
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part: { text?: string }) => part.text || "")
      .join("")
      .trim();

    return NextResponse.json({
      text: text || "No response returned.",
      model: "gemini-2.5-flash",
      free: true,
    });
  } catch (error) {
    console.error("API /gemini/chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
