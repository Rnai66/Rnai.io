"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import ApiKeyManager from "@/components/ApiKeyManager";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

interface BillingData {
  freeCreditsRemaining: number;
  paidCreditsBalance: number;
}

interface UsageEntry {
  id: string;
  skill: string;
  provider: string | null;
  status: string;
  latencyMs: number | null;
  createdAt: string | null;
}

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [usage, setUsage] = useState<UsageEntry[]>([]);
  const router = useRouter();
  const { language } = useLanguage();

  const t = translations[language];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        setEmail(user.email);
        try {
          const [billingRes, usageRes] = await Promise.all([
            fetch("/api/billing/me"),
            fetch("/api/usage?limit=10"),
          ]);
          if (billingRes.ok) setBilling(await billingRes.json());
          if (usageRes.ok) {
            const data = await usageRes.json();
            setUsage(data.usage || []);
          }
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

  const totalCredits = billing 
    ? billing.freeCreditsRemaining + billing.paidCreditsBalance 
    : 0;

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      <Navbar />
      
      {/* Background blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full mix-blend-screen filter blur-[128px]"></div>

      <main className="max-w-4xl mx-auto px-6 w-full relative z-10 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-outfit font-bold text-white tracking-tight">{t.dashboard.welcome}</h1>
            <p className="text-sm text-gray-400 mt-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {email}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/billing")}
              className="px-5 py-2.5 bg-[#D77757]/20 hover:bg-[#D77757]/30 text-[#D77757] rounded-xl text-sm font-medium transition-all backdrop-blur-md border border-[#D77757]/30 hover:border-[#D77757]/50 shadow-lg"
            >
              💳 {t.billing?.title || "Billing"}
            </button>
            <button
              onClick={() => router.push("/dashboard/playground")}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all backdrop-blur-md border border-white/10 shadow-lg"
            >
              {t.common.openPlayground} &rarr;
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: t.dashboard.currentPlan, value: billing?.paidCreditsBalance ? t.dashboard.payAsYouGo : t.dashboard.freeTier, color: "text-white" },
            { label: t.dashboard.availableCredits, value: totalCredits.toLocaleString(), color: "text-[#D77757]" },
            { label: t.dashboard.activeSkills, value: "12", color: "text-blue-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="glass-card p-6 rounded-2xl flex flex-col justify-center"
            >
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">{s.label}</p>
              <p className={`text-2xl font-outfit font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="glass-card p-6 md:p-8 rounded-3xl">
          <ApiKeyManager />
        </div>

        <div className="glass-card p-6 md:p-8 rounded-3xl mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-outfit font-bold text-white mb-2">{t.dashboard.usageHistory}</h2>
            <p className="text-sm text-gray-400">{t.dashboard.latestApiCalls}</p>
          </div>

          {usage.length === 0 ? (
            <div className="text-center py-10 bg-black/20 rounded-2xl border border-white/5 border-dashed">
              <p className="text-sm text-gray-400">{t.dashboard.noUsageYet}</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/30">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-4 font-medium">{t.dashboard.skillColumn}</th>
                    <th className="px-5 py-4 font-medium hidden sm:table-cell">{t.dashboard.providerColumn}</th>
                    <th className="px-5 py-4 font-medium hidden md:table-cell">{t.dashboard.latencyColumn}</th>
                    <th className="px-5 py-4 font-medium">{t.dashboard.statusColumn}</th>
                    <th className="px-5 py-4 font-medium text-right hidden sm:table-cell">{t.dashboard.timeColumn}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usage.map((entry) => (
                    <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4 font-medium text-white">{entry.skill}</td>
                      <td className="px-5 py-4 text-gray-400 hidden sm:table-cell">{entry.provider || "-"}</td>
                      <td className="px-5 py-4 text-gray-400 hidden md:table-cell">
                        {entry.latencyMs ? `${entry.latencyMs}ms` : "-"}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          entry.status === "success"
                            ? "bg-green-500/10 text-green-400"
                            : entry.status === "cached"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-red-500/10 text-red-400"
                        }`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-right hidden sm:table-cell">
                        {entry.createdAt ? new Date(entry.createdAt).toLocaleString(language === "th" ? "th-TH" : "en-US") : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
