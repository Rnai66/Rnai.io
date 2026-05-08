# 🔧 Error Troubleshooting Guide

## ❌ Error 1: "SES Removing unpermitted intrinsics"

### ⚠️ What is this?
```
lockdown-install.js:1 SES Removing unpermitted intrinsics
```

**This is NOT an error** - It's just an informational message from a security library.

### 📖 Explanation:
- **SES** = Secure ECMAScript (ทำให้ JavaScript ปลอดภัยขึ้น)
- **lockdown-install.js** = Security hardening library
- ไปป้องกัน intrinsics (built-in objects) ที่อาจเป็นอันตราย

### ✅ Solution:
**ไม่ต้องทำอะไร** - นี่เป็นข้อความ log ปกติ ไม่มีผลต่อการทำงาน

---

## ❌ Error 2: "Failed to load resource: 404"

### ⚠️ What is this?
```
generate:1  Failed to load resource: the server responded with a status of 404
```

**นี่เป็นข้อผิดพลาดจริง** - หมายความว่ามีทรัพยากรที่ไม่พบ

### 🔍 สาเหตุที่เป็นไปได้

#### 1️⃣ **API Endpoint ไม่เปิดใช้งาน**
```
URL: https://rnai-io.vercel.app/api/v1/website/generate
สถานะ: ❌ Not deployed yet
```

**วิธีแก้:**
```bash
# 1. Deploy backend code ขึ้น Vercel
cd /Users/chanakhongdi/Downloads/rnai-platform
git add src/lib/ai/skills/website-generate.ts
git add src/app/api/v1/website/generate/route.ts
git commit -m "feat: add website generation API"
git push

# 2. รอ Vercel deploy เสร็จ (2-5 นาที)

# 3. ทดสอบ API
curl -X GET https://rnai-io.vercel.app/api/v1/website/generate

# ถ้ามี 200 OK → เสร็จแล้ว ✅
```

---

#### 2️⃣ **CORS Error (Cross-Origin)**
```
Error: Access to XMLHttpRequest blocked by CORS policy
```

**สาเหตุ:**
- Landing page อยู่ domain หนึ่ง
- API อยู่ domain คนละอัน
- Browser ปิดกั้นเพื่อความปลอดภัย

**วิธีแก้:**

**ที่ Backend (rnai-platform):**

```typescript
// src/app/api/v1/website/generate/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // ✅ เพิ่ม CORS headers
  const response = NextResponse.json({
    success: true,
    html: "...",
  });

  // ✅ Allow requests from any origin
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  return response;
}

// ✅ Handle preflight requests
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
```

---

#### 3️⃣ **ใช้ Demo Mode แทน API Mode**

ถ้า API ยังไม่พร้อม:

```html
<!-- ใน landing page -->
1. เปิด ai-platform-landing-integrated.html
2. ไม่ต้องกด "มี API Key?"
3. ใช้ Demo Mode ตามปกติ
   → ไม่ต้อง API ก็ได้
   → แค่ Mock success message
```

---

## 🔍 วิธีตรวจสอบต้นตอของ Error

### Step 1: เปิด Browser Developer Tools
```
Chrome/Edge:
  - Press: F12 หรือ Ctrl+Shift+I
  
Firefox:
  - Press: F12 หรือ Ctrl+Shift+I
  
Safari:
  - Press: Cmd+Option+I
```

### Step 2: ไปที่ Console tab
```
ดู 3 สิ่ง:
1. Error messages (แดง)
2. Warnings (เหลือง)
3. Network requests (บ้าน tab Network)
```

### Step 3: ไปที่ Network tab
```
1. กรอกฟอร์ม
2. กดปุ่ม "สร้างเวบไซด์"
3. ดู requests ที่ส่งไป
4. หา request ไปที่ generate endpoint
5. ตรวจสอบ:
   - Status code: 200 = OK, 404 = Not found, 500 = Server error
   - Response: มี HTML หรือเปล่า
```

---

## 📋 Complete Checklist

ก่อนใช้งาน Landing Page:

- [ ] Backend API deployed ที่ https://rnai-io.vercel.app
- [ ] ทดสอบ GET https://rnai-io.vercel.app/api/v1/website/generate
- [ ] ได้ 200 OK response
- [ ] CORS headers ตั้งค่าแล้ว
- [ ] Frontend landing page ที่ถูกต้อง
- [ ] API Key ถูกต้อง (ถ้าใช้ API mode)
- [ ] ไม่มี 404 errors

---

## 🛠️ Solutions Summary

| Error | Cause | Solution |
|-------|-------|----------|
| `SES Removing unpermitted intrinsics` | Security library message | ✅ Ignore - not an error |
| `404 generate:1` | API endpoint not deployed | Deploy backend code + wait for Vercel |
| `CORS policy blocked` | Cross-origin request | Add CORS headers to API |
| `Bearer token invalid` | Wrong API Key | Check API Key correctness |
| `Rate limit exceeded` | Too many requests | Wait or upgrade API plan |
| `Insufficient credits` | No credits left | Top up credits at platform |

---

## 🚀 Quick Fix Guide

### If using Demo Mode:
```
✅ Just ignore the 404 error
✅ Use the demo without API
✅ No real API calls needed
```

### If using API Mode:
```
1. Make sure backend is deployed
2. Get valid API Key
3. Check CORS settings
4. Test with curl first
5. Then use landing page
```

---

## 📱 Testing API with curl

```bash
# Test if API is working
curl -X GET https://rnai-io.vercel.app/api/v1/website/generate

# Expected response:
# {
#   "message": "Website Generation API",
#   "endpoint": "/api/v1/website/generate"
# }

# Test POST with API Key
curl -X POST https://rnai-io.vercel.app/api/v1/website/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "websiteName": "Test",
    "websiteType": "ecommerce",
    "template": "modern",
    "description": "Test website"
  }'

# Expected response:
# {
#   "success": true,
#   "html": "<!DOCTYPE html>...",
#   "cached": false
# }
```

---

## 📞 Still Having Issues?

**ลองตรวจสอบ:**
1. ✅ API endpoint deployed?
2. ✅ API Key valid?
3. ✅ CORS configured?
4. ✅ Browser console clear?
5. ✅ Landing page correct?

**ถ้าตรวจสอบแล้ว:**
- Check Vercel logs: https://vercel.com/dashboard
- Check Firebase logs: https://console.firebase.google.com
- Contact support: contact@anai.co.th

---

**Last Updated**: May 8, 2024
**Status**: Complete Troubleshooting Guide ✅
