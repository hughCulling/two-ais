// src/lib/translations/ro.ts
export const ro = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Setări',
        signIn: 'Conectare',
        signOut: 'Deconectare',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabă',
        bn: 'Bengali',
        bg: 'Bulgară',
        zh: 'Chineză',
        hr: 'Croată',
        cs: 'Cehă',
        da: 'Daneză',
        nl: 'Olandeză',
        en: 'Engleză',
        et: 'Estonă',
        fi: 'Finlandeză',
        fr: 'Franceză',
        de: 'Germană',
        el: 'Greacă',
        iw: 'Ebraică',
        hi: 'Hindi',
        hu: 'Maghiară',
        id: 'Indoneziană',
        it: 'Italiană',
        ja: 'Japoneză',
        ko: 'Coreeană',
        lv: 'Letonă',
        lt: 'Lituaniană',
        no: 'Norvegiană',
        pl: 'Poloneză',
        pt: 'Portugheză',
        ro: 'Română',
        ru: 'Rusă',
        sr: 'Sârbă',
        sk: 'Slovacă',
        sl: 'Slovenă',
        es: 'Spaniolă',
        sw: 'Swahili',
        sv: 'Suedeză',
        th: 'Thailandeză',
        tr: 'Turcă',
        uk: 'Ucraineană',
        vi: 'Vietnameză',
    },

    // Settings page
    settings: {
        title: 'Setări',
        sections: {
            appearance: 'Aspect',
            apiKeys: 'Chei API',
            language: 'Limbă',
        },
        appearance: {
            theme: 'Temă',
            light: 'Luminos',
            dark: 'Întunecat',
            system: 'Sistem',
        },
        language: {
            title: 'Limbă',
            description: 'Alegeți limba preferată pentru interfață',
            conversationLanguage: 'Limba conversației',
            conversationLanguageDescription: 'Limba utilizată pentru conversațiile AI se va potrivi cu limba interfeței dvs.',
        },
        apiKeys: {
            title: 'Chei API',
            description: 'Gestionați-vă cheile API pentru diferiți furnizori AI',
            saved: 'Salvat',
            notSet: 'Nu este setat',
            setKey: 'Setează cheia',
            updateKey: 'Actualizează cheia',
            removeKey: 'Elimină cheia',
            getKeyInstructions: 'Obțineți cheia API',
        },
    },

    // Main page
    main: {
        title: 'Conversație AI',
        setupForm: {
            title: 'Configurați-vă conversația',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Selectați un model',
            tts: {
                title: 'Text-în-Vorbire',
                enable: 'Activați Text-în-Vorbire',
                provider: 'Furnizor TTS',
                selectProvider: 'Selectați furnizorul TTS',
                voice: 'Voce',
                selectVoice: 'Selectați vocea',
                model: 'Model TTS',
                selectModel: 'Selectați modelul TTS',
            },
            startConversation: 'Începe conversația',
            conversationPrompt: 'Începeți conversația.',
        },
        conversation: {
            thinking: 'gândește...',
            stop: 'Oprește',
            restart: 'Repornește conversația',
        },
        pricing: {
            estimatedCost: 'Cost estimat',
            perMillionTokens: 'pe milion de jetoane',
            input: 'Intrare',
            output: 'Ieșire',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Conectați-vă la Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Parolă',
            signIn: 'Conectare',
            signInWithGoogle: 'Conectați-vă cu Google',
            noAccount: "Nu aveți cont?",
            signUp: 'Înregistrare',
            forgotPassword: 'Ați uitat parola?',
        },
        signup: {
            title: 'Creați un cont',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Parolă (cel puțin 6 caractere)',
            signUp: 'Înregistrare',
            signUpWithGoogle: 'Înregistrați-vă cu Google',
            hasAccount: 'Aveți deja un cont?',
            signIn: 'Conectare',
        },
        errors: {
            invalidCredentials: 'Email sau parolă incorecte',
            userNotFound: 'Utilizator negăsit',
            weakPassword: 'Parola trebuie să conțină cel puțin 6 caractere',
            emailInUse: 'Emailul este deja utilizat',
            generic: 'A apărut o eroare. Vă rugăm să încercați din nou.',
        },
    },

    // Common
    common: {
        loading: 'Se încarcă...',
        error: 'Eroare',
        save: 'Salvează',
        cancel: 'Anulează',
        delete: 'Șterge',
        confirm: 'Confirmă',
        or: 'sau',
    },
}; 