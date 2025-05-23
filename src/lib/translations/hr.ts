// src/lib/translations/hr.ts
export const hr = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Postavke',
        signIn: 'Prijava',
        signOut: 'Odjava',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arapski',
        bn: 'Bengalski',
        bg: 'Bugarski',
        zh: 'Kineski',
        hr: 'Hrvatski',
        cs: 'Češki',
        da: 'Danski',
        nl: 'Nizozemski',
        en: 'Engleski',
        et: 'Estonski',
        fi: 'Finski',
        fr: 'Francuski',
        de: 'Njemački',
        el: 'Grčki',
        iw: 'Hebrejski',
        hi: 'Hindski',
        hu: 'Mađarski',
        id: 'Indonezijski',
        it: 'Talijanski',
        ja: 'Japanski',
        ko: 'Korejski',
        lv: 'Latvijski',
        lt: 'Litavski',
        no: 'Norveški',
        pl: 'Poljski',
        pt: 'Portugalski',
        ro: 'Rumunjski',
        ru: 'Ruski',
        sr: 'Srpski',
        sk: 'Slovački',
        sl: 'Slovenski',
        es: 'Španjolski',
        sw: 'Svahili',
        sv: 'Švedski',
        th: 'Tajlandski',
        tr: 'Turski',
        uk: 'Ukrajinski',
        vi: 'Vijetnamski',
    },

    // Settings page
    settings: {
        title: 'Postavke',
        sections: {
            appearance: 'Izgled',
            apiKeys: 'API ključevi',
            language: 'Jezik',
        },
        appearance: {
            theme: 'Tema',
            light: 'Svijetla',
            dark: 'Tamna',
            system: 'Sustav',
        },
        language: {
            title: 'Jezik',
            description: 'Odaberite željeni jezik za sučelje',
            conversationLanguage: 'Jezik razgovora',
            conversationLanguageDescription: 'Jezik koji se koristi za AI razgovore odgovarat će jeziku vašeg sučelja',
        },
        apiKeys: {
            title: 'API ključevi',
            description: 'Upravljajte svojim API ključevima za različite AI pružatelje usluga',
            saved: 'Spremljeno',
            notSet: 'Nije postavljeno',
            setKey: 'Postavi ključ',
            updateKey: 'Ažuriraj ključ',
            removeKey: 'Ukloni ključ',
            getKeyInstructions: 'Nabavite svoj API ključ',
        },
    },

    // Main page
    main: {
        title: 'AI Razgovor',
        setupForm: {
            title: 'Postavite svoj razgovor',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Odaberite model',
            tts: {
                title: 'Tekst u govor',
                enable: 'Omogući tekst u govor',
                provider: 'TTS pružatelj',
                selectProvider: 'Odaberite TTS pružatelja',
                voice: 'Glas',
                selectVoice: 'Odaberite glas',
                model: 'TTS model',
                selectModel: 'Odaberite TTS model',
            },
            startConversation: 'Započni razgovor',
            conversationPrompt: 'Započnite razgovor.',
        },
        conversation: {
            thinking: 'razmišlja...',
            stop: 'Zaustavi',
            restart: 'Ponovno pokreni razgovor',
        },
        pricing: {
            estimatedCost: 'Procijenjeni trošak',
            perMillionTokens: 'po milijunu tokena',
            input: 'Unos',
            output: 'Izlaz',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Prijavite se na Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Lozinka',
            signIn: 'Prijava',
            signInWithGoogle: 'Prijavite se putem Googlea',
            noAccount: "Nemate račun?",
            signUp: 'Registrirajte se',
            forgotPassword: 'Zaboravili ste lozinku?',
        },
        signup: {
            title: 'Stvorite račun',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Lozinka (najmanje 6 znakova)',
            signUp: 'Registrirajte se',
            signUpWithGoogle: 'Registrirajte se putem Googlea',
            hasAccount: 'Već imate račun?',
            signIn: 'Prijava',
        },
        errors: {
            invalidCredentials: 'Nevažeći email ili lozinka',
            userNotFound: 'Korisnik nije pronađen',
            weakPassword: 'Lozinka mora imati najmanje 6 znakova',
            emailInUse: 'Email se već koristi',
            generic: 'Došlo je do pogreške. Molimo pokušajte ponovo.',
        },
    },

    // Common
    common: {
        loading: 'Učitavanje...',
        error: 'Pogreška',
        save: 'Spremi',
        cancel: 'Odustani',
        delete: 'Izbriši',
        confirm: 'Potvrdi',
        or: 'ili',
    },
}; 