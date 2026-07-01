"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

interface BillingData {
  freeCreditsRemaining: number;
  paidCreditsBalance: number;
}

const QUICK_SKILLS = [
  { id: "image/generate", icon: "🎨", th: "สร้างรูปภาพ", en: "Generate Image", from: "#9333EA", to: "#c084fc" },
  { id: "image/edit", icon: "🖌️", th: "แก้ไขรูปภาพ", en: "Edit Image", from: "#0EA5E9", to: "#38bdf8" },
  { id: "image/remove-background", icon: "✂️", th: "ลบพื้นหลัง", en: "Remove BG", from: "#10B981", to: "#34d399" },
  { id: "image/upscale", icon: "🔍", th: "เพิ่มความคมชัด", en: "Upscale", from: "#F59E0B", to: "#fbbf24" },
  { id: "text/generate", icon: "✍️", th: "เขียนข้อความ", en: "Write Text", from: "#8B5CF6", to: "#a78bfa" },
  { id: "text/translate", icon: "🌐", th: "แปลภาษา", en: "Translate", from: "#14B8A6", to: "#2dd4bf" },
  { id: "audio/tts", icon: "🔊", th: "ข้อความเป็นเสียง", en: "Text to Speech", from: "#EC4899", to: "#f472b6" },
  { id: "website/generate", icon: "💻", th: "สร้างเว็บไซต์", en: "Build Website", from: "#D77757", to: "#e89073" },
];

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const router = useRouter();
  const { language } = useLanguage();

  const t = translations[language];
  const th = language === "th";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        setEmail(user.email);
        try {
          const billingRes = await fetch("/api/billing/me");
          if (billingRes.ok) setBilling(await billingRes.json());
        } catch (e) {
          console.error("Failed to fetch dashboard data", e);
        }
        setReady(true);
      }
    });
    return unsub;
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#D77757] border-t-transparent rounded-full animate-spin"></div>
          {t.common.loading}
        </div>
      </div>
    );
  }

  const totalCredits = billing ? billing.freeCreditsRemaining + billing.paidCreditsBalance : 0;
  const isPaid = (billing?.paidCreditsBalance || 0) > 0;
  const lowCredits = totalCredits < 100;
  const greetingName = email ? email.split("@")[0] : "";

  const go = (path: string) => router.push(path);

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      <Navbar />

      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-[32rem] h-[32rem] bg-[#D77757]/20 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none absolute top-1/3 -left-32 w-[28rem] h-[28rem] bg-[#9333EA]/10 rounded-full blur-[140px]"></div>

      <main className="max-w-5xl mx-auto px-5 sm:px-6 w-full relative z-10 animate-fade-in">
        {/* ── Hero ── */}
        <section className="mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/10 text-gray-300 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            {th ? "ออนไลน์" : "Online"} · {email}
          </span>
          <h1 className="font-outfit text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            <span className="text-white">{th ? "สวัสดี, " : "Hi, "}</span>
            <span className="text-gradient">{greetingName}</span>
            <span className="text-white"> 👋</span>
          </h1>
          <p className="mt-3 text-gray-400 max-w-xl">
            {th
              ? "ยินดีต้อนรับสู่ Workspace ของคุณ — สร้างสรรค์ด้วย AI 18 สกิลในที่เดียว"
              : "Welcome to your workspace — create with 18 AI skills in one place."}
          </p>
        </section>

        {/* ── Stat cards ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Credits (hero stat) */}
          <div className="col-span-2 lg:col-span-2 relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#D77757]/25 via-[#D77757]/10 to-transparent border border-[#D77757]/25">
            <div className="absolute -top-10 -right-8 w-40 h-40 bg-[#D77757]/20 rounded-full blur-3xl"></div>
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#F0CBB6]/80">
                {th ? "เครดิตคงเหลือ" : "Available Credits"}
              </p>
              <p className="mt-2 text-5xl font-outfit font-bold text-white">{totalCredits.toLocaleString()}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-300">
                <span>{th ? "ฟรี" : "Free"}: <b className="text-white">{(billing?.freeCreditsRemaining || 0).toLocaleString()}</b></span>
                <span className="w-px h-3 bg-white/15"></span>
                <span>{th ? "เติม" : "Paid"}: <b className="text-white">{(billing?.paidCreditsBalance || 0).toLocaleString()}</b></span>
              </div>
              <button
                onClick={() => go("/dashboard/billing")}
                className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-[#D77757] text-white hover:bg-[#e08561] transition-colors shadow-lg shadow-[#D77757]/20"
              >
                {th ? "เติมเครดิต" : "Top up"} →
              </button>
            </div>
          </div>

          {/* Plan */}
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{th ? "แพ็กเกจ" : "Plan"}</p>
            <p className="mt-2 text-2xl font-outfit font-bold text-white">
              {isPaid ? (th ? "จ่ายตามใช้" : "Pay-as-you-go") : (th ? "ฟรี" : "Free")}
            </p>
            <span className={`mt-2 inline-block w-fit px-2 py-0.5 rounded-full text-[11px] font-bold ${isPaid ? "bg-green-500/15 text-green-400" : "bg-white/10 text-gray-300"}`}>
              {isPaid ? "PRO" : "STARTER"}
            </span>
          </div>

          {/* Active skills */}
          <div className="glass-card rounded-3xl p-6 flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{th ? "สกิลพร้อมใช้" : "Active Skills"}</p>
            <p className="mt-2 text-2xl font-outfit font-bold text-blue-400">18</p>
            <p className="mt-1 text-[11px] text-gray-500">{th ? "ภาพ · ข้อความ · เสียง · เว็บ" : "Image · Text · Audio · Web"}</p>
          </div>
        </section>

        {/* ── Upgrade banner (free / low credits) ── */}
        {(!isPaid || lowCredits) && (
          <section className="mb-10 relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#9333EA]/25 via-[#D77757]/20 to-[#D77757]/10 border border-white/10">
            <div className="absolute -bottom-12 -right-6 w-48 h-48 bg-[#D77757]/25 rounded-full blur-3xl"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-outfit text-xl font-bold text-white flex items-center gap-2">
                  ⭐ {th ? "อัปเกรดเป็น Pro" : "Upgrade to Pro"}
                </h3>
                <p className="mt-1 text-sm text-gray-300 max-w-md">
                  {th
                    ? "เติมเครดิตครั้งเดียว ใช้ได้ทุกสกิล ไม่มีวันหมดอายุ เริ่มต้นเพียง $5 รับ 600 เครดิต"
                    : "One top-up, every skill, credits never expire. From $5 for 600 credits."}
                </p>
              </div>
              <button
                onClick={() => go("/dashboard/billing")}
                className="shrink-0 px-6 py-3 rounded-xl text-sm font-semibold bg-white text-black hover:bg-gray-100 transition-colors shadow-lg"
              >
                {th ? "ดูแพ็กเกจ" : "View plans"}
              </button>
            </div>
          </section>
        )}

        {/* ── Quick start skills ── */}
        <section className="mb-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="font-outfit text-2xl font-bold text-white">{th ? "เริ่มสร้างเลย" : "Start creating"}</h2>
              <p className="text-sm text-gray-400 mt-0.5">{th ? "เลือกสกิลแล้วลุยได้ทันทีใน Playground" : "Pick a skill and jump into the Playground"}</p>
            </div>
            <button onClick={() => go("/dashboard/playground")} className="text-sm text-[#D77757] hover:text-[#e89073] font-medium whitespace-nowrap">
              {th ? "ดูทั้งหมด" : "See all"} →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_SKILLS.map((s) => (
              <button
                key={s.id}
                onClick={() => go(`/dashboard/playground?skill=${encodeURIComponent(s.id)}`)}
                className="group glass-card rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `linear-gradient(135deg, ${s.from}33, ${s.to}22)` }}
                >
                  {s.icon}
                </div>
                <p className="text-sm font-semibold text-white leading-tight">{th ? s.th : s.en}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ── Rewards ── */}
        <section className="mb-2">
          <button
            onClick={() => go("/rewards")}
            className="group relative w-full overflow-hidden rounded-3xl p-6 sm:p-8 text-left border border-yellow-500/25 bg-gradient-to-br from-yellow-500/15 via-[#D77757]/15 to-[#9333EA]/10 transition-all duration-300 hover:-translate-y-1 hover:border-yellow-500/40"
          >
            <div className="pointer-events-none absolute -top-10 -right-6 w-52 h-52 bg-yellow-500/20 rounded-full blur-3xl"></div>
            <div className="pointer-events-none absolute -bottom-16 left-1/4 w-52 h-52 bg-[#D77757]/20 rounded-full blur-3xl"></div>
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/30 to-[#D77757]/25 flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform">
                🏆
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-outfit text-xl font-bold text-white">RNAI Rewards</h3>
                  <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold uppercase tracking-wider">
                    {th ? "ใหม่" : "New"}
                  </span>
                </div>
                <p className="text-sm text-gray-300 max-w-lg leading-relaxed">
                  {th
                    ? "ยิ่งสร้าง ยิ่งได้คะแนน — ลุ้น 10 รางวัลทุกเดือน และ 20 รางวัลใหญ่ประจำปี"
                    : "Create more, earn more points — 10 prizes every month + 20 grand prizes yearly."}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-xl text-sm font-semibold bg-white text-black group-hover:bg-yellow-100 transition-colors">
                {th ? "ดูรางวัล" : "View rewards"} →
              </span>
            </div>
          </button>
        </section>

      </main>
    </div>
  );
}
