// src/lib/translations/da.ts
export const da = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Indstillinger',
        signIn: 'Log ind',
        signOut: 'Log ud',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabisk',
        bn: 'Bengalsk',
        bg: 'Bulgarsk',
        zh: 'Kinesisk',
        hr: 'Kroatisk',
        cs: 'Tjekkisk',
        da: 'Dansk',
        nl: 'Hollandsk',
        en: 'Engelsk',
        et: 'Estisk',
        fi: 'Finsk',
        fr: 'Fransk',
        de: 'Tysk',
        el: 'Græsk',
        iw: 'Hebraisk',
        hi: 'Hindi',
        hu: 'Ungarsk',
        id: 'Indonesisk',
        it: 'Italiensk',
        ja: 'Japansk',
        ko: 'Koreansk',
        lv: 'Lettisk',
        lt: 'Litauisk',
        no: 'Norsk',
        pl: 'Polsk',
        pt: 'Portugisisk',
        ro: 'Rumænsk',
        ru: 'Russisk',
        sr: 'Serbisk',
        sk: 'Slovakisk',
        sl: 'Slovensk',
        es: 'Spansk',
        sw: 'Swahili',
        sv: 'Svensk',
        th: 'Thailandsk',
        tr: 'Tyrkisk',
        uk: 'Ukrainsk',
        vi: 'Vietnamesisk',
    },

    // Settings page
    settings: {
        title: 'Indstillinger',
        sections: {
            appearance: 'Udseende',
            apiKeys: 'API-nøgler',
            language: 'Sprog',
        },
        appearance: {
            theme: 'Tema',
            light: 'Lys',
            dark: 'Mørk',
            system: 'System',
        },
        language: {
            title: 'Sprog',
            description: 'Vælg dit foretrukne sprog til grænsefladen',
            conversationLanguage: 'Samtalesprog',
            conversationLanguageDescription: 'Sproget, der bruges til AI-samtaler, matcher dit grænsefladesprog',
        },
        apiKeys: {
            title: 'API-nøgler',
            description: 'Administrer dine API-nøgler for forskellige AI-udbydere',
            saved: 'Gemt',
            notSet: 'Ikke indstillet',
            setKey: 'Indstil nøgle',
            updateKey: 'Opdater nøgle',
            removeKey: 'Fjern nøgle',
            getKeyInstructions: 'Hent din API-nøgle',
        },
    },

    // Main page
    main: {
        title: 'AI-samtale',
        setupForm: {
            title: 'Opsæt din samtale',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Vælg en model',
            tts: {
                title: 'Tekst-til-tale',
                enable: 'Aktiver tekst-til-tale',
                provider: 'TTS-udbyder',
                selectProvider: 'Vælg TTS-udbyder',
                voice: 'Stemme',
                selectVoice: 'Vælg stemme',
                model: 'TTS-model',
                selectModel: 'Vælg TTS-model',
            },
            startConversation: 'Start samtale',
            conversationPrompt: 'Start samtalen.',
        },
        conversation: {
            thinking: 'tænker...',
            stop: 'Stop',
            restart: 'Genstart samtale',
        },
        pricing: {
            estimatedCost: 'Anslåede omkostninger',
            perMillionTokens: 'pr. million tokens',
            input: 'Input',
            output: 'Output',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Log ind på Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Adgangskode',
            signIn: 'Log ind',
            signInWithGoogle: 'Log ind med Google',
            noAccount: "Har du ikke en konto?",
            signUp: 'Opret konto',
            forgotPassword: 'Glemt adgangskode?',
        },
        signup: {
            title: 'Opret konto',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Adgangskode (mindst 6 tegn)',
            signUp: 'Opret konto',
            signUpWithGoogle: 'Opret konto med Google',
            hasAccount: 'Har du allerede en konto?',
            signIn: 'Log ind',
        },
        errors: {
            invalidCredentials: 'Ugyldig e-mail eller adgangskode',
            userNotFound: 'Bruger ikke fundet',
            weakPassword: 'Adgangskoden skal være på mindst 6 tegn',
            emailInUse: 'E-mail er allerede i brug',
            generic: 'Der opstod en fejl. Prøv igen.',
        },
    },

    // Common
    common: {
        loading: 'Indlæser...',
        error: 'Fejl',
        save: 'Gem',
        cancel: 'Annuller',
        delete: 'Slet',
        confirm: 'Bekræft',
        or: 'eller',
    },
}; 