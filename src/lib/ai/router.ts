import { Provider } from "./types";
import { HuggingFaceProvider } from "./providers/huggingface";
import { TogetherProvider } from "./providers/together";
import { OpenRouterProvider } from "./providers/openrouter";
import { SelfHostedProvider } from "./providers/selfhosted";

const providers: Record<string, Provider> = {
  huggingface: HuggingFaceProvider,
  together: TogetherProvider,
  openrouter: OpenRouterProvider,
  // Self-hosted Rnai backup — last resort when external providers are down.
  "self-hosted": SelfHostedProvider,
};

export async function executeWithFallback<T>(
  providerNames: string[],
  action: (provider: Provider) => Promise<T>
): Promise<{ result: T; provider: string }> {
  let lastError: Error | null = null;
  
  for (const name of providerNames) {
    const provider = providers[name];
    if (!provider) continue;
    
    try {
      const result = await action(provider);
      return { result, provider: name };
    } catch (err: any) {
      console.error(`Provider ${name} failed:`, err.message);
      lastError = err;
      // Fallback to next provider in the array
    }
  }
  
  throw lastError || new Error("All providers failed");
}
