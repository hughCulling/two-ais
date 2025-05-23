// src/lib/translations/sk.ts
export const sk = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Nastavenia',
        signIn: 'Prihlásiť sa',
        signOut: 'Odhlásiť sa',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabčina',
        bn: 'Bengálčina',
        bg: 'Bulharčina',
        zh: 'Čínština',
        hr: 'Chorvátčina',
        cs: 'Čeština',
        da: 'Dánčina',
        nl: 'Holandčina',
        en: 'Angličtina',
        et: 'Estónčina',
        fi: 'Fínčina',
        fr: 'Francúzština',
        de: 'Nemčina',
        el: 'Gréčtina',
        iw: 'Hebrejčina',
        hi: 'Hindčina',
        hu: 'Maďarčina',
        id: 'Indonézština',
        it: 'Taliančina',
        ja: 'Japončina',
        ko: 'Kórejčina',
        lv: 'Lotyština',
        lt: 'Litovčina',
        no: 'Nórčina',
        pl: 'Poľština',
        pt: 'Portugalčina',
        ro: 'Rumunčina',
        ru: 'Ruština',
        sr: 'Srbčina',
        sk: 'Slovenčina',
        sl: 'Slovinčina',
        es: 'Španielčina',
        sw: 'Svahilčina',
        sv: 'Švédčina',
        th: 'Thajčina',
        tr: 'Turečtina',
        uk: 'Ukrajinčina',
        vi: 'Vietnamčina',
    },

    // Settings page
    settings: {
        title: 'Nastavenia',
        sections: {
            appearance: 'Vzhľad',
            apiKeys: 'API kľúče',
            language: 'Jazyk',
        },
        appearance: {
            theme: 'Téma',
            light: 'Svetlá',
            dark: 'Tmavá',
            system: 'Systémová',
        },
        language: {
            title: 'Jazyk',
            description: 'Vyberte preferovaný jazyk pre rozhranie',
            conversationLanguage: 'Jazyk konverzácie',
            conversationLanguageDescription: 'Jazyk používaný pre konverzácie s AI bude zodpovedať jazyku vášho rozhrania',
        },
        apiKeys: {
            title: 'API kľúče',
            description: 'Spravujte svoje API kľúče pre rôznych poskytovateľov AI',
            saved: 'Uložené',
            notSet: 'Nenastavené',
            setKey: 'Nastaviť kľúč',
            updateKey: 'Aktualizovať kľúč',
            removeKey: 'Odstrániť kľúč',
            getKeyInstructions: 'Získajte svoj API kľúč',
        },
    },

    // Main page
    main: {
        title: 'Konverzácia s AI',
        setupForm: {
            title: 'Nastavte si konverzáciu',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Vyberte model',
            tts: {
                title: 'Prevod textu na reč',
                enable: 'Povoliť prevod textu na reč',
                provider: 'Poskytovateľ TTS',
                selectProvider: 'Vyberte poskytovateľa TTS',
                voice: 'Hlas',
                selectVoice: 'Vyberte hlas',
                model: 'Model TTS',
                selectModel: 'Vyberte model TTS',
            },
            startConversation: 'Začať konverzáciu',
            conversationPrompt: 'Začnite konverzáciu.',
        },
        conversation: {
            thinking: 'rozmýšľa...',
            stop: 'Zastaviť',
            restart: 'Reštartovať konverzáciu',
        },
        pricing: {
            estimatedCost: 'Odhadované náklady',
            perMillionTokens: 'na milión tokenov',
            input: 'Vstup',
            output: 'Výstup',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Prihlásiť sa do Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Heslo',
            signIn: 'Prihlásiť sa',
            signInWithGoogle: 'Prihlásiť sa cez Google',
            noAccount: "Nemáte účet?",
            signUp: 'Zaregistrovať sa',
            forgotPassword: 'Zabudli ste heslo?',
        },
        signup: {
            title: 'Vytvoriť účet',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Heslo (aspoň 6 znakov)',
            signUp: 'Zaregistrovať sa',
            signUpWithGoogle: 'Zaregistrovať sa cez Google',
            hasAccount: 'Máte už účet?',
            signIn: 'Prihlásiť sa',
        },
        errors: {
            invalidCredentials: 'Neplatný e-mail alebo heslo',
            userNotFound: 'Používateľ sa nenašiel',
            weakPassword: 'Heslo musí mať aspoň 6 znakov',
            emailInUse: 'E-mail sa už používa',
            generic: 'Vyskytla sa chyba. Skúste to znova.',
        },
    },

    // Common
    common: {
        loading: 'Načítava sa...',
        error: 'Chyba',
        save: 'Uložiť',
        cancel: 'Zrušiť',
        delete: 'Odstrániť',
        confirm: 'Potvrdiť',
        or: 'alebo',
    },
}; 