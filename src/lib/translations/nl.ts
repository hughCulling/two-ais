// src/lib/translations/nl.ts
export const nl = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Instellingen',
        signIn: 'Inloggen',
        signOut: 'Uitloggen',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabisch',
        bn: 'Bengaals',
        bg: 'Bulgaars',
        zh: 'Chinees',
        hr: 'Kroatisch',
        cs: 'Tsjechisch',
        da: 'Deens',
        nl: 'Nederlands',
        en: 'Engels',
        et: 'Estisch',
        fi: 'Fins',
        fr: 'Frans',
        de: 'Duits',
        el: 'Grieks',
        iw: 'Hebreeuws',
        hi: 'Hindi',
        hu: 'Hongaars',
        id: 'Indonesisch',
        it: 'Italiaans',
        ja: 'Japans',
        ko: 'Koreaans',
        lv: 'Lets',
        lt: 'Litouws',
        no: 'Noors',
        pl: 'Pools',
        pt: 'Portugees',
        ro: 'Roemeens',
        ru: 'Russisch',
        sr: 'Servisch',
        sk: 'Slowaaks',
        sl: 'Sloveens',
        es: 'Spaans',
        sw: 'Swahili',
        sv: 'Zweeds',
        th: 'Thais',
        tr: 'Turks',
        uk: 'Oekraïens',
        vi: 'Vietnamees',
    },

    // Settings page
    settings: {
        title: 'Instellingen',
        sections: {
            appearance: 'Uiterlijk',
            apiKeys: 'API-sleutels',
            language: 'Taal',
        },
        appearance: {
            theme: 'Thema',
            light: 'Licht',
            dark: 'Donker',
            system: 'Systeem',
        },
        language: {
            title: 'Taal',
            description: 'Kies uw voorkeurstaal voor de interface',
            conversationLanguage: 'Gesprekstaal',
            conversationLanguageDescription: 'De taal die voor AI-gesprekken wordt gebruikt, komt overeen met uw interfacetail',
        },
        apiKeys: {
            title: 'API-sleutels',
            description: 'Beheer uw API-sleutels voor verschillende AI-providers',
            saved: 'Opgeslagen',
            notSet: 'Niet ingesteld',
            setKey: 'Sleutel instellen',
            updateKey: 'Sleutel bijwerken',
            removeKey: 'Sleutel verwijderen',
            getKeyInstructions: 'Haal uw API-sleutel op',
        },
    },

    // Main page
    main: {
        title: 'AI-gesprek',
        setupForm: {
            title: 'Stel uw gesprek in',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Selecteer een model',
            tts: {
                title: 'Tekst-naar-spraak',
                enable: 'Tekst-naar-spraak inschakelen',
                provider: 'TTS-provider',
                selectProvider: 'Selecteer TTS-provider',
                voice: 'Stem',
                selectVoice: 'Selecteer stem',
                model: 'TTS-model',
                selectModel: 'Selecteer TTS-model',
            },
            startConversation: 'Gesprek starten',
            conversationPrompt: 'Start het gesprek.',
        },
        conversation: {
            thinking: 'denkt na...',
            stop: 'Stoppen',
            restart: 'Gesprek opnieuw starten',
        },
        pricing: {
            estimatedCost: 'Geschatte kosten',
            perMillionTokens: 'per miljoen tokens',
            input: 'Invoer',
            output: 'Uitvoer',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Inloggen bij Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Wachtwoord',
            signIn: 'Inloggen',
            signInWithGoogle: 'Inloggen met Google',
            noAccount: "Geen account?",
            signUp: 'Registreren',
            forgotPassword: 'Wachtwoord vergeten?',
        },
        signup: {
            title: 'Account aanmaken',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Wachtwoord (minimaal 6 tekens)',
            signUp: 'Registreren',
            signUpWithGoogle: 'Registreren met Google',
            hasAccount: 'Al een account?',
            signIn: 'Inloggen',
        },
        errors: {
            invalidCredentials: 'Ongeldige e-mail of wachtwoord',
            userNotFound: 'Gebruiker niet gevonden',
            weakPassword: 'Wachtwoord moet minimaal 6 tekens lang zijn',
            emailInUse: 'E-mailadres is al in gebruik',
            generic: 'Er is een fout opgetreden. Probeer het opnieuw.',
        },
    },

    // Common
    common: {
        loading: 'Laden...',
        error: 'Fout',
        save: 'Opslaan',
        cancel: 'Annuleren',
        delete: 'Verwijderen',
        confirm: 'Bevestigen',
        or: 'of',
    },
}; 