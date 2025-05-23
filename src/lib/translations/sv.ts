// src/lib/translations/sv.ts
export const sv = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Inställningar',
        signIn: 'Logga in',
        signOut: 'Logga ut',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabiska',
        bn: 'Bengali',
        bg: 'Bulgariska',
        zh: 'Kinesiska',
        hr: 'Kroatiska',
        cs: 'Tjeckiska',
        da: 'Danska',
        nl: 'Nederländska',
        en: 'Engelska',
        et: 'Estniska',
        fi: 'Finska',
        fr: 'Franska',
        de: 'Tyska',
        el: 'Grekiska',
        iw: 'Hebreiska',
        hi: 'Hindi',
        hu: 'Ungerska',
        id: 'Indonesiska',
        it: 'Italienska',
        ja: 'Japanska',
        ko: 'Koreanska',
        lv: 'Lettiska',
        lt: 'Litauiska',
        no: 'Norska',
        pl: 'Polska',
        pt: 'Portugisiska',
        ro: 'Rumänska',
        ru: 'Ryska',
        sr: 'Serbiska',
        sk: 'Slovakiska',
        sl: 'Slovenska',
        es: 'Spanska',
        sw: 'Swahili',
        sv: 'Svenska',
        th: 'Thailändska',
        tr: 'Turkiska',
        uk: 'Ukrainska',
        vi: 'Vietnamesiska',
    },

    // Settings page
    settings: {
        title: 'Inställningar',
        sections: {
            appearance: 'Utseende',
            apiKeys: 'API-nycklar',
            language: 'Språk',
        },
        appearance: {
            theme: 'Tema',
            light: 'Ljus',
            dark: 'Mörk',
            system: 'System',
        },
        language: {
            title: 'Språk',
            description: 'Välj önskat språk för gränssnittet',
            conversationLanguage: 'Konversationsspråk',
            conversationLanguageDescription: 'Språket som används för AI-konversationer matchar ditt gränssnittsspråk',
        },
        apiKeys: {
            title: 'API-nycklar',
            description: 'Hantera dina API-nycklar för olika AI-leverantörer',
            saved: 'Sparad',
            notSet: 'Inte inställd',
            setKey: 'Ställ in nyckel',
            updateKey: 'Uppdatera nyckel',
            removeKey: 'Ta bort nyckel',
            getKeyInstructions: 'Hämta din API-nyckel',
        },
    },

    // Main page
    main: {
        title: 'AI-konversation',
        setupForm: {
            title: 'Ställ in din konversation',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Modell',
            selectModel: 'Välj en modell',
            tts: {
                title: 'Text-till-tal',
                enable: 'Aktivera text-till-tal',
                provider: 'TTS-leverantör',
                selectProvider: 'Välj TTS-leverantör',
                voice: 'Röst',
                selectVoice: 'Välj röst',
                model: 'TTS-modell',
                selectModel: 'Välj TTS-modell',
            },
            startConversation: 'Starta konversation',
            conversationPrompt: 'Starta konversationen.',
        },
        conversation: {
            thinking: 'tänker...',
            stop: 'Stoppa',
            restart: 'Starta om konversation',
        },
        pricing: {
            estimatedCost: 'Beräknad kostnad',
            perMillionTokens: 'per miljon tokens',
            input: 'Indata',
            output: 'Utdata',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Logga in på Two AIs', // Keep brand name
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Lösenord',
            signIn: 'Logga in',
            signInWithGoogle: 'Logga in med Google',
            noAccount: "Har du inget konto?",
            signUp: 'Registrera dig',
            forgotPassword: 'Glömt lösenord?',
        },
        signup: {
            title: 'Skapa konto',
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Lösenord (minst 6 tecken)',
            signUp: 'Registrera dig',
            signUpWithGoogle: 'Registrera dig med Google',
            hasAccount: 'Har du redan ett konto?',
            signIn: 'Logga in',
        },
        errors: {
            invalidCredentials: 'Ogiltig e-postadress eller lösenord',
            userNotFound: 'Användaren hittades inte',
            weakPassword: 'Lösenordet måste vara minst 6 tecken långt',
            emailInUse: 'E-postadressen används redan',
            generic: 'Ett fel uppstod. Försök igen.',
        },
    },

    // Common
    common: {
        loading: 'Laddar...',
        error: 'Fel',
        save: 'Spara',
        cancel: 'Avbryt',
        delete: 'Ta bort',
        confirm: 'Bekräfta',
        or: 'eller',
    },
}; 