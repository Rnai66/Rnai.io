export type Language = "en" | "th";

export const translations = {
  en: {
    // Navigation
    nav: {
      dashboard: "Dashboard",
      playground: "Playground",
      profile: "Profile",
      logout: "Logout",
      signOut: "Sign out",
      login: "Log in",
      logIn: "Log in",
      getStarted: "Get Started",
      backToDashboard: "Back to Dashboard",
    },

    // Common
    common: {
      welcome: "Welcome",
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      update: "Update",
      confirm: "Confirm",
      close: "Close",
      copy: "Copy",
      copied: "Copied to clipboard",
      required: "Required",
      optional: "Optional",
      noData: "No data available",
      loadingMore: "Loading more...",
      tryAgain: "Try Again",
      goBack: "Go Back",
      function: "Function",
      credits: "credits",
      openPlayground: "Open Playground →",
      running: "Running...",
      backToDashboard: "Back to Dashboard",
      run: "Run",
      result: "Result",
      downloadHtml: "Download HTML",
      remove: "Remove",
      prompt: "Prompt",
      text: "Text",
      targetLanguage: "Target Language",
      tone: "Tone",
      extractionSchema: "Extraction Schema",
      image: "Image",
      mask: "Mask",
      audio: "Audio",
      websiteName: "Website Name",
      websiteType: "Website Type",
      templateStyle: "Template Style",
      description: "Description",
      customPromptOptional: "Custom Prompt (Optional)",
      referenceImageOptional: "Reference Image (Optional)",
      send: "Send",
      free: "Free",
      addFiles: "Add Files",
    },

    // Dashboard
    dashboard: {
      title: "Welcome to Workspace",
      subtitle: "Manage your AI skills and usage",
      welcome: "Welcome to Workspace",
      currentPlan: "Current Plan",
      availableCredits: "Available Credits",
      activeSkills: "Active Skills",
      openPlayground: "Open Playground →",
      usageHistory: "Usage History",
      latestApiCalls: "Latest API calls across your active keys.",
      noUsageRecorded: "No usage recorded yet.",
      noUsageYet: "No usage recorded yet.",
      skill: "Skill",
      skillColumn: "Skill",
      provider: "Provider",
      providerColumn: "Provider",
      latency: "Latency",
      latencyColumn: "Latency",
      status: "Status",
      statusColumn: "Status",
      time: "Time",
      timeColumn: "Time",
      freeTier: "Free Tier",
      payAsYouGo: "Pay-As-You-Go",
      totalCredits: "Total Credits",
      freeCredits: "Free Credits",
      paidCredits: "Paid Credits",
    },

    // Playground
    playground: {
      title: "AI Playground",
      subtitle: "Run Rnai skills from your account and chat with Gemini for free.",
      selectFunction: "Select a Function",

      // Skills
      imageGenerate: "Image Generate",
      imageEdit: "Image Edit",
      removeBackground: "Remove Background",
      imageRemoveBackground: "Remove Background",
      imageUpscale: "Image Upscale",
      imageStylize: "Image Stylize",
      textGenerate: "Text Generate",
      textSummarize: "Text Summarize",
      textTranslate: "Text Translate",
      textRewrite: "Text Rewrite",
      textExtract: "Text Extract",
      audioTts: "Text to Speech",
      audioStt: "Speech to Text",
      websiteGenerate: "Website Generate",

      // Inputs
      promptPlaceholder: "Describe what you want to generate...",
      textPlaceholder: "Paste or write text here...",
      websiteNamePlaceholder: "เช่น ร้านกาแฟ AromaBean",
      descriptionPlaceholder: "อธิบายรายละเอียดของเวบไซด์ที่ต้องการ...",
      customPromptPlaceholder: "ป้อนคำสั่ง custom เพิ่มเติมเพื่อปรับแต่งการสร้างเว็บไซด์ (จะผสมกับ Description)...",

      // UI Elements
      popularTemplates: "Popular Templates",
      clickToFill: "Click to fill prompt",
      promptAttachments: "Prompt Attachments",
      attachmentsHelp: "Text files are added to the prompt. Images and other binary files are metadata only unless the selected function has its own image upload field.",
      textIncluded: "text included",
      metadataOnly: "metadata only",

      // Website specific
      websiteTypeEcommerce: "E-Commerce",
      websiteTypeBlog: "Blog",
      websiteTypePortfolio: "Portfolio",
      websiteTypeService: "Service",
      websiteTypeRestaurant: "Restaurant",
      websiteTypeSaas: "SaaS",

      // Templates
      templateModern: "Modern",
      templateMinimal: "Minimal",
      templateBold: "Bold",
      templateElegant: "Elegant",

      // Image usage
      howToUseImage: "How to use this image:",
      imageUsageDesignRef: "Design Ref",
      imageUsageBackground: "Background",
      imageUsageLogo: "Logo",

      // Results
      htmlPreview: "HTML Preview (first 1000 chars):",

      // Gemini Chat
      geminiChat: "Gemini Chat",
      freeChatSubtitle: "Free chat for signed-in users.",
      geminiThinking: "Gemini is thinking...",
      askGemini: "Ask Gemini...",

      // Errors
      unauthorized: "Unauthorized",
      rateLimitExceeded: "Rate limit exceeded",
      insufficientCredits: "Insufficient credits",
      requestFailed: "Request failed",
    },

    // Profile/Settings
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
      english: "🇬🇧 English",
      thai: "🇹🇭 ไทย",
      saved: "Language saved successfully",
      languageSaved: "Language saved",

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
      profileUpdated: "Profile updated successfully",
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
      revoke: "Revoke",
      goToApiKeys: "Go to API Keys",

      // Billing
      billingInfo: "Billing Information",
      currentPlanLabel: "Current Plan",
      freeTier: "Free Tier",
      payAsYouGo: "Pay-As-You-Go",
      totalCredits: "Total Credits",
      freeCreditsLabel: "Free Credits",
      paidCreditsLabel: "Paid Credits",
      usageThisMonth: "Usage This Month",
      addPaymentMethod: "Add Payment Method",
      goToBilling: "Go to Billing",
    },

    // Billing / Payments
    billing: {
      title: "Billing & Credits",
      subtitle: "Manage your credits and payment methods",
      totalAvailableCredits: "Total Available Credits",
      readyToUse: "Ready to use",
      freeQuota: "Free Credits",
      paidBalance: "Paid Credits Balance",
      topupPacks: "Top up Credits",
      noExpiry: "No expiry",
      mostPopular: "Most Popular",
      aiCredits: "AI Credits",
      buyNow: "Buy Now",
      paymentSuccess: "🎉 Payment successful! Credits added to your account.",
      paymentCancelled: "❌ Payment cancelled. No charges were made.",
    },

    // Auth Pages
    auth: {
      login: "Log in",
      signup: "Sign up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signIn: "Sign In",
      signUp: "Sign Up",
      loginWithGoogle: "Login with Google",
      orContinueWith: "Or continue with",
      alreadyHaveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      createAccount: "Create account",
      agreeToTerms: "I agree to the Terms of Service and Privacy Policy",
      invalidEmail: "Invalid email address",
      passwordTooShort: "Password must be at least 6 characters",
      passwordMismatch: "Passwords do not match",
      loginError: "Login failed. Please check your credentials.",
      signupError: "Sign up failed. Please try again.",
      logoutSuccess: "Logged out successfully",
    },

    // Website Generation specific
    website: {
      name: "Website Name",
      type: "Website Type",
      template: "Template Style",
      description: "Description",
      customPrompt: "Custom Prompt (Optional)",
      referenceImage: "Reference Image (Optional)",
      designReferenceDesc: "Use as design inspiration (colors, layout, style, typography)",
      backgroundDesc: "Use as background image for hero section",
      logoDesc: "Use as logo or brand image in header",
      generate: "Generate Website",
      generating: "Generating...",
      generationFailed: "Website generation failed",
      previewHtml: "HTML Preview",
    },

    // Status messages
    status: {
      success: "Success",
      success_message: "Operation completed successfully",
      error: "Error",
      error_message: "Something went wrong. Please try again.",
      warning: "Warning",
      info: "Info",
      loading: "Loading",
      cached: "Cached",
    },

    // Landing page / Home
    home: {
      title: "Rnai — The Ultimate AI Gateway",
      subtitle: "Generate, edit, translate, and extract using the world's best AI models",
      cta: "Get Started",
      loginLink: "Log in",
    },
  },

  th: {
    // Navigation
    nav: {
      dashboard: "แดชบอร์ด",
      playground: "พื้นที่จำลอง",
      profile: "โปรไฟล์",
      logout: "ออกจากระบบ",
      signOut: "ออกจากระบบ",
      login: "เข้าสู่ระบบ",
      logIn: "เข้าสู่ระบบ",
      getStarted: "เริ่มต้นใช้งาน",
      backToDashboard: "กลับไปแดชบอร์ด",
    },

    // Common
    common: {
      welcome: "ยินดีต้อนรับ",
      loading: "กำลังโหลด...",
      error: "เกิดข้อผิดพลาด",
      success: "สำเร็จ",
      save: "บันทึก",
      cancel: "ยกเลิก",
      delete: "ลบ",
      edit: "แก้ไข",
      update: "อัปเดต",
      confirm: "ยืนยัน",
      close: "ปิด",
      copy: "คัดลอก",
      copied: "คัดลอกไปยังคลิปบอร์ดแล้ว",
      required: "จำเป็น",
      optional: "ไม่จำเป็น",
      noData: "ไม่มีข้อมูล",
      loadingMore: "กำลังโหลดเพิ่มเติม...",
      tryAgain: "ลองใหม่",
      goBack: "กลับไป",
      function: "ฟังชั่น",
      credits: "เครดิต",
      openPlayground: "เปิด Playground →",
      running: "กำลังรัน...",
      backToDashboard: "กลับไปแดชบอร์ด",
      run: "รัน",
      result: "ผลลัพธ์",
      downloadHtml: "ดาวน์โหลด HTML",
      remove: "ลบ",
      prompt: "คำสั่ง",
      text: "ข้อความ",
      targetLanguage: "ภาษาที่ต้องการ",
      tone: "บทความ",
      extractionSchema: "โครงร่างการสกัด",
      image: "ภาพ",
      mask: "มาสก์",
      audio: "เสียง",
      websiteName: "ชื่อเว็บไซด์",
      websiteType: "ประเภทเว็บไซด์",
      templateStyle: "รูปแบบเทมเพลต",
      description: "คำอธิบาย",
      customPromptOptional: "คำสั่งแบบกำหนดเอง (ไม่จำเป็น)",
      referenceImageOptional: "ภาพอ้างอิง (ไม่จำเป็น)",
      send: "ส่ง",
      free: "ฟรี",
      addFiles: "เพิ่มไฟล์",
    },

    // Dashboard
    dashboard: {
      title: "ยินดีต้อนรับสู่ Workspace",
      subtitle: "จัดการทักษะ AI และการใช้งาน",
      welcome: "ยินดีต้อนรับสู่ Workspace",
      currentPlan: "แผนปัจจุบัน",
      availableCredits: "เครดิตที่มีอยู่",
      activeSkills: "ทักษะที่ใช้งาน",
      openPlayground: "เปิด Playground →",
      usageHistory: "ประวัติการใช้งาน",
      latestApiCalls: "เรียกใช้ API ล่าสุดจากคีย์ที่ใช้งานอยู่",
      noUsageRecorded: "ยังไม่มีการบันทึกการใช้งาน",
      noUsageYet: "ยังไม่มีการบันทึกการใช้งาน",
      skill: "ทักษะ",
      skillColumn: "ทักษะ",
      provider: "ผู้ให้บริการ",
      providerColumn: "ผู้ให้บริการ",
      latency: "ความหน่วง",
      latencyColumn: "ความหน่วง",
      status: "สถานะ",
      statusColumn: "สถานะ",
      time: "เวลา",
      timeColumn: "เวลา",
      freeTier: "ฟรี",
      payAsYouGo: "Pay-As-You-Go",
      totalCredits: "เครดิตทั้งหมด",
      freeCredits: "เครดิตฟรี",
      paidCredits: "เครดิตที่ชำระแล้ว",
    },

    // Playground
    playground: {
      title: "พื้นที่จำลอง AI",
      subtitle: "ใช้ทักษะ Rnai จากบัญชีของคุณ และแชทกับ Gemini ได้ฟรี",
      selectFunction: "เลือกฟังชั่น",

      // Skills
      imageGenerate: "สร้างภาพ",
      imageEdit: "แก้ไขภาพ",
      removeBackground: "ลบพื้นหลัง",
      imageRemoveBackground: "ลบพื้นหลัง",
      imageUpscale: "ขยายภาพ",
      imageStylize: "ให้ศิลปะแก่ภาพ",
      textGenerate: "สร้างข้อความ",
      textSummarize: "สรุปข้อความ",
      textTranslate: "แปลข้อความ",
      textRewrite: "เขียนข้อความใหม่",
      textExtract: "สกัดข้อมูล",
      audioTts: "ข้อความเป็นเสียง",
      audioStt: "เสียงเป็นข้อความ",
      websiteGenerate: "สร้างเว็บไซด์",

      // Inputs
      promptPlaceholder: "บอกสิ่งที่คุณต้องการ...",
      textPlaceholder: "วางหรือเขียนข้อความที่นี่...",
      websiteNamePlaceholder: "เช่น ร้านกาแฟ AromaBean",
      descriptionPlaceholder: "อธิบายรายละเอียดของเวบไซด์ที่ต้องการ...",
      customPromptPlaceholder: "ป้อนคำสั่ง custom เพิ่มเติมเพื่อปรับแต่งการสร้างเว็บไซด์ (จะผสมกับ Description)...",

      // UI Elements
      popularTemplates: "เทมเพลตยอดนิยม",
      clickToFill: "คลิกเพื่อเติม prompt",
      promptAttachments: "ไฟล์ที่แนบมากับ Prompt",
      attachmentsHelp: "ไฟล์ข้อความจะถูกเพิ่มลงใน prompt ไฟล์ภาพและไฟล์ไบนารีอื่นๆ จะเป็นข้อมูลเมตาเท่านั้น",
      textIncluded: "รวมข้อความ",
      metadataOnly: "เพียงข้อมูลเมตา",

      // Website specific
      websiteTypeEcommerce: "อีคอมเมิร์ซ",
      websiteTypeBlog: "บล็อก",
      websiteTypePortfolio: "พอร์ตโฟลิโอ",
      websiteTypeService: "บริการ",
      websiteTypeRestaurant: "ร้านอาหาร",
      websiteTypeSaas: "SaaS",

      // Templates
      templateModern: "สมัยใหม่",
      templateMinimal: "น้อยนิยม",
      templateBold: "ตัวหนา",
      templateElegant: "สง่างาม",

      // Image usage
      howToUseImage: "วิธีใช้ภาพนี้:",
      imageUsageDesignRef: "ออกแบบ",
      imageUsageBackground: "พื้นหลัง",
      imageUsageLogo: "โลโก้",

      // Results
      htmlPreview: "ตัวอย่าง HTML (ตัวอักษร 1000 ตัวแรก):",

      // Gemini Chat
      geminiChat: "แชท Gemini",
      freeChatSubtitle: "แชทฟรีสำหรับผู้ใช้ที่เข้าสู่ระบบแล้ว",
      geminiThinking: "เจมิน กำลังคิด...",
      askGemini: "ถามเจมิน...",

      // Errors
      unauthorized: "ไม่ได้รับอนุญาต",
      rateLimitExceeded: "เกินขีด จำกัดอัตรา",
      insufficientCredits: "เครดิตไม่เพียงพอ",
      requestFailed: "คำขอล้มเหลว",
    },

    // Profile/Settings
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
      english: "🇬🇧 English",
      thai: "🇹🇭 ไทย",
      saved: "บันทึกภาษาสำเร็จ",
      languageSaved: "บันทึกภาษาแล้ว",

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
      profileUpdated: "อัปเดตโปรไฟล์สำเร็จ",
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
      revoke: "เพิกถอน",
      goToApiKeys: "ไปยัง API Keys",

      // Billing
      billingInfo: "ข้อมูลการเรียกเก็บเงิน",
      currentPlanLabel: "แผนปัจจุบัน",
      freeTier: "ฟรี",
      payAsYouGo: "Pay-As-You-Go",
      totalCredits: "เครดิตทั้งหมด",
      freeCreditsLabel: "เครดิตฟรี",
      paidCreditsLabel: "เครดิตที่ชำระแล้ว",
      usageThisMonth: "การใช้งานเดือนนี้",
      addPaymentMethod: "เพิ่มวิธีการชำระเงิน",
      goToBilling: "ไปยังการเรียกเก็บเงิน",
    },

    // Billing / Payments
    billing: {
      title: "การเรียกเก็บเงิน & เครดิต",
      subtitle: "จัดการเครดิตและวิธีการชำระเงินของคุณ",
      totalAvailableCredits: "เครดิตที่มีอยู่ทั้งหมด",
      readyToUse: "พร้อมใช้งาน",
      freeQuota: "เครดิตฟรี",
      paidBalance: "ยอดเครดิตที่ชำระแล้ว",
      topupPacks: "เติมเครดิต",
      noExpiry: "ไม่มีการหมดอายุ",
      mostPopular: "ได้รับความนิยมมากที่สุด",
      aiCredits: "เครดิต AI",
      buyNow: "ซื้อเลย",
      paymentSuccess: "🎉 ชำระเงินสำเร็จ! เครดิตเพิ่มเข้าบัญชีของคุณแล้ว",
      paymentCancelled: "❌ ยกเลิกการชำระเงิน ไม่มีการเรียกเก็บเงิน",
    },

    // Auth Pages
    auth: {
      login: "เข้าสู่ระบบ",
      signup: "ลงทะเบียน",
      email: "อีเมล",
      password: "รหัสผ่าน",
      confirmPassword: "ยืนยันรหัสผ่าน",
      rememberMe: "จำฉันไว้",
      forgotPassword: "ลืมรหัสผ่าน?",
      signIn: "เข้าสู่ระบบ",
      signUp: "ลงทะเบียน",
      loginWithGoogle: "เข้าสู่ระบบด้วย Google",
      orContinueWith: "หรือดำเนินการต่อด้วย",
      alreadyHaveAccount: "มีบัญชีอยู่แล้ว?",
      noAccount: "ยังไม่มีบัญชี?",
      createAccount: "สร้างบัญชี",
      agreeToTerms: "ฉันยอมรับข้อกำหนดการใช้บริการและนโยบายความเป็นส่วนตัว",
      invalidEmail: "ที่อยู่อีเมลไม่ถูกต้อง",
      passwordTooShort: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
      passwordMismatch: "รหัสผ่านไม่ตรงกัน",
      loginError: "การเข้าสู่ระบบล้มเหลว โปรดตรวจสอบข้อมูลประจำตัวของคุณ",
      signupError: "การลงทะเบียนล้มเหลว โปรดลองอีกครั้ง",
      logoutSuccess: "ออกจากระบบสำเร็จ",
    },

    // Website Generation specific
    website: {
      name: "ชื่อเว็บไซด์",
      type: "ประเภทเว็บไซด์",
      template: "รูปแบบเทมเพลต",
      description: "คำอธิบาย",
      customPrompt: "คำสั่งแบบกำหนดเอง (ไม่จำเป็น)",
      referenceImage: "ภาพอ้างอิง (ไม่จำเป็น)",
      designReferenceDesc: "ใช้เป็นแรงบันดาลใจในการออกแบบ (สี เค้าโครง สไตล์ ไทโปกราฟฟี)",
      backgroundDesc: "ใช้เป็นภาพพื้นหลังของหัวข้อ",
      logoDesc: "ใช้เป็นโลโก้หรือภาพแบรนด์ในส่วนหัว",
      generate: "สร้างเว็บไซด์",
      generating: "กำลังสร้าง...",
      generationFailed: "การสร้างเว็บไซด์ล้มเหลว",
      previewHtml: "ตัวอย่าง HTML",
    },

    // Status messages
    status: {
      success: "สำเร็จ",
      success_message: "ดำเนินการสำเร็จ",
      error: "เกิดข้อผิดพลาด",
      error_message: "มีบางอย่างผิดพลาด โปรดลองอีกครั้ง",
      warning: "คำเตือน",
      info: "ข้อมูล",
      loading: "กำลังโหลด",
      cached: "แคชไว้",
    },

    // Landing page / Home
    home: {
      title: "Rnai — ประตูทางเข้า AI ชั้นยอด",
      subtitle: "สร้าง แก้ไข แปล และสกัด โดยใช้ AI โมเดลดีที่สุดในโลก",
      cta: "เริ่มต้นใช้งาน",
      loginLink: "เข้าสู่ระบบ",
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
