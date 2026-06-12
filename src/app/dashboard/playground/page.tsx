"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";
import { SKILL_TEMPLATES, SKILL_TEMPLATE_FILL, TARGET_LANGUAGES } from "@/lib/playground/templates";

type SkillId =
  | "image/generate"
  | "image/remove-background"
  | "image/upscale"
  | "image/stylize"
  | "image/edit"
  | "text/generate"
  | "text/summarize"
  | "text/translate"
  | "text/rewrite"
  | "text/extract"
  | "audio/tts"
  | "audio/stt"
  | "website/generate";

type SkillConfig = {
  id: SkillId;
  label: string;
  category: "Image" | "Text" | "Audio" | "Website";
  credits: number;
  needsPrompt?: boolean;
  needsText?: boolean;
  needsImage?: boolean;
  needsMask?: boolean;
  needsAudio?: boolean;
  needsTargetLanguage?: boolean;
  needsTone?: boolean;
  needsSchema?: boolean;
  needsWebsiteName?: boolean;
  needsWebsiteType?: boolean;
  needsTemplate?: boolean;
  needsDescription?: boolean;
  needsWebsiteCustomPrompt?: boolean;
  needsWebsiteImage?: boolean;
};

// Emoji icons — same visual language as the Rnai.io mobile app
const SKILL_ICONS: Record<SkillId, string> = {
  "image/generate": "🎨",
  "image/remove-background": "✂️",
  "image/upscale": "🔍",
  "image/stylize": "🖌️",
  "image/edit": "✏️",
  "text/generate": "📝",
  "text/summarize": "📋",
  "text/translate": "🌐",
  "text/rewrite": "♻️",
  "text/extract": "🔎",
  "audio/tts": "🔊",
  "audio/stt": "🎙️",
  "website/generate": "💻",
};

const CATEGORY_META: { id: SkillConfig["category"]; icon: string }[] = [
  { id: "Image", icon: "🖼️" },
  { id: "Text", icon: "📝" },
  { id: "Audio", icon: "🔊" },
  { id: "Website", icon: "💻" },
];

const SKILLS: SkillConfig[] = [
  { id: "image/generate", label: "Image Generate", category: "Image", credits: 5, needsPrompt: true },
  { id: "image/remove-background", label: "Remove Background", category: "Image", credits: 2, needsImage: true },
  { id: "image/upscale", label: "Image Upscale", category: "Image", credits: 3, needsImage: true },
  { id: "image/stylize", label: "Image Stylize", category: "Image", credits: 6, needsImage: true, needsPrompt: true },
  { id: "image/edit", label: "Image Edit", category: "Image", credits: 8, needsImage: true, needsMask: true, needsPrompt: true },
  { id: "text/generate", label: "Text Generate", category: "Text", credits: 1, needsPrompt: true },
  { id: "text/summarize", label: "Text Summarize", category: "Text", credits: 1, needsText: true },
  { id: "text/translate", label: "Text Translate", category: "Text", credits: 1, needsText: true, needsTargetLanguage: true },
  { id: "text/rewrite", label: "Text Rewrite", category: "Text", credits: 1, needsText: true, needsTone: true },
  { id: "text/extract", label: "Text Extract", category: "Text", credits: 1, needsText: true, needsSchema: true },
  { id: "audio/tts", label: "Text to Speech", category: "Audio", credits: 10, needsText: true },
  { id: "audio/stt", label: "Speech to Text", category: "Audio", credits: 5, needsAudio: true },
  { id: "website/generate", label: "Website Generate", category: "Website", credits: 10, needsWebsiteName: true, needsWebsiteType: true, needsTemplate: true, needsDescription: true, needsWebsiteCustomPrompt: true, needsWebsiteImage: true },
];

type RunResult = {
  text?: string;
  url?: string;
  format?: string;
  provider?: string;
  creditsCharged?: number;
};

type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type PromptAttachment = {
  name: string;
  type: string;
  size: number;
  content: string;
  readable: boolean;
};

type PromptTemplate = {
  title: string;
  tag: string;
  prompt: string;
  previewClass: string;
};

