import { executeWithFallback } from "../router";

export async function removeBackgroundSkill(image: string) {
  const providers = ["huggingface", "self-hosted"]; 
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.removeBackground) throw new Error(`${provider.name} does not support removeBackground`);
    return provider.removeBackground(image);
  });
}
