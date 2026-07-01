"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface BoardRow { rank: number; name: string; points: number; prize: number; isMe: boolean }
interface BoardMe { rank: number | null; points: number; eligible: boolean; minPoints: number }
interface Board { period: string; pool: number; top: BoardRow[]; me: BoardMe }

const T = {
  th: {
    badge: "โปรแกรมรางวัล",
    title: "RNAI Points Rewards",
    subtitle: "ยิ่งสร้าง ยิ่งได้ — สะสมคะแนนจากการสร้างผลงาน ลุ้น 10 รางวัลทุกเดือน และ 20 รางวัลใหญ่ประจำปี",
    cta: "เริ่มสร้างผลงานเลย",
    earnTitle: "วิธีได้คะแนน",
    earn: [
      { icon: "⚡", title: "สร้างผลงาน", desc: "ใช้ 1 เครดิต = ได้ 1 คะแนน ทุก skill ทุกประเภท" },
      { icon: "🔥", title: "สร้างต่อเนื่อง", desc: "streak ครบ 7 วัน รับโบนัส +50 คะแนน" },
      { icon: "💳", title: "เติมเครดิต", desc: "เติมครั้งแรกของเดือน รับ +100 คะแนน" },
      { icon: "🤝", title: "ชวนเพื่อน", desc: "เพื่อนสมัครและใช้งานจริง +200 คะแนน/คน (สูงสุด 5 คน/เดือน)" },
    ],
    monthlyTitle: "🗓️ รางวัลประจำเดือน",
    monthlySub: "10 รางวัล · ตัดสินจากอันดับคะแนนสิ้นเดือน",
    monthly: [
      { rank: "🥇 อันดับ 1", prize: "1,500 เครดิต", extra: "badge 👑 + ผลงานขึ้น Featured", hot: true },
      { rank: "🥈 อันดับ 2", prize: "1,000 เครดิต", extra: "badge ผู้ชนะ", hot: true },
      { rank: "🥉 อันดับ 3", prize: "700 เครดิต", extra: "badge ผู้ชนะ", hot: true },
      { rank: "อันดับ 4–5", prize: "400 เครดิต", extra: "badge ผู้ชนะ", hot: false },
      { rank: "อันดับ 6–10", prize: "200 เครดิต", extra: "badge ผู้ชนะ", hot: false },
    ],
    yearlyTitle: "🏆 รางวัลใหญ่ประจำปี",
    yearlySub: "20 รางวัล · แชมป์คะแนนรวม 10 อันดับ + รางวัลพิเศษ 10 หมวด",
    champion: { title: "Creator of the Year", prize: "10,000 เครดิต", extra: "+ Pro ฟรี 12 เดือน + โล่ดิจิทัล" },
    yearly: [
      { rank: "🥈 อันดับ 2", prize: "5,000 เครดิต + Pro 6 เดือน" },
      { rank: "🥉 อันดับ 3", prize: "3,000 เครดิต + Pro 3 เดือน" },
      { rank: "อันดับ 4–5", prize: "1,500 เครดิต" },
      { rank: "อันดับ 6–10", prize: "800 เครดิต" },
    ],
    specialTitle: "รางวัลพิเศษ 10 หมวด (300 เครดิต + badge เฉพาะทาง)",
    special: ["🎨 นักสร้างภาพแห่งปี", "📝 นักเขียนแห่งปี", "💻 นักสร้างเว็บแห่งปี", "🔊 เสียงแห่งปี", "🌐 นักแปลแห่งปี", "🌟 ดาวรุ่งแห่งปี", "🔥 ขยันสุดแห่งปี", "🤝 ผู้แนะนำเพื่อนสูงสุด", "💬 ผู้ให้ Feedback ยอดเยี่ยม", "❤️ ขวัญใจชุมชน"],
    rulesTitle: "กติกาสำคัญ",
    rules: [
      "ตัดสินจากคะแนนสะสมจริงในรอบ (ไม่ใช่การจับฉลาก) — ผลจากระบบถือเป็นที่สิ้นสุด",
      "ผู้มีสิทธิ์: ยืนยันอีเมลแล้ว อายุบัญชี ≥ 7 วัน และใช้ ≥ 100 เครดิตในรอบ",
      "หนึ่งบัญชีรับได้ 1 รางวัลต่อรอบ — ตรวจพบหลายบัญชี/บอท ตัดสิทธิ์ทันที",
      "รางวัลเป็นเครดิตและสิทธิพิเศษภายในแพลตฟอร์ม แลกเงินสด/โอนไม่ได้ · เครดิตรางวัลมีอายุ 90 วัน",
      "ประกาศผลภายใน 7 วันหลังจบรอบ เครดิตเข้ากระเป๋าอัตโนมัติ",
      "มูลค่ารางวัลอาจปรับตามสัดส่วนยอดใช้งานรวมของรอบ (ประกาศล่วงหน้า ≥ 15 วัน)",
    ],
    footnote: "เริ่มนับคะแนนอัตโนมัติทันทีที่คุณสร้างผลงาน — ดูคะแนนของคุณได้ที่แท็บกระเป๋าในแอป Rnai.io",
  },
  en: {
    badge: "Rewards Program",
    title: "RNAI Points Rewards",
    subtitle: "Create more, earn more — collect points from every generation. 10 prizes every month, 20 grand prizes every year.",
    cta: "Start creating now",
    earnTitle: "How to earn points",
    earn: [
      { icon: "⚡", title: "Create", desc: "Spend 1 credit = earn 1 point, on every skill" },
      { icon: "🔥", title: "Keep a streak", desc: "7-day creation streak earns +50 bonus points" },
      { icon: "💳", title: "Top up", desc: "First top-up of the month earns +100 points" },
      { icon: "🤝", title: "Refer friends", desc: "Friend signs up & creates (≥50 credits): +200 points each (max 5/month)" },
    ],
    monthlyTitle: "🗓️ Monthly Rewards",
    monthlySub: "10 prizes · ranked by end-of-month points",
    monthly: [
      { rank: "🥇 Rank 1", prize: "1,500 credits", extra: "👑 badge + Featured showcase", hot: true },
      { rank: "🥈 Rank 2", prize: "1,000 credits", extra: "winner badge", hot: true },
      { rank: "🥉 Rank 3", prize: "700 credits", extra: "winner badge", hot: true },
      { rank: "Rank 4–5", prize: "400 credits", extra: "winner badge", hot: false },
      { rank: "Rank 6–10", prize: "200 credits", extra: "winner badge", hot: false },
    ],
    yearlyTitle: "🏆 Yearly Grand Prizes",
    yearlySub: "20 prizes · top-10 overall champions + 10 special categories",
    champion: { title: "Creator of the Year", prize: "10,000 credits", extra: "+ 12 months Pro + digital trophy" },
    yearly: [
      { rank: "🥈 Rank 2", prize: "5,000 credits + 6 months Pro" },
      { rank: "🥉 Rank 3", prize: "3,000 credits + 3 months Pro" },
      { rank: "Rank 4–5", prize: "1,500 credits" },
      { rank: "Rank 6–10", prize: "800 credits" },
    ],
    specialTitle: "10 special categories (300 credits + unique badge)",
    special: ["🎨 Image Creator of the Year", "📝 Writer of the Year", "💻 Web Builder of the Year", "🔊 Voice of the Year", "🌐 Translator of the Year", "🌟 Rising Star", "🔥 Longest Streak", "🤝 Top Referrer", "💬 Best Feedback", "❤️ Community Favorite"],
    rulesTitle: "Key rules",
    rules: [
      "Ranked by real accumulated points (no lottery) — system results are final",
      "Eligibility: verified email, account age ≥ 7 days, ≥ 100 credits used in the period",
      "One prize per account per period — multi-accounts/bots are disqualified",
      "Prizes are in-platform credits & perks, non-cashable and non-transferable · reward credits expire in 90 days",
      "Winners announced within 7 days; credits land in your wallet automatically",
      "Prize values may scale with the period's total usage (announced ≥ 15 days ahead)",
    ],
    footnote: "Points start counting automatically the moment you create — check yours in the Wallet tab of the Rnai.io app",
  },
};