const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    title: "Classic Romance",
    tag: "Romantic",
    previewClass: "from-[#2b1720] via-[#a6425d] to-[#f3c4a5]",
    prompt:
      "Create an original vintage romantic movie poster inspired by classic cinema of the 1950s, featuring two lovers under warm city lights, elegant dramatic composition, hand-painted poster texture, soft golden glow, expressive faces, nostalgic typography area with no readable text, rich film grain, timeless romantic atmosphere, not based on any real movie poster",
  },
  {
    title: "Classic War",
    tag: "War",
    previewClass: "from-[#171812] via-[#60624a] to-[#d8c58a]",
    prompt:
      "Create an original vintage war movie poster inspired by classic cinema of the 1940s, showing brave soldiers silhouetted against a smoky battlefield sunrise, dramatic clouds, heroic composition, muted olive and sepia palette, hand-painted illustration style, aged paper texture, strong cinematic tension, empty title space with no readable text, not based on any real movie poster",
  },
  {
    title: "Classic Biography",
    tag: "Biopic",
    previewClass: "from-[#1f1c18] via-[#7b5e3b] to-[#e8d6aa]",
    prompt:
      "Create an original vintage biographical movie poster inspired by classic prestige films of the 1960s, centered on a thoughtful historical figure at a desk with papers, warm spotlight, symbolic background montage of life achievements, dignified painterly realism, elegant sepia and gold tones, film grain, archival atmosphere, empty title area with no readable text, not based on any real person or real movie poster",
  },
  {
    title: "Classic Drama",
    tag: "Drama",
    previewClass: "from-[#151923] via-[#41516b] to-[#c7b8a1]",
    prompt:
      "Create an original vintage drama movie poster inspired by classic cinema of the 1970s, featuring a lone character standing in rain near a glowing window, emotional expression, moody blue and amber lighting, painterly poster art, strong negative space, subtle film grain, melancholic atmosphere, empty title space with no readable text, not based on any real movie poster",
  },
  {
    title: "Classic Comedy",
    tag: "Comedy",
    previewClass: "from-[#1d2630] via-[#e3a72f] to-[#f5ead0]",
    prompt:
      "Create an original vintage comedy movie poster inspired by classic slapstick cinema of the 1930s, featuring a charming awkward character in an exaggerated funny situation on a city street, playful composition, warm cream and mustard colors, hand-painted poster texture, lively facial expression, whimsical motion lines, empty title space with no readable text, not based on any real comedian or real movie poster",
  },
];

const TEXT_FILE_EXTENSIONS = new Set([
  "txt",
  "md",
  "markdown",
  "json",
  "csv",
  "tsv",
  "html",
  "xml",
  "log",
  "js",
  "jsx",
  "ts",
  "tsx",
  "css",
  "scss",
  "py",
  "java",
  "go",
  "rs",
  "rb",
  "php",
  "sql",
  "yaml",
  "yml",
]);

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function fileToText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

