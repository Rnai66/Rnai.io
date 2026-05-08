import { executeWithFallback } from "../router";

interface WebsiteGenerationParams {
  websiteName: string;
  websiteType: string;
  template: string;
  description: string;
  language?: string;
}

export async function websiteGenerateSkill(params: WebsiteGenerationParams) {
  const { websiteName, websiteType, template, description, language = "th" } = params;

  // Build detailed prompt for AI to generate complete HTML website
  const prompt = `
You are a professional web developer. Generate a complete, beautiful, and functional HTML5 website with embedded CSS and JavaScript based on the following requirements:

**Website Details:**
- Name: ${websiteName}
- Type: ${websiteType}
- Template Style: ${template}
- Description: ${description}
- Language: ${language === 'th' ? 'Thai' : 'English'}

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

**Output Format:**
Return ONLY the complete HTML code starting with <!DOCTYPE html> and ending with </html>. No explanations, no markdown, just the pure HTML code.

Begin generating the website now:`;

  // Use OpenRouter/Together for text generation with higher context limits
  const providers = ["openrouter", "together"];

  return executeWithFallback(providers, async (provider) => {
    if (!provider.generateText) throw new Error(`${provider.name} does not support generateText`);

    const result = await provider.generateText(prompt);

    // Extract HTML from the response (in case it includes extra text)
    const htmlMatch = result.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    const htmlCode = htmlMatch ? htmlMatch[0] : result;

    return {
      html: htmlCode,
      prompt: prompt
    };
  });
}
