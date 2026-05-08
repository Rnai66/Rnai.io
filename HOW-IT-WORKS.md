# 🏗️ สถาปัตยกรรมและการทำงานของเวบไซด์ อานาย AI

## 📊 ระบบการทำงาน (Current Architecture)

### 1️⃣ **ปัจจุบัน (Static Landing Page)**

```
┌─────────────────────────────────────────┐
│      ai-platform-landing.html           │
│   (Frontend Only - ไม่มี Backend)       │
├─────────────────────────────────────────┤
│ • ฟอร์มรับข้อมูล (HTML)                 │
│ • Styling สวยงาม (CSS)                  │
│ • Mock Demo (JavaScript)                │
│ • Mock Alert ข้อความจำลอง              │
│ • ไม่มีการเชื่อมต่อ API                 │
└─────────────────────────────────────────┘
```

**ข้อมูลที่รวบรวม:**
- ชื่อเวบไซด์
- ประเภทเวบไซด์
- เทมเพลตที่เลือก
- รายละเอียด/คำอธิบาย

**ปัญหา:** ข้อมูลเหล่านี้ **ยังไม่ส่งไปที่ไหน** แค่แสดง alert

---

## 🔌 วิธีเชื่อมต่อกับ rnai-platform

### 2️⃣ **ที่ต้องทำ (Proposed Architecture)**

```
┌──────────────────────┐         API Request        ┌────────────────────────┐
│  Landing Page        │    (Form Data JSON)       │   rnai-platform        │
│  (Frontend)          │──────────────────────────>│   (Backend Server)     │
│  ai-platform-...html │                           │   https://rnai-io...   │
└──────────────────────┘                           └────────────────────────┘
                             API Response                    │
                      (Generated HTML/CSS)                   │
                       <─────────────────────                │
                                                              │
                                                    ┌─────────▼──────────┐
                                                    │ • Process with AI  │
                                                    │ • Generate Code    │
                                                    │ • Return Result    │
                                                    └────────────────────┘
```

---

## 🛠️ ขั้นตอนการเชื่อมต่อ

### Step 1: สร้าง API Endpoint ที่ Backend (rnai-platform)

Backend ต้องสร้าง API endpoint เช่น:

```
POST https://rnai-io.vercel.app/api/generate-website
Content-Type: application/json

{
  "websiteName": "ร้านกาแฟ AromaBean",
  "websiteType": "ecommerce",
  "template": "modern",
  "description": "ร้านกาแฟที่เน้นเมล็ดกาแฟคุณภาพสูง"
}
```

**Response ที่คาดหวัง:**

```json
{
  "success": true,
  "htmlCode": "<html>...",
  "cssCode": "...",
  "websiteUrl": "https://preview-xxxx.vercel.app/",
  "downloadUrl": "https://rnai-io.vercel.app/download/xxxx"
}
```

---

### Step 2: แก้ไข Landing Page เพื่อเรียก API

ต้องเปลี่ยนฟังก์ชัน `generateWebsite()` จากการแสดง alert เป็นการส่ง request

```javascript
async function generateWebsite() {
    const name = document.getElementById('website-name').value;
    const type = document.getElementById('website-type').value;
    const description = document.getElementById('description').value;
    
    // Validation
    if (!name.trim() || !type || !description.trim()) {
        alert('⚠️ กรุณากรอกข้อมูลให้ครบถ้วน');
        return;
    }

    // Show loading
    const btn = document.querySelector('.generate-btn');
    btn.disabled = true;
    btn.textContent = '⏳ กำลังสร้าง...';

    try {
        // 🔑 ส่ง Request ไปที่ Backend
        const response = await fetch('https://rnai-io.vercel.app/api/generate-website', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                websiteName: name,
                websiteType: type,
                template: selectedTemplate || 'modern',
                description: description
            })
        });

        const result = await response.json();

        if (result.success) {
            // ✅ สำเร็จ
            alert(`✅ เวบไซด์ของคุณสร้างเสร็จแล้ว!\n\nดูตัวอย่าง: ${result.websiteUrl}`);
            
            // บันทึก URL เพื่อให้ผู้ใช้ดาวน์โหลด
            window.location.href = result.downloadUrl;
        } else {
            alert(`❌ มีข้อผิดพลาด: ${result.message}`);
        }
    } catch (error) {
        alert(`❌ เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ สร้างเวบไซด์ของฉัน';
    }
}
```

---

## 🔐 CORS Configuration

เนื่องจาก Landing Page จะรันบน domain ต่างจากที่เซิร์ฟเวอร์ ต้องตั้ง CORS:

**Backend (rnai-platform) ต้องตั้ง:**

```javascript
// Express.js Example
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000', 'https://anai.co.th', '*.vercel.app'],
    methods: ['POST', 'GET'],
    credentials: true
}));

