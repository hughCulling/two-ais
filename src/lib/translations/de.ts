// src/lib/translations/de.ts
export const de = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Einstellungen',
        signIn: 'Anmelden',
        signOut: 'Abmelden',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabisch',
        bn: 'Bengalisch',
        bg: 'Bulgarisch',
        zh: 'Chinesisch',
        hr: 'Kroatisch',
        cs: 'Tschechisch',
        da: 'Dänisch',
        nl: 'Niederländisch',
        en: 'Englisch',
        et: 'Estnisch',
        fi: 'Finnisch',
        fr: 'Französisch',
        de: 'Deutsch',
        el: 'Griechisch',
        iw: 'Hebräisch',
        hi: 'Hindi',
        hu: 'Ungarisch',
        id: 'Indonesisch',
        it: 'Italienisch',
        ja: 'Japanisch',
        ko: 'Koreanisch',
        lv: 'Lettisch',
        lt: 'Litauisch',
        no: 'Norwegisch',
        pl: 'Polnisch',
        pt: 'Portugiesisch',
        ro: 'Rumänisch',
        ru: 'Russisch',
        sr: 'Serbisch',
        sk: 'Slowakisch',
        sl: 'Slowenisch',
        es: 'Spanisch',
        sw: 'Swahili',
        sv: 'Schwedisch',
        th: 'Thailändisch',
        tr: 'Türkisch',
        uk: 'Ukrainisch',
        vi: 'Vietnamesisch',
    },

    // Settings page
    settings: {
        title: 'Einstellungen',
        sections: {
            appearance: 'Erscheinungsbild',
            apiKeys: 'API-Schlüssel',
            language: 'Sprache',
        },
        appearance: {
            theme: 'Design',
            light: 'Hell',
            dark: 'Dunkel',
            system: 'System',
        },
        language: {
            title: 'Sprache',
            description: 'Wählen Sie Ihre bevorzugte Sprache für die Benutzeroberfläche',
            conversationLanguage: 'Konversationssprache',
            conversationLanguageDescription: 'Die für KI-Konversationen verwendete Sprache entspricht Ihrer Oberflächensprache',
        },
        apiKeys: {
            title: 'API-Schlüssel',
            description: 'Verwalten Sie Ihre API-Schlüssel für verschiedene KI-Anbieter',
            saved: 'Gespeichert',
            notSet: 'Nicht festgelegt',
            setKey: 'Schlüssel festlegen',
            updateKey: 'Schlüssel aktualisieren',
            removeKey: 'Schlüssel entfernen',
            getKeyInstructions: 'API-Schlüssel erhalten',
        },
    },

    // Main page
    main: {
        title: 'KI-Konversation',
        setupForm: {
            title: 'Konfigurieren Sie Ihre Konversation',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Modell',
            selectModel: 'Modell auswählen',
            tts: {
                title: 'Text-zu-Sprache',
                enable: 'Text-zu-Sprache aktivieren',
                provider: 'TTS-Anbieter',
                selectProvider: 'TTS-Anbieter auswählen',
                voice: 'Stimme',
                selectVoice: 'Stimme auswählen',
                model: 'TTS-Modell',
                selectModel: 'TTS-Modell auswählen',
            },
            startConversation: 'Konversation starten',
            conversationPrompt: 'Beginnen Sie das Gespräch.',
        },
        conversation: {
            thinking: 'denkt nach...',
            stop: 'Stoppen',
            restart: 'Konversation neu starten',
        },
        pricing: {
            estimatedCost: 'Geschätzte Kosten',
            perMillionTokens: 'pro Million Token',
            input: 'Eingabe',
            output: 'Ausgabe',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Bei Two AIs anmelden',
            emailPlaceholder: 'E-Mail',
            passwordPlaceholder: 'Passwort',
            signIn: 'Anmelden',
            signInWithGoogle: 'Mit Google anmelden',
            noAccount: 'Kein Konto?',
            signUp: 'Registrieren',
            forgotPassword: 'Passwort vergessen?',
        },
        signup: {
            title: 'Konto erstellen',
            emailPlaceholder: 'E-Mail',
            passwordPlaceholder: 'Passwort (mindestens 6 Zeichen)',
            signUp: 'Registrieren',
            signUpWithGoogle: 'Mit Google registrieren',
            hasAccount: 'Bereits ein Konto?',
            signIn: 'Anmelden',
        },
        errors: {
            invalidCredentials: 'Ungültige E-Mail oder Passwort',
            userNotFound: 'Benutzer nicht gefunden',
            weakPassword: 'Das Passwort muss mindestens 6 Zeichen lang sein',
            emailInUse: 'E-Mail wird bereits verwendet',
            generic: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        },
    },

    // Common
    common: {
        loading: 'Lädt...',
        error: 'Fehler',
        save: 'Speichern',
        cancel: 'Abbrechen',
        delete: 'Löschen',
        confirm: 'Bestätigen',
        or: 'oder',
    },
}; 