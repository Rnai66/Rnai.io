// Rnai — Product catalog for the Downloads hub.
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
export type Tier = "free" | "starter" | "pro" | "enterprise";

// Membership hierarchy — a higher tier unlocks everything the lower tiers do.
export const TIER_RANK: Record<Tier, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

/** True if a member on `userTier` may download a product requiring `productTier`. */
export function hasAccess(userTier: Tier, productTier: Tier): boolean {
  return (TIER_RANK[userTier] ?? 0) >= (TIER_RANK[productTier] ?? 0);
}

/** Map a Stripe pack id to the membership tier it grants. */
export function tierForPack(packId: string): Tier {
  if (packId === "pack_100") return "enterprise";
  if (packId === "pack_20") return "pro";
  if (packId === "pack_5") return "starter";
  return "free";
}

/**
 * Map a TrueMoney top-up amount (THB) to the membership tier it grants.
 * Mirrors the Stripe packs (~$5 Starter / $20 Pro / $100 Enterprise at ~35 THB/$).
 */
export function tierForBaht(baht: number): Tier {
  if (baht >= 3000) return "enterprise";
  if (baht >= 700) return "pro";
  if (baht > 0) return "starter";
  return "free";
}

export interface Product {
  id: string;
  name: string;
  tagline: string;     // English
  taglineTh: string;   // Thai
  version: string;
  platforms: Platform[];
  tier: Tier;          // minimum membership tier required to download
  icon: string;        // emoji (fallback)
  iconImg?: string;    // real app icon in /public/apps (overrides emoji)
  color: string;       // accent hex
  downloads: Partial<Record<Platform, string>>; // direct installer URLs (gated)
  store?: Partial<Record<Platform, string>>;     // public store links (optional)
  webApp?: string;                                // public web-app URL (ungated, opens directly)
  landing?: string;                               // override "Details" landing URL
}

export const PRODUCTS: Product[] = [
  {
    id: "rnai-mobile",
    name: "Rnai Mobile",
    tagline: "Create anything with AI — 18 skills, 15 languages",
    taglineTh: "สร้างสรรค์ทุกอย่างด้วย AI — 18 สกิล 15 ภาษา",
    version: "2.0.0",
    platforms: ["ios", "android"],
    tier: "starter",
    icon: "🎨",
    iconImg: "/apps/rnai-mobile.png",
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
    tier: "enterprise",
    icon: "🚚",
    iconImg: "/apps/h2hfleet.png",
    color: "#0EA5E9",
    downloads: { android: "https://github.com/Rnai-io/H2Hfleet/releases/latest" },
    webApp: "https://h2hfleet.netlify.app/",
  },
  {
    id: "moneyma",
    name: "MoneyMa",
    tagline: "Personal finance, simplified",
    taglineTh: "จัดการการเงินส่วนตัวให้ง่ายขึ้น",
    version: "1.4.1",
    platforms: ["android", "web"],
    tier: "enterprise",
    icon: "💰",
    iconImg: "/apps/moneyma.png",
    color: "#10B981",
    downloads: { android: "https://github.com/Rnai66/Moneyma/releases/latest" },
    webApp: "https://moneyma-app.netlify.app/",
    landing: "https://moneyma-detail.netlify.app/",
  },
  {
    id: "quom",
    name: "Quom",
    tagline: "AI-powered quotes & sayings",
    taglineTh: "คำคมโดนใจ ให้ AI ช่วยคิดให้",
    version: "1.2.0",
    platforms: ["ios", "android"],
    tier: "pro",
    icon: "💬",
    iconImg: "/apps/quom.png",
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
    tier: "starter",
    icon: "🎯",
    iconImg: "/apps/lotterymap.png",
    color: "#EC4899",
    downloads: { android: "https://github.com/Rnai66/lotterymap/releases/latest" },
    store: { android: "https://play.google.com/store/apps/details?id=com.lotterymap.th" },
    webApp: "https://lotterymap99.web.app/",
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
