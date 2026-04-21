"use client";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b border-[#1e1b18] px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Rnai<span className="text-[#D77757]">.</span>io
        </Link>
        <div className="flex items-center gap-4 text-sm">
          {email ? (
            <>
              <Link
                href="/dashboard"
                className="text-[#8a7a6a] hover:text-[#f5f0eb] transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={signOut}
                className="text-[#8a7a6a] hover:text-[#f5f0eb] transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-[#8a7a6a] hover:text-[#f5f0eb] transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-1.5 bg-[#D77757] text-white rounded-lg hover:bg-[#c0664a] transition-colors font-medium"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
