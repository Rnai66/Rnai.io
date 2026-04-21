"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import Navbar from "@/components/Navbar";
import ApiKeyManager from "@/components/ApiKeyManager";

export default function DashboardPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/auth/login");
      } else {
        setEmail(user.email);
        setReady(true);
      }
    });
    return unsub;
  }, [router]);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#6a5a4a] text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-[#6a5a4a] mt-1">{email}</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Plan", value: "Free" },
            { label: "Requests / mo", value: "1,000" },
            { label: "AI Models", value: "3" },
          ].map((s) => (
            <div
              key={s.label}
              className="p-4 rounded-xl bg-[#1e1b18] border border-[#2a2520] text-center"
            >
              <p className="text-xl font-bold text-[#D77757]">{s.value}</p>
              <p className="text-xs text-[#6a5a4a] mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <ApiKeyManager />
      </main>
    </div>
  );
}
