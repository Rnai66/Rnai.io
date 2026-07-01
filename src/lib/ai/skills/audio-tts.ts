import { executeWithFallback } from "../router";

export async function audioTTSSkill(text: string) {
  // Primary: huggingface (free/reliable)
  const providers = ["huggingface", "self-hosted"]; 
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateAudio) throw new Error(`${provider.name} does not support generateAudio`);
    return provider.generateAudio(text);
  });
}
