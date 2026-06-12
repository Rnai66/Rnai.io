"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type LegalDoc = "privacy" | "terms";

interface LegalSection {
  title: string;
  body: string;
}

interface LegalContent {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
  contactTitle: string;
  contactLead: string;
  crossLinkLabel: string;
  crossLinkHref: string;
}

const CONTENT: Record<LegalDoc, Record<"en" | "th", LegalContent>> = {
  privacy: {
    en: {
      title: "Privacy Policy",
      updated: "Last updated: June 12, 2026",
      intro:
        "Rnai.io (“we”, “our”) provides an AI generation platform via our website and mobile application. This policy explains what we collect and how we use it.",
      sections: [
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
      ],
      contactTitle: "6. Contact",
      contactLead: "Questions about this policy:",
      crossLinkLabel: "Terms of Service →",
      crossLinkHref: "/terms",
    },
    th: {
      title: "นโยบายความเป็นส่วนตัว",
      updated: "อัปเดตล่าสุด: 12 มิถุนายน 2026",
      intro:
        "Rnai.io (“เรา”) ให้บริการแพลตฟอร์มสร้างสรรค์ผลงานด้วย AI ผ่านเว็บไซต์และแอปพลิเคชันมือถือ นโยบายฉบับนี้อธิบายว่าเราเก็บข้อมูลอะไรบ้างและนำไปใช้อย่างไร",
      sections: [
        {
          title: "1. ข้อมูลที่เราเก็บรวบรวม",
          body: "ข้อมูลบัญชี: อีเมลและข้อมูลระบุตัวตนสำหรับการเข้าสู่ระบบ จัดการผ่าน Google Firebase Authentication ข้อมูลการใช้งาน: คำขอที่ส่งมายังระบบ AI ของเรา (ประเภทความสามารถ เวลา ความหน่วง สถานะ) และยอดเครดิตของคุณ ซึ่งจัดเก็บเพื่อการคิดค่าบริการและป้องกันการใช้งานในทางที่ผิด เนื้อหา: ข้อความคำสั่งและรูปภาพที่คุณส่งจะถูกประมวลผลเพื่อสร้างผลลัพธ์ตามที่ขอ และผลลัพธ์อาจถูกแคชไว้เพื่อเพิ่มความเร็ว การชำระเงิน: ดำเนินการผ่าน Stripe — เราไม่จัดเก็บข้อมูลบัตรของคุณเด็ดขาด",
        },
        {
          title: "2. เรานำข้อมูลไปใช้อย่างไร",
          body: "เราใช้ข้อมูลของคุณเพื่อให้บริการเท่านั้น ได้แก่ การยืนยันตัวตน การประมวลผลคำขอสร้างผลงานด้วย AI การจัดการยอดเครดิต การป้องกันการฉ้อโกงและการใช้งานในทางที่ผิด และการปรับปรุงความเสถียรของระบบ เราไม่ขายข้อมูลส่วนบุคคลของคุณให้บุคคลที่สาม",
        },
        {
          title: "3. ผู้ประมวลผลภายนอก",
          body: "คำขอของคุณอาจถูกประมวลผลโดยผู้ให้บริการโมเดล AI (เช่น HuggingFace, Together AI และ OpenRouter) ผู้ให้บริการโครงสร้างพื้นฐาน (Vercel, Google Firebase, Upstash) และ Stripe สำหรับการชำระเงิน โดยแต่ละรายจะประมวลผลข้อมูลเท่าที่จำเป็นต่อการให้บริการเท่านั้น",
        },
        {
          title: "4. ข้อมูลที่จัดเก็บบนอุปกรณ์ของคุณ",
          body: "แอปมือถือ Rnai.io จัดเก็บ API key และโทเค็นการเข้าสู่ระบบไว้อย่างปลอดภัยใน Keychain ของอุปกรณ์ และจัดเก็บคลังผลงานของคุณไว้ในเครื่องเท่านั้น การลบแอปจะเป็นการลบข้อมูลเหล่านี้ออกจากอุปกรณ์",
        },
        {
          title: "5. การลบบัญชี",
          body: "คุณสามารถลบบัญชีอย่างถาวรได้ตลอดเวลาจากแอปมือถือ (โปรไฟล์ → ลบบัญชี) หรือติดต่อเรา การลบบัญชีจะลบข้อมูลการยืนยันตัวตนของคุณ ส่วนประวัติการใช้งานที่เกี่ยวข้องจะถูกลบหรือทำให้ไม่สามารถระบุตัวตนได้ภายใน 30 วัน",
        },
      ],
      contactTitle: "6. ติดต่อเรา",
      contactLead: "หากมีคำถามเกี่ยวกับนโยบายฉบับนี้:",
      crossLinkLabel: "ข้อกำหนดการใช้งาน →",
      crossLinkHref: "/terms",
    },
  },
  terms: {
    en: {
      title: "Terms of Service",
      updated: "Last updated: June 12, 2026",
      intro:
        "By using Rnai.io (the website at rnai-io.vercel.app and the Rnai.io mobile application), you agree to these terms.",
      sections: [
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
      ],
      contactTitle: "7. Contact",
      contactLead: "Questions about these terms:",
      crossLinkLabel: "Privacy Policy →",
      crossLinkHref: "/privacy",
    },
    th: {
      title: "ข้อกำหนดการใช้งาน",
      updated: "อัปเดตล่าสุด: 12 มิถุนายน 2026",
      intro:
        "การใช้งาน Rnai.io (เว็บไซต์ rnai-io.vercel.app และแอปพลิเคชันมือถือ Rnai.io) ถือว่าคุณยอมรับข้อกำหนดเหล่านี้",
      sections: [
        {
          title: "1. บริการของเรา",
          body: "Rnai.io ให้บริการเครื่องมือสร้างสรรค์ผลงานด้วย AI (ข้อความ รูปภาพ เว็บไซต์ เสียง) ผ่าน API กลาง เว็บไซต์ และแอปมือถือ Rnai.io ฟีเจอร์อาจเปลี่ยนแปลงได้ตามการพัฒนาแพลตฟอร์ม บริการนี้ให้บริการ “ตามสภาพ” โดยไม่มีการรับประกันใดๆ",
        },
        {
          title: "2. บัญชีและเครดิต",
          body: "คุณมีหน้าที่ดูแลรักษาบัญชีและ API key ของตนเอง บัญชีใหม่จะได้รับเครดิตฟรี และสามารถซื้อเครดิตเพิ่มผ่าน Stripe เครดิตถูกหักตามการใช้งานแต่ละครั้ง ไม่สามารถโอนให้ผู้อื่นได้ และเครดิตที่ซื้อจะคืนเงินได้เฉพาะกรณีที่กฎหมายกำหนดเท่านั้น กรณีการประมวลผลล้มเหลว ระบบจะคืนเครดิตให้อัตโนมัติ",
        },
        {
          title: "3. การใช้งานที่ยอมรับได้",
          body: "ห้ามใช้บริการเพื่อสร้างเนื้อหาที่ผิดกฎหมาย ละเมิดทรัพย์สินทางปัญญา แสวงหาประโยชน์จากผู้เยาว์ หรือมีเจตนาคุกคาม ฉ้อโกง หรือทำร้ายผู้อื่น รวมถึงห้ามพยายามหลีกเลี่ยงการจำกัดอัตราการใช้งาน ใช้เครดิตฟรีในทางที่ผิด หรือแทรกแซงการทำงานของแพลตฟอร์ม เราอาจระงับบัญชีที่ละเมิดข้อกำหนดเหล่านี้",
        },
        {
          title: "4. เนื้อหาของคุณ",
          body: "คุณยังคงเป็นเจ้าของสิทธิ์ในข้อความคำสั่งที่ส่ง และเป็นเจ้าของผลลัพธ์ที่สร้างขึ้นเท่าที่กฎหมายและสัญญาอนุญาตของโมเดลที่เกี่ยวข้องอนุญาต โดยคุณให้สิทธิ์เราแบบจำกัดในการประมวลผลและแคชเนื้อหาเท่าที่จำเป็นต่อการให้บริการ",
        },
        {
          title: "5. ข้อจำกัดความรับผิด",
          body: "ภายใต้ขอบเขตสูงสุดที่กฎหมายอนุญาต Rnai.io จะไม่รับผิดต่อความเสียหายทางอ้อม ความเสียหายต่อเนื่อง หรือความเสียหายพิเศษใดๆ ที่เกิดจากการใช้บริการ โดยความรับผิดรวมของเราจำกัดไม่เกินจำนวนเงินที่คุณชำระในช่วง 12 เดือนก่อนเกิดข้อเรียกร้อง",
        },
        {
          title: "6. การเปลี่ยนแปลงข้อกำหนด",
          body: "เราอาจปรับปรุงข้อกำหนดเหล่านี้ได้ การเปลี่ยนแปลงที่สำคัญจะประกาศบนเว็บไซต์ การใช้งานต่อหลังการเปลี่ยนแปลงถือว่าคุณยอมรับข้อกำหนดใหม่",
        },
      ],
      contactTitle: "7. ติดต่อเรา",
      contactLead: "หากมีคำถามเกี่ยวกับข้อกำหนดเหล่านี้:",
      crossLinkLabel: "นโยบายความเป็นส่วนตัว →",
      crossLinkHref: "/privacy",
    },
  },
};

