# RNAi Platform — Project Analysis & AI Multi-Skill Roadmap

**Prepared for:** Rnai (naiguitarfolk@gmail.com)
**Date:** 5 May 2026
**Repo analyzed:** `/Users/chanakhongdi/Downloads/rnai-platform`
**Business model selected:** Pay-as-you-go + Free quota
**Skill scope:** Image · Text/LLM · Audio · Video & 3D

---

## 1. Executive summary

โปรเจค `rnai-platform` ปัจจุบันเป็น **AI Image API platform** ที่มีโครงพื้นฐานครบและทำงานได้: Next.js 16 + Firebase Auth/Firestore + Hugging Face Inference API พร้อมระบบ API key (SHA-256 hash) และหน้า dashboard. ทั้งหมดนี้คือ **MVP ที่ดี ~25% ของระยะที่จะเป็นแพลตฟอร์ม AI หลายสกิลแบบเชิงพาณิชย์**

จุดแข็ง: โครง auth + key management สะอาด, แยก server/client Firebase ถูกหลัก, security headers ตั้งไว้แล้ว, design language (สี #D77757) ดู minimal premium

ช่องว่างใหญ่ที่ต้องปิดก่อนเปิดให้คนใช้จริง:

1. **Secret leak (CRITICAL)** — `.env.example` มี private key + HF token จริง คอมมิตเข้า git แล้ว ต้อง rotate ทุกตัวทันที
2. **ไม่มี usage tracking / quota / billing** — dashboard hardcode "Free / 1,000 req/mo" แต่ไม่มี enforcement จริง
3. **ไม่มี rate limit** — endpoint `/api/v1/*` รับ request ได้ไม่จำกัด → ระเบิด HF cost ได้
4. **ทับซ้อน Firebase + Supabase** — `supabase/migrations/` ยังหลงเหลือจาก migration เก่า ต้องเลือกข้างเดียว
5. **สกิล AI มีแค่ 3 ตัว ทั้งหมดเป็น image** — ห่างจากเป้าหมาย multi-skill ค่อนข้างมาก

แผนต่อยอดในเอกสารนี้แบ่งเป็น 4 phase, 12 สัปดาห์, นำ codebase ปัจจุบันไปต่อยอดเป็น **AI multi-skill API platform 17 สกิล** พร้อม Pay-as-you-go credit ledger + Stripe + free quota 200 credits/เดือน

---

## 2. Current state analysis

### 2.1 Tech stack ปัจจุบัน

| Layer | Tech | สถานะ |
|---|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind 3.4 | ใช้ได้ |
| Auth | Firebase Auth (email/password) | ใช้ได้ |
| Database | Firestore | ใช้ได้ แต่ schema ยังบาง |
| AI provider | Hugging Face Inference API | ใช้ได้ (cold-start ไม่ stable) |
| Deployment | Vercel (`output: 'standalone'`) | OK |
| Legacy | Supabase migrations folder | ต้องลบหรือฟื้น |

### 2.2 Surface ที่มีอยู่จริง

**API Routes (8 endpoints)**

- `POST /api/v1/generate` — text-to-image (FLUX.1-schnell)
- `POST /api/v1/edit` — inpainting (SDXL-1.0-inpainting-0.1)
- `POST /api/v1/remove-background` — RMBG-1.4
- `GET /api/keys` / `POST /api/keys` / `DELETE /api/keys/[id]`
- `GET /api/health` — Firebase admin sanity check

**Pages (5 pages)**

- `/` landing — hero, 3 feature cards, code example
- `/auth/login`, `/auth/signup` — email/password
- `/dashboard` — Plan / Requests / Models cards + ApiKeyManager component

**Data model (Firestore)**

```
apiKeys/{id}
  userId      : string  (Firebase UID)
  name        : string
  keyHash     : string  (sha256 ของ rnai_sk_...)
  keyPrefix   : string  (16 chars)
  isActive    : boolean
  createdAt   : Timestamp
  lastUsedAt  : Timestamp | null
```

`supabase/migrations/001_api_keys.sql` มี schema เดียวกัน + RLS policies — เห็นได้ว่าตอนแรกตั้งใจใช้ Supabase แล้วย้ายมา Firebase

### 2.3 จุดแข็ง

- **Key hashing ถูกต้อง** — เก็บ `sha256(rawKey)` เท่านั้น, raw key ส่งกลับ user แค่ครั้งเดียวตอนสร้าง
- **Server-side admin SDK แยก client** — ใช้ `firebase-admin` ใน `/lib/firebase/admin.ts` กัน leak credential
- **Security headers** มีตั้งใน `next.config.ts` (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- **Soft delete** ของ key (set `isActive: false`) ดีกว่า hard delete เพราะยังตรวจ audit ได้
- **Middleware** ป้องกัน `/dashboard` route โดย redirect ไป login ถ้าไม่มี cookie

### 2.4 Critical issues

#### 🔴 P0 — ต้องแก้ก่อนเปิดให้ใครใช้

| # | Issue | Impact | แก้อย่างไร |
|---|---|---|---|
| C1 | `.env.example` มี private key + HF token จริง commit เข้า git | Credential leak; ใครก็เข้าถึง Firebase/HF ได้ | Rotate ทุก credential, แก้ `.env.example` ให้เหลือแต่ placeholder, `git filter-repo` ลบประวัติ |
| C2 | ไม่มี rate limit บน `/api/v1/*` | Bot spam ทำเงิน HF บานภายในชั่วโมง | เพิ่ม Upstash Redis / Vercel KV — token bucket ต่อ API key |
| C3 | ไม่มี quota/usage tracking | ผู้ใช้ฟรีอาจใช้เกินจน burn margin | เพิ่ม `usageLogs` collection + middleware นับก่อนเรียก HF |
| C4 | Middleware เช็คแค่ presence ของ cookie | ใส่ค่ามั่วก็ผ่าน middleware (token verify เกิดที่ client) | ใช้ Firebase Admin verify ฝั่ง server, set cookie เป็น httpOnly |

#### 🟠 P1 — ส่งผลก่อน scale

| # | Issue | แก้อย่างไร |
|---|---|---|
| H1 | Session cookie ตั้งจาก `document.cookie` (ไม่ HttpOnly, ไม่ Secure) | สร้าง endpoint `/api/auth/session` ที่ verify token แล้ว set cookie แบบ HttpOnly + Secure + SameSite=Lax |
| H2 | ไม่มี request validation (no zod) | เพิ่ม `zod` schema ทุก endpoint, reject 400 ก่อนเรียก HF |
| H3 | Image base64 ส่งใน JSON body — Vercel limit 4.5MB | ใช้ Vercel Blob / Firebase Storage + signed URL pattern |
| H4 | HF cold-start อาจตอบ 503 เป็นนาที | เพิ่ม fallback provider (Replicate, fal.ai) + retry exponential backoff |
| H5 | ไม่มี webhook สำหรับ async job (image gen 5-30s) | เพิ่ม job queue (Upstash QStash / Inngest) |
| H6 | Firestore queries ขาด composite index hint | เตรียม `firestore.indexes.json` |
| H7 | ไม่มี logging/observability | ต่อ Sentry หรือ Better Stack |

#### 🟡 P2 — Polish

- ลบ `supabase/` folder (เลิกใช้แล้ว) หรือเขียนสคริปต์ migrate ย้อน
- เพิ่ม OpenAPI spec (`/api/openapi.json`) ให้ user generate SDK ได้
- ApiKeyManager ไม่ได้แสดง expiry → เพิ่ม optional `expiresAt`
- ESLint 9 incompatibility (ระบุใน README) — pin lint config

### 2.5 ช่องว่างเทียบกับเป้าหมาย "AI multi-skill platform"

| ด้าน | ปัจจุบัน | ต้องมี |
|---|---|---|
| สกิล | 3 (image only) | ≥17 ครอบคลุม Image + Text + Audio + Video/3D |
| Provider | HF เท่านั้น | HF + Replicate + Together + OpenAI-compatible + fal.ai (multi-vendor failover) |
| Billing | ไม่มี | Stripe + credit ledger + free quota |
| Long jobs | sync เท่านั้น | async webhook + polling endpoint |
| Storage | base64 in JSON | object storage + signed URL |
| Streaming | ไม่มี | SSE สำหรับ LLM/audio chunks |
| Docs | README เดียว | docs site + API reference + cookbook |
| SDK | ไม่มี | `@rnai/sdk` (TS) + Python optional |

---

## 3. Vision — Rnai เป็น "Multi-skill AI gateway"

**Positioning:** "API เดียว, สกิล AI ครบ — เริ่มฟรี จ่ายเฉพาะที่ใช้"

แทนที่จะแข่งกับ OpenAI/Anthropic ซึ่งต้นทุนการ host model สูงมาก, Rnai เลือกบทบาท **AI gateway** — เป็น routing + billing + quota layer หน้าโมเดลของผู้ให้บริการอื่น (HF, Replicate, OpenRouter, fal.ai) แล้ว **bundle ราคา + UX แบบ developer-friendly** เหมือน Vercel ของ AI

### 3.1 หลักการออกแบบสกิล

ทุกสกิลต้อง:

1. **มี endpoint แบบเดียวกัน** — `POST /api/v1/{category}/{skill}` รับ JSON, คืน JSON หรือ multipart
2. **คิด credit แบบ predictable** — ผู้ใช้คำนวณค่าใช้จ่ายล่วงหน้าได้
3. **มี fallback อย่างน้อย 1 provider** — ถ้า primary cold/down ใช้สำรอง
4. **รองรับ async** — `Idempotency-Key` header + `?async=true` คืน `jobId`
5. **มี output cache 24 ชม.** — เรียกซ้ำด้วย hash ของ input ไม่คิด credit ใหม่

---

## 4. AI Skill catalog (17 skills, 4 categories)

ทั้งหมดออกแบบให้ map ได้กับโมเดลฟรี/ราคาถูกบน HF/Replicate เพื่อให้ Rnai ตั้งราคาขายได้ที่ ~2-4× cost

### 4.1 🎨 Image (5 skills)

| Skill | Endpoint | Primary model | Fallback | Credit/req |
|---|---|---|---|---|
| **Generate** *(มีแล้ว)* | `/v1/image/generate` | FLUX.1-schnell (HF) | SDXL-Lightning (Replicate) | 5 |
| **Edit / Inpaint** *(มีแล้ว)* | `/v1/image/edit` | SDXL-1.0-inpainting | FLUX.1-Fill (fal.ai) | 8 |
| **Remove BG** *(มีแล้ว)* | `/v1/image/remove-bg` | RMBG-1.4 | BiRefNet | 2 |
| **Upscale 4×** | `/v1/image/upscale` | Real-ESRGAN-x4 | clarity-upscaler | 3 |
| **Style transfer** | `/v1/image/stylize` | IP-Adapter + SDXL | Stable Cascade | 6 |

### 4.2 💬 Text / LLM (5 skills)

| Skill | Endpoint | Primary | Fallback | Credit/req หรือ /1K tok |
|---|---|---|---|---|
| **Chat completion** | `/v1/text/chat` | Llama-3.1-70B (Together) | Mixtral-8x7B (OpenRouter) | 1 / 1K input + 2 / 1K output |
| **Summarize** | `/v1/text/summarize` | Llama-3.1-8B | DistilBart-CNN | 0.5 / 1K input |
| **Translate** | `/v1/text/translate` | NLLB-200-3.3B (HF) | Llama-3-8B (zero-shot) | 0.5 / 1K input |
| **Embeddings** | `/v1/text/embeddings` | nomic-embed-text-v1.5 | bge-m3 | 0.05 / 1K tok |
| **Rerank** | `/v1/text/rerank` | bge-reranker-v2-m3 | jina-reranker-v2 | 0.1 / req |

### 4.3 🔊 Audio (4 skills)

| Skill | Endpoint | Primary | Fallback | Credit/req |
|---|---|---|---|---|
| **Text-to-speech** | `/v1/audio/tts` | XTTS-v2 (Coqui) | parler-tts-mini | 1 / 100 chars |
| **Speech-to-text** | `/v1/audio/transcribe` | Whisper-large-v3 | distil-whisper-v3 | 3 / minute |
| **Music gen** | `/v1/audio/music` | MusicGen-medium | Stable-Audio-Open | 10 / 30s |
| **Voice clone** | `/v1/audio/clone` | XTTS-v2 (clone mode) | F5-TTS | 8 / req |

### 4.4 🎬 Video & 3D (3 skills)

| Skill | Endpoint | Primary | Fallback | Credit/req |
|---|---|---|---|---|
| **Text-to-video** | `/v1/video/generate` | LTX-Video (fal.ai) | CogVideoX-2B | 30 / 5s clip |
| **Lip-sync** | `/v1/video/lipsync` | Wav2Lip | LatentSync | 20 / req |
| **Image-to-3D** | `/v1/3d/from-image` | TripoSR | InstantMesh | 15 / req |

**Total = 17 skills**, ทุกสกิลใช้ shared infra เดียว (ดู §6)

---

## 5. Billing — Pay-as-you-go + Free quota

### 5.1 หลักการ

- **1 credit = 0.01 USD** ตอน sell, cost จริงของ Rnai ~0.003-0.005 USD/credit (margin 50-70%)
- **Free quota:** ให้ทุก user ใหม่ **200 credits/เดือน** (≈ 40 image generations หรือ ~200K LLM tokens)
- **Topup pack:** ซื้อเป็น pack ลด cost ของการเรียก Stripe — `$5 = 600 credits`, `$20 = 2,500 credits`, `$100 = 13,500 credits`
- **Auto-recharge (optional):** เมื่อต่ำกว่า 100 credits, ตัดเครดิตการ์ดเติม pack เดิม
- **Hard stop:** ถ้า balance ≤ 0 และไม่มี auto-recharge, API ตอบ `402 Payment Required`

### 5.2 Schema เพิ่มเติม (Firestore)

```
users/{uid}
  email, createdAt
  freeCreditsRemaining       : number   (reset ทุก 1 ของเดือน via cron)
  paidCreditsBalance         : number
  stripeCustomerId           : string?
  autoRechargeEnabled        : boolean
  autoRechargePackUsd        : number?

usageLogs/{id}
  uid, apiKeyId, skill, model, provider
  creditsCharged, latencyMs
  inputHash, outputHash
  status                     : 'success' | 'error' | 'cached'
  createdAt

ledgerEntries/{id}
  uid, type ('charge' | 'topup' | 'refund' | 'free_grant')
  credits, balanceAfter
  ref                        : usageLog id หรือ stripe charge id
  createdAt
```

### 5.3 Logic การหัก credit

```
1. Validate API key → uid + apiKeyId
2. Check rate limit (token bucket Redis)
3. Estimate credits ก่อนเรียก model (จาก input size)
4. ถ้า freeCredits >= cost: หักจาก free
   else if paidCredits >= cost: หักจาก paid
   else: 402
5. เรียก provider (with retry/fallback)
6. Reconcile actual cost vs estimate → คืน/หักเพิ่มถ้าต่างเกิน 5%
7. Insert usageLog + ledgerEntry (transaction)
```

### 5.4 Stripe integration

- ใช้ **Stripe Checkout** สำหรับ topup (ไม่ต้อง PCI)
- **Customer Portal** ให้ user จัดการการ์ดเอง
- Webhook `/api/stripe/webhook`:
  - `checkout.session.completed` → grant credits + ledgerEntry type=topup
  - `payment_intent.payment_failed` → ปิด autoRecharge ถ้าล้มเหลว 3 ครั้ง

### 5.5 ราคาเปรียบเทียบ (อ้างอิงคู่แข่ง)

| Provider | Image gen (1024×1024) | LLM (1M tok mid-tier) | TTS (1K chars) |
|---|---|---|---|
| **Rnai (เรา)** | $0.05 | $1-3 | $0.10 |
| Replicate FLUX schnell | $0.003 (cost) | n/a | n/a |
| Together Llama-70B | n/a | $0.88 (cost) | n/a |
| OpenAI DALL-E 3 | $0.04 | $5 (GPT-4o) | $0.015 |
| ElevenLabs | n/a | n/a | $0.30 |

**Margin ประมาณ:** image 50-90%, LLM 60-70%, audio 65-80%

### 5.6 ข้อระวัง

- **HF/Replicate cost variability** — บางโมเดล cold-start แพง, ต้องเก็บ log cost จริงรายเดือนแล้ว recalibrate ราคาทุก quarter
- **Refund policy** — auto-refund ถ้า provider error หรือ output cached — ทำใน reconciliation step
- **Currency** — เริ่ม USD เท่านั้น เพราะ Stripe Checkout ง่าย; THB ทีหลัง

---

## 6. Architecture roadmap

### 6.1 Target architecture

```
Client (Next.js page / SDK / curl)
        │
        ▼
[ Vercel Edge ]  ←  rate limit (Upstash Redis)
        │
        ▼
/api/v1/*  →  validate key  →  estimate cost  →  reserve credit
                                                    │
                       ┌────────────────────────────┼────────────────────────────┐
                       ▼                            ▼                            ▼
                 Sync handler                  Job queue                     Cache (KV)
                 (image/text/audio short)      (video, music, long LLM)      (24h, by inputHash)
                       │                            │
                       ▼                            ▼
              ┌─────── Provider router ───────┐
              ▼               ▼               ▼
              HF Inference    Replicate       fal.ai / Together
                       │
                       ▼
              Object storage (Vercel Blob / R2)
                       │
                       ▼
              Reconcile credit  →  usageLog  →  ledgerEntry
```

### 6.2 Module ใหม่ที่ต้องเพิ่ม

```
src/
├── lib/
│   ├── ai/
│   │   ├── providers/
│   │   │   ├── huggingface.ts      (มีแล้ว — refactor)
│   │   │   ├── replicate.ts        ใหม่
│   │   │   ├── together.ts         ใหม่
│   │   │   └── fal.ts              ใหม่
│   │   ├── router.ts               ใหม่ — เลือก provider, fallback
│   │   └── skills/                 ใหม่ — 1 ไฟล์/สกิล (registry pattern)
│   ├── billing/
│   │   ├── credits.ts              ใหม่ — หัก/คืน credit (transactional)
│   │   ├── stripe.ts               ใหม่
│   │   └── pricing.ts              ใหม่ — credit cost table
│   ├── ratelimit.ts                ใหม่ — Upstash token bucket
│   ├── jobs/
│   │   ├── queue.ts                ใหม่ — QStash/Inngest wrapper
│   │   └── handlers/               ใหม่ — long-running skills
│   └── storage.ts                  ใหม่ — Blob upload + signed URL
└── app/
    ├── api/
    │   ├── v1/
    │   │   ├── image/{skill}/route.ts
    │   │   ├── text/{skill}/route.ts
    │   │   ├── audio/{skill}/route.ts
    │   │   └── video/{skill}/route.ts
    │   ├── jobs/[id]/route.ts        GET status / result
    │   ├── stripe/
    │   │   ├── checkout/route.ts
    │   │   └── webhook/route.ts
    │   └── auth/session/route.ts     httpOnly cookie
    └── (dashboard)/
        ├── usage/page.tsx            chart + log table
        ├── billing/page.tsx          balance + topup
        └── playground/page.tsx       เทสต์สกิลทุกตัวจาก browser
```

### 6.3 Database สำคัญ — Firestore vs Postgres?

ตอนนี้ Firestore โอเคสำหรับ users/keys (เขียนน้อย), แต่ **`usageLogs` มี write rate สูง** (ทุก API call) และต้อง aggregate รายเดือน → Firestore แพงเร็ว

**คำแนะนำ:** ย้าย `usageLogs` + `ledgerEntries` ไป **Postgres (Supabase)** ตั้งแต่ Phase 2 — pricing เด็ดขาด, query analytics ง่ายกว่า, RLS policies เดิมก็พร้อมใช้ใน `supabase/migrations/`

(เก็บ users + apiKeys ไว้ Firestore ก็ได้, หรือย้ายทั้งหมดในระยะยาว)

---

## 7. Implementation plan (12 สัปดาห์, 4 phase)

### Phase 0 — Security cleanup (สัปดาห์ 1)
**Must-do ก่อน push อะไรเพิ่มเลย:**

- [ ] **C1** rotate Firebase service account + HF token, แก้ `.env.example` ให้เป็น placeholder
- [ ] `git filter-repo` ลบ secret ออกจากประวัติ + force push
- [ ] **C2** เพิ่ม Upstash Redis rate limit (1 endpoint ทดลอง → ทุก endpoint)
- [ ] **C4** สร้าง `/api/auth/session` ที่ set httpOnly cookie + แก้ middleware ให้ verify token จริง
- [ ] เลือกระหว่าง Firebase หรือ Supabase (แนะ: Firebase สำหรับ auth+keys, Supabase สำหรับ logs ภายหลัง)

### Phase 1 — Billing foundation (สัปดาห์ 2-4)

- [ ] เพิ่ม `users/{uid}` document + cron reset free quota รายเดือน
- [ ] `lib/billing/credits.ts` — `reserve()`, `commit()`, `refund()` แบบ transactional
- [ ] `lib/billing/pricing.ts` — table cost ของทุก skill
- [ ] เพิ่ม middleware billing ใน 3 endpoint เดิม → หัก credit จริง
- [ ] หน้า `/dashboard/billing` แสดง balance + history
- [ ] Stripe Checkout + Webhook + topup pack 3 ตัว
- [ ] Sentry / log retention 30 วัน

### Phase 2 — Skill expansion (สัปดาห์ 5-9)

- [ ] Refactor: provider router + skill registry pattern
- [ ] เพิ่ม Image skills 2 ตัว (upscale, stylize)
- [ ] เพิ่ม Text skills ครบ 5 ตัว — ใช้ Together AI หรือ OpenRouter
- [ ] เพิ่ม Audio skills (TTS, STT, music, clone)
- [ ] Async job queue (QStash) สำหรับ skill > 10s
- [ ] Object storage + signed URL pattern (เลิกส่ง base64)
- [ ] Cache layer (24h, by inputHash)

### Phase 3 — Video/3D + product polish (สัปดาห์ 10-12)

- [ ] Video gen, lipsync (async job เท่านั้น)
- [ ] Image-to-3D
- [ ] หน้า `/playground` ทดลองทุก skill
- [ ] OpenAPI spec auto-gen + docs site (Mintlify หรือ Nextra)
- [ ] `@rnai/sdk` (TS) + publish npm
- [ ] Status page (BetterStack)
- [ ] Marketing site update + launch บน Product Hunt + ชุมชน Hugging Face

---

## 8. Risk & compliance

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Provider price shock (HF/fal เปลี่ยนราคา) | M | H | Multi-provider router, รายไตรมาส recalibrate |
| Abuse / NSFW / CSAM | H | H | Content filter (Anthropic Claude moderate / OpenAI moderation) ก่อนเรียก image/video model; ban ทันที |
| Stripe fraud (test cards) | M | M | Stripe Radar + min topup $5 |
| HF cold-start ทำให้ latency แตก SLO | H | M | Pre-warm script + fallback provider |
| User abuse free quota หลายบัญชี | H | M | Email verify + IP/device fingerprint + limit 1 free quota / fingerprint |
| Copyright (image gen output) | M | M | TOS ระบุชัด user ถือสิทธิ์ output, Rnai ไม่รับประกัน |
| GDPR / data deletion | M | H | DELETE endpoint ลบ usageLogs + ledger หลัง 90 วัน, account deletion flow |

**Compliance checklist:** TOS, Privacy Policy, DPA, Cookie banner (EU), refund policy, abuse reporting email — เตรียมก่อน launch สาธารณะ

---

## 9. Quick wins (ทำได้สัปดาห์นี้)

ถ้าต้องเลือกแค่ 5 อย่างที่ impact สูงสุด:

1. **Rotate ทุก secret ทันที** + แก้ `.env.example`
2. **Vercel KV / Upstash Redis** — ใส่ rate limit 60 req/min/key เริ่มต้น
3. **Refactor `huggingface.ts` → `lib/ai/providers/huggingface.ts`** + interface `Provider` รองรับ provider เพิ่มในอนาคต
4. **เพิ่ม `usageLogs` collection** + middleware นับทุก request — ยังไม่ต้องคิด credit ก็ได้ แค่เริ่มเก็บข้อมูล
5. **ย้าย session cookie เป็น httpOnly** — แก้ login page เรียก `/api/auth/session` แทน `document.cookie`

---

## 10. ภาคผนวก — เครื่องมือแนะนำ

| ความต้องการ | เครื่องมือ | เหตุผล |
|---|---|---|
| Rate limit + cache | Upstash Redis (Vercel integration) | ฟรี tier 10K command/วัน เริ่มต้นพอ |
| Job queue | Upstash QStash | HTTP-based, integrate Vercel ง่าย |
| Object storage | Vercel Blob | native, signed URL builtin |
| Observability | Sentry + Better Stack | error + uptime monitor |
| Stripe | Stripe Checkout + Customer Portal | ไม่ต้อง PCI |
| Multi-provider LLM | OpenRouter | endpoint เดียว, fallback อัตโนมัติ |
| Vector / RAG | pgvector (Supabase) | ใช้ embedding skill ที่ออกแบบไว้ |
| Docs site | Mintlify หรือ Fumadocs | OpenAPI auto-render |
| SDK gen | OpenAPI Generator + tsoa | ลด boilerplate |

---

## 11. ถัดจากนี้

1. ตัดสินใจ **Firebase vs Supabase** สำหรับ usageLogs (แนะ: Supabase Postgres ใน Phase 1+)
2. ลงทะเบียน Stripe + เปิดบัญชี Together / fal.ai / Replicate
3. เริ่ม Phase 0 รายการความปลอดภัย — งานนี้ก่อนทุกอย่าง
4. ออกแบบ landing/pricing page ใหม่สะท้อนสกิลทั้ง 17 และ pricing ที่ออกแบบไว้

ดู **`Rnai_Skill_Matrix.xlsx`** สำหรับ pricing/cost matrix ครบทุกสกิล + financial projection
ดู **`Rnai_Project_Analysis.docx`** สำหรับเวอร์ชันเอกสารทางการ (พร้อม TOC, headings)
