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
        },
        language: {
            title: 'Bahasa',
            description: 'Pilih bahasa pilihan Anda untuk antarmuka',
            conversationLanguage: 'Bahasa Percakapan',
            conversationLanguageDescription: 'Bahasa yang digunakan untuk percakapan AI akan cocok dengan bahasa antarmuka Anda',
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
        },
        errors: {
            invalidCredentials: 'Email atau kata sandi tidak valid',
            userNotFound: 'Pengguna tidak ditemukan',
            weakPassword: 'Kata sandi minimal 6 karakter',
            emailInUse: 'Email sudah digunakan',
            generic: 'Terjadi kesalahan. Silakan coba lagi.',
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
    },
}; 