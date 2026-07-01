import { executeWithFallback } from "../router";

export async function textExtractSkill(text: string, schema: string) {
  const providers = ["openrouter", "together", "self-hosted"]; 
  const systemPrompt = `You are a data extraction bot. Extract information from the given text matching the following schema/instructions: ${schema}. Output ONLY valid JSON.`;
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateText) throw new Error(`${provider.name} does not support generateText`);
    return provider.generateText(text, systemPrompt);
  });
}
