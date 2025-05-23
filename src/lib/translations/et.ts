// src/lib/translations/et.ts
export const et = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Seaded',
        signIn: 'Logi sisse',
        signOut: 'Logi välja',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Araabia',
        bn: 'Bengali',
        bg: 'Bulgaaria',
        zh: 'Hiina',
        hr: 'Horvaadi',
        cs: 'Tšehhi',
        da: 'Taani',
        nl: 'Hollandi',
        en: 'Inglise',
        et: 'Eesti',
        fi: 'Soome',
        fr: 'Prantsuse',
        de: 'Saksa',
        el: 'Kreeka',
        iw: 'Heebrea',
        hi: 'Hindi',
        hu: 'Ungari',
        id: 'Indoneesia',
        it: 'Itaalia',
        ja: 'Jaapani',
        ko: 'Korea',
        lv: 'Läti',
        lt: 'Leedu',
        no: 'Norra',
        pl: 'Poola',
        pt: 'Portugali',
        ro: 'Rumeenia',
        ru: 'Vene',
        sr: 'Serbia',
        sk: 'Slovaki',
        sl: 'Sloveeni',
        es: 'Hispaania',
        sw: 'Suahiili',
        sv: 'Rootsi',
        th: 'Tai',
        tr: 'Türgi',
        uk: 'Ukraina',
        vi: 'Vietnami',
    },

    // Settings page
    settings: {
        title: 'Seaded',
        sections: {
            appearance: 'Välimus',
            apiKeys: 'API võtmed',
            language: 'Keel',
        },
        appearance: {
            theme: 'Teema',
            light: 'Hele',
            dark: 'Tume',
            system: 'Süsteem',
        },
        language: {
            title: 'Keel',
            description: 'Valige eelistatud keel kasutajaliidese jaoks',
            conversationLanguage: 'Vestluskeel',
            conversationLanguageDescription: 'AI vestlustes kasutatav keel vastab teie kasutajaliidese keelele',
        },
        apiKeys: {
            title: 'API võtmed',
            description: 'Hallake oma API võtmeid erinevate AI pakkujate jaoks',
            saved: 'Salvestatud',
            notSet: 'Määramata',
            setKey: 'Määra võti',
            updateKey: 'Uuenda võtit',
            removeKey: 'Eemalda võti',
            getKeyInstructions: 'Hankige oma API võti',
        },
    },

    // Main page
    main: {
        title: 'AI Vestlus',
        setupForm: {
            title: 'Seadistage oma vestlus',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Mudel',
            selectModel: 'Valige mudel',
            tts: {
                title: 'Tekst kõneks',
                enable: 'Luba tekst kõneks',
                provider: 'TTS pakkuja',
                selectProvider: 'Valige TTS pakkuja',
                voice: 'Hääl',
                selectVoice: 'Valige hääl',
                model: 'TTS mudel',
                selectModel: 'Valige TTS mudel',
            },
            startConversation: 'Alusta vestlust',
            conversationPrompt: 'Alustage vestlust.',
        },
        conversation: {
            thinking: 'mõtleb...',
            stop: 'Peata',
            restart: 'Taaskäivita vestlus',
        },
        pricing: {
            estimatedCost: 'Eeldatav maksumus',
            perMillionTokens: 'miljoni märgi kohta',
            input: 'Sisend',
            output: 'Väljund',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Logi sisse Two AIs', // Keep brand name
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Parool',
            signIn: 'Logi sisse',
            signInWithGoogle: 'Logi sisse Google\'ga',
            noAccount: "Kas teil pole kontot?",
            signUp: 'Registreeru',
            forgotPassword: 'Unustasid parooli?',
        },
        signup: {
            title: 'Loo konto',
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Parool (vähemalt 6 tähemärki)',
            signUp: 'Registreeru',
            signUpWithGoogle: 'Registreeru Google\'ga',
            hasAccount: 'Kas teil on juba konto?',
            signIn: 'Logi sisse',
        },
        errors: {
            invalidCredentials: 'Vale e-posti aadress või parool',
            userNotFound: 'Kasutajat ei leitud',
            weakPassword: 'Parool peab olema vähemalt 6 tähemärki pikk',
            emailInUse: 'E-posti aadress on juba kasutusel',
            generic: 'Ilmnes viga. Palun proovi uuesti.',
        },
    },

    // Common
    common: {
        loading: 'Laadimine...',
        error: 'Viga',
        save: 'Salvesta',
        cancel: 'Tühista',
        delete: 'Kustuta',
        confirm: 'Kinnita',
        or: 'või',
    },
}; 