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
        },
        signup: {
            title: 'สร้างบัญชี',
            emailPlaceholder: 'อีเมล',
            passwordPlaceholder: 'รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)',
            signUp: 'ลงทะเบียน',
            signUpWithGoogle: 'ลงทะเบียนด้วย Google',
            hasAccount: 'มีบัญชีอยู่แล้วใช่ไหม',
            signIn: 'ลงชื่อเข้าใช้',
        },
        errors: {
            invalidCredentials: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
            userNotFound: 'ไม่พบผู้ใช้',
            weakPassword: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
            emailInUse: 'อีเมลนี้ถูกใช้แล้ว',
            generic: 'เกิดข้อผิดพลาด โปรดลองอีกครั้ง',
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
    },
}; 