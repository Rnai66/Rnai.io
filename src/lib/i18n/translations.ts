export type Language = "en" | "th";

export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      playground: "Playground",
      profile: "Profile",
      logout: "Logout",
    },
    // Dashboard
    dashboard: {
      welcome: "Welcome to Workspace",
      currentPlan: "Current Plan",
      availableCredits: "Available Credits",
      activeSkills: "Active Skills",
      openPlayground: "Open Playground →",
      usageHistory: "Usage History",
      latestApiCalls: "Latest API calls across your active keys.",
      noUsageRecorded: "No usage recorded yet.",
      skill: "Skill",
      provider: "Provider",
      latency: "Latency",
      status: "Status",
      time: "Time",
    },
    // Profile
    profile: {
      title: "Profile Settings",
      subtitle: "Manage your account and preferences",

      // Tabs
      language: "Language",
      apiKeys: "API Keys",
      billing: "Billing",
      account: "Account",

      // Language Settings
      languageSettings: "Language Preference",
      currentLanguage: "Current Language",
      selectLanguage: "Select Display Language",
      english: "English",
      thai: "Thai",
      saved: "Language saved successfully",

      // Account Settings
      email: "Email Address",
      emailDescription: "Your registered email",
      password: "Password",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",
      confirmPassword: "Confirm Password",
      phone: "Phone Number",
      address: "Address",
      city: "City",
      country: "Country",
      postalCode: "Postal Code",
      saveChanges: "Save Changes",
      deleteAccount: "Delete Account",
      deleteAccountWarning: "This action cannot be undone",

      // API Keys
      yourApiKeys: "Your API Keys",
      noKeysCreated: "No API keys created yet",
      createNewKey: "Create New Key",
      keyName: "Key Name",
      created: "Created",
      lastUsed: "Last Used",
      actions: "Actions",
      copy: "Copy",
      revoke: "Revoke",
      copied: "Copied to clipboard",

      // Billing
      billingInfo: "Billing Information",
      currentPlanLabel: "Current Plan",
      freeTier: "Free Tier",
      payAsYouGo: "Pay-As-You-Go",
      totalCredits: "Total Credits",
      freeCredits: "Free Credits",
      paidCredits: "Paid Credits",
      usageThisMonth: "Usage This Month",
      addPaymentMethod: "Add Payment Method",

      // Actions
      update: "Update",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
    },
  },
  th: {
    // Navigation
    nav: {
      dashboard: "แดชบอร์ด",
      playground: "พื้นที่ทดลอง",
      profile: "โปรไฟล์",
      logout: "ออกจากระบบ",
    },
    // Dashboard
    dashboard: {
      welcome: "ยินดีต้อนรับสู่ Workspace",
      currentPlan: "แผนปัจจุบัน",
      availableCredits: "เครดิตที่มีอยู่",
      activeSkills: "ทักษะที่ใช้งาน",
      openPlayground: "เปิด Playground →",
      usageHistory: "ประวัติการใช้งาน",
      latestApiCalls: "เรียกใช้ API ล่าสุดจากคีย์ที่ใช้งานอยู่",
      noUsageRecorded: "ยังไม่มีการบันทึกการใช้งาน",
      skill: "ทักษะ",
      provider: "ผู้ให้บริการ",
      latency: "ความหน่วง",
      status: "สถานะ",
      time: "เวลา",
    },
    // Profile
    profile: {
      title: "ตั้งค่าโปรไฟล์",
      subtitle: "จัดการบัญชีและการตั้งค่าของคุณ",

      // Tabs
      language: "ภาษา",
      apiKeys: "API Keys",
      billing: "การเรียกเก็บเงิน",
      account: "บัญชี",

      // Language Settings
      languageSettings: "การตั้งค่าภาษา",
      currentLanguage: "ภาษาปัจจุบัน",
      selectLanguage: "เลือกภาษาที่แสดงผล",
      english: "English",
      thai: "ไทย",
      saved: "บันทึกภาษาสำเร็จ",

      // Account Settings
      email: "ที่อยู่อีเมล",
      emailDescription: "อีเมลที่ลงทะเบียน",
      password: "รหัสผ่าน",
      changePassword: "เปลี่ยนรหัสผ่าน",
      currentPassword: "รหัสผ่านปัจจุบัน",
      newPassword: "รหัสผ่านใหม่",
      confirmPassword: "ยืนยันรหัสผ่าน",
      phone: "เบอร์โทรศัพท์",
      address: "ที่อยู่",
      city: "เมือง",
      country: "ประเทศ",
      postalCode: "รหัสไปรษณีย์",
      saveChanges: "บันทึกการเปลี่ยนแปลง",
      deleteAccount: "ลบบัญชี",
      deleteAccountWarning: "การกระทำนี้ไม่สามารถยกเลิกได้",

      // API Keys
      yourApiKeys: "API Keys ของคุณ",
      noKeysCreated: "ยังไม่มีการสร้าง API key",
      createNewKey: "สร้าง API Key ใหม่",
      keyName: "ชื่อ Key",
      created: "สร้างเมื่อ",
      lastUsed: "ใช้ล่าสุดเมื่อ",
      actions: "การกระทำ",
      copy: "คัดลอก",
      revoke: "เพิกถอน",
      copied: "คัดลอกไปยังคลิปบอร์ดแล้ว",

      // Billing
      billingInfo: "ข้อมูลการเรียกเก็บเงิน",
      currentPlanLabel: "แผนปัจจุบัน",
      freeTier: "ฟรี",
      payAsYouGo: "Pay-As-You-Go",
      totalCredits: "เครดิตทั้งหมด",
      freeCredits: "เครดิตฟรี",
      paidCredits: "เครดิตที่ชำระแล้ว",
      usageThisMonth: "การใช้งานเดือนนี้",
      addPaymentMethod: "เพิ่มวิธีการชำระเงิน",

      // Actions
      update: "อัปเดต",
      cancel: "ยกเลิก",
      confirm: "ยืนยัน",
      delete: "ลบ",
    },
  },
};

export function t(key: string, lang: Language): string {
  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
