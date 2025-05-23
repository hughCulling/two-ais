// src/lib/translations/fi.ts
export const fi = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Asetukset',
        signIn: 'Kirjaudu sisään',
        signOut: 'Kirjaudu ulos',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabia',
        bn: 'Bengali',
        bg: 'Bulgaria',
        zh: 'Kiina',
        hr: 'Kroatia',
        cs: 'Tšekki',
        da: 'Tanska',
        nl: 'Hollanti',
        en: 'Englanti',
        et: 'Viro',
        fi: 'Suomi',
        fr: 'Ranska',
        de: 'Saksa',
        el: 'Kreikka',
        iw: 'Heprea',
        hi: 'Hindi',
        hu: 'Unkari',
        id: 'Indonesia',
        it: 'Italia',
        ja: 'Japani',
        ko: 'Korea',
        lv: 'Latvia',
        lt: 'Liettua',
        no: 'Norja',
        pl: 'Puola',
        pt: 'Portugali',
        ro: 'Romania',
        ru: 'Venäjä',
        sr: 'Serbia',
        sk: 'Slovakia',
        sl: 'Sloveeni',
        es: 'Espanja',
        sw: 'Swahili',
        sv: 'Ruotsi',
        th: 'Thai',
        tr: 'Turkki',
        uk: 'Ukraina',
        vi: 'Vietnam',
    },

    // Settings page
    settings: {
        title: 'Asetukset',
        sections: {
            appearance: 'Ulkoasu',
            apiKeys: 'API-avaimet',
            language: 'Kieli',
        },
        appearance: {
            theme: 'Teema',
            light: 'Vaalea',
            dark: 'Tumma',
            system: 'Järjestelmä',
        },
        language: {
            title: 'Kieli',
            description: 'Valitse haluamasi kieli käyttöliittymälle',
            conversationLanguage: 'Keskustelukieli',
            conversationLanguageDescription: 'Tekoälykeskusteluissa käytetty kieli vastaa käyttöliittymän kieltä',
        },
        apiKeys: {
            title: 'API-avaimet',
            description: 'Hallinnoi API-avaimiasi eri tekoälypalveluntarjoajille',
            saved: 'Tallennettu',
            notSet: 'Ei asetettu',
            setKey: 'Aseta avain',
            updateKey: 'Päivitä avain',
            removeKey: 'Poista avain',
            getKeyInstructions: 'Hanki API-avaimesi',
        },
    },

    // Main page
    main: {
        title: 'Tekoälykeskustelu',
        setupForm: {
            title: 'Määritä keskustelusi',
            agentA: 'Agentti A',
            agentB: 'Agentti B',
            model: 'Malli',
            selectModel: 'Valitse malli',
            tts: {
                title: 'Tekstistä puheeksi',
                enable: 'Ota tekstistä puheeksi käyttöön',
                provider: 'TTS-palveluntarjoaja',
                selectProvider: 'Valitse TTS-palveluntarjoaja',
                voice: 'Ääni',
                selectVoice: 'Valitse ääni',
                model: 'TTS-malli',
                selectModel: 'Valitse TTS-malli',
            },
            startConversation: 'Aloita keskustelu',
            conversationPrompt: 'Aloita keskustelu.',
        },
        conversation: {
            thinking: 'miettii...',
            stop: 'Pysäytä',
            restart: 'Aloita keskustelu uudelleen',
        },
        pricing: {
            estimatedCost: 'Arvioitu hinta',
            perMillionTokens: 'miljoonaa tokenia kohti',
            input: 'Syöte',
            output: 'Tuloste',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Kirjaudu sisään Two AIs -palveluun', // Keep brand name
            emailPlaceholder: 'Sähköposti',
            passwordPlaceholder: 'Salasana',
            signIn: 'Kirjaudu sisään',
            signInWithGoogle: 'Kirjaudu sisään Google-tunnuksilla',
            noAccount: "Eikö sinulla ole tiliä?",
            signUp: 'Rekisteröidy',
            forgotPassword: 'Unohditko salasanasi?',
        },
        signup: {
            title: 'Luo tili',
            emailPlaceholder: 'Sähköposti',
            passwordPlaceholder: 'Salasana (vähintään 6 merkkiä)',
            signUp: 'Rekisteröidy',
            signUpWithGoogle: 'Rekisteröidy Google-tunnuksilla',
            hasAccount: 'Onko sinulla jo tili?',
            signIn: 'Kirjaudu sisään',
        },
        errors: {
            invalidCredentials: 'Virheellinen sähköpostiosoite tai salasana',
            userNotFound: 'Käyttäjää ei löytynyt',
            weakPassword: 'Salasanan on oltava vähintään 6 merkkiä pitkä',
            emailInUse: 'Sähköpostiosoite on jo käytössä',
            generic: 'Tapahtui virhe. Yritä uudelleen.',
        },
    },

    // Common
    common: {
        loading: 'Ladataan...',
        error: 'Virhe',
        save: 'Tallenna',
        cancel: 'Peruuta',
        delete: 'Poista',
        confirm: 'Vahvista',
        or: 'tai',
    },
}; 