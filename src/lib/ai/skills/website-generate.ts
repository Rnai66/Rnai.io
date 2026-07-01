import { executeWithFallback } from "../router";

interface WebsiteGenerationParams {
  websiteName: string;
  websiteType: string;
  template: string;
  description: string;
  language?: string;
  customPrompt?: string;
  referenceImage?: string;
  imageUsage?: "design-reference" | "background" | "logo";
}

export async function websiteGenerateSkill(params: WebsiteGenerationParams) {
  const { websiteName, websiteType, template, description, language = "th", customPrompt, referenceImage, imageUsage = "design-reference" } = params;

  // Validate API keys are configured
  if (!process.env.OPENROUTER_API_KEY && !process.env.TOGETHER_API_KEY) {
    throw new Error(
      "Website generation service is not configured. Please set OPENROUTER_API_KEY or TOGETHER_API_KEY environment variables."
    );
  }

  // Build reference image context if provided
  let imageContext = "";
  if (referenceImage) {
    imageContext = `
**Reference Image:**
Use the provided image as ${
  imageUsage === "design-reference"
    ? "design inspiration (colors, layout, style, typography)"
    : imageUsage === "background"
      ? "the background image for the hero or main section"
      : "the logo or brand image (place it in header)"
}
Image (base64): ${referenceImage.substring(0, 50)}...
`;
  }

  // Combine description with custom prompt
  const fullDescription = customPrompt
    ? `${description}\n\nAdditional Custom Instructions:\n${customPrompt}`
    : description;

  // Build detailed prompt for AI to generate complete HTML website
  const prompt = `
You are a professional web developer. Generate a complete, beautiful, and functional HTML5 website with embedded CSS and JavaScript based on the following requirements:

**Website Details:**
- Name: ${websiteName}
- Type: ${websiteType}
- Template Style: ${template}
- Description: ${fullDescription}
- Language: ${language === 'th' ? 'Thai' : 'English'}
${imageContext}

**Requirements:**
1. Create a complete HTML5 file with embedded CSS (in <style> tag)
2. Include embedded JavaScript (in <script> tag) for interactivity
3. Use modern, responsive design that works on mobile and desktop
4. Use vibrant, bold colors and professional typography
5. Include:
   - Header with navigation
   - Hero/Banner section
   - Features or services section
   - Call-to-action section
   - Footer
6. Make it interactive with smooth animations and hover effects
7. Use semantic HTML
8. Make all text content in ${language === 'th' ? 'Thai language' : 'English'}
9. Include proper meta tags and responsive viewport settings
${referenceImage && imageUsage === "background" ? "10. Integrate the reference image as a background in the hero section\n" : ""}${referenceImage && imageUsage === "logo" ? "10. Include the reference image as the logo in the header\n" : ""}

**Output Format:**
Return ONLY the complete HTML code starting with <!DOCTYPE html> and ending with </html>. No explanations, no markdown, just the pure HTML code.

Begin generating the website now:`;

  // Use OpenRouter/Together for text generation with higher context limits
  const providers = ["openrouter", "together", "self-hosted"];

  try {
    const { result, provider: usedProvider } = await executeWithFallback(providers, async (provider) => {
      if (!provider.generateText) {
        throw new Error(`${provider.name} does not support generateText`);
      }

      const result = await provider.generateText(prompt);

      // Extract HTML from the response (in case it includes extra text)
      const htmlMatch = result.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
      const htmlCode = htmlMatch ? htmlMatch[0] : result;

      return {
        html: htmlCode,
        prompt: prompt
      };
    });

    return {
      result,
      provider: usedProvider
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error(`Website generation failed: ${errorMessage}`);
    throw new Error(`Failed to generate website: ${errorMessage}`);
  }
}
