// src/lib/translations/tr.ts
export const tr = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Ayarlar',
        signIn: 'Giriş Yap',
        signOut: 'Çıkış Yap',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arapça',
        bn: 'Bengalce',
        bg: 'Bulgarca',
        zh: 'Çince',
        hr: 'Hırvatça',
        cs: 'Çekçe',
        da: 'Danca',
        nl: 'Hollandaca',
        en: 'İngilizce',
        et: 'Estonca',
        fi: 'Fince',
        fr: 'Fransızca',
        de: 'Almanca',
        el: 'Yunanca',
        iw: 'İbranice',
        hi: 'Hintçe',
        hu: 'Macarca',
        id: 'Endonezce',
        it: 'İtalyanca',
        ja: 'Japonca',
        ko: 'Korece',
        lv: 'Letonca',
        lt: 'Litvanca',
        no: 'Norveççe',
        pl: 'Polonyaca',
        pt: 'Portekizce',
        ro: 'Rumence',
        ru: 'Rusça',
        sr: 'Sırpça',
        sk: 'Slovakça',
        sl: 'Slovence',
        es: 'İspanyolca',
        sw: 'Svahili',
        sv: 'İsveççe',
        th: 'Tayca',
        tr: 'Türkçe',
        uk: 'Ukraynaca',
        vi: 'Vietnamca',
    },

    // Settings page
    settings: {
        title: 'Ayarlar',
        sections: {
            appearance: 'Görünüm',
            apiKeys: 'API Anahtarları',
            language: 'Dil',
        },
        appearance: {
            theme: 'Tema',
            light: 'Açık',
            dark: 'Koyu',
            system: 'Sistem',
        },
        language: {
            title: 'Dil',
            description: 'Arayüz için tercih ettiğiniz dili seçin',
            conversationLanguage: 'Konuşma Dili',
            conversationLanguageDescription: 'Yapay zeka konuşmaları için kullanılan dil, arayüz dilinizle eşleşecektir',
        },
        apiKeys: {
            title: 'API Anahtarları',
            description: 'Farklı yapay zeka sağlayıcıları için API anahtarlarınızı yönetin',
            saved: 'Kaydedildi',
            notSet: 'Ayarlanmadı',
            setKey: 'Anahtarı Ayarla',
            updateKey: 'Anahtarı Güncelle',
            removeKey: 'Anahtarı Kaldır',
            getKeyInstructions: 'API anahtarınızı alın',
        },
    },

    // Main page
    main: {
        title: 'Yapay Zeka Sohbeti',
        setupForm: {
            title: 'Sohbetinizi ayarlayın',
            agentA: 'Ajan A',
            agentB: 'Ajan B',
            model: 'Model',
            selectModel: 'Bir model seçin',
            tts: {
                title: 'Metin Okuma',
                enable: 'Metin Okumayı Etkinleştir',
                provider: 'TTS Sağlayıcısı',
                selectProvider: 'TTS sağlayıcısını seçin',
                voice: 'Ses',
                selectVoice: 'Ses seçin',
                model: 'TTS Modeli',
                selectModel: 'TTS modelini seçin',
            },
            startConversation: 'Sohbeti Başlat',
            conversationPrompt: 'Sohbeti başlatın.',
        },
        conversation: {
            thinking: 'düşünüyor...',
            stop: 'Durdur',
            restart: 'Sohbeti Yeniden Başlat',
        },
        pricing: {
            estimatedCost: 'Tahmini Maliyet',
            perMillionTokens: 'milyon jeton başına',
            input: 'Giriş',
            output: 'Çıkış',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Two AIs uygulamasında oturum açın', // Keep brand name
            emailPlaceholder: 'E-posta',
            passwordPlaceholder: 'Şifre',
            signIn: 'Giriş Yap',
            signInWithGoogle: 'Google ile Giriş Yap',
            noAccount: "Hesabınız yok mu?",
            signUp: 'Kaydol',
            forgotPassword: 'Şifrenizi mi unuttunuz?',
        },
        signup: {
            title: 'Hesap Oluştur',
            emailPlaceholder: 'E-posta',
            passwordPlaceholder: 'Şifre (en az 6 karakter)',
            signUp: 'Kaydol',
            signUpWithGoogle: 'Google ile Kaydol',
            hasAccount: 'Zaten bir hesabınız var mı?',
            signIn: 'Giriş Yap',
        },
        errors: {
            invalidCredentials: 'Geçersiz e-posta veya şifre',
            userNotFound: 'Kullanıcı bulunamadı',
            weakPassword: 'Şifre en az 6 karakter olmalıdır',
            emailInUse: 'E-posta zaten kullanılıyor',
            generic: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        },
    },

    // Common
    common: {
        loading: 'Yükleniyor...',
        error: 'Hata',
        save: 'Kaydet',
        cancel: 'İptal',
        delete: 'Sil',
        confirm: 'Onayla',
        or: 'veya',
    },
}; 