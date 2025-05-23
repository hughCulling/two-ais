// src/lib/translations/ar.ts
export const ar = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'الإعدادات',
        signIn: 'تسجيل الدخول',
        signOut: 'تسجيل الخروج',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'العربية',
        bn: 'البنغالية',
        bg: 'البلغارية',
        zh: 'الصينية',
        hr: 'الكرواتية',
        cs: 'التشيكية',
        da: 'الدنماركية',
        nl: 'الهولندية',
        en: 'الإنجليزية',
        et: 'الإستونية',
        fi: 'الفنلندية',
        fr: 'الفرنسية',
        de: 'الألمانية',
        el: 'اليونانية',
        iw: 'العبرية',
        hi: 'الهندية',
        hu: 'المجرية',
        id: 'الإندونيسية',
        it: 'الإيطالية',
        ja: 'اليابانية',
        ko: 'الكورية',
        lv: 'اللاتفية',
        lt: 'الليتوانية',
        no: 'النرويجية',
        pl: 'البولندية',
        pt: 'البرتغالية',
        ro: 'الرومانية',
        ru: 'الروسية',
        sr: 'الصربية',
        sk: 'السلوفاكية',
        sl: 'السلوفينية',
        es: 'الإسبانية',
        sw: 'السواحيلية',
        sv: 'السويدية',
        th: 'التايلاندية',
        tr: 'التركية',
        uk: 'الأوكرانية',
        vi: 'الفيتنامية',
    },

    // Settings page
    settings: {
        title: 'الإعدادات',
        sections: {
            appearance: 'المظهر',
            apiKeys: 'مفاتيح API',
            language: 'اللغة',
        },
        appearance: {
            theme: 'السمة',
            light: 'فاتح',
            dark: 'داكن',
            system: 'النظام',
        },
        language: {
            title: 'اللغة',
            description: 'اختر لغتك المفضلة للواجهة',
            conversationLanguage: 'لغة المحادثة',
            conversationLanguageDescription: 'ستتطابق اللغة المستخدمة في محادثات الذكاء الاصطناعي مع لغة واجهتك',
        },
        apiKeys: {
            title: 'مفاتيح API',
            description: 'إدارة مفاتيح API لمختلف مزودي الذكاء الاصطناعي',
            saved: 'محفوظ',
            notSet: 'غير محدد',
            setKey: 'تعيين المفتاح',
            updateKey: 'تحديث المفتاح',
            removeKey: 'إزالة المفتاح',
            getKeyInstructions: 'احصل على مفتاح API الخاص بك',
        },
    },

    // Main page
    main: {
        title: 'محادثة الذكاء الاصطناعي',
        setupForm: {
            title: 'قم بإعداد محادثتك',
            agentA: 'الوكيل أ',
            agentB: 'الوكيل ب',
            model: 'النموذج',
            selectModel: 'اختر نموذجًا',
            tts: {
                title: 'تحويل النص إلى كلام',
                enable: 'تفعيل تحويل النص إلى كلام',
                provider: 'مزود TTS',
                selectProvider: 'اختر مزود TTS',
                voice: 'الصوت',
                selectVoice: 'اختر الصوت',
                model: 'نموذج TTS',
                selectModel: 'اختر نموذج TTS',
            },
            startConversation: 'بدء المحادثة',
            conversationPrompt: 'ابدأ المحادثة.',
        },
        conversation: {
            thinking: 'يفكر...',
            stop: 'إيقاف',
            restart: 'إعادة بدء المحادثة',
        },
        pricing: {
            estimatedCost: 'التكلفة المقدرة',
            perMillionTokens: 'لكل مليون رمز',
            input: 'الإدخال',
            output: 'الإخراج',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'تسجيل الدخول إلى Two AIs',
            emailPlaceholder: 'البريد الإلكتروني',
            passwordPlaceholder: 'كلمة المرور',
            signIn: 'تسجيل الدخول',
            signInWithGoogle: 'تسجيل الدخول باستخدام Google',
            noAccount: 'ليس لديك حساب؟',
            signUp: 'إنشاء حساب',
            forgotPassword: 'نسيت كلمة المرور؟',
        },
        signup: {
            title: 'إنشاء حساب',
            emailPlaceholder: 'البريد الإلكتروني',
            passwordPlaceholder: 'كلمة المرور (6 أحرف على الأقل)',
            signUp: 'إنشاء حساب',
            signUpWithGoogle: 'إنشاء حساب باستخدام Google',
            hasAccount: 'لديك حساب بالفعل؟',
            signIn: 'تسجيل الدخول',
        },
        errors: {
            invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
            userNotFound: 'المستخدم غير موجود',
            weakPassword: 'يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل',
            emailInUse: 'البريد الإلكتروني مستخدم بالفعل',
            generic: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
        },
    },

    // Common
    common: {
        loading: 'جار التحميل...',
        error: 'خطأ',
        save: 'حفظ',
        cancel: 'إلغاء',
        delete: 'حذف',
        confirm: 'تأكيد',
        or: 'أو',
    },
}; 