export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const { language, setLanguage } = useLanguage();
  const content = CONTENT[doc][language === "th" ? "th" : "en"];
  const blurClass = doc === "privacy"
    ? "top-1/4 left-1/4 bg-[#D77757]"
    : "top-1/4 right-1/4 bg-blue-500";

  return (
    <div className="min-h-screen relative overflow-hidden" lang={language}>
      <div className={`absolute w-96 h-96 rounded-full mix-blend-screen filter blur-[128px] opacity-10 pointer-events-none ${blurClass}`}></div>

      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-14 sm:py-20 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            ← Rnai.io
          </Link>

          {/* TH/EN toggle */}
          <div className="flex gap-1 rounded-full bg-white/[0.05] border border-white/10 p-1">
            {(["th", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  language === lang
                    ? "bg-[#D77757] text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {lang === "th" ? "🇹🇭 ไทย" : "🇺🇸 EN"}
              </button>
            ))}
          </div>
        </div>

        <h1 className="font-outfit text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
          <span className="text-gradient">{content.title}</span>
        </h1>
        <p className="text-sm text-gray-500 mb-10">{content.updated}</p>

        <p className="text-gray-300 leading-relaxed mb-8">{content.intro}</p>

        <div className="space-y-4">
          {content.sections.map((section) => (
            <section key={section.title} className="glass-card rounded-2xl p-5 sm:p-7">
              <h2 className="font-outfit text-lg sm:text-xl font-bold text-white mb-3">{section.title}</h2>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">{section.body}</p>
            </section>
          ))}

          <section className="glass-card rounded-2xl p-5 sm:p-7">
            <h2 className="font-outfit text-lg sm:text-xl font-bold text-white mb-3">{content.contactTitle}</h2>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              {content.contactLead}{" "}
              <a className="text-[#D77757] underline underline-offset-4" href="mailto:naiguitarfolk@gmail.com">
                naiguitarfolk@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link href={content.crossLinkHref} className="text-sm text-gray-500 hover:text-white underline underline-offset-4 transition-colors">
            {content.crossLinkLabel}
          </Link>
        </div>
      </main>
    </div>
  );
}
