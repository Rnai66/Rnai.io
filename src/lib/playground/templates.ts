/**
 * Skill prompt templates — shared design language with the Rnai.io mobile app
 * (mirrors rnai-mobile app/data/skillTemplates.ts so web & app feel identical).
 *
 * `fills` tells the playground which field the template populates.
 * `th` holds Thai localization; image-skill prompts stay English because
 * image models produce better results from English prompts.
 */

export type TemplateFill = "prompt" | "text" | "description";

export interface SkillTemplate {
  id: string;
  label: string;   // short chip label with emoji (same as mobile)
  prompt: string;  // full text pre-filled into the input
  caption: string; // short description of the expected result
  th?: { label: string; prompt?: string; caption: string };
}

/** Return a template localized for the given language. */
export function localizeTemplate(tmpl: SkillTemplate, language: string): SkillTemplate {
  if (language === "th" && tmpl.th) {
    return {
      ...tmpl,
      label: tmpl.th.label,
      prompt: tmpl.th.prompt ?? tmpl.prompt,
      caption: tmpl.th.caption,
    };
  }
  return tmpl;
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
    { id: "ig-1", label: "🐉 Fantasy Dragon", caption: "Epic fantasy landscape with dramatic lighting", prompt: "A majestic dragon soaring over snow-capped mountains at dawn, epic fantasy art, dramatic lighting, 4K ultra detailed", th: { label: "🐉 มังกรแฟนตาซี", caption: "ภาพแฟนตาซีอลังการ แสงเงาดราม่าติก" } },
    { id: "ig-2", label: "🏙️ Cyberpunk City", caption: "Neon-lit futuristic cityscape at night", prompt: "Cyberpunk city street at night with neon lights reflecting in rain puddles, flying cars, futuristic billboards, cinematic", th: { label: "🏙️ เมืองไซเบอร์พังก์", caption: "เมืองอนาคตแสงนีออนยามค่ำคืน" } },
    { id: "ig-3", label: "🌸 Anime Style", caption: "Soft anime-style cherry blossom scene", prompt: "A young girl sitting under cherry blossom trees, Studio Ghibli anime art style, soft warm colors, magical atmosphere", th: { label: "🌸 สไตล์อนิเมะ", caption: "ฉากซากุระโทนอนิเมะละมุนตา" } },
    { id: "ig-4", label: "☕ Minimal Logo", caption: "Clean minimalist coffee shop branding", prompt: "Minimalist logo design for a modern coffee shop, clean vector art, black and gold color scheme, professional branding", th: { label: "☕ โลโก้มินิมอล", caption: "แบรนด์ร้านกาแฟสไตล์มินิมอลสะอาดตา" } },
    { id: "ig-5", label: "🌊 Abstract Art", caption: "Vibrant abstract fluid artwork", prompt: "Abstract fluid art with deep purple and gold swirls, macro photography style, luxurious and ethereal, high contrast", th: { label: "🌊 ศิลปะนามธรรม", caption: "งานศิลป์ของไหลสีม่วงทองหรูหรา" } },
  ],
  "image/edit": [
    { id: "ie-1", label: "🌅 Sunset Glow", caption: "Warm golden hour color grading", prompt: "Apply a warm golden sunset lighting to the entire scene, add lens flare, make the colors rich and cinematic", th: { label: "🌅 แสงอาทิตย์ตก", caption: "เกรดสีโทนทองอบอุ่นแบบ golden hour" } },
    { id: "ie-2", label: "🏖️ Beach Background", caption: "Natural-looking beach background swap", prompt: "Replace the background with a tropical beach at sunset, crystal clear turquoise water, soft sand, seamless blend", th: { label: "🏖️ พื้นหลังชายหาด", caption: "เปลี่ยนพื้นหลังเป็นชายหาดแบบเนียนธรรมชาติ" } },
    { id: "ie-3", label: "🌙 Night Scene", caption: "Dramatic nighttime transformation", prompt: "Transform the scene to nighttime, add city lights in the background, moody blue atmosphere, stars in the sky", th: { label: "🌙 ฉากกลางคืน", caption: "แปลงฉากเป็นกลางคืนสุดดราม่าติก" } },
    { id: "ie-4", label: "🍂 Autumn Colors", caption: "Beautiful autumn season transformation", prompt: "Change the season to autumn, add warm orange and red leaves, misty morning atmosphere, cozy fall feeling", th: { label: "🍂 โทนใบไม้ร่วง", caption: "เปลี่ยนฤดูเป็นใบไม้ร่วงสวยอบอุ่น" } },
    { id: "ie-5", label: "📸 Studio Look", caption: "Professional studio photography style", prompt: "Make it look like a professional studio photograph, clean white background, soft box lighting, sharp focus, commercial quality", th: { label: "📸 ลุคสตูดิโอ", caption: "สไตล์ภาพถ่ายสตูดิโอระดับมืออาชีพ" } },
  ],
  "image/remove-background": [
    { id: "rb-1", label: "🛍️ Product Photo", caption: "Clean product cutout for online store", prompt: "Remove background completely for clean product photography, perfect transparent edges, ready for e-commerce", th: { label: "🛍️ รูปสินค้า", caption: "ไดคัทสินค้าสะอาดพร้อมลงร้านออนไลน์" } },
    { id: "rb-2", label: "🪪 ID Photo", caption: "Perfect portrait background removal", prompt: "Remove background for passport or ID photo, maintain natural hair edges, clean professional result", th: { label: "🪪 รูปติดบัตร", caption: "ลบพื้นหลังรูปบุคคลเก็บขอบผมเนียน" } },
    { id: "rb-3", label: "🎨 Sticker Art", caption: "Transparent sticker-ready cutout", prompt: "Remove background to create a transparent sticker-ready image with clean edges and no artifacts", th: { label: "🎨 สติกเกอร์", caption: "ไดคัทพื้นใสพร้อมทำสติกเกอร์" } },
    { id: "rb-4", label: "👔 LinkedIn Photo", caption: "Professional headshot background removal", prompt: "Remove background for professional headshot, replace with clean white or light gradient, business profile ready", th: { label: "👔 รูปโปรไฟล์งาน", caption: "รูปโปรไฟล์ธุรกิจพื้นหลังขาวสะอาด" } },
    { id: "rb-5", label: "🌿 Nature Object", caption: "Detailed natural object isolation", prompt: "Remove background from a natural object like a flower or leaf, preserve fine details and textures", th: { label: "🌿 วัตถุธรรมชาติ", caption: "แยกวัตถุธรรมชาติเก็บรายละเอียดครบ" } },
  ],
  "image/upscale": [
    { id: "up-1", label: "🖼️ 4K Enhance", caption: "Crisp 4K upscaled landscape", prompt: "Upscale to 4K resolution, enhance sharpness and detail, improve clarity without artifacts", th: { label: "🖼️ ขยายเป็น 4K", caption: "ขยายภาพคมชัดระดับ 4K" } },
    { id: "up-2", label: "👴 Old Photo Restore", caption: "Restored vintage photo clarity", prompt: "Restore old blurry photograph to HD quality, remove grain and noise, sharpen facial features", th: { label: "👴 ฟื้นฟูรูปเก่า", caption: "กู้รูปเก่าเบลอให้กลับมาคมชัด" } },
    { id: "up-3", label: "🌃 Night Photo", caption: "Enhanced low-light night photograph", prompt: "Enhance low-light night photo, reduce noise, upscale resolution, bring out hidden details in shadows", th: { label: "🌃 รูปกลางคืน", caption: "ฟื้นรายละเอียดภาพถ่ายแสงน้อย" } },
    { id: "up-4", label: "🖨️ Print Quality", caption: "Print-quality image upscaling", prompt: "Upscale small social media image to print-ready quality, 300 DPI equivalent, sharp and detailed", th: { label: "🖨️ คุณภาพงานพิมพ์", caption: "ขยายภาพให้พร้อมพิมพ์คมชัด" } },
    { id: "up-5", label: "😊 Portrait HD", caption: "High-definition portrait enhancement", prompt: "Upscale portrait photo, enhance skin texture naturally, sharpen eyes and hair detail, professional quality", th: { label: "😊 พอร์ตเทรต HD", caption: "ขยายรูปบุคคลผิวเนียนตาคมธรรมชาติ" } },
  ],
  "image/stylize": [
    { id: "st-1", label: "🎌 Ghibli Style", caption: "Magical Studio Ghibli art transformation", prompt: "Transform into Studio Ghibli anime art style, soft warm colors, hand-painted feel, magical and dreamlike atmosphere", th: { label: "🎌 สไตล์จิบลิ", caption: "แปลงภาพเป็นอาร์ตอนิเมะจิบลิสุดละมุน" } },
    { id: "st-2", label: "🖌️ Oil Painting", caption: "Classic oil painting transformation", prompt: "Convert to classic oil painting style, rich textures, brushstroke details, Old Masters technique, museum quality", th: { label: "🖌️ ภาพสีน้ำมัน", caption: "แปลงเป็นภาพวาดสีน้ำมันคลาสสิก" } },
    { id: "st-3", label: "🎨 Watercolor", caption: "Soft watercolor illustration style", prompt: "Apply soft watercolor illustration style, gentle color bleeds, paper texture visible, artistic and delicate", th: { label: "🎨 สีน้ำ", caption: "สไตล์ภาพวาดสีน้ำอ่อนโยนมีศิลปะ" } },
    { id: "st-4", label: "📷 Film Vintage", caption: "Authentic vintage film photograph", prompt: "Make it look like an authentic vintage 35mm film photograph, film grain, muted tones, light leaks, nostalgic 1970s feel", th: { label: "📷 ฟิล์มวินเทจ", caption: "ภาพถ่ายฟิล์ม 35mm ย้อนยุคขนานแท้" } },
    { id: "st-5", label: "🌆 Cyberpunk", caption: "Neon cyberpunk stylized artwork", prompt: "Apply cyberpunk neon art style, electric blue and magenta colors, glitch effects, futuristic dystopian atmosphere", th: { label: "🌆 ไซเบอร์พังก์", caption: "อาร์ตนีออนไซเบอร์พังก์สุดล้ำ" } },
  ],
  "text/generate": [
    { id: "tg-1", label: "💼 LinkedIn Post", caption: "Professional LinkedIn post with insights and engagement hook", prompt: "Write a professional and engaging LinkedIn post about the impact of AI on the creative industry in 2025, include 3 key insights and end with a question to spark discussion", th: { label: "💼 โพสต์ LinkedIn", prompt: "เขียนโพสต์ LinkedIn ภาษาไทยแบบมืออาชีพและน่าติดตาม เกี่ยวกับผลกระทบของ AI ต่อวงการครีเอทีฟในปี 2025 ใส่ข้อคิดสำคัญ 3 ข้อ และจบด้วยคำถามชวนคิดเพื่อกระตุ้นการแสดงความเห็น", caption: "📝 โพสต์ LinkedIn มืออาชีพ พร้อมข้อคิดและประโยคชวนคุย" } },
    { id: "tg-2", label: "🛒 Product Copy", caption: "Persuasive e-commerce product description", prompt: "Write a compelling product description for a premium wireless noise-canceling headphone. Highlight: 40-hour battery, studio-quality sound, foldable design. Target audience: remote workers and music lovers.", th: { label: "🛒 ก็อปปี้ขายสินค้า", prompt: "เขียนคำอธิบายสินค้าภาษาไทยที่ชวนซื้อ สำหรับหูฟังไร้สายตัดเสียงรบกวนระดับพรีเมียม จุดเด่น: แบตเตอรี่ 40 ชั่วโมง เสียงระดับสตูดิโอ พับเก็บได้ กลุ่มเป้าหมาย: คนทำงานทางไกลและคนรักเสียงเพลง", caption: "📝 คำอธิบายสินค้าโน้มน้าวใจ ครบฟีเจอร์และประโยชน์" } },
    { id: "tg-3", label: "📖 Short Story", caption: "Heartwarming 200-word short story", prompt: "Write a captivating 200-word short story about a robot who discovers music for the first time and begins to feel emotions. Make it heartwarming and thought-provoking.", th: { label: "📖 เรื่องสั้น", prompt: "เขียนเรื่องสั้นภาษาไทยความยาวประมาณ 200 คำ เกี่ยวกับหุ่นยนต์ที่ค้นพบเสียงดนตรีเป็นครั้งแรกแล้วเริ่มรู้สึกถึงอารมณ์ ให้อบอุ่นหัวใจและชวนขบคิด", caption: "📝 เรื่องสั้นอบอุ่นหัวใจ 200 คำ มีพัฒนาการทางอารมณ์" } },
    { id: "tg-4", label: "🚀 App Taglines", caption: "5 unique, punchy taglines for a mobile app", prompt: "Generate 5 creative and memorable taglines for a mobile AI image generation app called \"Rnai\". The app lets anyone create stunning visuals instantly. Make each tagline unique and punchy.", th: { label: "🚀 สโลแกนแอป", prompt: "คิดสโลแกนภาษาไทย 5 แบบที่สร้างสรรค์และจำง่าย สำหรับแอปสร้างภาพด้วย AI ชื่อ \"Rnai\" ที่ให้ทุกคนสร้างภาพสวยๆ ได้ในพริบตา แต่ละสโลแกนต้องไม่ซ้ำกันและกระชับโดนใจ", caption: "📝 สโลแกน 5 แบบ สั้น กระชับ จำง่าย" } },
    { id: "tg-5", label: "✉️ Business Email", caption: "Professional investor outreach email", prompt: "Write a formal email to request a 30-minute meeting with a potential investor at a tech conference. Express genuine interest in their portfolio, briefly introduce the company Rnai.io, and propose 3 available time slots.", th: { label: "✉️ อีเมลธุรกิจ", prompt: "เขียนอีเมลภาษาไทยแบบทางการ เพื่อขอนัดประชุม 30 นาทีกับนักลงทุนที่งานสัมมนาเทคโนโลยี แสดงความสนใจในพอร์ตการลงทุนของเขาอย่างจริงใจ แนะนำบริษัท Rnai.io สั้นๆ และเสนอช่วงเวลานัด 3 ตัวเลือก", caption: "📝 อีเมลติดต่อนักลงทุนแบบมืออาชีพ พร้อมข้อเสนอชัดเจน" } },
  ],
  "text/summarize": [
    { id: "ts-1", label: "📰 3 Bullet Points", caption: "3 focused bullet points capturing main ideas", prompt: "Summarize the following text into exactly 3 clear and concise bullet points. Focus on the most important facts and key takeaways. Start each point with an action verb.\n\n[Paste your text here]", th: { label: "📰 สรุป 3 ข้อ", prompt: "สรุปข้อความต่อไปนี้ให้เหลือ 3 ข้อสั้นกระชับ เน้นข้อเท็จจริงและประเด็นสำคัญที่สุด ขึ้นต้นแต่ละข้อด้วยคำกริยา\n\n[วางข้อความของคุณที่นี่]", caption: "📋 สรุปประเด็นหลัก 3 ข้อ ชัดเจนตรงจุด" } },
    { id: "ts-2", label: "⚡ TL;DR", caption: "Ultra-short 2-3 sentence summary", prompt: "Create a TL;DR (Too Long; Didn't Read) summary of the following text in 2-3 sentences maximum. Make it punchy and capture the absolute essence.\n\n[Paste your text here]", th: { label: "⚡ สรุปสั้นสุดๆ", prompt: "สรุปแบบสั้นที่สุด (TL;DR) ของข้อความต่อไปนี้ ไม่เกิน 2-3 ประโยค ให้กระชับและเก็บใจความสำคัญที่สุดไว้ครบ\n\n[วางข้อความของคุณที่นี่]", caption: "📋 สรุปจบใน 2-3 ประโยค" } },
    { id: "ts-3", label: "📊 Executive Summary", caption: "Business-ready executive summary paragraph", prompt: "Write a one-paragraph executive summary of the following content. Suitable for a business audience. Include: main purpose, key findings, and recommended action.\n\n[Paste your text here]", th: { label: "📊 บทสรุปผู้บริหาร", prompt: "เขียนบทสรุปผู้บริหาร (Executive Summary) หนึ่งย่อหน้าจากเนื้อหาต่อไปนี้ ให้เหมาะกับผู้อ่านสายธุรกิจ ครอบคลุม: วัตถุประสงค์หลัก ข้อค้นพบสำคัญ และข้อเสนอแนะ\n\n[วางข้อความของคุณที่นี่]", caption: "📋 บทสรุปย่อหน้าเดียวพร้อมนำเสนอผู้บริหาร" } },
    { id: "ts-4", label: "✅ Action Items", caption: "Numbered checklist of action items and owners", prompt: "Extract all action items and next steps from the following meeting notes or document. Format as a numbered checklist with owner names if mentioned and deadlines if specified.\n\n[Paste your text here]", th: { label: "✅ สิ่งที่ต้องทำ", prompt: "ดึงรายการสิ่งที่ต้องทำ (action items) และขั้นตอนถัดไปทั้งหมดจากบันทึกการประชุมหรือเอกสารต่อไปนี้ จัดเป็นเช็คลิสต์แบบมีลำดับเลข ระบุชื่อผู้รับผิดชอบและกำหนดส่งถ้ามี\n\n[วางข้อความของคุณที่นี่]", caption: "📋 เช็คลิสต์งานพร้อมผู้รับผิดชอบ" } },
    { id: "ts-5", label: "🔑 Key Insights", caption: "5 key insights with explanation of impact", prompt: "Identify and explain the 5 most important insights from the following research or article. For each insight, explain WHY it matters in one sentence.\n\n[Paste your text here]", th: { label: "🔑 ประเด็นสำคัญ", prompt: "ระบุและอธิบายข้อค้นพบสำคัญที่สุด 5 ประการจากงานวิจัยหรือบทความต่อไปนี้ พร้อมอธิบายว่าแต่ละข้อ \"สำคัญเพราะอะไร\" ในหนึ่งประโยค\n\n[วางข้อความของคุณที่นี่]", caption: "📋 5 ข้อค้นพบสำคัญพร้อมเหตุผล" } },
  ],
  "text/translate": [
    { id: "tt-1", label: "🇹🇭 → 🇺🇸 Thai to English", caption: "Natural English translation with cultural context", prompt: "Translate the following Thai text to English. Maintain natural phrasing and professional tone. If there are cultural references, add a brief explanation in brackets.\n\n[วางข้อความภาษาไทยที่นี่]", th: { label: "🇹🇭 → 🇺🇸 ไทยเป็นอังกฤษ", prompt: "แปลข้อความภาษาไทยต่อไปนี้เป็นภาษาอังกฤษ ใช้สำนวนที่เป็นธรรมชาติและโทนมืออาชีพ หากมีบริบททางวัฒนธรรมให้เพิ่มคำอธิบายสั้นๆ ในวงเล็บ\n\n[วางข้อความภาษาไทยที่นี่]", caption: "🌐 แปลอังกฤษลื่นไหล เก็บบริบทวัฒนธรรมครบ" } },
    { id: "tt-2", label: "🇺🇸 → 🇹🇭 English to Thai", caption: "Natural-sounding Thai translation", prompt: "Translate the following English text to Thai. Use natural Thai phrasing that sounds like it was written by a native speaker, not a literal translation.\n\n[Paste English text here]", th: { label: "🇺🇸 → 🇹🇭 อังกฤษเป็นไทย", prompt: "แปลข้อความภาษาอังกฤษต่อไปนี้เป็นภาษาไทย ใช้ภาษาที่เป็นธรรมชาติเหมือนคนไทยเขียนเอง ไม่ใช่การแปลตรงตัวคำต่อคำ\n\n[วางข้อความภาษาอังกฤษที่นี่]", caption: "🌐 แปลไทยอ่านลื่นเหมือนเจ้าของภาษาเขียน" } },
    { id: "tt-3", label: "🇯🇵 Japanese", caption: "Proper Japanese with correct formality level", prompt: "Translate the following text to Japanese (日本語). Use appropriate formality level (です/ます form for business, casual for informal). Include furigana for complex kanji.\n\n[Paste text here]", th: { label: "🇯🇵 ภาษาญี่ปุ่น", prompt: "แปลข้อความต่อไปนี้เป็นภาษาญี่ปุ่น (日本語) เลือกระดับความสุภาพให้เหมาะสม (รูป です/ます สำหรับงานธุรกิจ, ภาษาพูดสำหรับบริบทสบายๆ) ใส่ฟุริงานะกำกับคันจิที่อ่านยาก\n\n[วางข้อความที่นี่]", caption: "🌐 ภาษาญี่ปุ่นถูกระดับความสุภาพ" } },
    { id: "tt-4", label: "🇨🇳 Chinese", caption: "Idiomatic Simplified Chinese translation", prompt: "Translate the following text to Simplified Chinese (简体中文). Ensure idiomatic Chinese expressions are used rather than direct translations.\n\n[Paste text here]", th: { label: "🇨🇳 ภาษาจีน", prompt: "แปลข้อความต่อไปนี้เป็นภาษาจีนตัวย่อ (简体中文) ใช้สำนวนจีนแท้ที่เจ้าของภาษาใช้จริง ไม่ใช่การแปลตรงตัว\n\n[วางข้อความที่นี่]", caption: "🌐 ภาษาจีนตัวย่อสำนวนเจ้าของภาษา" } },
    { id: "tt-5", label: "🇪🇸 Spanish", caption: "Engaging Latin American Spanish marketing copy", prompt: "Translate the following marketing text to Latin American Spanish. Use modern, engaging language that resonates with a young adult audience. Keep brand voice consistent.\n\n[Paste text here]", th: { label: "🇪🇸 ภาษาสเปน", prompt: "แปลข้อความการตลาดต่อไปนี้เป็นภาษาสเปนแบบลาตินอเมริกา ใช้ภาษาทันสมัยที่โดนใจกลุ่มวัยรุ่น-วัยทำงาน คงน้ำเสียงของแบรนด์ไว้\n\n[วางข้อความที่นี่]", caption: "🌐 ก็อปปี้การตลาดภาษาสเปนโดนใจวัยรุ่น" } },
  ],
  "text/rewrite": [
    { id: "tr-1", label: "💼 More Professional", caption: "Polished, business-ready professional version", prompt: "Rewrite the following text in a more professional and formal tone. Eliminate casual language, improve vocabulary, and ensure it sounds polished for a business setting.\n\n[Paste your text here]", th: { label: "💼 เป็นทางการขึ้น", prompt: "เรียบเรียงข้อความต่อไปนี้ใหม่ให้เป็นทางการและมืออาชีพมากขึ้น ตัดภาษาพูดออก ยกระดับการใช้คำ ให้เหมาะกับบริบทธุรกิจ\n\n[วางข้อความของคุณที่นี่]", caption: "✏️ ฉบับขัดเกลา พร้อมใช้ในงานธุรกิจ" } },
    { id: "tr-2", label: "😊 More Friendly", caption: "Warm, conversational rewrite", prompt: "Rewrite the following text to be warmer, more conversational and approachable. Keep the information but make it feel like a friendly conversation, not a formal document.\n\n[Paste your text here]", th: { label: "😊 เป็นกันเองขึ้น", prompt: "เรียบเรียงข้อความต่อไปนี้ใหม่ให้อบอุ่น เป็นกันเอง และเข้าถึงง่ายขึ้น คงข้อมูลเดิมไว้ครบ แต่ให้อ่านแล้วรู้สึกเหมือนคุยกับเพื่อน ไม่ใช่เอกสารทางการ\n\n[วางข้อความของคุณที่นี่]", caption: "✏️ ฉบับอ่านสบาย เข้าถึงใจผู้อ่าน" } },
    { id: "tr-3", label: "✂️ Shorter (50%)", caption: "Concise rewrite with 50% fewer words", prompt: "Rewrite the following text to be at least 50% shorter. Remove redundancy, combine sentences, and keep only the essential information. Every word must earn its place.\n\n[Paste your text here]", th: { label: "✂️ สั้นลง 50%", prompt: "เรียบเรียงข้อความต่อไปนี้ให้สั้นลงอย่างน้อย 50% ตัดความซ้ำซ้อน รวมประโยค เก็บเฉพาะใจความจำเป็น ทุกคำต้องมีเหตุผลที่อยู่\n\n[วางข้อความของคุณที่นี่]", caption: "✏️ สั้นลงครึ่งหนึ่ง ความหมายครบเดิม" } },
    { id: "tr-4", label: "🎯 SEO Optimized", caption: "SEO-friendly version with keywords", prompt: "Rewrite the following text to be SEO-optimized. Add relevant keywords naturally, improve readability with short paragraphs, include a compelling intro and CTA at the end.\n\n[Paste your text here]", th: { label: "🎯 ปรับ SEO", prompt: "เรียบเรียงข้อความต่อไปนี้ให้เป็นมิตรกับ SEO แทรกคีย์เวิร์ดที่เกี่ยวข้องอย่างเป็นธรรมชาติ แบ่งย่อหน้าสั้นอ่านง่าย ใส่บทนำที่ดึงดูดและ CTA ปิดท้าย\n\n[วางข้อความของคุณที่นี่]", caption: "✏️ ฉบับ SEO มีคีย์เวิร์ดและโครงสร้างดีขึ้น" } },
    { id: "tr-5", label: "🚀 Marketing Style", caption: "High-energy marketing copy that drives action", prompt: "Rewrite the following text in an exciting, persuasive marketing style. Use power words, create urgency, highlight benefits not features, and inspire the reader to take action.\n\n[Paste your text here]", th: { label: "🚀 สไตล์การตลาด", prompt: "เรียบเรียงข้อความต่อไปนี้ใหม่ในสไตล์การตลาดที่เร้าใจและโน้มน้าว ใช้คำทรงพลัง สร้างความรู้สึกเร่งด่วน เน้นประโยชน์มากกว่าฟีเจอร์ และกระตุ้นให้ผู้อ่านลงมือทำ\n\n[วางข้อความของคุณที่นี่]", caption: "✏️ ก็อปปี้การตลาดพลังสูง กระตุ้นการตัดสินใจ" } },
  ],
  "audio/tts": [
    { id: "at-1", label: "📢 App Welcome", caption: "Warm welcome message for app onboarding (~8 sec)", prompt: "Welcome to Rnai! Your AI-powered creative assistant is ready to help you generate stunning images, write compelling content, and build beautiful websites — all with a single tap.", th: { label: "📢 ต้อนรับผู้ใช้แอป", prompt: "ยินดีต้อนรับสู่ Rnai! ผู้ช่วยสร้างสรรค์ด้วย AI ของคุณพร้อมแล้ว ที่จะช่วยสร้างภาพสวยตระการตา เขียนคอนเทนต์โดนใจ และสร้างเว็บไซต์สวยงาม ทั้งหมดนี้ในแตะเดียว", caption: "🔊 ข้อความต้อนรับอบอุ่นสำหรับเปิดแอป (~8 วินาที)" } },
    { id: "at-2", label: "📦 Order Update", caption: "Clear e-commerce order confirmation (~7 sec)", prompt: "Great news! Your order number 12345 has been confirmed and is now being prepared. Estimated delivery is within 3 to 5 business days. You will receive a tracking link via email shortly.", th: { label: "📦 แจ้งสถานะออเดอร์", prompt: "ข่าวดีค่ะ! คำสั่งซื้อหมายเลข 12345 ของคุณได้รับการยืนยันแล้ว และกำลังจัดเตรียมสินค้า คาดว่าจะจัดส่งถึงภายใน 3 ถึง 5 วันทำการ คุณจะได้รับลิงก์ติดตามพัสดุทางอีเมลเร็วๆ นี้", caption: "🔊 เสียงยืนยันคำสั่งซื้อชัดเจน (~7 วินาที)" } },
    { id: "at-3", label: "📖 Story Narration", caption: "Engaging audiobook-style narration (~12 sec)", prompt: "Chapter One: In a world where technology and nature coexisted in perfect harmony, there lived a young inventor named Aria. Every morning, she would climb to the top of her glass workshop and watch the solar drones tend to the ancient forest below.", th: { label: "📖 เสียงเล่าเรื่อง", prompt: "บทที่หนึ่ง: ในโลกที่เทคโนโลยีและธรรมชาติอยู่ร่วมกันอย่างกลมกลืน มีนักประดิษฐ์สาวคนหนึ่งชื่ออาริยา ทุกเช้าเธอจะปีนขึ้นไปบนยอดเวิร์กช็อปกระจกของเธอ เฝ้ามองโดรนพลังแสงอาทิตย์ดูแลผืนป่าโบราณเบื้องล่าง", caption: "🔊 เสียงเล่าเรื่องสไตล์หนังสือเสียง (~12 วินาที)" } },
    { id: "at-4", label: "📣 Ad Voiceover", caption: "High-energy 15-second advertisement voiceover", prompt: "Stop wasting time. Start creating. With Rnai, turn any idea into a stunning image in seconds. No design skills needed. No limits. Just your imagination. Try Rnai free today.", th: { label: "📣 เสียงโฆษณา", prompt: "หยุดเสียเวลา แล้วเริ่มสร้างสรรค์ กับ Rnai เปลี่ยนทุกไอเดียให้เป็นภาพสุดปังในไม่กี่วินาที ไม่ต้องมีพื้นฐานออกแบบ ไม่มีขีดจำกัด มีแค่จินตนาการของคุณ ลองใช้ Rnai ฟรีวันนี้", caption: "🔊 เสียงโฆษณาพลังสูง 15 วินาที" } },
    { id: "at-5", label: "🎓 Course Intro", caption: "Professional e-learning course introduction (~10 sec)", prompt: "Welcome to Advanced AI Design Fundamentals. In this course, you will learn how to harness the power of artificial intelligence to create professional-grade visuals, automate your workflow, and stay ahead in the rapidly evolving creative industry.", th: { label: "🎓 เปิดคอร์สเรียน", prompt: "ยินดีต้อนรับสู่คอร์สพื้นฐานการออกแบบด้วย AI ขั้นสูง ในคอร์สนี้คุณจะได้เรียนรู้วิธีใช้พลังของปัญญาประดิษฐ์ เพื่อสร้างงานภาพระดับมืออาชีพ ทำงานอัตโนมัติ และก้าวนำในวงการครีเอทีฟที่เปลี่ยนแปลงอย่างรวดเร็ว", caption: "🔊 เสียงเปิดคอร์สออนไลน์มืออาชีพ (~10 วินาที)" } },
  ],
  "website/generate": [
    { id: "wg-1", label: "🎨 Designer Portfolio", caption: "Dark-themed designer portfolio with modern UI", prompt: "Modern dark-theme portfolio website for a UX/UI designer. Sections: Hero with animated tagline, About, Skills (with progress bars), Featured Projects (3 case studies), and Contact form. Use purple and cyan accent colors.", th: { label: "🎨 พอร์ตดีไซเนอร์", prompt: "เว็บไซต์พอร์ตโฟลิโอธีมมืดสมัยใหม่สำหรับนักออกแบบ UX/UI ประกอบด้วย: Hero พร้อมสโลแกนแบบแอนิเมชัน, เกี่ยวกับฉัน, ทักษะ (มีแถบความชำนาญ), ผลงานเด่น 3 ชิ้น และฟอร์มติดต่อ ใช้สีม่วงและฟ้าน้ำทะเลเป็นสีหลัก เนื้อหาภาษาไทย", caption: "พอร์ตโฟลิโอธีมมืด UI ทันสมัย" } },
    { id: "wg-2", label: "🍽️ Restaurant Page", caption: "Elegant restaurant website with reservation system", prompt: "Elegant restaurant landing page for an Italian fine dining restaurant called \"La Cucina\". Include: hero with food photography, featured menu section, chef story, reservation form, and Google Maps embed. Warm earthy tones.", th: { label: "🍽️ เว็บร้านอาหาร", prompt: "หน้าเว็บร้านอาหารไทยไฟน์ไดนิ่งชื่อ \"เรือนไทย\" สไตล์หรูหรา ประกอบด้วย: Hero รูปอาหารสวยๆ, เมนูแนะนำ, เรื่องราวของเชฟ, ฟอร์มจองโต๊ะ และแผนที่ Google Maps โทนสีอบอุ่นแบบเอิร์ธโทน เนื้อหาภาษาไทย", caption: "เว็บร้านอาหารหรูพร้อมระบบจองโต๊ะ" } },
    { id: "wg-3", label: "💻 SaaS Landing", caption: "Conversion-optimized SaaS product landing page", prompt: "High-converting SaaS landing page for an AI writing tool. Include: hero with product demo GIF, 3 key features, social proof (testimonials + logos), pricing table (3 tiers), FAQ, and signup CTA. Clean white and blue design.", th: { label: "💻 หน้า SaaS", prompt: "หน้า Landing Page สำหรับ SaaS เครื่องมือเขียนด้วย AI ที่เน้นการแปลงผู้เข้าชมเป็นลูกค้า ประกอบด้วย: Hero พร้อมเดโมสินค้า, ฟีเจอร์เด่น 3 ข้อ, รีวิวจากผู้ใช้และโลโก้ลูกค้า, ตารางราคา 3 แพ็กเกจ, FAQ และปุ่มสมัคร ดีไซน์ขาว-น้ำเงินสะอาดตา เนื้อหาภาษาไทย", caption: "Landing Page SaaS เน้นปิดการขาย" } },
    { id: "wg-4", label: "📸 Photo Blog", caption: "Beautiful travel photography blog with gallery", prompt: "Personal photography blog for a travel photographer. Masonry grid photo gallery, travel stories blog section, destination map, Instagram feed widget, and newsletter signup. Light airy aesthetic with serif fonts.", th: { label: "📸 บล็อกภาพถ่าย", prompt: "บล็อกภาพถ่ายส่วนตัวของช่างภาพสายท่องเที่ยว มีแกลเลอรีแบบ masonry grid, บทความเล่าเรื่องการเดินทาง, แผนที่จุดหมายปลายทาง, วิดเจ็ตฟีด Instagram และฟอร์มรับจดหมายข่าว สไตล์โปร่งสบายใช้ฟอนต์ serif เนื้อหาภาษาไทย", caption: "บล็อกท่องเที่ยวพร้อมแกลเลอรีสวยงาม" } },
    { id: "wg-5", label: "🛍️ Product Store", caption: "Elegant product page with reviews and gallery", prompt: "E-commerce product page for handmade artisan ceramic jewelry. Product image gallery, size/color selector, customer reviews (4.8 stars), related products, and secure checkout section. Minimalist warm beige theme.", th: { label: "🛍️ หน้าร้านค้า", prompt: "หน้าสินค้าอีคอมเมิร์ซสำหรับเครื่องประดับเซรามิกแฮนด์เมด มีแกลเลอรีรูปสินค้า, ตัวเลือกขนาด/สี, รีวิวลูกค้า (4.8 ดาว), สินค้าที่เกี่ยวข้อง และส่วนชำระเงินปลอดภัย ธีมมินิมอลโทนเบจอบอุ่น เนื้อหาภาษาไทย", caption: "หน้าสินค้าสวยหรูพร้อมรีวิวและแกลเลอรี" } },
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