export default function RewardsContent() {
  const { language, setLanguage } = useLanguage();
  const t = T[language === "th" ? "th" : "en"];
  const th = language === "th";

  // ── Live leaderboard (signed-in users) ──
  const [board, setBoard] = useState<Board | null>(null);
  const [boardState, setBoardState] = useState<"loading" | "ok" | "anon">("loading");
  useEffect(() => {
    fetch("/api/rewards/leaderboard")
      .then(async (res) => {
        if (res.status === 401) { setBoardState("anon"); return; }
        const data = await res.json();
        setBoard(data);
        setBoardState("ok");
      })
      .catch(() => setBoardState("anon"));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" lang={language}>
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#D77757] rounded-full mix-blend-screen filter blur-[128px] opacity-15 pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[128px] opacity-10 pointer-events-none"></div>

      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20 relative z-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Rnai.io
          </Link>
          <div className="flex gap-1 rounded-full bg-white/[0.05] border border-white/10 p-1">
            {(["th", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  language === lang ? "bg-[#D77757] text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                {lang === "th" ? "🇹🇭 ไทย" : "🇺🇸 EN"}
              </button>
            ))}
          </div>
        </div>

        {/* Hero */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-medium text-gray-300 tracking-wide uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-[#D77757] animate-pulse"></span>
            {t.badge}
          </span>
          <h1 className="font-outfit text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
            🏆 <span className="text-gradient">{t.title}</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-8">{t.subtitle}</p>
          <Link
            href="/dashboard/playground"
            className="inline-block px-8 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.25)]"
          >
            ⚡ {t.cta}
          </Link>
        </div>

        {/* How to earn */}
        <h2 className="font-outfit text-2xl font-bold text-white mb-6">{t.earnTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {t.earn.map((item) => (
            <div key={item.title} className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 transition-transform">
              <div className="text-3xl mb-3">{item.icon}</div>
              <p className="font-semibold text-white mb-1">{item.title}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Live leaderboard */}
        <h2 className="font-outfit text-2xl font-bold text-white mb-1">
          📊 {th ? "อันดับเดือนนี้ (สด)" : "This Month's Standings (Live)"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          {board ? `${th ? "รอบ" : "Period"} ${board.period} · ${th ? "กองรางวัลปัจจุบัน" : "current pool"} ${board.pool.toLocaleString()} ${th ? "เครดิต" : "credits"}` : " "}
        </p>
        <div className="glass-card rounded-2xl p-5 sm:p-7 mb-16">
          {boardState === "loading" && (
            <p className="text-sm text-gray-500 text-center py-6">{th ? "กำลังโหลดอันดับ..." : "Loading standings..."}</p>
          )}
          {boardState === "anon" && (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400 mb-4">
                {th ? "เข้าสู่ระบบเพื่อดูอันดับสดและคะแนนของคุณ" : "Sign in to see live standings and your rank"}
              </p>
              <Link href="/auth/login" className="inline-block px-6 py-2.5 bg-white/10 border border-white/15 text-white text-sm font-medium rounded-full hover:bg-white/20 transition-all">
                {th ? "เข้าสู่ระบบ" : "Sign in"}
              </Link>
            </div>
          )}
          {boardState === "ok" && board && (
            <>
              {board.top.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">
                  {th ? "ยังไม่มีผู้ติดอันดับเดือนนี้ — เป็นคนแรกเลย!" : "No one on the board yet — be the first!"}
                </p>
              ) : (
                <div className="space-y-2">
                  {board.top.map((row) => (
                    <div
                      key={row.rank}
                      className={`flex items-center gap-4 rounded-xl px-4 py-3 ${
                        row.isMe ? "bg-[#D77757]/15 border border-[#D77757]/40" : "bg-white/[0.03]"
                      }`}
                    >
                      <span className="w-8 text-center font-outfit font-bold text-lg">
                        {row.rank === 1 ? "🥇" : row.rank === 2 ? "🥈" : row.rank === 3 ? "🥉" : row.rank}
                      </span>
                      <span className="flex-1 text-sm text-gray-200 truncate">
                        {row.name}{row.isMe ? (th ? " (คุณ)" : " (you)") : ""}
                      </span>
                      <span className="text-sm text-gray-400">{row.points.toLocaleString()} pts</span>
                      <span className="text-sm font-semibold text-[#D77757] w-24 text-right">
                        +{row.prize.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-5 pt-4 border-t border-white/10 text-sm text-gray-300 text-center">
                {board.me.rank
                  ? (th
                      ? <>อันดับของคุณ: <b className="text-[#D77757]">#{board.me.rank}</b> · {board.me.points.toLocaleString()} คะแนน</>
                      : <>Your rank: <b className="text-[#D77757]">#{board.me.rank}</b> · {board.me.points.toLocaleString()} points</>)
                  : (th
                      ? <>คะแนนของคุณ: {board.me.points.toLocaleString()} — {board.me.eligible ? "ยังไม่ติด Top 10" : `ใช้ครบ ${board.me.minPoints} เครดิตเพื่อมีสิทธิ์`}</>
                      : <>Your points: {board.me.points.toLocaleString()} — {board.me.eligible ? "not in Top 10 yet" : `use ${board.me.minPoints} credits to qualify`}</>)}
              </div>
            </>
          )}
        </div>

        {/* Monthly */}
        <h2 className="font-outfit text-2xl font-bold text-white mb-1">{t.monthlyTitle}</h2>
        <p className="text-sm text-gray-500 mb-6">{t.monthlySub}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {t.monthly.filter((m) => m.hot).map((item, i) => (
            <div
              key={item.rank}
              className={`rounded-2xl p-6 text-center border ${
                i === 0
                  ? "bg-gradient-to-b from-[#D77757]/25 to-transparent border-[#D77757]/50 shadow-[0_0_40px_rgba(215,119,87,0.15)]"
                  : "glass-card border-white/10"
              }`}
            >
              <p className="text-sm text-gray-400 mb-2">{item.rank}</p>
              <p className={`font-outfit text-2xl font-extrabold ${i === 0 ? "text-[#D77757]" : "text-white"}`}>{item.prize}</p>
              <p className="text-xs text-gray-500 mt-2">{item.extra}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {t.monthly.filter((m) => !m.hot).map((item) => (
            <div key={item.rank} className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-300">{item.rank}</p>
              <p className="font-semibold text-white">{item.prize}</p>
            </div>
          ))}
        </div>

        {/* Yearly */}
        <h2 className="font-outfit text-2xl font-bold text-white mb-1">{t.yearlyTitle}</h2>
        <p className="text-sm text-gray-500 mb-6">{t.yearlySub}</p>
        <div className="rounded-3xl p-8 sm:p-10 text-center mb-4 bg-gradient-to-b from-yellow-500/20 via-[#D77757]/10 to-transparent border border-yellow-500/40 shadow-[0_0_60px_rgba(234,179,8,0.12)]">
          <div className="text-5xl mb-3">🏆</div>
          <p className="font-outfit text-xl font-bold text-yellow-300 mb-2">{t.champion.title}</p>
          <p className="font-outfit text-4xl sm:text-5xl font-extrabold text-white">{t.champion.prize}</p>
          <p className="text-sm text-gray-400 mt-3">{t.champion.extra}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {t.yearly.map((item) => (
            <div key={item.rank} className="glass-card rounded-2xl px-6 py-4 flex items-center justify-between">
              <p className="text-sm text-gray-300">{item.rank}</p>
              <p className="font-semibold text-white text-right">{item.prize}</p>
            </div>
          ))}
        </div>
        <p className="text-sm font-semibold text-white mb-4">{t.specialTitle}</p>
        <div className="flex flex-wrap gap-2 mb-16">
          {t.special.map((badge) => (
            <span key={badge} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-gray-300">
              {badge}
            </span>
          ))}
        </div>

        {/* Rules */}
        <h2 className="font-outfit text-2xl font-bold text-white mb-6">📋 {t.rulesTitle}</h2>
        <div className="glass-card rounded-2xl p-6 sm:p-8 mb-12">
          <ol className="space-y-3">
            {t.rules.map((rule, i) => (
              <li key={i} className="flex gap-3 text-sm sm:text-base text-gray-300 leading-relaxed">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[#D77757]/20 text-[#D77757] text-xs font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {rule}
              </li>
            ))}
          </ol>
        </div>

        <p className="text-center text-sm text-gray-500 mb-8">{t.footnote}</p>
        <div className="text-center">
          <Link
            href="/dashboard/playground"
            className="inline-block px-8 py-3.5 bg-gradient-to-r from-[#D77757] to-[#c4552f] text-white font-semibold rounded-full hover:opacity-90 transition-all shadow-[0_4px_30px_rgba(215,119,87,0.35)]"
          >
            🚀 {t.cta}
          </Link>
        </div>
      </main>
    </div>
  );
}
