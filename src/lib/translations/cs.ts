// src/lib/translations/cs.ts
export const cs = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Nastavení',
        signIn: 'Přihlásit se',
        signOut: 'Odhlásit se',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabština',
        bn: 'Bengálština',
        bg: 'Bulharština',
        zh: 'Čínština',
        hr: 'Chorvatština',
        cs: 'Čeština',
        da: 'Dánština',
        nl: 'Nizozemština',
        en: 'Angličtina',
        et: 'Estonština',
        fi: 'Finština',
        fr: 'Francouzština',
        de: 'Němčina',
        el: 'Řečtina',
        iw: 'Hebrejština',
        hi: 'Hindština',
        hu: 'Maďarština',
        id: 'Indonéština',
        it: 'Italština',
        ja: 'Japonština',
        ko: 'Korejština',
        lv: 'Lotyština',
        lt: 'Litevština',
        no: 'Norština',
        pl: 'Polština',
        pt: 'Portugalština',
        ro: 'Rumunština',
        ru: 'Ruština',
        sr: 'Srbština',
        sk: 'Slovenština',
        sl: 'Slovinština',
        es: 'Španělština',
        sw: 'Svahilština',
        sv: 'Švédština',
        th: 'Thajština',
        tr: 'Turečtina',
        uk: 'Ukrajinština',
        vi: 'Vietnamština',
    },

    // Settings page
    settings: {
        title: 'Nastavení',
        sections: {
            appearance: 'Vzhled',
            apiKeys: 'API klíče',
            language: 'Jazyk',
        },
        appearance: {
            theme: 'Motiv',
            light: 'Světlý',
            dark: 'Tmavý',
            system: 'Systémový',
        },
        language: {
            title: 'Jazyk',
            description: 'Vyberte preferovaný jazyk pro rozhraní',
            conversationLanguage: 'Jazyk konverzace',
            conversationLanguageDescription: 'Jazyk používaný pro konverzace s AI bude odpovídat jazyku vašeho rozhraní',
        },
        apiKeys: {
            title: 'API klíče',
            description: 'Spravujte své API klíče pro různé poskytovatele AI',
            saved: 'Uloženo',
            notSet: 'Nenastaveno',
            setKey: 'Nastavit klíč',
            updateKey: 'Aktualizovat klíč',
            removeKey: 'Odebrat klíč',
            getKeyInstructions: 'Získejte svůj API klíč',
        },
    },

    // Main page
    main: {
        title: 'Konverzace s AI',
        setupForm: {
            title: 'Nastavte si konverzaci',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Vyberte model',
            tts: {
                title: 'Převod textu na řeč',
                enable: 'Povolit převod textu na řeč',
                provider: 'Poskytovatel TTS',
                selectProvider: 'Vyberte poskytovatele TTS',
                voice: 'Hlas',
                selectVoice: 'Vyberte hlas',
                model: 'Model TTS',
                selectModel: 'Vyberte model TTS',
            },
            startConversation: 'Zahájit konverzaci',
            conversationPrompt: 'Zahajte konverzaci.',
        },
        conversation: {
            thinking: 'přemýšlí...',
            stop: 'Zastavit',
            restart: 'Restartovat konverzaci',
        },
        pricing: {
            estimatedCost: 'Odhadované náklady',
            perMillionTokens: 'za milion tokenů',
            input: 'Vstup',
            output: 'Výstup',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Přihlásit se k Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Heslo',
            signIn: 'Přihlásit se',
            signInWithGoogle: 'Přihlásit se přes Google',
            noAccount: "Nemáte účet?",
            signUp: 'Zaregistrovat se',
            forgotPassword: 'Zapomenuté heslo?',
        },
        signup: {
            title: 'Vytvořit účet',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Heslo (alespoň 6 znaků)',
            signUp: 'Zaregistrovat se',
            signUpWithGoogle: 'Zaregistrovat se přes Google',
            hasAccount: 'Máte již účet?',
            signIn: 'Přihlásit se',
        },
        errors: {
            invalidCredentials: 'Neplatný e-mail nebo heslo',
            userNotFound: 'Uživatel nenalezen',
            weakPassword: 'Heslo musí mít alespoň 6 znaků',
            emailInUse: 'E-mail je již používán',
            generic: 'Došlo k chybě. Zkuste to prosím znovu.',
        },
    },

    // Common
    common: {
        loading: 'Načítání...',
        error: 'Chyba',
        save: 'Uložit',
        cancel: 'Zrušit',
        delete: 'Smazat',
        confirm: 'Potvrdit',
        or: 'nebo',
    },
}; 