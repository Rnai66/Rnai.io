import { executeWithFallback } from "../router";

export async function stylizeImageSkill(image: string, prompt: string) {
  const providers = ["huggingface"]; 
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.stylizeImage) throw new Error(`${provider.name} does not support stylizeImage`);
    return provider.stylizeImage(image, prompt);
  });
}
