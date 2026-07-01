import { executeWithFallback } from "../router";

export async function editImageSkill(image: string, mask: string, prompt: string) {
  const providers = ["huggingface", "self-hosted"]; 
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.editImage) throw new Error(`${provider.name} does not support editImage`);
    return provider.editImage(image, mask, prompt);
  });
}
