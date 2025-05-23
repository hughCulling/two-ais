// src/lib/translations/hu.ts
export const hu = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Beállítások',
        signIn: 'Bejelentkezés',
        signOut: 'Kijelentkezés',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arab',
        bn: 'Bengáli',
        bg: 'Bolgár',
        zh: 'Kínai',
        hr: 'Horvát',
        cs: 'Cseh',
        da: 'Dán',
        nl: 'Holland',
        en: 'Angol',
        et: 'Észt',
        fi: 'Finn',
        fr: 'Francia',
        de: 'Német',
        el: 'Görög',
        iw: 'Héber',
        hi: 'Hindi',
        hu: 'Magyar',
        id: 'Indonéz',
        it: 'Olasz',
        ja: 'Japán',
        ko: 'Koreai',
        lv: 'Lett',
        lt: 'Litván',
        no: 'Norvég',
        pl: 'Lengyel',
        pt: 'Portugál',
        ro: 'Román',
        ru: 'Orosz',
        sr: 'Szerb',
        sk: 'Szlovák',
        sl: 'Szlovén',
        es: 'Spanyol',
        sw: 'Szuahéli',
        sv: 'Svéd',
        th: 'Thai',
        tr: 'Török',
        uk: 'Ukrán',
        vi: 'Vietnami',
    },

    // Settings page
    settings: {
        title: 'Beállítások',
        sections: {
            appearance: 'Megjelenés',
            apiKeys: 'API kulcsok',
            language: 'Nyelv',
        },
        appearance: {
            theme: 'Téma',
            light: 'Világos',
            dark: 'Sötét',
            system: 'Rendszer',
        },
        language: {
            title: 'Nyelv',
            description: 'Válassza ki a felület preferált nyelvét',
            conversationLanguage: 'Beszélgetés nyelve',
            conversationLanguageDescription: 'Az AI beszélgetésekhez használt nyelv megegyezik a felület nyelvével',
        },
        apiKeys: {
            title: 'API kulcsok',
            description: 'Kezelje API kulcsait a különböző AI szolgáltatókhoz',
            saved: 'Mentve',
            notSet: 'Nincs beállítva',
            setKey: 'Kulcs beállítása',
            updateKey: 'Kulcs frissítése',
            removeKey: 'Kulcs eltávolítása',
            getKeyInstructions: 'Szerezze be API kulcsát',
        },
    },

    // Main page
    main: {
        title: 'AI Beszélgetés',
        setupForm: {
            title: 'Állítsa be a beszélgetést',
            agentA: 'A ügynök',
            agentB: 'B ügynök',
            model: 'Modell',
            selectModel: 'Válasszon modellt',
            tts: {
                title: 'Szövegfelolvasás',
                enable: 'Szövegfelolvasás engedélyezése',
                provider: 'TTS szolgáltató',
                selectProvider: 'Válasszon TTS szolgáltatót',
                voice: 'Hang',
                selectVoice: 'Válasszon hangot',
                model: 'TTS modell',
                selectModel: 'Válasszon TTS modellt',
            },
            startConversation: 'Beszélgetés indítása',
            conversationPrompt: 'Indítsa el a beszélgetést.',
        },
        conversation: {
            thinking: 'gondolkodik...',
            stop: 'Stop',
            restart: 'Beszélgetés újraindítása',
        },
        pricing: {
            estimatedCost: 'Becsült költség',
            perMillionTokens: 'millió tokenenként',
            input: 'Bemenet',
            output: 'Kimenet',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Bejelentkezés a Two AIs-ba', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Jelszó',
            signIn: 'Bejelentkezés',
            signInWithGoogle: 'Bejelentkezés Google-fiókkal',
            noAccount: "Nincs fiókja?",
            signUp: 'Regisztráció',
            forgotPassword: 'Elfelejtette a jelszavát?',
        },
        signup: {
            title: 'Fiók létrehozása',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Jelszó (legalább 6 karakter)',
            signUp: 'Regisztráció',
            signUpWithGoogle: 'Regisztráció Google-fiókkal',
            hasAccount: 'Már van fiókja?',
            signIn: 'Bejelentkezés',
        },
        errors: {
            invalidCredentials: 'Érvénytelen e-mail cím vagy jelszó',
            userNotFound: 'Felhasználó nem található',
            weakPassword: 'A jelszónak legalább 6 karakter hosszúnak kell lennie',
            emailInUse: 'Az e-mail cím már használatban van',
            generic: 'Hiba történt. Kérjük, próbálja újra.',
        },
    },

    // Common
    common: {
        loading: 'Betöltés...',
        error: 'Hiba',
        save: 'Mentés',
        cancel: 'Mégse',
        delete: 'Törlés',
        confirm: 'Megerősítés',
        or: 'vagy',
    },
}; 