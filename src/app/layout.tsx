import type { Metadata } from "next";
import { Inter, Outfit, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
// Thai glyphs — crisp Thai typography with proper spacing on all devices
const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-thai",
});

export const metadata: Metadata = {
  title: "Rnai.io — The Ultimate AI Gateway",
  description: "Generate, edit, translate, and extract using the world's best AI models with one simple API.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Rnai.io",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${notoThai.variable} font-sans min-h-screen bg-[#050505] text-white antialiased`}>
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#D77757]/15 via-[#050505] to-[#050505] opacity-50"></div>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
