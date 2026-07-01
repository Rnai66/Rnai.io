import { executeWithFallback } from "../router";

export async function generateImageSkill(prompt: string) {
  // Ordered array defines priority: Primary is huggingface, fallback will be added later
  const providers = ["huggingface", "self-hosted"]; 
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateImage) throw new Error(`${provider.name} does not support generateImage`);
    return provider.generateImage(prompt);
  });
}
