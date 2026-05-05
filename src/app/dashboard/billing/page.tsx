"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";

interface BillingData {
  freeCreditsRemaining: number;
  paidCreditsBalance: number;
}

const TOPUP_PACKS = [
  { id: "pack_5", name: "Starter", price: 5, credits: 600, popular: false },
  { id: "pack_20", name: "Pro", price: 20, credits: 2500, popular: true },
  { id: "pack_100", name: "Enterprise", price: 100, credits: 13500, popular: false },
];

export default function BillingPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const topupStatus = searchParams.get("topup");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        setEmail(user.email);
        fetchBilling();
      }
    });
    return unsub;
  }, [router]);

  const fetchBilling = async () => {
    try {
      const res = await fetch("/api/billing/me");
      if (res.ok) {
        setBilling(await res.json());
      }
    } catch (e) {
      console.error("Failed to fetch billing", e);
    }
    setReady(true);
  };

  const handleCheckout = async (packId: string) => {
    setLoadingPack(packId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
    setLoadingPack(null);
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#D77757] border-t-transparent rounded-full animate-spin"></div>
          Loading billing data...
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
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-[#D77757] rounded-full mix-blend-screen filter blur-[128px] opacity-10"></div>

      <main className="max-w-4xl mx-auto px-6 w-full relative z-10 animate-fade-in">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-outfit font-bold tracking-tight text-white">Billing & Credits</h1>
            <p className="text-sm text-gray-400 mt-1.5">Manage your API credits and top-up packs</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10">
            &larr; Back to Dashboard
          </button>
        </div>

        {topupStatus === "success" && (
          <div className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-xl">🎉</span> Payment successful! Your credits have been added to your account.
          </div>
        )}
        
        {topupStatus === "cancelled" && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-xl">❌</span> Payment cancelled. No charges were made.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="glass-card p-8 rounded-2xl">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Total Available Credits</p>
            <p className="text-5xl font-outfit font-bold text-white mb-1">{totalCredits.toLocaleString()}</p>
            <p className="text-sm text-green-400">Ready to use across all APIs</p>
          </div>
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-center gap-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-sm text-gray-400">Free Quota</span>
              <span className="text-lg font-outfit font-bold text-white">{billing?.freeCreditsRemaining.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Paid Balance</span>
              <span className="text-lg font-outfit font-bold text-[#D77757]">{billing?.paidCreditsBalance.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-outfit font-bold text-white">Top-up Packs</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-[#D77757]/20 text-[#D77757] text-xs font-bold uppercase tracking-wider">No Expiry</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOPUP_PACKS.map((pack) => (
            <div key={pack.id} className={`glass-card p-8 rounded-3xl relative flex flex-col transition-all duration-300 hover:-translate-y-1 ${pack.popular ? 'border-[#D77757]/50 shadow-[0_0_40px_rgba(215,119,87,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D77757] to-[#e89073] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-outfit font-bold text-white mb-2">{pack.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${pack.price}</span>
              </div>
              
              <div className="mb-8 p-4 rounded-xl bg-black/30 border border-white/5">
                <p className="text-[#D77757] font-bold text-lg">{pack.credits.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">AI Credits</p>
              </div>
              
              <div className="mt-auto">
                <button
                  onClick={() => handleCheckout(pack.id)}
                  disabled={loadingPack === pack.id}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${pack.popular ? 'bg-white text-black hover:bg-gray-200 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'} disabled:opacity-50 flex justify-center items-center`}
                >
                  {loadingPack === pack.id ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : "Buy Now"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
