import Link from "next/link";
import Navbar from "@/components/Navbar";

const FEATURES = [
  {
    icon: "✦",
    title: "Generate",
    desc: "Create stunning images from text prompts using FLUX.1 AI model.",
    endpoint: "POST /api/v1/generate",
  },
  {
    icon: "⬡",
    title: "Edit",
    desc: "Modify specific areas of your images with AI-guided inpainting.",
    endpoint: "POST /api/v1/edit",
  },
  {
    icon: "◈",
    title: "Remove BG",
    desc: "Instantly remove backgrounds with pixel-perfect precision.",
    endpoint: "POST /api/v1/remove-background",
  },
];

const CODE_EXAMPLE = `const response = await fetch("https://rnai.io/api/v1/generate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer rnai_sk_...",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "A serene Japanese garden at sunset",
  }),
});

const { image } = await response.json();
// image → base64 data URI (data:image/png;base64,...)`;

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D77757]/10 border border-[#D77757]/20 text-[#D77757] text-sm mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D77757] animate-pulse" />
          Image AI API Platform
        </div>
        <h1 className="text-6xl font-bold mb-4 tracking-tight">
          Rnai<span className="text-[#D77757]">.</span>io
        </h1>
        <p className="text-xl text-[#8a7a6a] mb-8 max-w-xl mx-auto leading-relaxed">
          Generate, edit, and enhance images with a single API.
          <br />
          Built for developers. Designed for speed.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-[#D77757] text-white rounded-lg font-medium hover:bg-[#c0664a] transition-colors"
          >
            Get API Key →
          </Link>
          <a
            href="#docs"
            className="px-6 py-3 border border-[#2a2520] text-[#8a7a6a] rounded-lg font-medium hover:border-[#D77757]/40 hover:text-[#f5f0eb] transition-colors"
          >
            Documentation
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-xl bg-[#1e1b18] border border-[#2a2520] hover:border-[#D77757]/30 transition-colors group"
            >
              <div className="text-2xl mb-3 text-[#D77757]">{f.icon}</div>
              <h3 className="font-semibold text-[#f5f0eb] mb-2">{f.title}</h3>
              <p className="text-sm text-[#6a5a4a] mb-4 leading-relaxed">{f.desc}</p>
              <code className="text-xs text-[#D77757] bg-[#D77757]/5 px-2 py-1 rounded font-mono">
                {f.endpoint}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Code example */}
      <section id="docs" className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-2 text-[#f5f0eb]">Quick Start</h2>
        <p className="text-[#6a5a4a] mb-6 text-sm">
          Integrate in minutes. One endpoint per feature.
        </p>
        <div className="rounded-xl overflow-hidden border border-[#2a2520]">
          <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1714] border-b border-[#2a2520]">
            <div className="w-3 h-3 rounded-full bg-[#3a3530]" />
            <div className="w-3 h-3 rounded-full bg-[#3a3530]" />
            <div className="w-3 h-3 rounded-full bg-[#3a3530]" />
            <span className="text-xs text-[#4a3a2a] ml-2 font-mono">example.js</span>
          </div>
          <pre className="p-6 text-sm text-[#b0a090] overflow-x-auto bg-[#1e1b18] font-mono leading-relaxed">
            <code>{CODE_EXAMPLE}</code>
          </pre>
        </div>
      </section>

      {/* Endpoints reference */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-semibold mb-6 text-[#f5f0eb]">API Reference</h2>
        <div className="space-y-3">
          {[
            {
              method: "POST",
              path: "/api/v1/generate",
              body: '{ "prompt": "string" }',
              desc: "Generate image from text",
            },
            {
              method: "POST",
              path: "/api/v1/edit",
              body: '{ "image": "base64", "mask": "base64", "prompt": "string" }',
              desc: "Edit image with inpainting",
            },
            {
              method: "POST",
              path: "/api/v1/remove-background",
              body: '{ "image": "base64" }',
              desc: "Remove image background",
            },
          ].map((e) => (
            <div
              key={e.path}
              className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg bg-[#1e1b18] border border-[#2a2520]"
            >
              <span className="text-xs font-mono font-bold text-[#D77757] bg-[#D77757]/10 px-2 py-1 rounded w-fit">
                {e.method}
              </span>
              <code className="text-sm font-mono text-[#f5f0eb]">{e.path}</code>
              <span className="text-xs text-[#5a4a3a] font-mono hidden sm:block">
                {e.body}
              </span>
              <span className="text-sm text-[#6a5a4a] sm:ml-auto">{e.desc}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-[#4a3a2a]">
          All endpoints require{" "}
          <code className="font-mono text-[#D77757]">Authorization: Bearer rnai_sk_...</code>{" "}
          header.
        </p>
      </section>

      <footer className="border-t border-[#1e1b18] px-6 py-8 text-center text-sm text-[#4a3a2a]">
        © 2024 Rnai.io
      </footer>
    </div>
  );
}
