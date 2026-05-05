import { executeWithFallback } from "../router";

export async function upscaleImageSkill(image: string) {
  const providers = ["huggingface"]; 
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.upscaleImage) throw new Error(`${provider.name} does not support upscaleImage`);
    return provider.upscaleImage(image);
  });
}
