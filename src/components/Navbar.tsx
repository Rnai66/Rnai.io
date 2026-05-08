"use client";
import Link from "next/link";
import { auth } from "@/lib/firebase/client";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setEmail(user?.email ?? null);
    });
    return unsub;
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-center pointer-events-none">
      <nav className="pointer-events-auto glass-card rounded-full px-6 py-3 w-full max-w-5xl flex items-center justify-between transition-all duration-300">
        <Link href="/" className="font-outfit font-bold text-xl tracking-tight text-white flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D77757] to-[#8a4b35] flex items-center justify-center shadow-lg shadow-[#D77757]/20 group-hover:scale-105 transition-transform">
            <span className="text-white text-sm font-black">R</span>
          </div>
          Rnai<span className="text-[#D77757]">.io</span>
        </Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          {email ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/playground" className="text-gray-300 hover:text-white transition-colors">
                Playground
              </Link>
              <Link href="/dashboard/profile" className="text-gray-300 hover:text-white transition-colors">
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
              <div className="h-6 w-px bg-white/10"></div>
              <LanguageSwitcher />
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="px-5 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-200"
              >
                Get Started
              </Link>
              <div className="h-6 w-px bg-white/10"></div>
              <LanguageSwitcher />
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
