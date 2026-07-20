"use client";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err?.message || t.auth.resetPasswordError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#D77757] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob"></div>

      <main className="flex-1 flex items-center justify-center p-6 z-10 pt-24">
        <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-3xl animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#D77757] rounded-full filter blur-[80px] opacity-20"></div>

          <h1 className="font-outfit text-3xl font-bold text-center mb-2">{t.auth.resetPasswordTitle}</h1>
          <p className="text-gray-400 text-center text-sm mb-8">{t.auth.resetPasswordSubtitle}</p>

          {sent ? (
            <div className="space-y-6">
              <p className="text-sm text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20 text-center">
                {t.auth.resetEmailSent}
              </p>
              <Link
                href="/auth/login"
                className="block w-full text-center bg-white text-black font-semibold rounded-xl py-3.5 hover:bg-gray-200 transition-all"
              >
                {t.auth.backToLogin}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.auth.emailAddress}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 focus:border-[#D77757]/50 transition-all"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-semibold rounded-xl py-3.5 hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                )}
                {loading ? t.auth.sendingResetLink : t.auth.sendResetLink}
              </button>

              <p className="text-center text-sm text-gray-400 mt-2">
                <Link href="/auth/login" className="text-[#D77757] font-medium hover:underline">
                  {t.auth.backToLogin}
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
