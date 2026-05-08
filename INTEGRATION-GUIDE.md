# 🔗 Integration Guide - อานาย AI Landing Page + rnai-platform

## 📚 สารบัญ
1. [ภาพรวมระบบ](#ภาพรวมระบบ)
2. [ไฟล์ที่สร้าง](#ไฟล์ที่สร้าง)
3. [การตั้งค่าและติดตั้ง](#การตั้งค่าและติดตั้ง)
4. [วิธีใช้งาน](#วิธีใช้งาน)
5. [Troubleshooting](#troubleshooting)

---

## 🌐 ภาพรวมระบบ

```
┌─────────────────────────────────────────────────────────────┐
│                   Landing Page (Frontend)                   │
│         ai-platform-landing-integrated.html                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • รับข้อมูลจากผู้ใช้                                 │  │
│  │ • ปุ่ม "มี API Key?" เพื่อเปิด/ปิด API Mode        │  │
│  │ • เรียก API /v1/website/generate                   │  │
│  │ • ดาวน์โหลด HTML ที่สร้าง                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓ POST Request                      │
├─────────────────────────────────────────────────────────────┤
│  rnai-io.vercel.app/api/v1/website/generate (Backend API)  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ • ตรวจสอบ API Key (Bearer Token)                   │  │
│  │ • ตรวจสอบ Rate Limit                                │  │
│  │ • หักเครดิต                                         │  │
│  │ • เรียก websiteGenerateSkill()                      │  │
│  │ • บันทึก Log ในDatabase                            │  │
│  │ • ส่ง HTML Response กลับ                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                      ↓ JSON Response                         │
│  {                                                           │
│    "success": true,                                          │
│    "html": "<html>...",                                      │
│    "websiteName": "...",                                     │
│    "cached": false                                           │
│  }                                                           │
│                          ↓                                   │
└─────────────────────────────────────────────────────────────┘
                     Frontend Downloads HTML
                   & Saves as .html file
```

---

## 📁 ไฟล์ที่สร้าง

### 1. **Landing Page (Frontend)**
**File**: `ai-platform-landing-integrated.html`

**ฟีเจอร์:**
- ✅ Demo Mode (ไม่ต้อง API Key)
- ✅ API Mode (ใช้ API Key จริง)
- ✅ ปุ่ม "มี API Key?" เพื่อเปลี่ยนโหมด
- ✅ ดาวน์โหลด HTML โดยตรง
- ✅ Loading indicator
- ✅ Status messages

**ใช้วิธี:**
```html
<!-- Demo Mode -->
1. เปิด ai-platform-landing-integrated.html
2. กรอกฟอร์มข้อมูล
3. กดปุ่ม "สร้างเวบไซด์"
4. ได้ Success message

<!-- API Mode -->
1. กดปุ่ม "มี API Key?"
2. ใส่ API Key ของคุณ
3. กรอกฟอร์มข้อมูล
4. กดปุ่ม "สร้างเวบไซด์"
5. HTML ถูกดาวน์โหลด
```

---

### 2. **Website Generation Skill (AI)**
**File**: `src/lib/ai/skills/website-generate.ts`

**ทำไม:**
- รับ parameters: websiteName, websiteType, template, description
- สร้าง prompt เพื่อให้ AI สร้าง HTML
- ใช้ OpenRouter/Together API
- ส่ง HTML code กลับ

**Code Structure:**
```typescript
export async function websiteGenerateSkill(params: WebsiteGenerationParams) {
  // Build AI prompt
  // Call AI provider
  // Extract & return HTML
}
```

---

### 3. **API Route (Backend)**
**File**: `src/app/api/v1/website/generate/route.ts`

**Endpoints:**
```
GET  /api/v1/website/generate
     └─ ข้อมูล API documentation

POST /api/v1/website/generate
     └─ สร้างเวบไซด์
```

**Request Headers:**
```
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

**Request Body:**
```json
{
  "websiteName": "ร้านกาแฟ AromaBean",
  "websiteType": "ecommerce",
  "template": "modern",
  "description": "ร้านกาแฟที่เน้นเมล็ดกาแฟคุณภาพสูง...",
  "language": "th"
}
```

**Response:**
```json
{
  "success": true,
  "html": "<!DOCTYPE html>...",
  "cached": false,
  "websiteName": "ร้านกาแฟ AromaBean",
  "message": "Website generated successfully"
}
```

---

## 🔧 การตั้งค่าและติดตั้ง

### Step 1: Deploy Backend Code
```bash
# ที่ rnai-platform
cd /Users/chanakhongdi/Downloads/rnai-platform

# Files ที่ต้อง commit
git add src/lib/ai/skills/website-generate.ts
git add src/app/api/v1/website/generate/route.ts
git commit -m "feat: add website generation API endpoint"
git push

# Vercel จะ auto-deploy
# ตรวจสอบว่า https://rnai-io.vercel.app/api/v1/website/generate ทำงาน
```

### Step 2: Test API (Optional)
```bash
# ใช้ curl เพื่อทดสอบ
curl -X GET https://rnai-io.vercel.app/api/v1/website/generate

# ลองสร้างเวบไซด์
curl -X POST https://rnai-io.vercel.app/api/v1/website/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "websiteName": "Test Website",
    "websiteType": "ecommerce",
    "template": "modern",
    "description": "Test description"
  }'
```

### Step 3: Deploy Frontend
```bash
# Option A: ใช้ Vercel
1. Push ai-platform-landing-integrated.html ไปที่ GitHub
2. Connect ให้ Vercel
3. Deploy!

# Option B: ใช้ Netlify
1. Push ไป GitHub
2. Connect ให้ Netlify
3. Deploy!

# Option C: ใช้ GitHub Pages
1. Rename เป็น index.html
2. Push ไป gh-pages branch
3. Enable GitHub Pages ในเซตติ้ง
```

### Step 4: Get API Key
```
1. ไป https://rnai-io.vercel.app
2. Login/Register
3. ไปที่ "API Keys"
4. สร้าง Key ใหม่
5. Copy & Save API Key
   เช่น: rnai_sk_xxxxxxxxxxxxx
```

---

## 💻 วิธีใช้งาน

### Demo Mode (ไม่ต้อง API Key)
```
1. เปิด ai-platform-landing-integrated.html ในเบราว์เซอร์
2. กรอกข้อมูล:
   - ชื่อเวบไซด์
   - ประเภท
   - เทมเพลต
   - รายละเอียด
3. กดปุ่ม "สร้างเวบไซด์"
4. ได้ Success message (Mock demo)
```

### API Mode (ใช้ API จริง)
```
1. เปิด ai-platform-landing-integrated.html
2. กดปุ่ม "🔌 มี API Key?"
3. ใส่ API Key ของคุณ
   - ถ้าไม่มี ไปสร้างที่ https://rnai-io.vercel.app
4. กรอกข้อมูลฟอร์ม
5. กดปุ่ม "สร้างเวบไซด์"
6. รอ AI สร้าง (20-60 วินาที)
7. HTML ถูกดาวน์โหลดอัตโนมัติ
8. เปิดไฟล์ HTML ในเบราว์เซอร์ ✅
```

---

## 🔌 API Integration Details

### Rate Limiting
```
- ตรวจสอบโดย Upstash Redis
- Limit: ขึ้นอยู่กับ API Key
- Headers ที่ส่งกลับ:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 99
  X-RateLimit-Reset: 1234567890
```

### Credits System
```
- Cost: 10 credits (configurable)
- ถ้า insufficient → Error 402
- ถ้า success → หักเครดิต
- ถ้า error → refund เครดิต
```

### Caching
```
- Hash ของ input params
- Cache expire: 7 วัน (default)
- ตรวจสอบ: Upstash Redis
- Response แสดง: "cached": true/false
```

### Database Logging
```
Collection: usageLogs
Fields:
  - uid: User ID
  - apiKeyId: API Key ID
  - skill: "website/generate"
  - status: "success" | "cached"
  - provider: "openrouter" | "together"
  - latencyMs: processing time
  - websiteName, websiteType, template: input data
  - createdAt: timestamp
```

---

## 🛠️ Troubleshooting

### ❌ API Key ไม่ถูกต้อง
```
Error: Invalid or inactive API key

วิธีแก้:
1. ตรวจสอบ API Key ว่าถูกต้อง
2. ทำให้ API Key active ที่ https://rnai-io.vercel.app
3. ลองสร้าง Key ใหม่
```

### ❌ Rate Limit เกิน
```
Error: Rate limit exceeded

วิธีแก้:
1. รอ rate limit reset
2. Check X-RateLimit-Reset header
3. ติดต่อ admin ขอเพิ่ม limit
```

### ❌ Insufficient Credits
```
Error: Insufficient credits

วิธีแก้:
1. เติมเครดิต ที่ https://rnai-io.vercel.app/billing
2. หรือติดต่อ support
```

### ❌ AI Model Error
```
Error: Internal server error

วิธีแก้:
1. ลองอีกครั้ง (อาจเป็น temporary error)
2. ตรวจสอบ description ว่า valid
3. ลองเปลี่ยน template
4. ติดต่อ support ถ้าเกิดขึ้นซ้ำ
```

### ❌ CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS policy

วิธีแก้:
1. ตรวจสอบ CORS ที่ backend
2. ทำให้ origin ของ landing page trusted
3. ใช้ proxy ถ้าจำเป็น
```

### ❌ Download ไม่ได้
```
วิธีแก้:
1. ตรวจสอบ pop-up blocker
2. ดู console.log ว่ามี error
3. ลองใช้ browser อื่น
4. ลองใช้ incognito mode
```

---

## 📊 Pricing & Costs

```
Website Generation:
- 10 credits per request
- 1 credit ≈ $0.01 (estimated)
- Cost: ~$0.10 per website

AI Models Used:
- OpenRouter (primary)
- Together AI (fallback)
- Cost: ขึ้นอยู่กับ model & tokens
```

---

## 🎯 เป้าหมายและการปรับปรุง

### Current Status ✅
- ✅ Landing Page สมบูรณ์
- ✅ API Endpoint สร้างแล้ว
- ✅ Skill function สร้างแล้ว
- ✅ Authentication & Rate Limiting
- ✅ Caching system
- ✅ Credits system

### Future Improvements 🚀
- [ ] Preview live ใน landing page
- [ ] Template customization UI
- [ ] Edit generated HTML ใน platform
- [ ] SEO optimization
- [ ] Mobile app version
- [ ] Webhook notifications
- [ ] Batch generation
- [ ] Analytics dashboard

---

## 📞 Support & Contact

```
Email: contact@anai.co.th
Website: https://rnai-io.vercel.app
API Docs: https://rnai-io.vercel.app/api/v1/website/generate (GET)
```

---

## ✅ Checklist

Before going live:

- [ ] API endpoint deployed และ working
- [ ] Frontend landing page hosted
- [ ] API Key ได้ & เก็บอย่างปลอดภัย
- [ ] Test API ว่า generate HTML ได้
- [ ] Test download HTML ได้
- [ ] CORS ตั้งค่าถูกต้อง
- [ ] Rate limiting ตั้งค่าเหมาะสม
- [ ] Database logging ทำงาน
- [ ] Error handling complete
- [ ] Documentation ready

---

**Last Updated**: May 8, 2024
**Status**: Ready for Production ✅
