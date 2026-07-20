"use client";
import { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err?.message || t.auth.signupError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Background blurs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-blob"></div>

      <main className="flex-1 flex items-center justify-center p-6 z-10 pt-24">
        <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-3xl animate-fade-in relative overflow-hidden">
          {/* Subtle glow inside card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#D77757] rounded-full filter blur-[80px] opacity-20"></div>

          <h1 className="font-outfit text-3xl font-bold text-center mb-2">{t.auth.createAccountTitle}</h1>
          <p className="text-gray-400 text-center text-sm mb-8">{t.auth.createAccountSubtitle}</p>

          <form onSubmit={handleSignup} className="space-y-5">
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
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">{t.auth.password}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 focus:border-[#D77757]/50 transition-all"
                placeholder="••••••••"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D77757] text-white font-semibold rounded-xl py-3.5 hover:bg-[#c0664a] transition-all shadow-[0_0_20px_rgba(215,119,87,0.3)] hover:shadow-[0_0_30px_rgba(215,119,87,0.5)] hover:-translate-y-0.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              )}
              {loading ? t.auth.signingUp : t.auth.signUp}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-8">
            {t.auth.alreadyHaveAccount}{" "}
            <Link href="/auth/login" className="text-white font-medium hover:underline">
              {t.auth.login}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
