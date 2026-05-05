"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import ApiKeyManager from "@/components/ApiKeyManager";

interface BillingData {
  freeCreditsRemaining: number;
  paidCreditsBalance: number;
}

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        setEmail(user.email);
        try {
          const res = await fetch("/api/billing/me");
          if (res.ok) {
            setBilling(await res.json());
          }
        } catch (e) {
          console.error("Failed to fetch billing", e);
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
          Loading your workspace...
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
            <h1 className="text-3xl font-outfit font-bold text-white tracking-tight">Welcome to Workspace</h1>
            <p className="text-sm text-gray-400 mt-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {email}
            </p>
          </div>
          <button 
            onClick={() => router.push("/dashboard/billing")}
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all backdrop-blur-md border border-white/10 shadow-lg"
          >
            Manage Billing &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { label: "Current Plan", value: billing?.paidCreditsBalance ? "Pay-As-You-Go" : "Free Tier", color: "text-white" },
            { label: "Available Credits", value: totalCredits.toLocaleString(), color: "text-[#D77757]" },
            { label: "Active Skills", value: "8+", color: "text-blue-400" },
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
      </main>
    </div>
  );
}
