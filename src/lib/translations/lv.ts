// src/lib/translations/lv.ts
export const lv = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Iestatījumi',
        signIn: 'Pieteikties',
        signOut: 'Izrakstīties',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arābu',
        bn: 'Bengāļu',
        bg: 'Bulgāru',
        zh: 'Ķīniešu',
        hr: 'Horvātu',
        cs: 'Čehu',
        da: 'Dāņu',
        nl: 'Holandiešu',
        en: 'Angļu',
        et: 'Igauņu',
        fi: 'Somu',
        fr: 'Franču',
        de: 'Vācu',
        el: 'Grieķu',
        iw: 'Ebreju',
        hi: 'Hindi',
        hu: 'Ungāru',
        id: 'Indonēziešu',
        it: 'Itāļu',
        ja: 'Japāņu',
        ko: 'Korejiešu',
        lv: 'Latviešu',
        lt: 'Lietuviešu',
        no: 'Norvēģu',
        pl: 'Poļu',
        pt: 'Portugāļu',
        ro: 'Rumāņu',
        ru: 'Krievu',
        sr: 'Serbu',
        sk: 'Slovāku',
        sl: 'Slovēņu',
        es: 'Spāņu',
        sw: 'Svahili',
        sv: 'Zviedru',
        th: 'Taju',
        tr: 'Turku',
        uk: 'Ukraiņu',
        vi: 'Vjetnamiešu',
    },

    // Settings page
    settings: {
        title: 'Iestatījumi',
        sections: {
            appearance: 'Izskats',
            apiKeys: 'API atslēgas',
            language: 'Valoda',
        },
        appearance: {
            theme: 'Tēma',
            light: 'Gaišs',
            dark: 'Tumšs',
            system: 'Sistēma',
        },
        language: {
            title: 'Valoda',
            description: 'Izvēlieties vēlamo valodu saskarnei',
            conversationLanguage: 'Sarunvaloda',
            conversationLanguageDescription: 'AI sarunām izmantotā valoda atbildīs jūsu saskarnes valodai',
        },
        apiKeys: {
            title: 'API atslēgas',
            description: 'Pārvaldiet savas API atslēgas dažādiem AI nodrošinātājiem',
            saved: 'Saglabāts',
            notSet: 'Nav iestatīts',
            setKey: 'Iestatīt atslēgu',
            updateKey: 'Atjaunināt atslēgu',
            removeKey: 'Noņemt atslēgu',
            getKeyInstructions: 'Iegūstiet savu API atslēgu',
        },
    },

    // Main page
    main: {
        title: 'AI Saruna',
        setupForm: {
            title: 'Iestatiet savu sarunu',
            agentA: 'Aģents A',
            agentB: 'Aģents B',
            model: 'Modelis',
            selectModel: 'Izvēlieties modeli',
            tts: {
                title: 'Teksts uz runu',
                enable: 'Iespējot tekstu uz runu',
                provider: 'TTS nodrošinātājs',
                selectProvider: 'Izvēlieties TTS nodrošinātāju',
                voice: 'Balss',
                selectVoice: 'Izvēlieties balsi',
                model: 'TTS modelis',
                selectModel: 'Izvēlieties TTS modeli',
            },
            startConversation: 'Sākt sarunu',
            conversationPrompt: 'Sāciet sarunu.',
        },
        conversation: {
            thinking: 'domā...',
            stop: 'Pārtraukt',
            restart: 'Restartēt sarunu',
        },
        pricing: {
            estimatedCost: 'Aprēķinātās izmaksas',
            perMillionTokens: 'par miljonu žetonu',
            input: 'Ievade',
            output: 'Izvade',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Pieteikties Two AIs', // Keep brand name
            emailPlaceholder: 'E-pasts',
            passwordPlaceholder: 'Parole',
            signIn: 'Pieteikties',
            signInWithGoogle: 'Pieteikties ar Google',
            noAccount: "Nav konta?",
            signUp: 'Reģistrēties',
            forgotPassword: 'Aizmirsāt paroli?',
        },
        signup: {
            title: 'Izveidot kontu',
            emailPlaceholder: 'E-pasts',
            passwordPlaceholder: 'Parole (vismaz 6 rakstzīmes)',
            signUp: 'Reģistrēties',
            signUpWithGoogle: 'Reģistrēties ar Google',
            hasAccount: 'Jau ir konts?',
            signIn: 'Pieteikties',
        },
        errors: {
            invalidCredentials: 'Nederīgs e-pasts vai parole',
            userNotFound: 'Lietotājs nav atrasts',
            weakPassword: 'Parolei jābūt vismaz 6 rakstzīmēm garai',
            emailInUse: 'E-pasts jau tiek izmantots',
            generic: 'Radās kļūda. Lūdzu, mēģiniet vēlreiz.',
        },
    },

    // Common
    common: {
        loading: 'Notiek ielāde...',
        error: 'Kļūda',
        save: 'Saglabāt',
        cancel: 'Atcelt',
        delete: 'Dzēst',
        confirm: 'Apstiprināt',
        or: 'vai',
    },
}; 