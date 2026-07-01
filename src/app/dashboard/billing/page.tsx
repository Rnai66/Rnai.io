"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { translations } from "@/lib/i18n/translations";

interface BillingData {
  freeCreditsRemaining: number;
  paidCreditsBalance: number;
}

const TOPUP_PACKS = [
  { id: "pack_5", name: "Starter", price: 5, credits: 600, popular: false },
  { id: "pack_20", name: "Pro", price: 20, credits: 2500, popular: true },
  { id: "pack_100", name: "Enterprise", price: 100, credits: 13500, popular: false },
];

function BillingPageContent() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [billing, setBilling] = useState<BillingData | null>(null);
  const [loadingPack, setLoadingPack] = useState<string | null>(null);
  const [voucher, setVoucher] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const { language } = useLanguage();

  const t = translations[language];
  const th = language === "th";

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

  const handleRedeem = async () => {
    if (!voucher.trim()) return;
    setRedeeming(true);
    setRedeemMsg(null);
    try {
      const res = await fetch("/api/billing/truemoney/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucher: voucher.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setRedeemMsg({
          ok: true,
          text: th
            ? `เติมสำเร็จ +${(data.credits_added || 0).toLocaleString()} เครดิต (${data.amount_baht} บาท)`
            : `Added +${(data.credits_added || 0).toLocaleString()} credits (฿${data.amount_baht})`,
        });
        setVoucher("");
        fetchBilling();
      } else {
        setRedeemMsg({ ok: false, text: data.message || (th ? "เติมไม่สำเร็จ" : "Redeem failed") });
      }
    } catch {
      setRedeemMsg({ ok: false, text: th ? "เครือข่ายขัดข้อง" : "Network error" });
    }
    setRedeeming(false);
  };

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
      
      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-[32rem] h-[32rem] bg-[#D77757]/20 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none absolute top-1/3 -left-32 w-[28rem] h-[28rem] bg-[#9333EA]/10 rounded-full blur-[140px]"></div>

      <main className="max-w-4xl mx-auto px-6 w-full relative z-10 animate-fade-in">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#D77757]/10 border border-[#D77757]/20 text-[#D77757] mb-3">
              💳 {th ? "เครดิต & แพ็กเกจ" : "Credits & Billing"}
            </span>
            <h1 className="font-outfit text-4xl sm:text-5xl font-bold tracking-tight text-gradient">{t.billing.title}</h1>
            <p className="text-sm text-gray-400 mt-2">{t.billing.subtitle}</p>
          </div>
          <button onClick={() => router.push("/dashboard")} className="text-sm text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10">
            &larr; {t.common.backToDashboard}
          </button>
        </div>

        {topupStatus === "success" && (
          <div className="mb-8 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-xl">🎉</span> {t.billing.paymentSuccess}
          </div>
        )}

        {topupStatus === "cancelled" && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-xl">❌</span> {t.billing.paymentCancelled}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="glass-card p-8 rounded-2xl">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t.billing.totalAvailableCredits}</p>
            <p className="text-5xl font-outfit font-bold text-white mb-1">{totalCredits.toLocaleString()}</p>
            <p className="text-sm text-green-400">{t.billing.readyToUse}</p>
          </div>
          <div className="glass-card p-8 rounded-2xl flex flex-col justify-center gap-4">
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-sm text-gray-400">{t.billing.freeQuota}</span>
              <span className="text-lg font-outfit font-bold text-white">{billing?.freeCreditsRemaining.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">{t.billing.paidBalance}</span>
              <span className="text-lg font-outfit font-bold text-[#D77757]">{billing?.paidCreditsBalance.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-2xl font-outfit font-bold text-white">{t.billing.topupPacks}</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-[#D77757]/20 text-[#D77757] text-xs font-bold uppercase tracking-wider">{t.billing.noExpiry}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TOPUP_PACKS.map((pack) => (
            <div key={pack.id} className={`glass-card p-8 rounded-3xl relative flex flex-col transition-all duration-300 hover:-translate-y-1 ${pack.popular ? 'border-[#D77757]/50 shadow-[0_0_40px_rgba(215,119,87,0.1)]' : 'border-white/5 hover:border-white/20'}`}>
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D77757] to-[#e89073] text-white text-[10px] font-bold uppercase tracking-wider py-1 px-4 rounded-full shadow-lg">
                  {t.billing.mostPopular}
                </div>
              )}
              
              <h3 className="text-xl font-outfit font-bold text-white mb-2">{pack.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">${pack.price}</span>
              </div>
              
              <div className="mb-8 p-4 rounded-xl bg-black/30 border border-white/5">
                <p className="text-[#D77757] font-bold text-lg">{pack.credits.toLocaleString()}</p>
                <p className="text-xs text-gray-400 mt-1">{t.billing.aiCredits}</p>
              </div>
              
              <div className="mt-auto">
                <button
                  onClick={() => handleCheckout(pack.id)}
                  disabled={loadingPack === pack.id}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 ${pack.popular ? 'bg-white text-black hover:bg-gray-200 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'} disabled:opacity-50 flex justify-center items-center`}
                >
                  {loadingPack === pack.id ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : t.billing.buyNow}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* TrueMoney top-up */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-outfit font-bold text-white">
              {th ? "เติมเงินด้วยทรูมันนี่" : "Top up with TrueMoney"}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ff6a13]/20 text-[#ff8a4c] text-xs font-bold uppercase tracking-wider">
              TrueMoney
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* QR transfer */}
            <div className="glass-card p-8 rounded-3xl flex flex-col items-center text-center">
              <p className="text-sm text-gray-400 mb-4">
                {th ? "สแกนด้วยแอปทรูมันนี่เพื่อโอนเข้าบัญชี" : "Scan with the TrueMoney app to transfer"}
              </p>
              <div className="bg-white rounded-2xl p-3 w-48 h-48 flex items-center justify-center">
                {/* วางไฟล์ QR จริงที่ public/truemoney-qr.png */}
                <img
                  src="/truemoney-qr.png"
                  alt="TrueMoney QR"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.display = "none";
                    const ph = img.nextElementSibling as HTMLElement | null;
                    if (ph) ph.style.display = "flex";
                  }}
                />
                <div
                  style={{ display: "none" }}
                  className="flex-col items-center justify-center text-center text-gray-400 text-[11px] px-3 leading-relaxed"
                >
                  {th ? "วางไฟล์ QR ที่ public/truemoney-qr.png" : "Add QR file at public/truemoney-qr.png"}
                </div>
              </div>
              <p className="mt-4 font-outfit font-bold text-white">ชนะ คง***</p>
              <p className="text-xs text-gray-400">บัญชีทรูมันนี่ · 095-***-7090</p>
              <p className="mt-3 text-[11px] text-gray-500 max-w-xs">
                {th
                  ? "โอนแล้วนำลิงก์ซองของขวัญ (อังเปา) มาเติมด้านขวาเพื่อรับเครดิตทันที"
                  : "After transfer, paste a gift link on the right for instant credit"}
              </p>

              <div className="mt-5 w-full">
                <div className="w-full py-3 rounded-xl font-semibold text-sm flex justify-center items-center gap-2 bg-white/[0.04] border border-white/10 text-gray-500 cursor-not-allowed">
                  📤 {th ? "อัปโหลดสลิปการโอน" : "Upload transfer slip"}
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                    {th ? "เร็วๆ นี้" : "Soon"}
                  </span>
                </div>
              </div>
            </div>

            {/* Gift voucher redeem (auto credit) */}
            <div className="glass-card p-8 rounded-3xl flex flex-col">
              <h3 className="text-lg font-outfit font-bold text-white mb-1">
                {th ? "เติมด้วยซองอังเปา (อัตโนมัติ)" : "Redeem gift voucher (instant)"}
              </h3>
              <p className="text-xs text-gray-400 mb-5">
                {th
                  ? "วางลิงก์ของขวัญทรูมันนี่ (gift.truemoney.com) หรือรหัส แล้วรับเครดิตทันที"
                  : "Paste a TrueMoney gift link or code to get credits instantly"}
              </p>
              <input
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleRedeem()}
                placeholder="https://gift.truemoney.com/campaign/?v=..."
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#D77757]/60 mb-3"
              />
              <button
                onClick={handleRedeem}
                disabled={redeeming || !voucher.trim()}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#ff6a13] text-white hover:bg-[#ff7d31] disabled:opacity-50 transition-all flex justify-center items-center"
              >
                {redeeming ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                ) : th ? (
                  "เติมเครดิต"
                ) : (
                  "Redeem"
                )}
              </button>
              {redeemMsg && (
                <div
                  className={`mt-4 p-3 rounded-xl text-sm ${
                    redeemMsg.ok
                      ? "bg-green-500/10 border border-green-500/20 text-green-400"
                      : "bg-red-500/10 border border-red-500/20 text-red-400"
                  }`}
                >
                  {redeemMsg.text}
                </div>
              )}
              <p className="mt-auto pt-4 text-[11px] text-gray-500">
                {th ? "อัตรา 3 เครดิต / 1 บาท" : "3 credits per ฿1"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#D77757] border-t-transparent rounded-full animate-spin"></div></div>}>
      <BillingPageContent />
    </Suspense>
  );
}
