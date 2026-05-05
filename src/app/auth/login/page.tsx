"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <Navbar />
      
      {/* Background blurs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#D77757] rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob"></div>
      
      <main className="flex-1 flex items-center justify-center p-6 z-10 pt-24">
        <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-3xl animate-fade-in relative overflow-hidden">
          {/* Subtle glow inside card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#D77757] rounded-full filter blur-[80px] opacity-20"></div>
          
          <h1 className="font-outfit text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-gray-400 text-center text-sm mb-8">Sign in to manage your APIs and credits.</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 focus:border-[#D77757]/50 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D77757]/50 focus:border-[#D77757]/50 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</p>}
            
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold rounded-xl py-3.5 hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 mt-2"
            >
              Sign In
            </button>
          </form>
          
          <p className="text-center text-sm text-gray-400 mt-8">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-[#D77757] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
