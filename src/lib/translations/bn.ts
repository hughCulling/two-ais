// src/lib/translations/bn.ts
export const bn = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'সেটিংস',
        signIn: 'সাইন ইন করুন',
        signOut: 'সাইন আউট করুন',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'আরবি',
        bn: 'বাংলা',
        bg: 'বুলগেরীয়',
        zh: 'চীনা',
        hr: 'ক্রোয়েশীয়',
        cs: 'চেক',
        da: 'ডেনিশ',
        nl: 'ডাচ',
        en: 'ইংরেজি',
        et: 'এস্তোনীয়',
        fi: 'ফিনিশ',
        fr: 'ফরাসি',
        de: 'জার্মান',
        el: 'গ্রিক',
        iw: 'হিব্রু',
        hi: 'হিন্দি',
        hu: 'হাঙ্গেরীয়',
        id: 'ইন্দোনেশীয়',
        it: 'ইতালীয়',
        ja: 'জাপানি',
        ko: 'কোরিয়ান',
        lv: 'লাটভিয়ান',
        lt: 'লিথুয়ানিয়ান',
        no: 'নরওয়েজীয়',
        pl: 'পোলিশ',
        pt: 'পর্তুগিজ',
        ro: 'রোমানিয়ান',
        ru: 'রাশিয়ান',
        sr: 'সার্বিয়ান',
        sk: 'স্লোভাক',
        sl: 'স্লোভেনিয়ান',
        es: 'স্প্যানিশ',
        sw: 'সোয়াহিলি',
        sv: 'সুইডিশ',
        th: 'থাই',
        tr: 'তুর্কি',
        uk: 'ইউক্রেনীয়',
        vi: 'ভিয়েতনামী',
    },

    // Settings page
    settings: {
        title: 'সেটিংস',
        sections: {
            appearance: 'অ্যাপিয়ারেন্স',
            apiKeys: 'এপিআই কী',
            language: 'ভাষা',
        },
        appearance: {
            theme: 'থিম',
            light: 'হালকা',
            dark: 'অন্ধকার',
            system: 'সিস্টেম',
        },
        language: {
            title: 'ভাষা',
            description: 'ইন্টারফেসের জন্য আপনার পছন্দের ভাষা নির্বাচন করুন',
            conversationLanguage: 'কথোপকথনের ভাষা',
            conversationLanguageDescription: 'এআই কথোপকথনের জন্য ব্যবহৃত ভাষা আপনার ইন্টারফেস ভাষার সাথে মিলবে',
        },
        apiKeys: {
            title: 'এপিআই কী',
            description: 'বিভিন্ন এআই প্রদানকারীদের জন্য আপনার এপিআই কী পরিচালনা করুন',
            saved: 'সংরক্ষিত',
            notSet: 'সেট করা নেই',
            setKey: 'কী সেট করুন',
            updateKey: 'কী আপডেট করুন',
            removeKey: 'কী সরান',
            getKeyInstructions: 'আপনার এপিআই কী পান',
        },
    },

    // Main page
    main: {
        title: 'এআই কথোপকথন',
        setupForm: {
            title: 'আপনার কথোপকথন সেট আপ করুন',
            agentA: 'এজেন্ট এ',
            agentB: 'এজেন্ট বি',
            model: 'মডেল',
            selectModel: 'একটি মডেল নির্বাচন করুন',
            tts: {
                title: 'টেক্সট-টু-স্পিচ',
                enable: 'টেক্সট-টু-স্পিচ সক্ষম করুন',
                provider: 'টিটিএস প্রদানকারী',
                selectProvider: 'টিটিএস প্রদানকারী নির্বাচন করুন',
                voice: 'কণ্ঠস্বর',
                selectVoice: 'কণ্ঠস্বর নির্বাচন করুন',
                model: 'টিটিএস মডেল',
                selectModel: 'টিটিএস মডেল নির্বাচন করুন',
            },
            startConversation: 'কথোপকথন শুরু করুন',
            conversationPrompt: 'কথোপকথন শুরু করুন।',
        },
        conversation: {
            thinking: 'চিন্তা করছে...',
            stop: 'থামান',
            restart: 'কথোপকথন পুনরায় শুরু করুন',
        },
        pricing: {
            estimatedCost: 'আনুমানিক খরচ',
            perMillionTokens: 'প্রতি মিলিয়ন টোকেন',
            input: 'ইনপুট',
            output: 'আউটপুট',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Two AIs এ সাইন ইন করুন', // Keep brand name
            emailPlaceholder: 'ইমেইল',
            passwordPlaceholder: 'পাসওয়ার্ড',
            signIn: 'সাইন ইন করুন',
            signInWithGoogle: 'Google দিয়ে সাইন ইন করুন',
            noAccount: "কোনো অ্যাকাউন্ট নেই?",
            signUp: 'সাইন আপ করুন',
            forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
        },
        signup: {
            title: 'একটি অ্যাকাউন্ট তৈরি করুন',
            emailPlaceholder: 'ইমেইল',
            passwordPlaceholder: 'পাসওয়ার্ড (কমপক্ষে ৬টি অক্ষর)',
            signUp: 'সাইন আপ করুন',
            signUpWithGoogle: 'Google দিয়ে সাইন আপ করুন',
            hasAccount: 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?',
            signIn: 'সাইন ইন করুন',
        },
        errors: {
            invalidCredentials: 'অবৈধ ইমেইল বা পাসওয়ার্ড',
            userNotFound: 'ব্যবহারকারী পাওয়া যায়নি',
            weakPassword: 'পাসওয়ার্ড কমপক্ষে ৬টি অক্ষর হতে হবে',
            emailInUse: 'ইমেইল ইতিমধ্যে ব্যবহৃত হচ্ছে',
            generic: 'একটি ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
        },
    },

    // Common
    common: {
        loading: 'লোড হচ্ছে...',
        error: 'ত্রুটি',
        save: 'সংরক্ষণ করুন',
        cancel: 'বাতিল করুন',
        delete: 'মুছে ফেলুন',
        confirm: 'নিশ্চিত করুন',
        or: 'অথবা',
    },
}; 