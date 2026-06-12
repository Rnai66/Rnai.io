/**
 * Skill prompt templates — shared design language with the Rnai.io mobile app
 * (ported from rnai-mobile app/data/skillTemplates.ts so web & app feel identical).
 *
 * `fills` tells the playground which field the template populates.
 */

export type TemplateFill = "prompt" | "text" | "description";

export interface SkillTemplate {
  id: string;
  label: string;   // short chip label with emoji (same as mobile)
  prompt: string;  // full text pre-filled into the input
  caption: string; // short description of the expected result
}

export const SKILL_TEMPLATE_FILL: Record<string, TemplateFill> = {
  "image/generate": "prompt",
  "image/edit": "prompt",
  "image/remove-background": "prompt",
  "image/upscale": "prompt",
  "image/stylize": "prompt",
  "text/generate": "prompt",
  "text/summarize": "text",
  "text/translate": "text",
  "text/rewrite": "text",
  "audio/tts": "text",
  "website/generate": "description",
};

export const SKILL_TEMPLATES: Record<string, SkillTemplate[]> = {
  "image/generate": [
    { id: "ig-1", label: "🐉 Fantasy Dragon", caption: "Epic fantasy landscape with dramatic lighting", prompt: "A majestic dragon soaring over snow-capped mountains at dawn, epic fantasy art, dramatic lighting, 4K ultra detailed" },
    { id: "ig-2", label: "🏙️ Cyberpunk City", caption: "Neon-lit futuristic cityscape at night", prompt: "Cyberpunk city street at night with neon lights reflecting in rain puddles, flying cars, futuristic billboards, cinematic" },
    { id: "ig-3", label: "🌸 Anime Style", caption: "Soft anime-style cherry blossom scene", prompt: "A young girl sitting under cherry blossom trees, Studio Ghibli anime art style, soft warm colors, magical atmosphere" },
    { id: "ig-4", label: "☕ Minimal Logo", caption: "Clean minimalist coffee shop branding", prompt: "Minimalist logo design for a modern coffee shop, clean vector art, black and gold color scheme, professional branding" },
    { id: "ig-5", label: "🌊 Abstract Art", caption: "Vibrant abstract fluid artwork", prompt: "Abstract fluid art with deep purple and gold swirls, macro photography style, luxurious and ethereal, high contrast" },
  ],
  "image/edit": [
    { id: "ie-1", label: "🌅 Sunset Glow", caption: "Warm golden hour color grading", prompt: "Apply a warm golden sunset lighting to the entire scene, add lens flare, make the colors rich and cinematic" },
    { id: "ie-2", label: "🏖️ Beach Background", caption: "Natural-looking beach background swap", prompt: "Replace the background with a tropical beach at sunset, crystal clear turquoise water, soft sand, seamless blend" },
    { id: "ie-3", label: "🌙 Night Scene", caption: "Dramatic nighttime transformation", prompt: "Transform the scene to nighttime, add city lights in the background, moody blue atmosphere, stars in the sky" },
    { id: "ie-4", label: "🍂 Autumn Colors", caption: "Beautiful autumn season transformation", prompt: "Change the season to autumn, add warm orange and red leaves, misty morning atmosphere, cozy fall feeling" },
    { id: "ie-5", label: "📸 Studio Look", caption: "Professional studio photography style", prompt: "Make it look like a professional studio photograph, clean white background, soft box lighting, sharp focus, commercial quality" },
  ],
  "image/remove-background": [
    { id: "rb-1", label: "🛍️ Product Photo", caption: "Clean product cutout for online store", prompt: "Remove background completely for clean product photography, perfect transparent edges, ready for e-commerce" },
    { id: "rb-2", label: "🪪 ID Photo", caption: "Perfect portrait background removal", prompt: "Remove background for passport or ID photo, maintain natural hair edges, clean professional result" },
    { id: "rb-3", label: "🎨 Sticker Art", caption: "Transparent sticker-ready cutout", prompt: "Remove background to create a transparent sticker-ready image with clean edges and no artifacts" },
    { id: "rb-4", label: "👔 LinkedIn Photo", caption: "Professional headshot background removal", prompt: "Remove background for professional headshot, replace with clean white or light gradient, business profile ready" },
    { id: "rb-5", label: "🌿 Nature Object", caption: "Detailed natural object isolation", prompt: "Remove background from a natural object like a flower or leaf, preserve fine details and textures" },
  ],
  "image/upscale": [
    { id: "up-1", label: "🖼️ 4K Enhance", caption: "Crisp 4K upscaled landscape", prompt: "Upscale to 4K resolution, enhance sharpness and detail, improve clarity without artifacts" },
    { id: "up-2", label: "👴 Old Photo Restore", caption: "Restored vintage photo clarity", prompt: "Restore old blurry photograph to HD quality, remove grain and noise, sharpen facial features" },
    { id: "up-3", label: "🌃 Night Photo", caption: "Enhanced low-light night photograph", prompt: "Enhance low-light night photo, reduce noise, upscale resolution, bring out hidden details in shadows" },
    { id: "up-4", label: "🖨️ Print Quality", caption: "Print-quality image upscaling", prompt: "Upscale small social media image to print-ready quality, 300 DPI equivalent, sharp and detailed" },
    { id: "up-5", label: "😊 Portrait HD", caption: "High-definition portrait enhancement", prompt: "Upscale portrait photo, enhance skin texture naturally, sharpen eyes and hair detail, professional quality" },
  ],
  "image/stylize": [
    { id: "st-1", label: "🎌 Ghibli Style", caption: "Magical Studio Ghibli art transformation", prompt: "Transform into Studio Ghibli anime art style, soft warm colors, hand-painted feel, magical and dreamlike atmosphere" },
    { id: "st-2", label: "🖌️ Oil Painting", caption: "Classic oil painting transformation", prompt: "Convert to classic oil painting style, rich textures, brushstroke details, Old Masters technique, museum quality" },
    { id: "st-3", label: "🎨 Watercolor", caption: "Soft watercolor illustration style", prompt: "Apply soft watercolor illustration style, gentle color bleeds, paper texture visible, artistic and delicate" },
    { id: "st-4", label: "📷 Film Vintage", caption: "Authentic vintage film photograph", prompt: "Make it look like an authentic vintage 35mm film photograph, film grain, muted tones, light leaks, nostalgic 1970s feel" },
    { id: "st-5", label: "🌆 Cyberpunk", caption: "Neon cyberpunk stylized artwork", prompt: "Apply cyberpunk neon art style, electric blue and magenta colors, glitch effects, futuristic dystopian atmosphere" },
  ],
  "text/generate": [
    { id: "tg-1", label: "💼 LinkedIn Post", caption: "Professional LinkedIn post with insights and engagement hook", prompt: "Write a professional and engaging LinkedIn post about the impact of AI on the creative industry in 2025, include 3 key insights and end with a question to spark discussion" },
    { id: "tg-2", label: "🛒 Product Copy", caption: "Persuasive e-commerce product description", prompt: "Write a compelling product description for a premium wireless noise-canceling headphone. Highlight: 40-hour battery, studio-quality sound, foldable design. Target audience: remote workers and music lovers." },
    { id: "tg-3", label: "📖 Short Story", caption: "Heartwarming 200-word short story", prompt: "Write a captivating 200-word short story about a robot who discovers music for the first time and begins to feel emotions. Make it heartwarming and thought-provoking." },
    { id: "tg-4", label: "🚀 App Taglines", caption: "5 unique, punchy taglines for a mobile app", prompt: "Generate 5 creative and memorable taglines for a mobile AI image generation app called \"Rnai\". The app lets anyone create stunning visuals instantly. Make each tagline unique and punchy." },
    { id: "tg-5", label: "✉️ Business Email", caption: "Professional investor outreach email", prompt: "Write a formal email to request a 30-minute meeting with a potential investor at a tech conference. Express genuine interest in their portfolio, briefly introduce the company Rnai.io, and propose 3 available time slots." },
  ],
  "text/summarize": [
    { id: "ts-1", label: "📰 3 Bullet Points", caption: "3 focused bullet points capturing main ideas", prompt: "Summarize the following text into exactly 3 clear and concise bullet points. Focus on the most important facts and key takeaways. Start each point with an action verb.\n\n[Paste your text here]" },
    { id: "ts-2", label: "⚡ TL;DR", caption: "Ultra-short 2-3 sentence summary", prompt: "Create a TL;DR (Too Long; Didn't Read) summary of the following text in 2-3 sentences maximum. Make it punchy and capture the absolute essence.\n\n[Paste your text here]" },
    { id: "ts-3", label: "📊 Executive Summary", caption: "Business-ready executive summary paragraph", prompt: "Write a one-paragraph executive summary of the following content. Suitable for a business audience. Include: main purpose, key findings, and recommended action.\n\n[Paste your text here]" },
    { id: "ts-4", label: "✅ Action Items", caption: "Numbered checklist of action items and owners", prompt: "Extract all action items and next steps from the following meeting notes or document. Format as a numbered checklist with owner names if mentioned and deadlines if specified.\n\n[Paste your text here]" },
    { id: "ts-5", label: "🔑 Key Insights", caption: "5 key insights with explanation of impact", prompt: "Identify and explain the 5 most important insights from the following research or article. For each insight, explain WHY it matters in one sentence.\n\n[Paste your text here]" },
  ],
  "text/translate": [
    { id: "tt-1", label: "🇹🇭 → 🇺🇸 Thai to English", caption: "Natural English translation with cultural context", prompt: "Translate the following Thai text to English. Maintain natural phrasing and professional tone. If there are cultural references, add a brief explanation in brackets.\n\n[วางข้อความภาษาไทยที่นี่]" },
    { id: "tt-2", label: "🇺🇸 → 🇹🇭 English to Thai", caption: "Natural-sounding Thai translation", prompt: "Translate the following English text to Thai. Use natural Thai phrasing that sounds like it was written by a native speaker, not a literal translation.\n\n[Paste English text here]" },
    { id: "tt-3", label: "🇯🇵 Japanese", caption: "Proper Japanese with correct formality level", prompt: "Translate the following text to Japanese (日本語). Use appropriate formality level (です/ます form for business, casual for informal). Include furigana for complex kanji.\n\n[Paste text here]" },
    { id: "tt-4", label: "🇨🇳 Chinese", caption: "Idiomatic Simplified Chinese translation", prompt: "Translate the following text to Simplified Chinese (简体中文). Ensure idiomatic Chinese expressions are used rather than direct translations.\n\n[Paste text here]" },
    { id: "tt-5", label: "🇪🇸 Spanish", caption: "Engaging Latin American Spanish marketing copy", prompt: "Translate the following marketing text to Latin American Spanish. Use modern, engaging language that resonates with a young adult audience. Keep brand voice consistent.\n\n[Paste text here]" },
  ],
  "text/rewrite": [
    { id: "tr-1", label: "💼 More Professional", caption: "Polished, business-ready professional version", prompt: "Rewrite the following text in a more professional and formal tone. Eliminate casual language, improve vocabulary, and ensure it sounds polished for a business setting.\n\n[Paste your text here]" },
    { id: "tr-2", label: "😊 More Friendly", caption: "Warm, conversational rewrite", prompt: "Rewrite the following text to be warmer, more conversational and approachable. Keep the information but make it feel like a friendly conversation, not a formal document.\n\n[Paste your text here]" },
    { id: "tr-3", label: "✂️ Shorter (50%)", caption: "Concise rewrite with 50% fewer words", prompt: "Rewrite the following text to be at least 50% shorter. Remove redundancy, combine sentences, and keep only the essential information. Every word must earn its place.\n\n[Paste your text here]" },
    { id: "tr-4", label: "🎯 SEO Optimized", caption: "SEO-friendly version with keywords", prompt: "Rewrite the following text to be SEO-optimized. Add relevant keywords naturally, improve readability with short paragraphs, include a compelling intro and CTA at the end.\n\n[Paste your text here]" },
    { id: "tr-5", label: "🚀 Marketing Style", caption: "High-energy marketing copy that drives action", prompt: "Rewrite the following text in an exciting, persuasive marketing style. Use power words, create urgency, highlight benefits not features, and inspire the reader to take action.\n\n[Paste your text here]" },
  ],
  "audio/tts": [
    { id: "at-1", label: "📢 App Welcome", caption: "Warm welcome message for app onboarding (~8 sec)", prompt: "Welcome to Rnai! Your AI-powered creative assistant is ready to help you generate stunning images, write compelling content, and build beautiful websites — all with a single tap." },
    { id: "at-2", label: "📦 Order Update", caption: "Clear e-commerce order confirmation (~7 sec)", prompt: "Great news! Your order number 12345 has been confirmed and is now being prepared. Estimated delivery is within 3 to 5 business days. You will receive a tracking link via email shortly." },
    { id: "at-3", label: "📖 Story Narration", caption: "Engaging audiobook-style narration (~12 sec)", prompt: "Chapter One: In a world where technology and nature coexisted in perfect harmony, there lived a young inventor named Aria. Every morning, she would climb to the top of her glass workshop and watch the solar drones tend to the ancient forest below." },
    { id: "at-4", label: "📣 Ad Voiceover", caption: "High-energy 15-second advertisement voiceover", prompt: "Stop wasting time. Start creating. With Rnai, turn any idea into a stunning image in seconds. No design skills needed. No limits. Just your imagination. Try Rnai free today." },
    { id: "at-5", label: "🎓 Course Intro", caption: "Professional e-learning course introduction (~10 sec)", prompt: "Welcome to Advanced AI Design Fundamentals. In this course, you will learn how to harness the power of artificial intelligence to create professional-grade visuals, automate your workflow, and stay ahead in the rapidly evolving creative industry." },
  ],
  "website/generate": [
    { id: "wg-1", label: "🎨 Designer Portfolio", caption: "Dark-themed designer portfolio with modern UI", prompt: "Modern dark-theme portfolio website for a UX/UI designer. Sections: Hero with animated tagline, About, Skills (with progress bars), Featured Projects (3 case studies), and Contact form. Use purple and cyan accent colors." },
    { id: "wg-2", label: "🍽️ Restaurant Page", caption: "Elegant restaurant website with reservation system", prompt: "Elegant restaurant landing page for an Italian fine dining restaurant called \"La Cucina\". Include: hero with food photography, featured menu section, chef story, reservation form, and Google Maps embed. Warm earthy tones." },
    { id: "wg-3", label: "💻 SaaS Landing", caption: "Conversion-optimized SaaS product landing page", prompt: "High-converting SaaS landing page for an AI writing tool. Include: hero with product demo GIF, 3 key features, social proof (testimonials + logos), pricing table (3 tiers), FAQ, and signup CTA. Clean white and blue design." },
    { id: "wg-4", label: "📸 Photo Blog", caption: "Beautiful travel photography blog with gallery", prompt: "Personal photography blog for a travel photographer. Masonry grid photo gallery, travel stories blog section, destination map, Instagram feed widget, and newsletter signup. Light airy aesthetic with serif fonts." },
    { id: "wg-5", label: "🛍️ Product Store", caption: "Elegant product page with reviews and gallery", prompt: "E-commerce product page for handmade artisan ceramic jewelry. Product image gallery, size/color selector, customer reviews (4.8 stars), related products, and secure checkout section. Minimalist warm beige theme." },
  ],
};

/** Quick target-language chips for translate — same list as the mobile app. */
export const TARGET_LANGUAGES = [
  { flag: "🇹🇭", value: "Thai" },
  { flag: "🇺🇸", value: "English" },
  { flag: "🇯🇵", value: "Japanese" },
  { flag: "🇨🇳", value: "Chinese" },
  { flag: "🇰🇷", value: "Korean" },
  { flag: "🇫🇷", value: "French" },
  { flag: "🇩🇪", value: "German" },
  { flag: "🇪🇸", value: "Spanish" },
];
