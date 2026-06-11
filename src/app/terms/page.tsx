import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Rnai.io",
  description: "Terms governing use of the Rnai.io platform and mobile app.",
};

const sections: { title: string; body: string }[] = [
  {
    title: "1. The service",
    body: "Rnai.io provides AI-powered generation tools (text, images, websites, audio) through a unified API, the website, and the Rnai.io mobile app. Features may change as the platform evolves. The service is provided “as is” without warranties of any kind.",
  },
  {
    title: "2. Accounts and credits",
    body: "You are responsible for safeguarding your account and API keys. New accounts receive free credits; additional credits can be purchased via Stripe. Credits are consumed per request, are non-transferable, and purchased credits are refundable only where required by law. Failed generations are automatically refunded.",
  },
  {
    title: "3. Acceptable use",
    body: "You may not use the service to generate content that is illegal, infringes intellectual property, exploits minors, or is intended to harass, defraud, or harm others; nor may you attempt to circumvent rate limits, abuse free credits, or interfere with the platform. We may suspend accounts that violate these rules.",
  },
  {
    title: "4. Your content",
    body: "You retain rights to the prompts you submit and, to the extent permitted by applicable law and underlying model licenses, the outputs you generate. You grant us a limited license to process and cache content as needed to operate the service.",
  },
  {
    title: "5. Limitation of liability",
    body: "To the maximum extent permitted by law, Rnai.io shall not be liable for indirect, incidental, or consequential damages arising from use of the service. Our total liability is limited to the amount you paid in the 12 months preceding the claim.",
  },
  {
    title: "6. Changes",
    body: "We may update these terms; material changes will be announced on the website. Continued use after changes constitutes acceptance.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px] opacity-10 pointer-events-none"></div>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8">
          ← Rnai.io
        </Link>

        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          <span className="text-gradient">Terms of Service</span>
        </h1>
        <p className="text-sm text-gray-500 mb-10">Last updated: June 11, 2026</p>

        <p className="text-gray-300 leading-relaxed mb-8">
          By using Rnai.io (the website at rnai-io.vercel.app and the Rnai.io mobile application),
          you agree to these terms.
        </p>

        <div className="space-y-4">
          {sections.map(s => (
            <section key={s.title} className="glass-card rounded-2xl p-5 sm:p-7">
              <h2 className="font-outfit text-lg sm:text-xl font-bold text-white mb-3">{s.title}</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{s.body}</p>
            </section>
          ))}

          <section className="glass-card rounded-2xl p-5 sm:p-7">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-white mb-3">7. Contact</h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Questions about these terms:{" "}
              <a className="text-[#D77757] underline underline-offset-4" href="mailto:naiguitarfolk@gmail.com">
                naiguitarfolk@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-white underline underline-offset-4 transition-colors">
            Privacy Policy →
          </Link>
        </div>
      </main>
    </div>
  );
}
