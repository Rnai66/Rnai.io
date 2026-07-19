"use client";
import Link from "next/link";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setEmail(user?.email ?? null));
    setMounted(true);
    return unsub;
  }, []);

  // Close the mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  const t = translations[language];

  const appsLabel = language === "th" ? "ดาวน์โหลด" : "Apps";

  const links = email
    ? [
        { href: "/dashboard", label: t.nav.dashboard },
        { href: "/dashboard/playground", label: t.nav.playground },
        { href: "/products", label: appsLabel },
        { href: "/dashboard/profile", label: t.nav.profile },
      ]
    : [
        { href: "/products", label: appsLabel },
        { href: "/auth/login", label: t.nav.logIn },
      ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href + "/"));

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto glass-card rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 w-full max-w-5xl transition-all duration-300">
        <div className="flex items-center justify-between gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="font-outfit font-bold text-lg sm:text-xl tracking-tight text-white flex items-center gap-2 group shrink-0"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 512 512"
              className="shrink-0 shadow-lg shadow-[#D77757]/20 rounded-lg group-hover:scale-105 transition-transform"
              aria-label="Rnai logo"
            >
              <defs>
                <linearGradient id="rnaiNavBg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#155E70" />
                  <stop offset="1" stopColor="#0B3945" />
                </linearGradient>
              </defs>
              <rect width="512" height="512" rx="116" fill="url(#rnaiNavBg)" />
              <path d="M 196 196 L 196 356" stroke="#FFFFFF" strokeWidth="62" strokeLinecap="round" fill="none" />
              <path d="M 196 300 Q 196 196 306 196" stroke="#FFFFFF" strokeWidth="62" strokeLinecap="round" fill="none" />
              <circle cx="382" cy="196" r="34" fill="#D77757" />
            </svg>
            Rnai<span className="text-[#D77757]">.io</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2 rounded-full transition-colors ${
                  isActive(l.href)
                    ? "text-white bg-white/[0.08]"
                    : "text-gray-300 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {!email && (
              <Link
                href="/auth/signup"
                className="ml-1 px-5 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
              >
                {t.nav.getStarted}
              </Link>
            )}
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            <LanguageSwitcher />
          </div>

          {/* Mobile: language + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              aria-label="Menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.06] border border-white/10 text-white hover:bg-white/[0.12] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden mt-3 pt-3 border-t border-white/10 flex flex-col gap-1 animate-fade-in">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(l.href) ? "text-white bg-white/[0.08]" : "text-gray-300 hover:text-white hover:bg-white/[0.05]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {!email && (
              <Link
                href="/auth/signup"
                className="mt-1 px-3 py-2.5 bg-white text-black rounded-xl text-sm font-semibold text-center hover:bg-gray-200 transition-colors"
              >
                {t.nav.getStarted}
              </Link>
            )}
          </div>
        )}
      </nav>
    </div>
  );
}
