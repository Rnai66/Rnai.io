import { executeWithFallback } from "../router";

export async function textTranslateSkill(text: string, targetLanguage: string) {
  const providers = ["openrouter", "together", "self-hosted"]; 
  const systemPrompt = `You are a professional translator. Translate the following text into ${targetLanguage}. Return only the translation, no extra context.`;
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateText) throw new Error(`${provider.name} does not support generateText`);
    return provider.generateText(text, systemPrompt);
  });
}
