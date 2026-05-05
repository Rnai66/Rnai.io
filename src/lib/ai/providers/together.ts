import { Provider } from "../types";

export const TogetherProvider: Provider = {
  name: "together",

  async generateText(prompt: string, systemPrompt?: string) {
    const messages = [];
    if (systemPrompt) {
      messages.push({ role: "system", content: systemPrompt });
    }
    messages.push({ role: "user", content: prompt });

    const res = await fetch("https://api.together.xyz/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3-8b-chat-hf",
        messages,
      }),
    });

    if (!res.ok) throw new Error(`Together error: ${await res.text()}`);
    const data = await res.json();
    return data.choices[0].message.content;
  },

  async transcribeAudio(audioBase64: string) {
    const audioData = Buffer.from(audioBase64.replace(/^data:audio\/\w+;base64,/, ""), "base64");
    const blob = new Blob([audioData], { type: "audio/wav" });
    
    const formData = new FormData();
    formData.append("file", blob, "audio.wav");
    formData.append("model", "whisper-large-v3");

    const res = await fetch("https://api.together.xyz/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error(`Together STT error: ${await res.text()}`);
    const data = await res.json();
    return data.text;
  }
};
