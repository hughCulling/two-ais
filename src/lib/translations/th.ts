// src/lib/translations/th.ts
export const th = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'การตั้งค่า',
        signIn: 'ลงชื่อเข้าใช้',
        signOut: 'ออกจากระบบ',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'ภาษาอาหรับ',
        bn: 'ภาษาเบงกาลี',
        bg: 'ภาษาบัลแกเรีย',
        zh: 'ภาษาจีน',
        hr: 'ภาษาโครเอเชีย',
        cs: 'ภาษาเช็ก',
        da: 'ภาษาเดนมาร์ก',
        nl: 'ภาษาดัตช์',
        en: 'ภาษาอังกฤษ',
        et: 'ภาษาเอสโตเนีย',
        fi: 'ภาษาฟินแลนด์',
        fr: 'ภาษาฝรั่งเศส',
        de: 'ภาษาเยอรมัน',
        el: 'ภาษากรีก',
        iw: 'ภาษาฮีบรู',
        hi: 'ภาษาฮินดี',
        hu: 'ภาษาฮังการี',
        id: 'ภาษาอินโดนีเซีย',
        it: 'ภาษาอิตาลี',
        ja: 'ภาษาญี่ปุ่น',
        ko: 'ภาษาเกาหลี',
        lv: 'ภาษาลัตเวีย',
        lt: 'ภาษาลิทัวเนีย',
        no: 'ภาษานอร์เวย์',
        pl: 'ภาษาโปแลนด์',
        pt: 'ภาษาโปรตุเกส',
        ro: 'ภาษาโรมาเนีย',
        ru: 'ภาษารัสเซีย',
        sr: 'ภาษาเซอร์เบีย',
        sk: 'ภาษาสโลวัก',
        sl: 'ภาษาสโลวีเนีย',
        es: 'ภาษาสเปน',
        sw: 'ภาษาสวาฮิลี',
        sv: 'ภาษาสวีเดน',
        th: 'ภาษาไทย',
        tr: 'ภาษาตุรกี',
        uk: 'ภาษายูเครน',
        vi: 'ภาษาเวียดนาม',
    },

    // Settings page
    settings: {
        title: 'การตั้งค่า',
        sections: {
            appearance: 'ลักษณะที่ปรากฏ',
            apiKeys: 'คีย์ API',
            language: 'ภาษา',
        },
        appearance: {
            theme: 'ธีม',
            light: 'สว่าง',
            dark: 'มืด',
            system: 'ระบบ',
        },
        language: {
            title: 'ภาษา',
            description: 'เลือกภาษาที่คุณต้องการสำหรับอินเทอร์เฟซ',
            conversationLanguage: 'ภาษาการสนทนา',
            conversationLanguageDescription: 'ภาษาที่ใช้สำหรับการสนทนา AI จะตรงกับภาษาอินเทอร์เฟซของคุณ',
        },
        apiKeys: {
            title: 'คีย์ API',
            description: 'จัดการคีย์ API ของคุณสำหรับผู้ให้บริการ AI ต่างๆ',
            saved: 'บันทึกแล้ว',
            notSet: 'ไม่ได้ตั้งค่า',
            setKey: 'ตั้งค่าคีย์',
            updateKey: 'อัปเดตคีย์',
            removeKey: 'ลบคีย์',
            getKeyInstructions: 'รับคีย์ API ของคุณ',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "No new API keys entered to save.",
            unexpectedResponse: "Received an unexpected response from the server.",
            failedToSaveKey: "Failed to save {serviceName} key.", 
            someKeysNotSaved: "Some API keys could not be saved. Please check the details below.",
            keyStatus: "key status...", 
            apiKeySecurelySaved: "API Key Securely Saved", 
            confirmRemoveTitle: "Confirm Removal",
            confirmRemoveDescription: "Are you sure you want to remove the API key for {serviceName}? This action cannot be undone.", 
            failedToRemoveKey: "Failed to remove {serviceName} key.",
            successfullyRemovedKey: "Successfully removed {serviceName} key.",
            keyNotSet: "Key Status: Not Set",
            keySet: "Key Status: Set",
            saveButton: "Save API Key(s)"
        },
    },

    // Main page
    main: {
        title: 'การสนทนา AI',
        setupForm: {
            title: 'ตั้งค่าการสนทนาของคุณ',
            agentA: 'ตัวแทน A',
            agentB: 'ตัวแทน B',
            model: 'โมเดล',
            selectModel: 'เลือกโมเดล',
            tts: {
                title: 'ข้อความเป็นคำพูด',
                enable: 'เปิดใช้งานข้อความเป็นคำพูด',
                provider: 'ผู้ให้บริการ TTS',
                selectProvider: 'เลือกผู้ให้บริการ TTS',
                voice: 'เสียง',
                selectVoice: 'เลือกเสียง',
                model: 'โมเดล TTS',
                selectModel: 'เลือกโมเดล TTS',
            },
            startConversation: 'เริ่มการสนทนา',
            conversationPrompt: 'เริ่มการสนทนา',
        },
        conversation: {
            thinking: 'กำลังคิด...',
            stop: 'หยุด',
            restart: 'เริ่มการสนทนาใหม่',
        },
        pricing: {
            estimatedCost: 'ค่าใช้จ่ายโดยประมาณ',
            perMillionTokens: 'ต่อล้านโทเค็น',
            input: 'อินพุต',
            output: 'เอาต์พุต',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'ลงชื่อเข้าใช้ Two AIs', // Keep brand name
            emailPlaceholder: 'อีเมล',
            passwordPlaceholder: 'รหัสผ่าน',
            signIn: 'ลงชื่อเข้าใช้',
            signInWithGoogle: 'ลงชื่อเข้าใช้ด้วย Google',
            noAccount: "ยังไม่มีบัญชีใช่ไหม",
            signUp: 'ลงทะเบียน',
            forgotPassword: 'ลืมรหัสผ่าน?',
            signingIn: "กำลังลงชื่อเข้าใช้..."
        },
        signup: {
            title: 'สร้างบัญชี',
            emailPlaceholder: 'อีเมล',
            passwordPlaceholder: 'รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)',
            signUp: 'ลงทะเบียน',
            signUpWithGoogle: 'ลงทะเบียนด้วย Google',
            hasAccount: 'มีบัญชีอยู่แล้วใช่ไหม',
            signIn: 'ลงชื่อเข้าใช้',
            emailLabel: "ที่อยู่อีเมล",
            confirmPasswordPlaceholder: "ยืนยันรหัสผ่าน",
            signingUp: "กำลังลงทะเบียน..."
        },
        errors: {
            invalidCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            userNotFound: 'ไม่พบผู้ใช้',
            weakPassword: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
            emailInUse: 'อีเมลนี้ถูกใช้แล้ว',
            generic: 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง',
            initialization: "การเริ่มต้นล้มเหลว โปรดลองอีกครั้งในภายหลัง",
            invalidEmail: "โปรดป้อนที่อยู่อีเมลที่ถูกต้อง",
            tooManyRequests: "การเข้าถึงถูกระงับชั่วคราวเนื่องจากพยายามลงชื่อเข้าใช้ล้มเหลวหลายครั้งเกินไป โปรดรีเซ็ตรหัสผ่านของคุณหรือลองอีกครั้งในภายหลัง",
            signInFailedPrefix: "การลงชื่อเข้าใช้ล้มเหลว: ",
            unknownSignInError: "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการลงชื่อเข้าใช้",
            profileSaveFailedPrefix: "การลงชื่อเข้าใช้สำเร็จ แต่การบันทึกข้อมูลโปรไฟล์ล้มเหลว: ",
            profileCheckSaveFailedPrefix: "การลงชื่อเข้าใช้สำเร็จ แต่การตรวจสอบ/บันทึกข้อมูลโปรไฟล์ล้มเหลว: ",
            accountExistsWithDifferentCredential: "บัญชีที่มีอีเมลนี้มีอยู่แล้วด้วยวิธีการลงชื่อเข้าใช้ที่แตกต่างกัน",
            googleSignInFailedPrefix: "การลงชื่อเข้าใช้ด้วย Google ล้มเหลว: ",
            unknownGoogleSignInError: "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการลงชื่อเข้าใช้ด้วย Google",
            passwordsDoNotMatch: "รหัสผ่านไม่ตรงกัน",
            accountCreatedProfileSaveFailedPrefix: "สร้างบัญชีแล้ว แต่การบันทึกข้อมูลโปรไฟล์ล้มเหลว: ",
            unknownProfileSaveError: "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการบันทึกโปรไฟล์",
            emailAlreadyRegistered: "ที่อยู่อีเมลนี้ได้รับการลงทะเบียนแล้ว",
            passwordTooShortSignUp: "รหัสผ่านต้องมีอักขระอย่างน้อย 6 ตัว",
            signUpFailedPrefix: "การลงทะเบียนล้มเหลว: ",
            unknownSignUpError: "เกิดข้อผิดพลาดที่ไม่รู้จักระหว่างการลงทะเบียน"
        },
    },

    // Common
    common: {
        loading: 'กำลังโหลด...',
        error: 'ข้อผิดพลาด',
        save: 'บันทึก',
        cancel: 'ยกเลิก',
        delete: 'ลบ',
        confirm: 'ยืนยัน',
        or: 'หรือ',
        MoreInformation: "ข้อมูลเพิ่มเติม",
        Example: "ตัวอย่าง:",
        ShowMore: "แสดงเพิ่มเติม",
        ShowLess: "แสดงน้อยลง",
        AwaitingApproval: "รอการอนุมัติ...",
        OpenInNewTab: "เปิดในแท็บใหม่",
        AdvancedSettings: "การตั้งค่าขั้นสูง",
        Name: "ชื่อ",
        Created: "สร้างเมื่อ",
        Updated: "อัปเดตเมื่อ",
        Launched: "เปิดตัวเมื่อ",
        Docs: "เอกสาร",
        Blog: "บล็อก",
        Pricing: "ราคา",
        Terms: "ข้อกำหนด",
        Privacy: "ความเป็นส่วนตัว",
        Changelog: "บันทึกการเปลี่ยนแปลง",
        Copy: "คัดลอก",
        Copied: "คัดลอกแล้ว",
        TryAgain: "ลองอีกครั้ง"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "ไม่พบ API Key",
    apiKeyMissingSubtext: "API key สำหรับผู้ให้บริการนี้หายไปหรือไม่ถูกต้อง โปรดเพิ่มในหน้าการตั้งค่า",
    apiKeyNotNeeded: "ไม่จำเป็นต้องใช้ API Key",
    apiKeyNotNeededSubtext: "ผู้ให้บริการนี้ไม่ต้องการ API key สำหรับระดับการใช้งานฟรีหรือบางรุ่น",
    apiKeyFound: "ตั้งค่า API Key แล้ว",
    apiKeyFoundSubtext: "มีการกำหนดค่า API key สำหรับผู้ให้บริการนี้แล้ว",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "รุ่นเรือธงสำหรับแชท",
    modelCategory_Reasoning: "รุ่นสำหรับการให้เหตุผล",
    modelCategory_CostOptimized: "รุ่นที่คุ้มค่า",
    modelCategory_OlderGPT: "รุ่น GPT ที่เก่ากว่า",
    modelCategory_Gemini2_5: "Gemini 2.5 Series",
    modelCategory_Gemini2_0: "Gemini 2.0 Series",
    modelCategory_Gemini1_5: "Gemini 1.5 Series",
    modelCategory_Claude3_7: "Claude 3.7 Series",
    modelCategory_Claude3_5: "Claude 3.5 Series",
    modelCategory_Claude3: "Claude 3 Series",
    modelCategory_Grok3: "Grok 3 Series",
    modelCategory_Grok3Mini: "Grok 3 Mini Series",
    modelCategory_Llama4: "Llama 4 Series",
    modelCategory_Llama3_3: "Llama 3.3 Series",
    modelCategory_Llama3_2: "Llama 3.2 Series",
    modelCategory_Llama3_1: "Llama 3.1 Series",
    modelCategory_Llama3: "Llama 3 Series",
    modelCategory_LlamaVision: "Llama Vision Models",
    modelCategory_MetaLlama: "Meta Llama Models",
    modelCategory_Gemma2: "Gemma 2 Series",
    modelCategory_Gemma: "Gemma Series",
    modelCategory_GoogleGemma: "Google Gemma Models",
    modelCategory_DeepSeekR1: "DeepSeek R1 Series",
    modelCategory_DeepSeekV3: "DeepSeek V3 Series",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill Series",
    modelCategory_DeepSeekModels: "DeepSeek Models",
    modelCategory_MistralAIModels: "Mistral AI Models",
    modelCategory_Qwen3: "Qwen3 Series",
    modelCategory_QwQwQ: "Qwen QwQ Series",
    modelCategory_Qwen2_5: "Qwen2.5 Series",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision Series",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder Series",
    modelCategory_Qwen2: "Qwen2 Series",
    modelCategory_Qwen2Vision: "Qwen2 Vision Series",
    modelCategory_QwenModels: "Qwen Models",
    modelCategory_OtherModels: "รุ่นอื่นๆ",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "ไม่สามารถโหลดข้อมูลผู้ใช้: {errorMessage} โปรดลองรีเฟรช",
    page_ErrorUserNotFound: "ไม่พบผู้ใช้ โปรดลงชื่อเข้าใช้อีกครั้ง",
    page_ErrorUserApiKeyConfig: "ไม่สามารถโหลดการกำหนดค่า API key ของผู้ใช้ โปรดรีเฟรชหรือตรวจสอบการตั้งค่า",
    page_ErrorStartingSessionAPI: "ข้อผิดพลาด API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "ข้อผิดพลาดในการเริ่มเซสชัน: {errorMessage}",
    page_ErrorSessionIdMissing: "การตอบกลับ API สำเร็จแต่ไม่รวม ID การสนทนา",
    page_LoadingUserData: "กำลังโหลดข้อมูลผู้ใช้...",
    page_ErrorAlertTitle: "ข้อผิดพลาด",
    page_WelcomeTitle: "ยินดีต้อนรับสู่ Two AIs",
    page_WelcomeSubtitle: "เว็บไซต์นี้ให้คุณฟังการสนทนาระหว่าง LLM สองตัว",
    page_ApiKeysRequiredTitle: "จำเป็นต้องใช้ API Keys",
    page_ApiKeysRequiredDescription: "ในการเรียกใช้การสนทนา คุณจะต้องให้ API keys ของคุณเองสำหรับโมเดล AI ที่คุณต้องการใช้ (เช่น OpenAI, Google, Anthropic) หลังจากลงชื่อเข้าใช้แล้ว สามารถดูคำแนะนำโดยละเอียดสำหรับผู้ให้บริการแต่ละรายได้ที่หน้าการตั้งค่า / API Keys หลังจากลงชื่อเข้าใช้",
    page_SignInPrompt: "ในการเริ่มเซสชันของคุณเอง คุณสามารถลงชื่อเข้าใช้หรือสร้างบัญชีโดยใช้ลิงก์ในส่วนหัว",
    page_VideoTitle: "การสาธิตการสนทนาของ Two AIs",
    page_AvailableLLMsTitle: "LLM ที่มีให้บริการในปัจจุบัน",
    page_TooltipGoogleThinkingBudget: "โมเดล Google นี้ใช้ 'งบประมาณการคิด' ผลลัพธ์ของ 'การคิด' จะถูกเรียกเก็บเงินแต่จะไม่ปรากฏในแชท",
    page_TooltipAnthropicExtendedThinking: "โมเดล Anthropic นี้ใช้ 'การคิดแบบขยาย' ผลลัพธ์ของ 'การคิด' จะถูกเรียกเก็บเงินแต่จะไม่ปรากฏในแชท",
    page_TooltipXaiThinking: "โมเดล xAI นี้ใช้ 'การคิด' ผลลัพธ์นี้จะถูกเรียกเก็บเงินแต่จะไม่ปรากฏในแชท",
    page_TooltipQwenReasoning: "โมเดล Qwen นี้ใช้ 'การให้เหตุผล/การคิด' ผลลัพธ์นี้จะถูกเรียกเก็บเงินแต่จะไม่ปรากฏในแชท",
    page_TooltipDeepSeekReasoning: "โมเดล DeepSeek นี้ใช้ 'การให้เหตุผล/การคิด' ผลลัพธ์จะถูกเรียกเก็บเงินแต่จะไม่ปรากฏในแชท",
    page_TooltipGenericReasoning: "โมเดลนี้ใช้โทเค็นการให้เหตุผลซึ่งไม่ปรากฏในแชทแต่จะถูกเรียกเก็บเงินเป็นโทเค็นผลลัพธ์",
    page_TooltipRequiresVerification: "ต้องใช้การยืนยันองค์กร OpenAI คุณสามารถยืนยันได้ที่นี่",
    page_TooltipSupportsLanguage: "รองรับ {languageName}",
    page_TooltipMayNotSupportLanguage: "อาจไม่รองรับ {languageName}",
    page_BadgePreview: "ตัวอย่าง",
    page_BadgeExperimental: "ทดลอง",
    page_BadgeBeta: "เบต้า",
    page_AvailableTTSTitle: "TTS ที่มีให้บริการในปัจจุบัน",
    page_NoTTSOptions: "ขณะนี้ยังไม่มีตัวเลือก TTS",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "ป้อน API Key ใหม่ {serviceName}",
    apiKeyManager_TestKey: "ทดสอบ Key",
    apiKeyManager_TestingKey: "กำลังทดสอบ Key...",
    apiKeyManager_KeyIsValid: "Key ถูกต้อง",
    apiKeyManager_KeyIsInvalid: "Key ไม่ถูกต้อง",
    apiKeyManager_FailedToTestKey: "การทดสอบ Key ล้มเหลว",
    apiKeyManager_ErrorTestingKey: "ข้อผิดพลาดในการทดสอบ Key: {error}",
    apiKeyManager_KeyProvider: "ผู้ให้บริการ",
    apiKeyManager_KeyName: "ชื่อ Key",
    apiKeyManager_Status: "สถานะ",
    apiKeyManager_Action: "การดำเนินการ",

    // Model capabilities
    modelCapability_Vision: "การมองเห็น",
    modelCapability_JSON: "โหมด JSON",
    modelCapability_Tools: "การใช้เครื่องมือ",
    modelCapability_ImageGen: "การสร้างภาพ",
    modelCapability_Multilingual: "หลายภาษา",
    modelCapability_WebSearch: "การค้นหาเว็บ",
    modelCapability_LargeContext: "บริบทขนาดใหญ่",
    modelCapability_LongContext: "บริบทแบบยาว",
    modelCapability_FastResponse: "การตอบสนองที่รวดเร็ว",
    modelCapability_CostEffective: "คุ้มค่า",
    modelCapability_AdvancedReasoning: "การให้เหตุผลขั้นสูง",
    modelCapability_Coding: "การเขียนโค้ด",
    modelCapability_Foundation: "โมเดลพื้นฐาน",
    modelCapability_Experimental: "ทดลอง",
    modelCapability_Beta: "เบต้า",
    modelCapability_Preview: "ตัวอย่าง",
    modelCapability_RequiresVerification: "ต้องมีการยืนยัน",
    modelCapability_RequiresAccount: "ต้องมีบัญชี",

    // TTS Voices (ElevenLabs specific)
    ttsVoice_Adam: "Adam", // Keep name
    ttsVoice_Antoni: "Antoni", // Keep name
    ttsVoice_Arnold: "Arnold", // Keep name
    ttsVoice_Bella: "Bella", // Keep name
    ttsVoice_Callum: "Callum", // Keep name
    ttsVoice_Charlie: "Charlie", // Keep name
    ttsVoice_Charlotte: "Charlotte", // Keep name
    ttsVoice_Clyde: "Clyde", // Keep name
    ttsVoice_Daniel: "Daniel", // Keep name
    ttsVoice_Dave: "Dave", // Keep name
    ttsVoice_Domi: "Domi", // Keep name
    ttsVoice_Dorothy: "Dorothy", // Keep name
    ttsVoice_Drew: "Drew", // Keep name
    ttsVoice_Elli: "Elli", // Keep name
    ttsVoice_Emily: "Emily", // Keep name
    ttsVoice_Ethan: "Ethan", // Keep name
    ttsVoice_Fin: "Fin", // Keep name
    ttsVoice_Freya: "Freya", // Keep name
    ttsVoice_Gigi: "Gigi", // Keep name
    ttsVoice_Giovanni: "Giovanni", // Keep name
    ttsVoice_Glinda: "Glinda", // Keep name
    ttsVoice_Grace: "Grace", // Keep name
    ttsVoice_Harry: "Harry", // Keep name
    ttsVoice_James: "James", // Keep name
    ttsVoice_Jeremy: "Jeremy", // Keep name
    ttsVoice_Jessie: "Jessie", // Keep name
    ttsVoice_Joseph: "Joseph", // Keep name
    ttsVoice_Josh: "Josh", // Keep name
    ttsVoice_Liam: "Liam", // Keep name
    ttsVoice_Lottie: "Lottie", // Keep name
    ttsVoice_Matilda: "Matilda", // Keep name
    ttsVoice_Matthew: "Matthew", // Keep name
    ttsVoice_Michael: "Michael", // Keep name
    ttsVoice_Mimi: "Mimi", // Keep name
    ttsVoice_Nicole: "Nicole", // Keep name
    ttsVoice_Olivia: "Olivia", // Keep name
    ttsVoice_Patrick: "Patrick", // Keep name
    ttsVoice_Paul: "Paul", // Keep name
    ttsVoice_Rachel: "Rachel", // Keep name
    ttsVoice_Ryan: "Ryan", // Keep name // DEFAULT VOICE
    ttsVoice_Sam: "Sam", // Keep name
    ttsVoice_Sarah: "Sarah", // Keep name
    ttsVoice_Serena: "Serena", // Keep name
    ttsVoice_Thomas: "Thomas", // Keep name
    ttsVoice_Rem: "Rem", // Keep name (Japanese)
    ttsVoice_Ren: "Ren", // Keep name (Japanese)
    ttsVoice_Santa: "Santa Claus", // Keep name
    ttsVoice_Alice: "Alice", // Keep name (French)
    ttsVoice_Marcus: "Marcus", // Keep name (German)
    ttsVoice_Aurora: "Aurora", // Keep name (Spanish)
    ttsVoice_Luna: "Luna", // Keep name (Portuguese)
    ttsVoice_Leo: "Leo", // Keep name (Italian)
    ttsVoice_Victoria: "Victoria", // Keep name (Polish)
    ttsVoice_Jasper: "Jasper", // Keep name (Dutch)
    ttsVoice_Felix: "Felix", // Keep name (Finnish)
    ttsVoice_Oscar: "Oscar", // Keep name (Swedish)
    ttsVoice_Maya: "Maya", // Keep name (Hindi)
    ttsVoice_Noah: "Noah", // Keep name (Korean)
    ttsVoice_Kenji: "Kenji", // Keep name (Japanese)
    ttsVoice_Isabelle: "Isabelle", // Keep name (Chinese)
    ttsVoice_Layla: "Layla", // Keep name (Arabic)
    ttsVoice_Zoe: "Zoe", // Keep name (Turkish)
    ttsVoice_Alex: "Alex", // Keep name (Russian)
    ttsVoice_George: "George", // Keep name (Greek)
    ttsVoice_Valentina: "Valentina", // Keep name (Romanian)
    ttsVoice_Sofia: "Sofia", // Keep name (Bulgarian)
    ttsVoice_Viktor: "Viktor", // Keep name (Ukrainian)
    ttsVoice_Milos: "Milos", // Keep name (Czech)
    ttsVoice_Matej: "Matej", // Keep name (Slovak)
    ttsVoice_Luka: "Luka", // Keep name (Croatian)
    ttsVoice_Andrej: "Andrej", // Keep name (Slovenian)
    ttsVoice_Ivan: "Ivan", // Keep name (Serbian)
    ttsVoice_Janos: "Janos", // Keep name (Hungarian)
    ttsVoice_Elias: "Elias", // Keep name (Norwegian)
    ttsVoice_Olivia_DA: "Olivia", // Keep name (Danish)
    ttsVoice_Anna: "Anna", // Keep name (Estonian)
    ttsVoice_Roberts: "Roberts", // Keep name (Latvian)
    ttsVoice_Ugne: "Ugne" // Keep name (Lithuanian)

    // --------------- END OF FILE ---------------
}; 