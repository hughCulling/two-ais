// src/lib/translations/lt.ts
export const lt = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Nustatymai',
        signIn: 'Prisijungti',
        signOut: 'Atsijungti',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabų',
        bn: 'Bengalų',
        bg: 'Bulgarų',
        zh: 'Kinų',
        hr: 'Kroatų',
        cs: 'Čekų',
        da: 'Danų',
        nl: 'Olandų',
        en: 'Anglų',
        et: 'Estų',
        fi: 'Suomių',
        fr: 'Prancūzų',
        de: 'Vokiečių',
        el: 'Graikų',
        iw: 'Hebrajų',
        hi: 'Indų',
        hu: 'Vengrų',
        id: 'Indoneziečių',
        it: 'Italų',
        ja: 'Japonų',
        ko: 'Korėjiečių',
        lv: 'Latvių',
        lt: 'Lietuvių',
        no: 'Norvegų',
        pl: 'Lenkų',
        pt: 'Portugalų',
        ro: 'Rumunų',
        ru: 'Rusų',
        sr: 'Serbų',
        sk: 'Slovakų',
        sl: 'Slovėnų',
        es: 'Ispanų',
        sw: 'Svahilių',
        sv: 'Švedų',
        th: 'Tajų',
        tr: 'Turkų',
        uk: 'Ukrainiečių',
        vi: 'Vietnamiečių',
    },

    // Settings page
    settings: {
        title: 'Nustatymai',
        sections: {
            appearance: 'Išvaizda',
            apiKeys: 'API Raktai',
            language: 'Kalba',
        },
        appearance: {
            theme: 'Tema',
            light: 'Šviesi',
            dark: 'Tamsi',
            system: 'Sistema',
        },
        language: {
            title: 'Kalba',
            description: 'Pasirinkite norimą sąsajos kalbą',
            conversationLanguage: 'Pokalbio kalba',
            conversationLanguageDescription: 'AI pokalbiams naudojama kalba atitiks jūsų sąsajos kalbą',
        },
        apiKeys: {
            title: 'API Raktai',
            description: 'Tvarkykite savo API raktus skirtingiems AI teikėjams',
            saved: 'Išsaugota',
            notSet: 'Nenustatyta',
            setKey: 'Nustatyti raktą',
            updateKey: 'Atnaujinti raktą',
            removeKey: 'Pašalinti raktą',
            getKeyInstructions: 'Gaukite savo API raktą',
        },
    },

    // Main page
    main: {
        title: 'AI Pokalbis',
        setupForm: {
            title: 'Nustatykite savo pokalbį',
            agentA: 'Agentas A',
            agentB: 'Agentas B',
            model: 'Modelis',
            selectModel: 'Pasirinkite modelį',
            tts: {
                title: 'Tekstas į kalbą',
                enable: 'Įjungti tekstą į kalbą',
                provider: 'TTS Teikėjas',
                selectProvider: 'Pasirinkite TTS teikėją',
                voice: 'Balsas',
                selectVoice: 'Pasirinkite balsą',
                model: 'TTS Modelis',
                selectModel: 'Pasirinkite TTS modelį',
            },
            startConversation: 'Pradėti pokalbį',
            conversationPrompt: 'Pradėkite pokalbį.',
        },
        conversation: {
            thinking: 'galvoja...',
            stop: 'Sustabdyti',
            restart: 'Paleisti pokalbį iš naujo',
        },
        pricing: {
            estimatedCost: 'Numatoma kaina',
            perMillionTokens: 'už milijoną žetonų',
            input: 'Įvestis',
            output: 'Išvestis',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Prisijungti prie Two AIs', // Keep brand name
            emailPlaceholder: 'El. paštas',
            passwordPlaceholder: 'Slaptažodis',
            signIn: 'Prisijungti',
            signInWithGoogle: 'Prisijungti su Google',
            noAccount: "Neturite paskyros?",
            signUp: 'Registruotis',
            forgotPassword: 'Pamiršote slaptažodį?',
        },
        signup: {
            title: 'Sukurti paskyrą',
            emailPlaceholder: 'El. paštas',
            passwordPlaceholder: 'Slaptažodis (mažiausiai 6 simboliai)',
            signUp: 'Registruotis',
            signUpWithGoogle: 'Registruotis su Google',
            hasAccount: 'Jau turite paskyrą?',
            signIn: 'Prisijungti',
        },
        errors: {
            invalidCredentials: 'Neteisingas el. paštas arba slaptažodis',
            userNotFound: 'Vartotojas nerastas',
            weakPassword: 'Slaptažodis turi būti bent 6 simbolių ilgio',
            emailInUse: 'El. paštas jau naudojamas',
            generic: 'Įvyko klaida. Bandykite dar kartą.',
        },
    },

    // Common
    common: {
        loading: 'Kraunama...',
        error: 'Klaida',
        save: 'Išsaugoti',
        cancel: 'Atšaukti',
        delete: 'Ištrinti',
        confirm: 'Patvirtinti',
        or: 'arba',
    },
}; 