import { executeWithFallback } from "../router";

export async function audioSTTSkill(audioBase64: string) {
  // Primary: together (Whisper v3); self-hosted Whisper backup last.
  const providers = ["together", "self-hosted"];
  
  return executeWithFallback(providers, async (provider) => {
    if (!provider.transcribeAudio) throw new Error(`${provider.name} does not support transcribeAudio`);
    return provider.transcribeAudio(audioBase64);
  });
}
