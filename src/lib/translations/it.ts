// src/lib/translations/it.ts
export const it = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Impostazioni',
        signIn: 'Accedi',
        signOut: 'Esci',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabo',
        bn: 'Bengalese',
        bg: 'Bulgaro',
        zh: 'Cinese',
        hr: 'Croato',
        cs: 'Ceco',
        da: 'Danese',
        nl: 'Olandese',
        en: 'Inglese',
        et: 'Estone',
        fi: 'Finlandese',
        fr: 'Francese',
        de: 'Tedesco',
        el: 'Greco',
        iw: 'Ebraico',
        hi: 'Hindi',
        hu: 'Ungherese',
        id: 'Indonesiano',
        it: 'Italiano',
        ja: 'Giapponese',
        ko: 'Coreano',
        lv: 'Lettone',
        lt: 'Lituano',
        no: 'Norvegese',
        pl: 'Polacco',
        pt: 'Portoghese',
        ro: 'Rumeno',
        ru: 'Russo',
        sr: 'Serbo',
        sk: 'Slovacco',
        sl: 'Sloveno',
        es: 'Spagnolo',
        sw: 'Swahili',
        sv: 'Svedese',
        th: 'Thailandese',
        tr: 'Turco',
        uk: 'Ucraino',
        vi: 'Vietnamita',
    },

    // Settings page
    settings: {
        title: 'Impostazioni',
        sections: {
            appearance: 'Aspetto',
            apiKeys: 'Chiavi API',
            language: 'Lingua',
        },
        appearance: {
            theme: 'Tema',
            light: 'Chiaro',
            dark: 'Scuro',
            system: 'Sistema',
        },
        language: {
            title: 'Lingua',
            description: 'Scegli la tua lingua preferita per l\'interfaccia',
            conversationLanguage: 'Lingua della conversazione',
            conversationLanguageDescription: 'La lingua utilizzata per le conversazioni AI corrisponderà alla lingua della tua interfaccia',
        },
        apiKeys: {
            title: 'Chiavi API',
            description: 'Gestisci le tue chiavi API per diversi fornitori di IA',
            saved: 'Salvata',
            notSet: 'Non impostata',
            setKey: 'Imposta chiave',
            updateKey: 'Aggiorna chiave',
            removeKey: 'Rimuovi chiave',
            getKeyInstructions: 'Ottieni la tua chiave API',
        },
    },

    // Main page
    main: {
        title: 'Conversazione AI',
        setupForm: {
            title: 'Imposta la tua conversazione',
            agentA: 'Agente A',
            agentB: 'Agente B',
            model: 'Modello',
            selectModel: 'Seleziona un modello',
            tts: {
                title: 'Sintesi vocale',
                enable: 'Abilita sintesi vocale',
                provider: 'Provider TTS',
                selectProvider: 'Seleziona provider TTS',
                voice: 'Voce',
                selectVoice: 'Seleziona voce',
                model: 'Modello TTS',
                selectModel: 'Seleziona modello TTS',
            },
            startConversation: 'Inizia conversazione',
            conversationPrompt: 'Inizia la conversazione.',
        },
        conversation: {
            thinking: 'sta pensando...',
            stop: 'Ferma',
            restart: 'Riavvia conversazione',
        },
        pricing: {
            estimatedCost: 'Costo stimato',
            perMillionTokens: 'per milione di token',
            input: 'Input',
            output: 'Output',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Accedi a Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Password',
            signIn: 'Accedi',
            signInWithGoogle: 'Accedi con Google',
            noAccount: "Non hai un account?",
            signUp: 'Registrati',
            forgotPassword: 'Password dimenticata?',
        },
        signup: {
            title: 'Crea un account',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Password (almeno 6 caratteri)',
            signUp: 'Registrati',
            signUpWithGoogle: 'Registrati con Google',
            hasAccount: 'Hai già un account?',
            signIn: 'Accedi',
        },
        errors: {
            invalidCredentials: 'Email o password non validi',
            userNotFound: 'Utente non trovato',
            weakPassword: 'La password deve contenere almeno 6 caratteri',
            emailInUse: 'Email già in uso',
            generic: 'Si è verificato un errore. Riprova.',
        },
    },

    // Common
    common: {
        loading: 'Caricamento...',
        error: 'Errore',
        save: 'Salva',
        cancel: 'Annulla',
        delete: 'Elimina',
        confirm: 'Conferma',
        or: 'o',
    },
}; 