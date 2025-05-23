// src/lib/translations/id.ts
export const id = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Pengaturan',
        signIn: 'Masuk',
        signOut: 'Keluar',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arab',
        bn: 'Bengali',
        bg: 'Bulgaria',
        zh: 'Mandarin',
        hr: 'Kroasia',
        cs: 'Ceko',
        da: 'Denmark',
        nl: 'Belanda',
        en: 'Inggris',
        et: 'Estonia',
        fi: 'Finlandia',
        fr: 'Prancis',
        de: 'Jerman',
        el: 'Yunani',
        iw: 'Ibrani',
        hi: 'Hindi',
        hu: 'Hungaria',
        id: 'Indonesia',
        it: 'Italia',
        ja: 'Jepang',
        ko: 'Korea',
        lv: 'Latvia',
        lt: 'Lithuania',
        no: 'Norwegia',
        pl: 'Polandia',
        pt: 'Portugis',
        ro: 'Rumania',
        ru: 'Rusia',
        sr: 'Serbia',
        sk: 'Slowakia',
        sl: 'Slovenia',
        es: 'Spanyol',
        sw: 'Swahili',
        sv: 'Swedia',
        th: 'Thai',
        tr: 'Turki',
        uk: 'Ukraina',
        vi: 'Vietnam',
    },

    // Settings page
    settings: {
        title: 'Pengaturan',
        sections: {
            appearance: 'Tampilan',
            apiKeys: 'Kunci API',
            language: 'Bahasa',
        },
        appearance: {
            theme: 'Tema',
            light: 'Terang',
            dark: 'Gelap',
            system: 'Sistem',
            description: "Sesuaikan tampilan dan nuansa aplikasi."
        },
        language: {
            title: 'Bahasa',
            description: 'Pilih bahasa pilihan Anda untuk antarmuka',
            conversationLanguage: 'Bahasa Percakapan',
            conversationLanguageDescription: 'Bahasa yang digunakan untuk percakapan AI akan cocok dengan bahasa antarmuka Anda',
            signingIn: "Masuk..."
        },
        apiKeys: {
            title: 'Kunci API',
            description: 'Kelola kunci API Anda untuk berbagai penyedia AI',
            saved: 'Disimpan',
            notSet: 'Belum diatur',
            setKey: 'Atur kunci',
            updateKey: 'Perbarui kunci',
            removeKey: 'Hapus kunci',
            getKeyInstructions: 'Dapatkan kunci API Anda',
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
        title: 'Percakapan AI',
        setupForm: {
            title: 'Siapkan percakapan Anda',
            agentA: 'Agen A',
            agentB: 'Agen B',
            model: 'Model',
            selectModel: 'Pilih model',
            tts: {
                title: 'Teks-ke-Ucapan',
                enable: 'Aktifkan Teks-ke-Ucapan',
                provider: 'Penyedia TTS',
                selectProvider: 'Pilih penyedia TTS',
                voice: 'Suara',
                selectVoice: 'Pilih suara',
                model: 'Model TTS',
                selectModel: 'Pilih model TTS',
            },
            startConversation: 'Mulai Percakapan',
            conversationPrompt: 'Mulai percakapan.',
        },
        conversation: {
            thinking: 'berpikir...',
            stop: 'Berhenti',
            restart: 'Mulai Ulang Percakapan',
        },
        pricing: {
            estimatedCost: 'Perkiraan biaya',
            perMillionTokens: 'per juta token',
            input: 'Masukan',
            output: 'Keluaran',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Masuk ke Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Kata Sandi',
            signIn: 'Masuk',
            signInWithGoogle: 'Masuk dengan Google',
            noAccount: "Belum punya akun?",
            signUp: 'Daftar',
            forgotPassword: 'Lupa kata sandi?',
        },
        signup: {
            title: 'Buat akun',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Kata Sandi (minimal 6 karakter)',
            signUp: 'Daftar',
            signUpWithGoogle: 'Daftar dengan Google',
            hasAccount: 'Sudah punya akun?',
            signIn: 'Masuk',
            emailLabel: "Alamat email",
            confirmPasswordPlaceholder: "Konfirmasi kata sandi",
            signingUp: "Mendaftar..."
        },
        errors: {
            invalidCredentials: 'Email atau kata sandi tidak valid',
            userNotFound: 'Pengguna tidak ditemukan',
            weakPassword: 'Kata sandi minimal 6 karakter',
            emailInUse: 'Email sudah digunakan',
            generic: 'Terjadi kesalahan. Silakan coba lagi.',
            initialization: "Kesalahan inisialisasi. Silakan coba lagi nanti.",
            invalidEmail: "Silakan masukkan alamat email yang valid.",
            tooManyRequests: "Akses dinonaktifkan sementara karena terlalu banyak upaya login yang gagal. Silakan setel ulang kata sandi Anda atau coba lagi nanti.",
            signInFailedPrefix: "Gagal masuk: ",
            unknownSignInError: "Terjadi kesalahan yang tidak diketahui saat masuk.",
            profileSaveFailedPrefix: "Berhasil masuk, tetapi gagal menyimpan data profil: ",
            profileCheckSaveFailedPrefix: "Berhasil masuk, tetapi gagal memeriksa/menyimpan data profil: ",
            accountExistsWithDifferentCredential: "Akun dengan email ini sudah ada menggunakan metode login yang berbeda.",
            googleSignInFailedPrefix: "Gagal masuk dengan Google: ",
            unknownGoogleSignInError: "Terjadi kesalahan yang tidak diketahui saat masuk dengan Google.",
            passwordsDoNotMatch: "Kata sandi tidak cocok.",
            accountCreatedProfileSaveFailedPrefix: "Akun berhasil dibuat, tetapi gagal menyimpan data profil: ",
            unknownProfileSaveError: "Terjadi kesalahan yang tidak diketahui saat menyimpan profil.",
            emailAlreadyRegistered: "Alamat email ini sudah terdaftar.",
            passwordTooShortSignUp: "Kata sandi minimal harus 6 karakter.",
            signUpFailedPrefix: "Gagal mendaftar: ",
            unknownSignUpError: "Terjadi kesalahan yang tidak diketahui saat mendaftar."
        },
    },

    // Common
    common: {
        loading: 'Memuat...',
        error: 'Kesalahan',
        save: 'Simpan',
        cancel: 'Batal',
        delete: 'Hapus',
        confirm: 'Konfirmasi',
        or: 'atau',
        MoreInformation: "Informasi lebih lanjut",
        Example: "Contoh:",
        ShowMore: "Tampilkan lebih banyak",
        ShowLess: "Tampilkan lebih sedikit",
        AwaitingApproval: "Menunggu persetujuan...",
        OpenInNewTab: "Buka di tab baru",
        AdvancedSettings: "Pengaturan lanjutan",
        Name: "Nama",
        Created: "Dibuat",
        Updated: "Diperbarui",
        Launched: "Diluncurkan",
        Docs: "Dokumentasi",
        Blog: "Blog",
        Pricing: "Harga",
        Terms: "Ketentuan",
        Privacy: "Privasi",
        Changelog: "Catatan perubahan",
        Copy: "Salin",
        Copied: "Disalin",
        TryAgain: "Coba lagi"
    },
    page_TruncatableNoteFormat: "({noteText})",

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Kunci API Hilang",
    apiKeyMissingSubtext: "Kunci API untuk penyedia ini hilang atau tidak valid. Harap tambahkan di pengaturan.",
    apiKeyNotNeeded: "Kunci API Tidak Diperlukan",
    apiKeyNotNeededSubtext: "Penyedia ini tidak memerlukan kunci API untuk tingkat gratis atau model tertentu.",
    apiKeyFound: "Kunci API Ditemukan",
    apiKeyFoundSubtext: "Kunci API telah dikonfigurasi untuk penyedia ini.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Model Obrolan Unggulan",
    modelCategory_Reasoning: "Model Penalaran",
    modelCategory_CostOptimized: "Model Hemat Biaya",
    modelCategory_OlderGPT: "Model GPT Lama",
    modelCategory_Gemini2_5: "Seri Gemini 2.5",
    modelCategory_Gemini2_0: "Seri Gemini 2.0",
    modelCategory_Gemini1_5: "Seri Gemini 1.5",
    modelCategory_Claude3_7: "Seri Claude 3.7",
    modelCategory_Claude3_5: "Seri Claude 3.5",
    modelCategory_Claude3: "Seri Claude 3",
    modelCategory_Grok3: "Seri Grok 3",
    modelCategory_Grok3Mini: "Seri Grok 3 Mini",
    modelCategory_Llama4: "Seri Llama 4",
    modelCategory_Llama3_3: "Seri Llama 3.3",
    modelCategory_Llama3_2: "Seri Llama 3.2",
    modelCategory_Llama3_1: "Seri Llama 3.1",
    modelCategory_Llama3: "Seri Llama 3",
    modelCategory_LlamaVision: "Model Llama Vision",
    modelCategory_MetaLlama: "Model Meta Llama",
    modelCategory_Gemma2: "Seri Gemma 2",
    modelCategory_Gemma: "Seri Gemma",
    modelCategory_GoogleGemma: "Model Google Gemma",
    modelCategory_DeepSeekR1: "Seri DeepSeek R1",
    modelCategory_DeepSeekV3: "Seri DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Seri DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Model DeepSeek",
    modelCategory_MistralAIModels: "Model Mistral AI",
    modelCategory_Qwen3: "Seri Qwen3",
    modelCategory_QwQwQ: "Seri Qwen QwQ",
    modelCategory_Qwen2_5: "Seri Qwen2.5",
    modelCategory_Qwen2_5Vision: "Seri Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Seri Qwen2.5 Coder",
    modelCategory_Qwen2: "Seri Qwen2",
    modelCategory_Qwen2Vision: "Seri Qwen2 Vision",
    modelCategory_QwenModels: "Model Qwen",
    modelCategory_OtherModels: "Model Lainnya",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Gagal memuat data pengguna: {errorMessage}. Silakan coba segarkan.",
    page_ErrorUserNotFound: "Pengguna tidak ditemukan. Silakan masuk lagi.",
    page_ErrorUserApiKeyConfig: "Konfigurasi kunci API pengguna tidak dapat dimuat. Silakan segarkan atau periksa pengaturan.",
    page_ErrorStartingSessionAPI: "Kesalahan API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Kesalahan memulai sesi: {errorMessage}",
    page_ErrorSessionIdMissing: "Respons API berhasil tetapi tidak menyertakan ID percakapan.",
    page_LoadingUserData: "Memuat data pengguna...",
    page_ErrorAlertTitle: "Kesalahan",
    page_WelcomeTitle: "Selamat Datang di Two AIs",
    page_WelcomeSubtitle: "Situs web ini memungkinkan Anda mendengarkan percakapan antara dua LLM.",
    page_ApiKeysRequiredTitle: "Kunci API Diperlukan",
    page_ApiKeysRequiredDescription: "Untuk menjalankan percakapan, Anda perlu memberikan kunci API Anda sendiri untuk model AI yang ingin Anda gunakan (misalnya, OpenAI, Google, Anthropic) setelah masuk. Instruksi terperinci untuk setiap penyedia dapat ditemukan di halaman Pengaturan / Kunci API setelah masuk.",
    page_SignInPrompt: "Untuk memulai sesi Anda sendiri, Anda dapat masuk atau membuat akun menggunakan tautan di header.",
    page_VideoTitle: "Demo Percakapan Two AIs",
    page_AvailableLLMsTitle: "LLM yang Saat Ini Tersedia",
    page_TooltipGoogleThinkingBudget: "Model Google ini menggunakan 'anggaran berpikir'. Output 'berpikir' ditagih tetapi tidak terlihat dalam obrolan.",
    page_TooltipAnthropicExtendedThinking: "Model Anthropic ini menggunakan 'pemikiran yang diperluas'. Output 'berpikir' ditagih tetapi tidak terlihat dalam obrolan.",
    page_TooltipXaiThinking: "Model xAI ini menggunakan 'berpikir'. Output ini ditagih tetapi tidak terlihat dalam obrolan.",
    page_TooltipQwenReasoning: "Model Qwen ini menggunakan 'penalaran/pemikiran'. Output ini ditagih tetapi tidak terlihat dalam obrolan.",
    page_TooltipDeepSeekReasoning: "Model DeepSeek ini menggunakan 'penalaran/pemikiran'. Output ditagih tetapi tidak terlihat dalam obrolan.",
    page_TooltipGenericReasoning: "Model ini menggunakan token penalaran yang tidak terlihat dalam obrolan tetapi ditagih sebagai token output.",
    page_TooltipRequiresVerification: "Membutuhkan organisasi OpenAI yang terverifikasi. Anda dapat memverifikasi di sini.",
    page_TooltipSupportsLanguage: "Mendukung {languageName}",
    page_TooltipMayNotSupportLanguage: "Mungkin tidak mendukung {languageName}",
    page_BadgePreview: "Pratinjau",
    page_BadgeExperimental: "Eksperimental",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "TTS yang Saat Ini Tersedia",
    page_NoTTSOptions: "Tidak ada opsi TTS yang tersedia saat ini.",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Masukkan kunci API {serviceName} baru",
    apiKeyManager_TestKey: "Uji kunci",
    apiKeyManager_TestingKey: "Menguji kunci...",
    apiKeyManager_KeyIsValid: "Kunci valid.",
    apiKeyManager_KeyIsInvalid: "Kunci tidak valid.",
    apiKeyManager_FailedToTestKey: "Gagal menguji kunci.",
    apiKeyManager_ErrorTestingKey: "Kesalahan saat menguji kunci: {error}",
    apiKeyManager_KeyProvider: "Penyedia",
    apiKeyManager_KeyName: "Nama kunci",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Tindakan",

    // Model capabilities
    modelCapability_Vision: "Visi",
    modelCapability_JSON: "Mode JSON",
    modelCapability_Tools: "Penggunaan Alat",
    modelCapability_ImageGen: "Pembuatan Gambar",
    modelCapability_Multilingual: "Multibahasa",
    modelCapability_WebSearch: "Pencarian Web",
    modelCapability_LargeContext: "Konteks Besar",
    modelCapability_LongContext: "Konteks Panjang",
    modelCapability_FastResponse: "Respons Cepat",
    modelCapability_CostEffective: "Hemat Biaya",
    modelCapability_AdvancedReasoning: "Penalaran Tingkat Lanjut",
    modelCapability_Coding: "Pengkodean",
    modelCapability_Foundation: "Model Dasar",
    modelCapability_Experimental: "Eksperimental",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Pratinjau",
    modelCapability_RequiresVerification: "Membutuhkan Verifikasi",
    modelCapability_RequiresAccount: "Membutuhkan Akun",

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