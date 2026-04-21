import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/auth/validateKey";
import { editImage } from "@/lib/ai/huggingface";

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const keyId = await validateApiKey(auth.slice(7));
  if (!keyId) {
    return NextResponse.json({ error: "Invalid or inactive API key" }, { status: 401 });
  }

  const { image, mask, prompt } = await req.json();
  if (!image || !mask || !prompt) {
    return NextResponse.json(
      { error: "image, mask, and prompt are required" },
      { status: 400 }
    );
  }

  try {
    const buf = await editImage(image, mask, prompt);
    return NextResponse.json({
      image: `data:image/png;base64,${buf.toString("base64")}`,
      format: "png",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "AI error" },
      { status: 500 }
    );
  }
}
