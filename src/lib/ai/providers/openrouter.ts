import { Provider } from "../types";

export const OpenRouterProvider: Provider = {
  name: "openrouter",

  async generateText(prompt: string, systemPrompt?: string) {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "Rnai Platform",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages,
      }),
    });

    if (!res.ok) throw new Error(`OpenRouter error: ${await res.text()}`);
    const data = await res.json();
    return data.choices[0].message.content;
  }
};
