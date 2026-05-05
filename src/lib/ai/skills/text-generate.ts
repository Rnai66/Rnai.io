import { executeWithFallback } from "../router";

export async function textGenerateSkill(prompt: string) {
  // Use OpenRouter as primary, Together as fallback
  const providers = ["openrouter", "together"]; 
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateText) throw new Error(`${provider.name} does not support generateText`);
    return provider.generateText(prompt);
  });
}
