"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import ApiKeyManager from "@/components/ApiKeyManager";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { t } from "@/lib/i18n/translations";
import { translations } from "@/lib/i18n/translations";

type TabId = "language" | "account" | "apiKeys" | "billing";

interface UsageEntry {
  id: string;
  skill: string;
  provider: string | null;
  status: string;
  latencyMs: number | null;
  createdAt: string | null;
}

export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("account");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [usage, setUsage] = useState<UsageEntry[]>([]);
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const dash = translations[language].dashboard;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        setEmail(user.email);
        // Load profile data from Firebase
        try {
          const res = await fetch("/api/user/profile");
          if (res.ok) {
            const data = await res.json();
            setPhone(data.phone || "");
            setAddress(data.address || "");
            setCity(data.city || "");
            setCountry(data.country || "");
            setPostalCode(data.postalCode || "");
          }
        } catch (e) {
          console.error("Failed to load profile:", e);
        }
        try {
          const usageRes = await fetch("/api/usage?limit=8");
          if (usageRes.ok) {
            const data = await usageRes.json();
            setUsage(data.usage || []);
          }
        } catch (e) {
          console.error("Failed to load usage:", e);
        }
        setReady(true);
      }
    });
    return unsub;
  }, [router]);

  const handleSaveProfile = async () => {
    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address, city, country, postalCode }),
      });
      if (res.ok) {
        setSaveMessage(language === "en" ? "Profile updated successfully" : "อัปเดตโปรไฟล์สำเร็จ");
        setTimeout(() => setSaveMessage(""), 3000);
      }
    } catch (e) {
      console.error("Failed to save profile:", e);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  };

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm bg-[#050505]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#D77757] border-t-transparent rounded-full animate-spin"></div>
          {language === "en" ? "Loading..." : "กำลังโหลด..."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden bg-[#050505]">
      <Navbar />

      {/* Ambient background */}
      <div className="pointer-events-none absolute -top-32 -right-24 w-[32rem] h-[32rem] bg-[#D77757]/20 rounded-full blur-[140px]"></div>
      <div className="pointer-events-none absolute top-1/3 -left-32 w-[28rem] h-[28rem] bg-[#0B3945]/12 rounded-full blur-[140px]"></div>

      <main className="max-w-4xl mx-auto px-6 w-full relative z-10 animate-fade-in">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.06] border border-white/10 text-gray-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
            {email}
          </span>
          <h1 className="font-outfit text-4xl sm:text-5xl font-bold tracking-tight text-gradient">
            {language === "en" ? "Profile Settings" : "ตั้งค่าโปรไฟล์"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">
            {language === "en" ? "Manage your account and preferences" : "จัดการบัญชีและการตั้งค่าของคุณ"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10 overflow-x-auto pb-4">
          {(["account", "language", "apiKeys", "billing"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab
                  ? "bg-[#D77757] text-white shadow-lg shadow-[#D77757]/20"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="mr-1.5">{{ account: "👤", language: "🌐", apiKeys: "🔑", billing: "💳" }[tab]}</span>
              {language === "en"
                ? tab === "account"
                  ? "Account"
                  : tab === "language"
                    ? "Language"
                    : tab === "apiKeys"
                      ? "API Keys"
                      : "Billing"
                : tab === "account"
                  ? "บัญชี"
                  : tab === "language"
                    ? "ภาษา"
                    : tab === "apiKeys"
                      ? "API Keys"
                      : "การเรียกเก็บเงิน"}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="glass-card rounded-3xl p-6 md:p-8">
          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                  {language === "en" ? "Email Address" : "ที่อยู่อีเมล"}
                </label>
                <input
                  type="email"
                  value={email || ""}
                  disabled
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-gray-400 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                  {language === "en" ? "Phone Number" : "เบอร์โทรศัพท์"}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+66 8..."
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                  {language === "en" ? "Address" : "ที่อยู่"}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                    {language === "en" ? "City" : "เมือง"}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Bangkok"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                    {language === "en" ? "Country" : "ประเทศ"}
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Thailand"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">
                    {language === "en" ? "Postal Code" : "รหัสไปรษณีย์"}
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="10110"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 text-sm"
                  />
                </div>
              </div>

              {saveMessage && (
                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                  {saveMessage}
                </div>
              )}

              <button
                onClick={handleSaveProfile}
                className="w-full py-3 rounded-xl bg-[#D77757] text-white font-semibold text-sm hover:bg-[#c46543] transition-all"
              >
                {language === "en" ? "Save Changes" : "บันทึกการเปลี่ยนแปลง"}
              </button>

              {/* Sign Out Section */}
              <div className="pt-6 border-t border-white/10">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-white mb-2">
                    {language === "en" ? "Sign Out" : "ออกจากระบบ"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {language === "en"
                      ? "You will be logged out of all sessions"
                      : "คุณจะออกจากระบบในทุกเซสชั่น"}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 rounded-xl bg-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500/30 transition-all border border-red-500/30"
                >
                  {language === "en" ? "Sign Out" : "ออกจากระบบ"}
                </button>
              </div>
            </div>
          )}

          {/* Language Settings */}
          {activeTab === "language" && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-gray-400 mb-4 uppercase tracking-wider font-semibold">
                  {language === "en" ? "Select Display Language" : "เลือกภาษาที่แสดงผล"}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {(["en", "th"] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`p-4 rounded-xl border-2 text-center font-semibold transition-all ${
                        language === lang
                          ? "border-[#D77757] bg-[#D77757]/10 text-white"
                          : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {lang === "en" ? "🇬🇧 English" : "🇹🇭 ไทย"}
                    </button>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
                {language === "en" ? "Language saved" : "บันทึกภาษาแล้ว"}
              </div>
            </div>
          )}

          {/* API Keys + Usage history */}
          {activeTab === "apiKeys" && (
            <div className="space-y-10">
              <ApiKeyManager />

              <div className="pt-8 border-t border-white/10">
                <div className="mb-6">
                  <h2 className="text-xl font-outfit font-bold text-white mb-2">{dash.usageHistory}</h2>
                  <p className="text-sm text-gray-400">{dash.latestApiCalls}</p>
                </div>

                {usage.length === 0 ? (
                  <div className="text-center py-10 bg-black/20 rounded-2xl border border-white/5 border-dashed">
                    <p className="text-sm text-gray-400">{dash.noUsageYet}</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-white/5 bg-black/30">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-5 py-4 font-medium">{dash.skillColumn}</th>
                          <th className="px-5 py-4 font-medium hidden sm:table-cell">{dash.providerColumn}</th>
                          <th className="px-5 py-4 font-medium hidden md:table-cell">{dash.latencyColumn}</th>
                          <th className="px-5 py-4 font-medium">{dash.statusColumn}</th>
                          <th className="px-5 py-4 font-medium text-right hidden sm:table-cell">{dash.timeColumn}</th>
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
            </div>
          )}

          {/* Billing */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <p className="text-sm text-gray-400">
                {language === "en"
                  ? "View your billing information and usage. Check the Dashboard for details."
                  : "ดูข้อมูลการเรียกเก็บเงินและการใช้งาน ตรวจสอบแดชบอร์ดเพื่อดูรายละเอียด"}
              </p>
              <a
                href="/dashboard/billing"
                className="inline-block px-5 py-2.5 bg-[#D77757] text-white rounded-xl font-medium hover:bg-[#c46543] transition-all"
              >
                {language === "en" ? "Go to Billing" : "ไปยังการเรียกเก็บเงิน"}
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
