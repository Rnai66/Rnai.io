import { executeWithFallback } from "../router";

export async function textSummarizeSkill(text: string) {
  const providers = ["openrouter", "together"]; 
  const systemPrompt = "You are a professional summarizer. Provide a concise, clear, and accurate summary of the following text.";
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateText) throw new Error(`${provider.name} does not support generateText`);
    return provider.generateText(text, systemPrompt);
  });
}
