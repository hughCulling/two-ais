// src/lib/translations/sl.ts
export const sl = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Nastavitve',
        signIn: 'Prijava',
        signOut: 'Odjava',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabščina',
        bn: 'Bengalščina',
        bg: 'Bolgarščina',
        zh: 'Kitajščina',
        hr: 'Hrvaščina',
        cs: 'Češčina',
        da: 'Danščina',
        nl: 'Nizozemščina',
        en: 'Angleščina',
        et: 'Estonščina',
        fi: 'Finščina',
        fr: 'Francoščina',
        de: 'Nemščina',
        el: 'Grščina',
        iw: 'Hebrejščina',
        hi: 'Hindijščina',
        hu: 'Madžarščina',
        id: 'Indonezijščina',
        it: 'Italijanščina',
        ja: 'Japonščina',
        ko: 'Korejščina',
        lv: 'Latvijščina',
        lt: 'Litovščina',
        no: 'Norveščina',
        pl: 'Poljščina',
        pt: 'Portugalščina',
        ro: 'Romunščina',
        ru: 'Ruščina',
        sr: 'Srbščina',
        sk: 'Slovaščina',
        sl: 'Slovenščina',
        es: 'Španščina',
        sw: 'Svahili',
        sv: 'Švedščina',
        th: 'Tajščina',
        tr: 'Turščina',
        uk: 'Ukrajinščina',
        vi: 'Vietnamščina',
    },

    // Settings page
    settings: {
        title: 'Nastavitve',
        sections: {
            appearance: 'Videz',
            apiKeys: 'API ključi',
            language: 'Jezik',
        },
        appearance: {
            theme: 'Tema',
            light: 'Svetla',
            dark: 'Temna',
            system: 'Sistemska',
        },
        language: {
            title: 'Jezik',
            description: 'Izberite želeni jezik za vmesnik',
            conversationLanguage: 'Jezik pogovora',
            conversationLanguageDescription: 'Jezik, uporabljen za pogovore z UI, se bo ujemal z jezikom vašega vmesnika',
        },
        apiKeys: {
            title: 'API ključi',
            description: 'Upravljajte svoje API ključe za različne ponudnike UI',
            saved: 'Shranjeno',
            notSet: 'Ni nastavljeno',
            setKey: 'Nastavi ključ',
            updateKey: 'Posodobi ključ',
            removeKey: 'Odstrani ključ',
            getKeyInstructions: 'Pridobite svoj API ključ',
        },
    },

    // Main page
    main: {
        title: 'Pogovor z UI',
        setupForm: {
            title: 'Nastavite svoj pogovor',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Izberite model',
            tts: {
                title: 'Besedilo v govor',
                enable: 'Omogoči besedilo v govor',
                provider: 'Ponudnik TTS',
                selectProvider: 'Izberite ponudnika TTS',
                voice: 'Glas',
                selectVoice: 'Izberite glas',
                model: 'Model TTS',
                selectModel: 'Izberite model TTS',
            },
            startConversation: 'Začni pogovor',
            conversationPrompt: 'Začnite pogovor.',
        },
        conversation: {
            thinking: 'razmišlja...',
            stop: 'Ustavi',
            restart: 'Ponovno zaženi pogovor',
        },
        pricing: {
            estimatedCost: 'Ocenjeni stroški',
            perMillionTokens: 'na milijon žetonov',
            input: 'Vnos',
            output: 'Izhod',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Prijavite se v Two AIs', // Keep brand name
            emailPlaceholder: 'E-pošta',
            passwordPlaceholder: 'Geslo',
            signIn: 'Prijava',
            signInWithGoogle: 'Prijavite se z Googlom',
            noAccount: "Nimate računa?",
            signUp: 'Registracija',
            forgotPassword: 'Ste pozabili geslo?',
        },
        signup: {
            title: 'Ustvari račun',
            emailPlaceholder: 'E-pošta',
            passwordPlaceholder: 'Geslo (vsaj 6 znakov)',
            signUp: 'Registracija',
            signUpWithGoogle: 'Registrirajte se z Googlom',
            hasAccount: 'Že imate račun?',
            signIn: 'Prijava',
        },
        errors: {
            invalidCredentials: 'Napačna e-pošta ali geslo',
            userNotFound: 'Uporabnik ni bil najden',
            weakPassword: 'Geslo mora vsebovati vsaj 6 znakov',
            emailInUse: 'E-pošta je že v uporabi',
            generic: 'Prišlo je do napake. Poskusite znova.',
        },
    },

    // Common
    common: {
        loading: 'Nalaganje...',
        error: 'Napaka',
        save: 'Shrani',
        cancel: 'Prekliči',
        delete: 'Izbriši',
        confirm: 'Potrdi',
        or: 'ali',
    },
}; 