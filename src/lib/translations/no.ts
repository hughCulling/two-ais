// src/lib/translations/no.ts
export const no = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Innstillinger',
        signIn: 'Logg inn',
        signOut: 'Logg ut',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabisk',
        bn: 'Bengali',
        bg: 'Bulgarsk',
        zh: 'Kinesisk',
        hr: 'Kroatisk',
        cs: 'Tsjekkisk',
        da: 'Dansk',
        nl: 'Nederlandsk',
        en: 'Engelsk',
        et: 'Estisk',
        fi: 'Finsk',
        fr: 'Fransk',
        de: 'Tysk',
        el: 'Gresk',
        iw: 'Hebraisk',
        hi: 'Hindi',
        hu: 'Ungarsk',
        id: 'Indonesisk',
        it: 'Italiensk',
        ja: 'Japansk',
        ko: 'Koreansk',
        lv: 'Latvisk',
        lt: 'Litauisk',
        no: 'Norsk',
        pl: 'Polsk',
        pt: 'Portugisisk',
        ro: 'Rumensk',
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
        title: 'Innstillinger',
        sections: {
            appearance: 'Utseende',
            apiKeys: 'API-nøkler',
            language: 'Språk',
        },
        appearance: {
            theme: 'Tema',
            light: 'Lys',
            dark: 'Mørk',
            system: 'System',
        },
        language: {
            title: 'Språk',
            description: 'Velg ditt foretrukne språk for grensesnittet',
            conversationLanguage: 'Samtalespråk',
            conversationLanguageDescription: 'Språket som brukes for AI-samtaler vil matche språket i grensesnittet ditt',
        },
        apiKeys: {
            title: 'API-nøkler',
            description: 'Administrer API-nøklene dine for forskjellige AI-leverandører',
            saved: 'Lagret',
            notSet: 'Ikke angitt',
            setKey: 'Angi nøkkel',
            updateKey: 'Oppdater nøkkel',
            removeKey: 'Fjern nøkkel',
            getKeyInstructions: 'Få API-nøkkelen din',
        },
    },

    // Main page
    main: {
        title: 'AI-samtale',
        setupForm: {
            title: 'Sett opp samtalen din',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Modell',
            selectModel: 'Velg en modell',
            tts: {
                title: 'Tekst-til-tale',
                enable: 'Aktiver tekst-til-tale',
                provider: 'TTS-leverandør',
                selectProvider: 'Velg TTS-leverandør',
                voice: 'Stemme',
                selectVoice: 'Velg stemme',
                model: 'TTS-modell',
                selectModel: 'Velg TTS-modell',
            },
            startConversation: 'Start samtale',
            conversationPrompt: 'Start samtalen.',
        },
        conversation: {
            thinking: 'tenker...',
            stop: 'Stopp',
            restart: 'Start samtalen på nytt',
        },
        pricing: {
            estimatedCost: 'Estimert kostnad',
            perMillionTokens: 'per million tokens',
            input: 'Input',
            output: 'Output',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Logg inn på Two AIs', // Keep brand name
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Passord',
            signIn: 'Logg inn',
            signInWithGoogle: 'Logg inn med Google',
            noAccount: "Har du ikke konto?",
            signUp: 'Registrer deg',
            forgotPassword: 'Glemt passord?',
        },
        signup: {
            title: 'Opprett konto',
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Passord (minimum 6 tegn)',
            signUp: 'Registrer deg',
            signUpWithGoogle: 'Registrer deg med Google',
            hasAccount: 'Har du allerede konto?',
            signIn: 'Logg inn',
        },
        errors: {
            invalidCredentials: 'Ugyldig e-post eller passord',
            userNotFound: 'Bruker ikke funnet',
            weakPassword: 'Passordet må være på minst 6 tegn',
            emailInUse: 'E-posten er allerede i bruk',
            generic: 'Det oppstod en feil. Vennligst prøv igjen.',
        },
    },

    // Common
    common: {
        loading: 'Laster...',
        error: 'Feil',
        save: 'Lagre',
        cancel: 'Avbryt',
        delete: 'Slett',
        confirm: 'Bekreft',
        or: 'eller',
    },
}; 