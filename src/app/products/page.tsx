"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { PRODUCTS, type Platform } from "@/lib/products";

const PLATFORM_LABEL: Record<Platform, string> = {
  ios: "iOS",
  android: "Android",
  web: "Web",
  windows: "Windows",
  mac: "macOS",
};

export default function ProductsPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const { language } = useLanguage();
  const th = language === "th";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setSignedIn(!!user);
      setReady(true);
    });
    return unsub;
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#D77757]/10 text-[#D77757] border border-[#D77757]/20 mb-4">
            {th ? "ศูนย์รวมแอป" : "App Hub"}
          </span>
          <h1 className="font-outfit text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            {th ? "ดาวน์โหลดผลงานของเรา" : "Download our apps"}
          </h1>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            {th
              ? "แอปและซอฟต์แวร์ทั้งหมดจาก Rnai.io — ฟรีสำหรับสมาชิก เพียงเข้าสู่ระบบก็ดาวน์โหลดได้"
              : "Every app and tool from Rnai.io — free for members. Just sign in to download."}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {PRODUCTS.map((p) => {
            const platforms = Object.keys(p.downloads).filter(
              (k) => p.downloads[k as Platform]
            ) as Platform[];
            const hasDownloads = platforms.length > 0;
            return (
              <div
                key={p.id}
                className="glass-card rounded-2xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                    style={{ backgroundColor: `${p.color}1A` }}
                  >
                    {p.icon}
                  </div>
                  <div className="min-w-0">
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
                      {th ? "เข้าสู่ระบบเพื่อดาวน์โหลด" : "Sign in to download"}
                    </Link>
                  ) : hasDownloads ? (
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
                    <span className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 bg-white/[0.04] border border-white/10 cursor-not-allowed">
                      {th ? "เร็วๆ นี้" : "Coming soon"}
                    </span>
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