function canReadAsText(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";
  return file.type.startsWith("text/") || TEXT_FILE_EXTENSIONS.has(extension);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PlaygroundPage() {
  const [ready, setReady] = useState(false);
  const [skillId, setSkillId] = useState<SkillId>("image/generate");
  const [prompt, setPrompt] = useState("");
  const [promptAttachments, setPromptAttachments] = useState<PromptAttachment[]>([]);
  const [text, setText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("Thai");
  const [tone, setTone] = useState("professional");
  const [schema, setSchema] = useState("");
  const [image, setImage] = useState("");
  const [mask, setMask] = useState("");
  const [audio, setAudio] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [websiteType, setWebsiteType] = useState("ecommerce");
  const [template, setTemplate] = useState("modern");
  const [description, setDescription] = useState("");
  const [websiteCustomPrompt, setWebsiteCustomPrompt] = useState("");
  const [websiteImage, setWebsiteImage] = useState("");
  const [websiteImageUsage, setWebsiteImageUsage] = useState<"design-reference" | "background" | "logo">("design-reference");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [error, setError] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Ask me anything. Gemini chat is free for signed-in users." },
  ]);
  const [activeCategory, setActiveCategory] = useState<SkillConfig["category"]>("Image");
  const router = useRouter();
  const { language } = useLanguage();

  const t = translations[language];

  const skill = useMemo(() => SKILLS.find((item) => item.id === skillId) || SKILLS[0], [skillId]);

  // Templates for the current skill (shared with the mobile app)
  const skillTemplates = SKILL_TEMPLATES[skillId] ?? [];
  const templateFill = SKILL_TEMPLATE_FILL[skillId];
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  const applyTemplate = (templateId: string, templatePrompt: string) => {
    setActiveTemplateId(templateId);
    setResult(null);
    setError("");
    if (templateFill === "text") setText(templatePrompt);
    else if (templateFill === "description") setDescription(templatePrompt);
    else setPrompt(templatePrompt);
  };

  const selectSkill = (id: SkillId) => {
    setSkillId(id);
    setActiveTemplateId(null);
    setResult(null);
    setError("");
  };

  const getSkillLabel = (id: SkillId) => {
    const skillLabelMap: Record<SkillId, string> = {
      "image/generate": t.playground.imageGenerate,
      "image/remove-background": t.playground.removeBackground,
      "image/upscale": t.playground.imageUpscale,
      "image/stylize": t.playground.imageStylize,
      "image/edit": t.playground.imageEdit,
      "text/generate": t.playground.textGenerate,
      "text/summarize": t.playground.textSummarize,
      "text/translate": t.playground.textTranslate,
      "text/rewrite": t.playground.textRewrite,
      "text/extract": t.playground.textExtract,
      "audio/tts": t.playground.audioTts,
      "audio/stt": t.playground.audioStt,
      "website/generate": t.playground.websiteGenerate,
    };
    return skillLabelMap[id] || "Unknown";
  };

  const promptWithAttachments = useMemo(() => {
    if (promptAttachments.length === 0) return prompt;

    const fileContext = promptAttachments
      .map((file) => {
        if (!file.readable) {
          return [
            `File: ${file.name}`,
            `Type: ${file.type || "unknown"}`,
            `Size: ${formatBytes(file.size)}`,
            "Content: binary file attached as metadata only",
          ].join("\n");
        }

        return [
          `File: ${file.name}`,
          `Type: ${file.type || "text/plain"}`,
          `Size: ${formatBytes(file.size)}`,
          "Content:",
          file.content.slice(0, 6000),
        ].join("\n");
      })
      .join("\n\n---\n\n");

    return [prompt, "Attached file context:", fileContext].filter(Boolean).join("\n\n");
  }, [prompt, promptAttachments]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/auth/login");
      setReady(true);
    });
    return unsub;
  }, [router]);

  const handleRun = async () => {
    setRunning(true);
    setError("");
    setResult(null);

    const payload: Record<string, string> = { skill: skill.id };
    if (skill.needsPrompt) payload.prompt = promptWithAttachments;
    if (skill.needsText) payload.text = text;
    if (skill.needsImage) payload.image = image;
    if (skill.needsMask) payload.mask = mask;
    if (skill.needsAudio) payload.audio = audio;
    if (skill.needsTargetLanguage) payload.targetLanguage = targetLanguage;
    if (skill.needsTone) payload.tone = tone;
    if (skill.needsSchema) payload.schema = schema;
    if (skill.needsWebsiteName) payload.websiteName = websiteName;
    if (skill.needsWebsiteType) payload.websiteType = websiteType;
    if (skill.needsTemplate) payload.template = template;
    if (skill.needsDescription) payload.description = description;
    if (skill.needsWebsiteCustomPrompt) payload.websiteCustomPrompt = websiteCustomPrompt;
    if (skill.needsWebsiteImage) {
      payload.websiteImage = websiteImage;
      payload.websiteImageUsage = websiteImageUsage;
    }

    try {
      const res = await fetch("/api/playground/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setRunning(false);
    }
  };

  const sendChat = async () => {
    const message = chatInput.trim();
    if (!message || chatLoading) return;

    setChatInput("");
    setChatLoading(true);
    setChatMessages((current) => [...current, { role: "user", text: message }]);

    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gemini chat failed");
      setChatMessages((current) => [...current, { role: "assistant", text: data.text }]);
    } catch (err) {
      setChatMessages((current) => [
        ...current,
        { role: "assistant", text: err instanceof Error ? err.message : "Gemini chat failed" },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm bg-[#050505]">
        <div className="w-6 h-6 border-2 border-[#D77757] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-outfit font-bold text-white tracking-tight">{t.playground.title}</h1>
            <p className="text-sm text-gray-400 mt-1.5">{t.playground.subtitle}</p>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10"
          >
            {t.common.backToDashboard}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-6">
          <section className="glass-card rounded-3xl p-6 md:p-8">
            <div className="grid gap-5">
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.function}</label>

                {/* Category tabs */}
                <div className="flex gap-1.5 p-1 mb-3 rounded-xl bg-black/40 border border-white/10">
                  {CATEGORY_META.map((category) => {
                    const isActive = activeCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          setActiveCategory(category.id);
                          const first = SKILLS.find((item) => item.category === category.id);
                          if (first) selectSkill(first.id);
                        }}
                        className={`flex-1 rounded-lg px-2 py-2 text-xs sm:text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-[#D77757] text-white shadow-[0_0_20px_rgba(215,119,87,0.35)]"
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <span className="mr-1.5">{category.icon}</span>
                        {category.id}
                      </button>
                    );
                  })}
                </div>

                {/* Skill cards in the active category */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SKILLS.filter((item) => item.category === activeCategory).map((item) => {
                    const isActive = skillId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectSkill(item.id)}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          isActive
                            ? "border-[#D77757] bg-[#D77757]/10 shadow-[0_0_18px_rgba(215,119,87,0.2)]"
                            : "border-white/10 bg-black/30 hover:border-white/25 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="text-xl mb-1.5">{SKILL_ICONS[item.id]}</div>
                        <p className={`text-xs sm:text-sm font-semibold leading-tight ${isActive ? "text-[#D77757]" : "text-white"}`}>
                          {getSkillLabel(item.id)}
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1">{item.credits} {t.common.credits}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Popular templates (same set as the mobile app) ── */}
              {skillTemplates.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">{t.playground.popularTemplates}</label>
                    <p className="text-xs text-gray-500">{t.playground.clickToFill}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillTemplates.map((tmpl) => {
                      const isActive = activeTemplateId === tmpl.id;
                      return (
                        <button
                          key={tmpl.id}
                          type="button"
                          title={tmpl.caption}
                          onClick={() => applyTemplate(tmpl.id, tmpl.prompt)}
                          className={`rounded-full border px-3.5 py-1.5 text-xs sm:text-sm font-medium transition-all ${
                            isActive
                              ? "border-[#D77757] bg-[#D77757] text-white"
                              : "border-white/10 bg-black/30 text-gray-300 hover:border-[#D77757]/50 hover:text-white"
                          }`}
                        >
                          {tmpl.label}
                        </button>
                      );
                    })}
                  </div>
                  {activeTemplateId && (
                    <p className="mt-2 text-xs text-gray-500">
                      💡 {skillTemplates.find((tmpl) => tmpl.id === activeTemplateId)?.caption}
                    </p>
                  )}
                </div>
              )}

              {skill.needsPrompt && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.prompt}</label>
                  {skillId === "image/generate" && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium text-white">🎬 Cinematic Posters</p>
                      <p className="text-xs text-gray-500">{t.playground.clickToFill}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                      {PROMPT_TEMPLATES.map((template) => (
                        <button
                          key={template.title}
                          type="button"
                          onClick={() => {
                            setPrompt(template.prompt);
                            setResult(null);
                            setError("");
                          }}
                          className="group overflow-hidden rounded-2xl border border-white/10 bg-black/30 text-left transition-all hover:-translate-y-0.5 hover:border-[#D77757]/50 hover:bg-white/[0.04]"
                        >
                          <div className={`relative h-24 bg-gradient-to-br ${template.previewClass}`}>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.45),transparent_24%),radial-gradient(circle_at_78%_70%,rgba(255,255,255,0.25),transparent_26%)]"></div>
                            <div className="absolute bottom-2 left-2 rounded-full bg-black/45 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                              {template.tag}
                            </div>
                          </div>
                          <div className="p-3">
                            <p className="text-sm font-semibold text-white group-hover:text-[#D77757] transition-colors">{template.title}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  )}
                  <textarea
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                    placeholder={t.playground.promptPlaceholder}
                  />
                  <div className="mt-3 rounded-xl border border-white/10 bg-black/25 p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{t.playground.promptAttachments}</p>
                        <p className="text-xs text-gray-500 mt-1">{t.playground.attachmentsHelp}</p>
                      </div>
                      <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20 transition-colors">
                        {t.common.addFiles}
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={async (event) => {
                            const files = Array.from(event.target.files || []);
                            const nextAttachments = await Promise.all(
                              files.map(async (file) => {
                                const readable = canReadAsText(file);
                                return {
                                  name: file.name,
                                  type: file.type,
                                  size: file.size,
                                  readable,
                                  content: readable ? await fileToText(file) : "",
                                };
                              })
                            );
                            setPromptAttachments((current) => [...current, ...nextAttachments]);
                            event.target.value = "";
                          }}
                        />
                      </label>
                    </div>

                    {promptAttachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {promptAttachments.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
                            <div className="min-w-0">
                              <p className="truncate text-sm text-gray-200">{file.name}</p>
                              <p className="text-xs text-gray-500">
                                {file.readable ? t.playground.textIncluded : t.playground.metadataOnly} · {formatBytes(file.size)}
                              </p>
                            </div>
                            <button
                              onClick={() => setPromptAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                              className="shrink-0 rounded-md px-2 py-1 text-xs text-red-300 hover:bg-red-500/10"
                            >
                              {t.common.remove}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {skill.needsText && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.text}</label>
                  <textarea
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    rows={6}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                    placeholder={t.playground.textPlaceholder}
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skill.needsTargetLanguage && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.targetLanguage}</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {TARGET_LANGUAGES.map((lang) => {
                        const isActive = targetLanguage === lang.value;
                        return (
                          <button
                            key={lang.value}
                            type="button"
                            onClick={() => setTargetLanguage(lang.value)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                              isActive
                                ? "border-[#D77757] bg-[#D77757] text-white"
                                : "border-white/10 bg-black/30 text-gray-300 hover:border-[#D77757]/50 hover:text-white"
                            }`}
                          >
                            {lang.flag} {lang.value}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      value={targetLanguage}
                      onChange={(event) => setTargetLanguage(event.target.value)}
                      placeholder="Or type any language..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                    />
                  </div>
                )}

                {skill.needsTone && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.tone}</label>
                    <input
                      value={tone}
                      onChange={(event) => setTone(event.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                    />
                  </div>
                )}
              </div>

              {skill.needsSchema && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.extractionSchema}</label>
                  <textarea
                    value={schema}
                    onChange={(event) => setSchema(event.target.value)}
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                    placeholder='Example: {"name":"string","email":"string"}'
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skill.needsImage && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.image}</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) setImage(await fileToDataUrl(file));
                      }}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/20"
                    />
                  </div>
                )}

                {skill.needsMask && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.mask}</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) setMask(await fileToDataUrl(file));
                      }}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/20"
                    />
                  </div>
                )}

                {skill.needsAudio && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.audio}</label>
                    <input
                      type="file"
                      accept="audio/wav,audio/mpeg,audio/mp3,audio/webm,audio/ogg"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) setAudio(await fileToDataUrl(file));
                      }}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/20"
                    />
                  </div>
                )}
              </div>

              {skill.needsWebsiteName && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.websiteName}</label>
                  <input
                    type="text"
                    value={websiteName}
                    onChange={(event) => setWebsiteName(event.target.value)}
                    placeholder={t.playground.websiteNamePlaceholder}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skill.needsWebsiteType && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.websiteType}</label>
                    <select
                      value={websiteType}
                      onChange={(event) => setWebsiteType(event.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                    >
                      <option value="ecommerce">{t.playground.websiteTypeEcommerce}</option>
                      <option value="blog">{t.playground.websiteTypeBlog}</option>
                      <option value="portfolio">{t.playground.websiteTypePortfolio}</option>
                      <option value="service">{t.playground.websiteTypeService}</option>
                      <option value="restaurant">{t.playground.websiteTypeRestaurant}</option>
                      <option value="saas">{t.playground.websiteTypeSaas}</option>
                    </select>
                  </div>
                )}

                {skill.needsTemplate && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.templateStyle}</label>
                    <select
                      value={template}
                      onChange={(event) => setTemplate(event.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                    >
                      <option value="modern">{t.playground.templateModern}</option>
                      <option value="minimal">{t.playground.templateMinimal}</option>
                      <option value="bold">{t.playground.templateBold}</option>
                      <option value="elegant">{t.playground.templateElegant}</option>
                    </select>
                  </div>
                )}
              </div>

              {skill.needsDescription && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.description}</label>
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    placeholder={t.playground.descriptionPlaceholder}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                  />
                </div>
              )}

              {skill.needsWebsiteCustomPrompt && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.customPromptOptional}</label>
                  <textarea
                    value={websiteCustomPrompt}
                    onChange={(event) => setWebsiteCustomPrompt(event.target.value)}
                    rows={3}
                    placeholder={t.playground.customPromptPlaceholder}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                  />
                </div>
              )}

              {skill.needsWebsiteImage && (
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{t.common.referenceImageOptional}</label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        if (file) setWebsiteImage(await fileToDataUrl(file));
                      }}
                      className="block w-full text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-white/20"
                    />
                    {websiteImage && (
                      <div className="space-y-2">
                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold">{t.playground.howToUseImage}</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(["design-reference", "background", "logo"] as const).map((usage) => (
                            <label key={usage} className="flex items-center gap-2 p-2 rounded-lg border border-white/10 cursor-pointer hover:bg-white/5">
                              <input
                                type="radio"
                                name="imageUsage"
                                value={usage}
                                checked={websiteImageUsage === usage}
                                onChange={(e) => setWebsiteImageUsage(e.target.value as typeof websiteImageUsage)}
                                className="w-4 h-4"
                              />
                              <span className="text-sm text-white">
                                {usage === "design-reference" && t.playground.imageUsageDesignRef}
                                {usage === "background" && t.playground.imageUsageBackground}
                                {usage === "logo" && t.playground.imageUsageLogo}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleRun}
                disabled={running}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D77757] to-[#c4552f] text-white font-semibold text-sm hover:from-[#e08868] hover:to-[#d4663f] transition-all shadow-[0_4px_24px_rgba(215,119,87,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {running ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    {t.common.running}
                  </>
                ) : (
                  <>
                    {SKILL_ICONS[skill.id]} {t.common.run} {getSkillLabel(skill.id)}
                    <span className="text-white/70 text-xs font-normal">· {skill.credits} {t.common.credits}</span>
                  </>
                )}
              </button>

              {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">{error}</div>}

              {result && (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-white">{t.common.result}</p>
                    <div className="flex gap-3">
                      {result.format === "html" && result.text && (
                        <a
                          href={`data:text/html;charset=utf-8,${encodeURIComponent(result.text)}`}
                          download={`website-${Date.now()}.html`}
                          className="px-3 py-1 text-xs rounded-lg bg-[#D77757] text-white hover:bg-[#c46543] transition-colors"
                        >
                          {t.common.downloadHtml}
                        </a>
                      )}
                      <p className="text-xs text-gray-400">
                        {result.provider || "provider"} · {result.creditsCharged ?? skill.credits} {t.common.credits}
                      </p>
                    </div>
                  </div>
                  {result.text && result.format === "html" && (
                    <div>
                      <p className="text-xs text-gray-400 mb-3">{t.playground.htmlPreview}</p>
                      <pre className="whitespace-pre-wrap text-xs text-gray-300 max-h-64 overflow-y-auto bg-black/50 p-3 rounded-lg border border-white/5">
                        {result.text.slice(0, 1000)}...
                      </pre>
                    </div>
                  )}
                  {result.text && result.format !== "html" && <pre className="whitespace-pre-wrap text-sm text-gray-200">{result.text}</pre>}
                  {result.url && result.format === "mp3" && <audio src={result.url} controls className="w-full" />}
                  {result.url && result.format !== "mp3" && result.format !== "html" && (
                    <img src={result.url} alt="Generated result" className="w-full rounded-xl border border-white/10" />
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="glass-card rounded-3xl p-6 md:p-8 flex flex-col min-h-[640px]">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl font-outfit font-bold text-white">{t.playground.geminiChat}</h2>
                <p className="text-sm text-gray-400 mt-1">{t.playground.freeChatSubtitle}</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-bold uppercase tracking-wider">{t.common.free}</span>
            </div>

            <div className="flex-1 overflow-y-auto rounded-2xl bg-black/25 border border-white/5 p-4 space-y-3 mb-4">
              {chatMessages.map((message, index) => (
                <div key={index} className={message.role === "user" ? "text-right" : "text-left"}>
                  <div className={`inline-block max-w-[90%] rounded-2xl px-4 py-3 text-sm text-left whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-[#D77757] text-white"
                      : "bg-white/10 text-gray-100"
                  }`}>
                    {message.text}
                  </div>
                </div>
              ))}
              {chatLoading && <p className="text-sm text-gray-500">{t.playground.geminiThinking}</p>}
            </div>

            <div className="flex gap-3">
              <textarea
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendChat();
                  }
                }}
                rows={2}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                placeholder={t.playground.askGemini}
              />
              <button
                onClick={sendChat}
                disabled={chatLoading || !chatInput.trim()}
                className="px-5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.common.send}
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