// API Endpoint
app.post('/api/generate-website', async (req, res) => {
    // Process...
});
```

---

## 📱 ตัวอย่างแบบสมบูรณ์

### 1. Landing Page (Frontend)
- รวบรวมข้อมูลจากผู้ใช้
- ส่ง POST request ไปที่ Backend API
- แสดง Loading indicator
- แสดง Preview หรือ Download link

### 2. Backend API (rnai-platform)
- รับข้อมูลฟอร์ม
- เรียก Claude API เพื่อสร้างโค้ด HTML/CSS
- บันทึก/แคช ผลลัพธ์
- ส่งกลับ HTML code และ preview URL

### 3. Storage
- เก็บ HTML file ที่สร้าง
- สร้าง Preview URL ชั่วคราว
- เตรียม Download link

---

## 🚀 ขั้นตอนการติดตั้ง

### ตัวเลือก A: ใช้ API ที่มีอยู่แล้ว
```bash
# ถ้า rnai-platform มี API แล้ว
# แค่เปลี่ยน URL ใน generateWebsite()
https://rnai-io.vercel.app/api/generate-website
```

### ตัวเลือก B: สร้าง API ใหม่
```bash
# ที่ rnai-platform (backend)
1. สร้าง /api/generate-website endpoint
2. ติดตั้ง anthropic SDK
3. ตั้ง CORS
4. Deploy ขึ้น Vercel

# ที่ Landing Page (frontend)
1. อัปเดต generateWebsite() function
2. เปลี่ยน API URL
3. Deploy ขึ้น hosting
```

---

## 🔄 Request/Response Flow

```
┌─ User กรอกฟอร์ม ─┐
│                  │
│  • Website Name  │
│  • Type          │
│  • Template      │
│  • Description   │
└──────┬───────────┘
       │
       ▼
┌─────────────────────────────┐
│ JavaScript Function         │
│ generateWebsite()           │
│ • Validate Data             │
│ • Show Loading              │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ POST Request                │
│ fetch(API_URL, {            │
│   method: 'POST',           │
│   body: JSON                │
│ })                          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│ Backend API (rnai-platform)         │
│ /api/generate-website               │
│                                     │
│ 1. Receive JSON Data                │
│ 2. Call Claude API                  │
│ 3. Generate HTML/CSS Code           │
│ 4. Save File                        │
│ 5. Return Response                  │
└──────┬────────────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Response JSON                │
│ {                            │
│   success: true,             │
│   htmlCode: "...",           │
│   websiteUrl: "...",         │
│   downloadUrl: "..."         │
│ }                            │
└──────┬───────────────────────┘
       │
       ▼
┌──────────────────────────────┐
│ Frontend ตอบสนอง             │
│ • Redirect ไป Download       │
│ • Show Preview               │
│ • Display Success Message    │
└──────────────────────────────┘
```

---

## ⚙️ Environment Variables ที่ต้อง

### Landing Page (.env)
```
VITE_API_URL=https://rnai-io.vercel.app/api
```

### Backend (rnai-platform)
```
ANTHROPIC_API_KEY=sk-ant-...
CORS_ORIGIN=https://anai.co.th,https://anai-landing.vercel.app
NODE_ENV=production
```

---

## 📋 Checklist สำหรับการเชื่อมต่อ

- [ ] rnai-platform มี API endpoint `/api/generate-website` แล้ว
- [ ] API ถูก deploy ขึ้น Vercel
- [ ] CORS ตั้งค่าให้ถูกต้อง
- [ ] Claude API key ตั้งค่าในทั้ง frontend และ backend
- [ ] Landing Page แก้ไข generateWebsite() function
- [ ] Test API ว่าทำงานได้
- [ ] Deploy Landing Page ขึ้นเซิร์ฟเวอร์

---

## 🤔 คำถาม

ถ้าคุณต้องการให้ผมช่วย:
1. ✅ สร้าง Backend API ใหม่
2. ✅ แก้ไข Landing Page เพื่อเชื่อมต่อ
3. ✅ สร้างรหัส Full Stack
4. ✅ ติดตั้งและ Deploy

บอกเราได้เลยค่ะ! 🚀
