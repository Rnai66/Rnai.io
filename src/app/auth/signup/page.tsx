"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-xl font-semibold mb-2">Check your email</h2>
          <p className="text-[#6a5a4a] text-sm">
            We sent a confirmation link to <strong className="text-[#f5f0eb]">{email}</strong>.
            Click it to activate your account.
          </p>
          <Link href="/auth/login" className="mt-6 inline-block text-[#D77757] text-sm hover:underline">
            Back to login →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="font-bold text-2xl tracking-tight">
            Rnai<span className="text-[#D77757]">.</span>io
          </Link>
          <p className="mt-2 text-[#6a5a4a] text-sm">Create your free account</p>
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
              minLength={6}
              className="w-full px-4 py-2.5 bg-[#1e1b18] border border-[#2a2520] rounded-lg text-[#f5f0eb] text-sm focus:outline-none focus:border-[#D77757]/60 placeholder-[#4a3a2a]"
              placeholder="Min. 6 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#D77757] text-white rounded-lg font-medium text-sm hover:bg-[#c0664a] disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#6a5a4a]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#D77757] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
