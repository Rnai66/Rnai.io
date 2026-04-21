"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const token = await cred.user.getIdToken();
      document.cookie = `__session=${token}; path=/; max-age=3600`;
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setError(msg.replace("Firebase: ", "").replace(/ \(auth\/.*\)/, ""));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-bold text-2xl tracking-tight">
            Rnai<span className="text-[#D77757]">.</span>io
          </Link>
          <p className="mt-2 text-[#6a5a4a] text-sm">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-lg border border-red-900/30">
              {error}
            </div>
          )}
          <div>
            <label className="block text-sm text-[#8a7a6a] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#1e1b18] border border-[#2a2520] rounded-lg text-[#f5f0eb] text-sm focus:outline-none focus:border-[#D77757]/60 placeholder-[#4a3a2a]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-[#8a7a6a] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#1e1b18] border border-[#2a2520] rounded-lg text-[#f5f0eb] text-sm focus:outline-none focus:border-[#D77757]/60 placeholder-[#4a3a2a]"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#D77757] text-white rounded-lg font-medium text-sm hover:bg-[#c0664a] disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#6a5a4a]">
          No account?{" "}
          <Link href="/auth/signup" className="text-[#D77757] hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
