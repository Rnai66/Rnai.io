// Rnai.io — Product catalog for the Downloads hub.
//
// Each product's installer is downloaded via /api/downloads/[id]?platform=...
// which checks the user is signed in (tier "free" = any member) before
// redirecting to the real file.
//
// FILL IN `downloads` with your GitHub Release asset URLs, e.g.:
//   https://github.com/<owner>/<repo>/releases/download/<tag>/<file>.apk
// Use APK / installer files (small) — NOT the multi-GB project zips
// (GitHub Releases caps at 2GB/file). For >2GB use a Cloud Storage signed URL.
// Leave a platform out (or "") to show "Coming soon" for it.

export type Platform = "ios" | "android" | "web" | "windows" | "mac";
export type Tier = "free" | "pro" | "enterprise";

export interface Product {
  id: string;
  name: string;
  tagline: string;     // English
  taglineTh: string;   // Thai
  version: string;
  platforms: Platform[];
  tier: Tier;          // "free" = any signed-in member can download
  icon: string;        // emoji
  color: string;       // accent hex
  downloads: Partial<Record<Platform, string>>; // direct installer URLs (gated)
  store?: Partial<Record<Platform, string>>;     // public store links (optional)
}

export const PRODUCTS: Product[] = [
  {
    id: "rnai-mobile",
    name: "Rnai.io Mobile",
    tagline: "Create anything with AI — 18 skills, 15 languages",
    taglineTh: "สร้างสรรค์ทุกอย่างด้วย AI — 18 สกิล 15 ภาษา",
    version: "2.0.0",
    platforms: ["ios", "android"],
    tier: "free",
    icon: "🎨",
    color: "#9333EA",
    downloads: { android: "https://github.com/Rnai-io/Rnai/releases/latest" },
  },
  {
    id: "h2hfleet",
    name: "H2HFleet",
    tagline: "Fleet intelligence for Thai SMEs — live GPS & expenses",
    taglineTh: "จัดการรถ-ติดตาม GPS-ค่าใช้จ่าย สำหรับ SME ไทย",
    version: "1.0.0",
    platforms: ["ios", "android", "web"],
    tier: "free",
    icon: "🚚",
    color: "#0EA5E9",
    downloads: { android: "https://github.com/Rnai-io/H2Hfleet/releases/latest" },
  },
  {
    id: "moneyma",
    name: "MoneyMa",
    tagline: "Personal finance, simplified",
    taglineTh: "จัดการการเงินส่วนตัวให้ง่ายขึ้น",
    version: "1.4.1",
    platforms: ["android"],
    tier: "free",
    icon: "💰",
    color: "#10B981",
    downloads: { android: "https://github.com/Rnai66/Moneyma/releases/latest" },
  },
  {
    id: "quom",
    name: "Quom",
    tagline: "AI-powered quotes & sayings",
    taglineTh: "คำคมโดนใจ ให้ AI ช่วยคิดให้",
    version: "1.2.0",
    platforms: ["ios", "android"],
    tier: "free",
    icon: "💬",
    color: "#F59E0B",
    downloads: { android: "https://github.com/Rnai66/QUOM/releases/latest" },
  },
  {
    id: "lotterymap",
    name: "LotteryMap",
    tagline: "Find lottery sellers near you",
    taglineTh: "ค้นหาแผงลอตเตอรี่ใกล้คุณ",
    version: "1.0.1",
    platforms: ["ios", "android", "web"],
    tier: "free",
    icon: "🎯",
    color: "#EC4899",
    downloads: { android: "https://github.com/Rnai66/lotterymap/releases/latest" },
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
