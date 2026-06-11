import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Decorative background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D77757] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-blob animation-delay-2000"></div>

      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-5xl mx-auto w-full z-10 mt-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] mb-8 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-medium text-gray-300 tracking-wide uppercase">Phase 2: Text & Image APIs Live</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-outfit font-extrabold tracking-tight text-center leading-[1.1] mb-6">
          The Ultimate <br/>
          <span className="text-gradient">AI API Gateway</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 text-center max-w-2xl mb-10 leading-relaxed font-light">
          Generate, edit, summarize, and extract data using the world's most powerful AI models. 
          Integrate text, image, and soon audio with one simple, elegant API.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/auth/signup"
            className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] text-center"
          >
            Start Building for Free
          </Link>
          <Link
            href="https://github.com/rnai-io"
            target="_blank"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/[0.05] text-white font-medium rounded-full border border-white/[0.1] hover:bg-white/[0.1] transition-all text-center"
          >
            Read Documentation
          </Link>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-24">
          {[
            { title: "One API, All Models", desc: "Access HuggingFace, Together AI, OpenRouter, and more through a unified schema.", icon: "🌌" },
            { title: "Blazing Fast Edge", desc: "Powered by Next.js Edge, Redis Rate Limiting, and Global Object Storage.", icon: "⚡" },
            { title: "Pay-As-You-Go", desc: "Transparent billing with no hidden fees. Buy credits with Stripe instantly.", icon: "💳" }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-8 rounded-2xl hover:-translate-y-1 transition-transform duration-300 flex flex-col items-center text-center">
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="font-outfit font-bold text-xl text-white mb-3">{feature.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="z-10 mt-20 border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Rnai.io</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <a href="mailto:naiguitarfolk@gmail.com" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
