import { executeWithFallback } from "../router";

export async function textGenerateSkill(prompt: string, codeMode = false) {
  // Code requests prefer the self-hosted Rnai LLM (it's tuned for coding),
  // falling back to external providers. General text keeps external first.
  const providers = codeMode
    ? ["self-hosted", "openrouter", "together"]
    : ["openrouter", "together", "self-hosted"];

  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateText) throw new Error(`${provider.name} does not support generateText`);
    return provider.generateText(prompt);
  });
}
