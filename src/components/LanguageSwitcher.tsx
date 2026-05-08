"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useEffect, useState } from "react";

export default function LanguageSwitcher() {
  const [mounted, setMounted] = useState(false);

  try {
    const { language, setLanguage } = useLanguage();

    // Only render on client side
    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }

    return (
      <div className="flex gap-1 items-center">
        <button
          onClick={() => setLanguage("en")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            language === "en"
              ? "bg-[#D77757] text-white"
              : "bg-white/10 text-gray-400 hover:bg-white/20"
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("th")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            language === "th"
              ? "bg-[#D77757] text-white"
              : "bg-white/10 text-gray-400 hover:bg-white/20"
          }`}
        >
          TH
        </button>
      </div>
    );
  } catch {
    // If LanguageProvider is not available, return null
    return null;
  }
}
