import { executeWithFallback } from "../router";

export async function textRewriteSkill(text: string, tone: string = "professional") {
  const providers = ["openrouter", "together", "self-hosted"]; 
  const systemPrompt = `You are an expert editor. Rewrite the following text to have a ${tone} tone. Improve the flow, grammar, and readability without changing the core meaning.`;
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateText) throw new Error(`${provider.name} does not support generateText`);
    return provider.generateText(text, systemPrompt);
  });
}
