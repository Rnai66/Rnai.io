import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Rnai.io",
  description: "How Rnai.io collects, uses, and protects your data.",
};

const sections: { title: string; body: string }[] = [
  {
    title: "1. Information we collect",
    body: "Account data: your email address and authentication identifiers, managed through Google Firebase Authentication. Usage data: requests made to our AI endpoints (skill type, timestamps, latency, status) and your credit balance, stored to operate billing and prevent abuse. Content: prompts and images you submit are processed to generate your requested output; generated results may be cached to improve performance. Payments: processed by Stripe — we never store your card details.",
  },
  {
    title: "2. How we use information",
    body: "We use your information solely to provide the service: authenticating you, executing AI generation requests, maintaining your credit balance, preventing fraud and abuse, and improving reliability. We do not sell your personal data to third parties.",
  },
  {
    title: "3. Third-party processors",
    body: "Your requests may be processed by AI model providers (such as HuggingFace, Together AI, and OpenRouter), infrastructure providers (Vercel, Google Firebase, Upstash), and Stripe for payments. Each processes data only as needed to deliver the service.",
  },
  {
    title: "4. Data stored on your device",
    body: "The Rnai.io mobile app stores your API key and session token securely in the device keychain, and your creation library locally on your device. Deleting the app removes this local data.",
  },
  {
    title: "5. Account deletion",
    body: "You can permanently delete your account at any time from the mobile app (Profile → Delete Account) or by contacting us. Deletion removes your authentication account; associated usage records are removed or anonymized within 30 days.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D77757] rounded-full mix-blend-screen filter blur-[128px] opacity-10 pointer-events-none"></div>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          ← Rnai.io
        </Link>

        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          <span className="text-gradient">Privacy Policy</span>
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: June 11, 2026</p>

        <p className="text-gray-300 leading-relaxed mb-8">
          Rnai.io (&quot;we&quot;, &quot;our&quot;) provides an AI generation platform via our website
          and mobile application. This policy explains what we collect and how we use it.
        </p>

        <div className="space-y-4">
          {sections.map(s => (
            <section key={s.title} className="glass-card rounded-2xl p-5 sm:p-7">
              <h2 className="font-outfit text-lg sm:text-xl font-bold text-white mb-3">{s.title}</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{s.body}</p>
            </section>
          ))}

          <section className="glass-card rounded-2xl p-5 sm:p-7">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-white mb-3">6. Contact</h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Questions about this policy:{" "}
              <a className="text-[#D77757] underline underline-offset-4" href="mailto:naiguitarfolk@gmail.com">
                naiguitarfolk@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link href="/terms" className="text-sm text-gray-500 hover:text-white underline underline-offset-4 transition-colors">
            Terms of Service →
          </Link>
        </div>
      </main>
    </div>
  );
}
