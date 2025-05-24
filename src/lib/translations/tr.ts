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
            description: "Uygulamanın görünümünü ve verdiği hissi özelleştirin."
        },
        language: {
            title: 'Dil',
            description: 'Arayüz için tercih ettiğiniz dili seçin',
            conversationLanguage: 'Konuşma Dili',
            conversationLanguageDescription: 'Yapay zeka konuşmaları için kullanılan dil, arayüz dilinizle eşleşecektir',
        },
        apiKeys: {
            title: 'TRANSLATE: API Keys',
            description: 'TRANSLATE: Manage your API keys for different AI providers',
            saved: 'TRANSLATE: Saved',
            notSet: 'TRANSLATE: Not set',
            setKey: 'TRANSLATE: Set key',
            updateKey: 'TRANSLATE: Update key',
            removeKey: 'TRANSLATE: Remove key',
            getKeyInstructions: 'TRANSLATE: Get your API key',
            noNewKeys: "TRANSLATE: No new API keys entered to save.",
            unexpectedResponse: "TRANSLATE: Received an unexpected response from the server.",
            failedToSaveKey: "TRANSLATE: Failed to save {serviceName} key.",
            someKeysNotSaved: "TRANSLATE: Some API keys could not be saved. Please check the details below.",
            keyStatus: "TRANSLATE: key status...",
            apiKeySecurelySaved: "TRANSLATE: API Key Securely Saved",
            confirmRemoveTitle: "TRANSLATE: Confirm Removal",
            confirmRemoveDescription: "TRANSLATE: Are you sure you want to remove the API key for {serviceName}? This action cannot be undone.",
            failedToRemoveKey: "TRANSLATE: Failed to remove {serviceName} key.",
            successfullyRemovedKey: "TRANSLATE: Successfully removed {serviceName} key.",
            keyNotSet: "TRANSLATE: Key Status: Not Set",
            keySet: "TRANSLATE: Key Status: Set",
            saveButton: "TRANSLATE: Save API Key(s)"
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
            orContinueWith: "Veya şununla devam et",
            signingIn: "Giriş yapılıyor..."
        },
        signup: {
            title: 'Hesap Oluştur',
            emailPlaceholder: 'E-posta',
            passwordPlaceholder: 'Şifre (en az 6 karakter)',
            signUp: 'Kaydol',
            signUpWithGoogle: 'Google ile Kaydol',
            hasAccount: 'Zaten bir hesabınız var mı?',
            signIn: 'Giriş Yap',
            emailLabel: "E-posta Adresi",
            confirmPasswordPlaceholder: "Şifreyi Onayla",
            signingUp: "Kaydolunuyor..."
        },
        errors: {
            invalidCredentials: 'Geçersiz e-posta veya şifre',
            userNotFound: 'Kullanıcı bulunamadı',
            weakPassword: 'Şifre en az 6 karakter olmalıdır',
            emailInUse: 'E-posta zaten kullanılıyor',
            generic: 'Bir hata oluştu. Lütfen tekrar deneyin.',
            initialization: "Başlatma hatası. Lütfen daha sonra tekrar deneyin.",
            invalidEmail: "Lütfen geçerli bir e-posta adresi girin.",
            tooManyRequests: "Çok fazla başarısız giriş denemesi nedeniyle erişim geçici olarak engellendi. Lütfen şifrenizi sıfırlayın veya daha sonra tekrar deneyin.",
            signInFailedPrefix: "Giriş başarısız: ",
            unknownSignInError: "Giriş sırasında bilinmeyen bir hata oluştu.",
            profileSaveFailedPrefix: "Giriş başarılı ancak profil verileri kaydedilemedi: ",
            profileCheckSaveFailedPrefix: "Giriş başarılı ancak profil verileri kontrol edilemedi/kaydedilemedi: ",
            accountExistsWithDifferentCredential: "Bu e-postaya sahip bir hesap zaten farklı bir giriş yöntemiyle mevcut.",
            googleSignInFailedPrefix: "Google ile giriş başarısız: ",
            unknownGoogleSignInError: "Google ile giriş sırasında bilinmeyen bir hata oluştu.",
            passwordsDoNotMatch: "Şifreler eşleşmiyor.",
            accountCreatedProfileSaveFailedPrefix: "Hesap oluşturuldu ancak profil verileri kaydedilemedi: ",
            unknownProfileSaveError: "Profil kaydedilirken bilinmeyen bir hata oluştu.",
            emailAlreadyRegistered: "Bu e-posta adresi zaten kayıtlı.",
            passwordTooShortSignUp: "Şifre en az 6 karakter uzunluğunda olmalıdır.",
            signUpFailedPrefix: "Kayıt başarısız: ",
            unknownSignUpError: "Kayıt sırasında bilinmeyen bir hata oluştu."
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
        MoreInformation: "Daha Fazla Bilgi",
        Example: "Örnek:",
        ShowMore: "Daha Fazla Göster",
        ShowLess: "Daha Az Göster",
        AwaitingApproval: "Onay Bekleniyor...",
        OpenInNewTab: "Yeni Sekmede Aç",
        AdvancedSettings: "Gelişmiş Ayarlar",
        Name: "Ad",
        Created: "Oluşturuldu",
        Updated: "Güncellendi",
        Launched: "Başlatıldı",
        Docs: "Belgeler",
        Blog: "Blog",
        Pricing: "Fiyatlandırma",
        Terms: "Şartlar",
        Privacy: "Gizlilik",
        Changelog: "Değişiklik Günlüğü",
        Copy: "Kopyala",
        Copied: "Kopyalandı",
        TryAgain: "Tekrar Dene"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API Anahtarı Eksik",
    apiKeyMissingSubtext: "Bu sağlayıcı için API anahtarı eksik veya geçersiz. Lütfen ayarlara ekleyin.",
    apiKeyNotNeeded: "API Anahtarı Gerekli Değil",
    apiKeyNotNeededSubtext: "Bu sağlayıcı, ücretsiz katmanı veya belirli modelleri için bir API anahtarı gerektirmez.",
    apiKeyFound: "API Anahtarı Ayarlandı",
    apiKeyFoundSubtext: "Bu sağlayıcı için bir API anahtarı yapılandırıldı.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Amiral Gemisi Sohbet Modelleri",
    modelCategory_Reasoning: "Muhakeme Modelleri",
    modelCategory_CostOptimized: "Maliyet Optimize Edilmiş Modeller",
    modelCategory_OlderGPT: "Eski GPT Modelleri",
    modelCategory_Gemini2_5: "Gemini 2.5 Serisi",
    modelCategory_Gemini2_0: "Gemini 2.0 Serisi",
    modelCategory_Gemini1_5: "Gemini 1.5 Serisi",
    modelCategory_Claude3_7: "Claude 3.7 Serisi",
    modelCategory_Claude3_5: "Claude 3.5 Serisi",
    modelCategory_Claude3: "Claude 3 Serisi",
    modelCategory_Grok3: "Grok 3 Serisi",
    modelCategory_Grok3Mini: "Grok 3 Mini Serisi",
    modelCategory_Llama4: "Llama 4 Serisi",
    modelCategory_Llama3_3: "Llama 3.3 Serisi",
    modelCategory_Llama3_2: "Llama 3.2 Serisi",
    modelCategory_Llama3_1: "Llama 3.1 Serisi",
    modelCategory_Llama3: "Llama 3 Serisi",
    modelCategory_LlamaVision: "Llama Vision Modelleri",
    modelCategory_MetaLlama: "Meta Llama Modelleri",
    modelCategory_Gemma2: "Gemma 2 Serisi",
    modelCategory_Gemma: "Gemma Serisi",
    modelCategory_GoogleGemma: "Google Gemma Modelleri",
    modelCategory_DeepSeekR1: "DeepSeek R1 Serisi",
    modelCategory_DeepSeekV3: "DeepSeek V3 Serisi",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill Serisi",
    modelCategory_DeepSeekModels: "DeepSeek Modelleri",
    modelCategory_MistralAIModels: "Mistral AI Modelleri",
    modelCategory_Qwen3: "Qwen3 Serisi",
    modelCategory_QwQwQ: "Qwen QwQ Serisi",
    modelCategory_Qwen2_5: "Qwen2.5 Serisi",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision Serisi",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder Serisi",
    modelCategory_Qwen2: "Qwen2 Serisi",
    modelCategory_Qwen2Vision: "Qwen2 Vision Serisi",
    modelCategory_QwenModels: "Qwen Modelleri",
    modelCategory_OtherModels: "Diğer Modeller",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Kullanıcı verileri yüklenemedi: {errorMessage}. Lütfen yenilemeyi deneyin.",
    page_ErrorUserNotFound: "Kullanıcı bulunamadı. Lütfen tekrar giriş yapın.",
    page_ErrorUserApiKeyConfig: "Kullanıcı API anahtarı yapılandırması yüklenemedi. Lütfen yenileyin veya ayarları kontrol edin.",
    page_ErrorStartingSessionAPI: "API Hatası: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Oturum başlatılırken hata oluştu: {errorMessage}",
    page_ErrorSessionIdMissing: "API yanıtı başarılı ancak bir konuşma kimliği içermiyordu.",
    page_LoadingUserData: "Kullanıcı verileri yükleniyor...",
    page_ErrorAlertTitle: "Hata",
    page_WelcomeTitle: "Two AIs'ye Hoş Geldiniz",
    page_WelcomeSubtitle: "Bu web sitesi, iki LLM arasındaki konuşmaları dinlemenizi sağlar.",
    page_ApiKeysRequiredTitle: "API Anahtarları Gerekli",
    page_ApiKeysRequiredDescription: "Konuşmaları çalıştırmak için, oturum açtıktan sonra kullanmak istediğiniz AI modelleri (ör. OpenAI, Google, Anthropic) için kendi API anahtarlarınızı sağlamanız gerekir. Her sağlayıcı için ayrıntılı talimatlar, oturum açtıktan sonra Ayarlar / API Anahtarları sayfasında bulunabilir.",
    page_SignInPrompt: "Kendi oturumunuzu başlatmak için başlıktaki bağlantıyı kullanarak oturum açabilir veya bir hesap oluşturabilirsiniz.",
    page_VideoTitle: "Two AIs Konuşma Demosu",
    page_AvailableLLMsTitle: "Şu Anda Mevcut LLM'ler",
    page_TooltipGoogleThinkingBudget: "Bu Google modeli bir 'düşünme bütçesi' kullanır. 'Düşünme' çıktısı faturalandırılır ancak sohbette görünmez.",
    page_TooltipAnthropicExtendedThinking: "Bu Anthropic modeli 'genişletilmiş düşünme' kullanır. 'Düşünme' çıktısı faturalandırılır ancak sohbette görünmez.",
    page_TooltipXaiThinking: "Bu xAI modeli 'düşünme' kullanır. Bu çıktı faturalandırılır ancak sohbette görünmez.",
    page_TooltipQwenReasoning: "Bu Qwen modeli 'muhakeme/düşünme' kullanır. Bu çıktı faturalandırılır ancak sohbette görünmez.",
    page_TooltipDeepSeekReasoning: "Bu DeepSeek modeli 'muhakeme/düşünme' kullanır. Çıktı faturalandırılır ancak sohbette görünmez.",
    page_TooltipGenericReasoning: "Bu model, sohbette görünmeyen ancak çıktı jetonları olarak faturalandırılan muhakeme jetonlarını kullanır.",
    page_TooltipRequiresVerification: "Doğrulanmış OpenAI kuruluşu gerektirir. Buradan doğrulayabilirsiniz.",
    page_TooltipSupportsLanguage: "{languageName} dilini destekler",
    page_TooltipMayNotSupportLanguage: "{languageName} dilini desteklemeyebilir",
    page_BadgePreview: "Ön izleme",
    page_BadgeExperimental: "Deneysel",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Şu Anda Mevcut TTS",
    page_NoTTSOptions: "Şu anda TTS seçeneği mevcut değil.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Yeni API Anahtarı Girin {serviceName}",
    apiKeyManager_TestKey: "Anahtarı Test Et",
    apiKeyManager_TestingKey: "Anahtar Test Ediliyor...",
    apiKeyManager_KeyIsValid: "Anahtar Geçerli.",
    apiKeyManager_KeyIsInvalid: "Anahtar Geçersiz.",
    apiKeyManager_FailedToTestKey: "Anahtar Test Edilemedi.",
    apiKeyManager_ErrorTestingKey: "Anahtar Test Edilirken Hata: {error}",
    apiKeyManager_KeyProvider: "Sağlayıcı",
    apiKeyManager_KeyName: "Anahtar Adı",
    apiKeyManager_Status: "Durum",
    apiKeyManager_Action: "Eylem",

    // Model capabilities
    modelCapability_Vision: "Görüş",
    modelCapability_JSON: "JSON Modu",
    modelCapability_Tools: "Araç Kullanımı",
    modelCapability_ImageGen: "Görüntü Oluşturma",
    modelCapability_Multilingual: "Çok Dilli",
    modelCapability_WebSearch: "Web Araması",
    modelCapability_LargeContext: "Geniş Bağlam",
    modelCapability_LongContext: "Uzun Bağlam",
    modelCapability_FastResponse: "Hızlı Yanıt",
    modelCapability_CostEffective: "Uygun Maliyetli",
    modelCapability_AdvancedReasoning: "Gelişmiş Muhakeme",
    modelCapability_Coding: "Kodlama",
    modelCapability_Foundation: "Temel Model",
    modelCapability_Experimental: "Deneysel",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Ön izleme",
    modelCapability_RequiresVerification: "Doğrulama Gerektirir",
    modelCapability_RequiresAccount: "Hesap Gerektirir",

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