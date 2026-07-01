"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PRODUCTS, hasAccess, type Platform, type Tier } from "@/lib/products";

const PLATFORM_LABEL: Record<Platform, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web",
  windows: "Windows",
  mac: "macOS",
};

const TIER_LABEL: Record<Tier, string> = {
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
};

// Static landing site (Netlify) — per-app detail pages live at /<id>.html
const LANDING_BASE = "https://rnai-io.netlify.app";

export default function ProductsPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [tier, setTier] = useState<Tier>("free");
  const { language } = useLanguage();
  const th = language === "th";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setSignedIn(!!user);
      if (user) {
        try {
          const res = await fetch("/api/billing/me");
          if (res.ok) {
            const data = await res.json();
            setTier((data.tier as Tier) || "free");
          }
        } catch {
          /* ignore */
        }
      }
      setReady(true);
    });
    return unsub;
  }, []);

  // Scroll-reveal: fade/slide cards in as they enter the viewport
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("reveal-in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <span data-reveal className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#D77757]/10 text-[#D77757] border border-[#D77757]/20 mb-4">
            {th ? "ศูนย์รวมแอป" : "App Hub"}
          </span>
          <h1 data-reveal style={{ transitionDelay: "70ms" }} className="font-outfit text-4xl sm:text-5xl font-bold tracking-tight text-gradient animate-gradient-text">
            {th ? "ดาวน์โหลดผลงานของเรา" : "Download our apps"}
          </h1>
          <p data-reveal style={{ transitionDelay: "140ms" }} className="mt-4 text-gray-400 max-w-xl mx-auto">
            {th
              ? "ปลดล็อกดาวน์โหลดตามระดับสมาชิก — Starter · Pro · Enterprise"
              : "Downloads unlock by membership tier — Starter · Pro · Enterprise."}
          </p>
          {ready && signedIn && (
            <p className="mt-3 text-sm text-gray-300">
              {th ? "ระดับของคุณ: " : "Your tier: "}
              <span className="font-semibold text-[#D77757]">{TIER_LABEL[tier]}</span>
              {tier === "free" && (
                <>
                  {" · "}
                  <Link href="/dashboard/billing" className="underline hover:text-white">
                    {th ? "สมัครสมาชิก" : "Become a member"}
                  </Link>
                </>
              )}
            </p>
          )}
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {PRODUCTS.map((p, i) => {
            const platforms = Object.keys(p.downloads).filter(
              (k) => p.downloads[k as Platform]
            ) as Platform[];
            const hasDownloads = platforms.length > 0;
            const unlocked = hasAccess(tier, p.tier);
            return (
              <div
                key={p.id}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                className="glass-card rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{ backgroundColor: `${p.color}1A` }}
                  >
                    {p.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-outfit text-xl font-bold">{p.name}</h2>
                      <span className="text-[11px] font-medium text-gray-400 bg-white/[0.06] border border-white/10 rounded-full px-2 py-0.5">
                        v{p.version}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-400 leading-snug">
                      {th ? p.taglineTh : p.tagline}
                    </p>
                  </div>
                  {/* Required-tier badge */}
                  <span
                    className={`shrink-0 text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5 py-1 border ${
                      unlocked
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-white/[0.05] text-gray-400 border-white/10"
                    }`}
                  >
                    {unlocked ? "✓ " : "🔒 "}
                    {TIER_LABEL[p.tier]}
                  </span>
                </div>

                {/* Platform chips */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.platforms.map((pl) => (
                    <span
                      key={pl}
                      className="text-[11px] font-medium text-gray-300 bg-white/[0.05] border border-white/10 rounded-md px-2 py-1"
                    >
                      {PLATFORM_LABEL[pl]}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                  {!ready ? (
                    <div className="h-9 w-32 rounded-lg bg-white/[0.05] animate-pulse" />
                  ) : !signedIn ? (
                    <Link
                      href="/auth/login?next=/products"
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-white text-black hover:bg-gray-200 transition-colors"
                    >
                      {th ? "เข้าสู่ระบบ" : "Sign in"}
                    </Link>
                  ) : !hasDownloads ? (
                    <span className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white/[0.04] border border-white/10 cursor-not-allowed">
                      {th ? "เร็วๆ นี้" : "Coming soon"}
                    </span>
                  ) : unlocked ? (
                    platforms.map((pl) => (
                      <a
                        key={pl}
                        href={`/api/downloads/${p.id}?platform=${pl}`}
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                        style={{ backgroundColor: p.color }}
                      >
                        {th ? "ดาวน์โหลด" : "Download"} · {PLATFORM_LABEL[pl]}
                      </a>
                    ))
                  ) : (
                    <Link
                      href={`/dashboard/billing?upgrade=${p.tier}&product=${p.id}`}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/10 text-white border border-white/15 hover:bg-white/20 transition-colors"
                    >
                      🔒 {th ? `สมัคร ${TIER_LABEL[p.tier]} เพื่อปลดล็อก` : `Upgrade to ${TIER_LABEL[p.tier]} to unlock`}
                    </Link>
                  )}
                  <a
                    href={p.landing || `${LANDING_BASE}/${p.id}.html`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-300 border border-white/10 hover:border-[#D77757]/50 hover:text-white hover:bg-white/[0.04] transition-all"
                  >
                    {th ? "รายละเอียด" : "Details"} →
                  </a>
                  {p.webApp && (
                    <a
                      href={p.webApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                      style={{ backgroundColor: `${p.color}26`, border: `1px solid ${p.color}66` }}
                    >
                      🌐 {th ? "เว็บแอป" : "Web app"}
                    </a>
                  )}
                  {p.store?.android && (
                    <a
                      href={p.store.android}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#01875f] hover:opacity-90 transition-all"
                    >
                      ▶ Google Play
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
