import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rnai.io — AI Image API",
  description: "Generate, edit, and enhance images with one simple API",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#141210] text-[#f5f0eb] antialiased">
        {children}
      </body>
    </html>
  );
}
