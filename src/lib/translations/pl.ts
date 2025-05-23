// src/lib/translations/pl.ts
export const pl = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Ustawienia',
        signIn: 'Zaloguj się',
        signOut: 'Wyloguj się',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabski',
        bn: 'Bengalski',
        bg: 'Bułgarski',
        zh: 'Chiński',
        hr: 'Chorwacki',
        cs: 'Czeski',
        da: 'Duński',
        nl: 'Holenderski',
        en: 'Angielski',
        et: 'Estoński',
        fi: 'Fiński',
        fr: 'Francuski',
        de: 'Niemiecki',
        el: 'Grecki',
        iw: 'Hebrajski',
        hi: 'Hinduski',
        hu: 'Węgierski',
        id: 'Indonezyjski',
        it: 'Włoski',
        ja: 'Japoński',
        ko: 'Koreański',
        lv: 'Łotewski',
        lt: 'Litewski',
        no: 'Norweski',
        pl: 'Polski',
        pt: 'Portugalski',
        ro: 'Rumuński',
        ru: 'Rosyjski',
        sr: 'Serbski',
        sk: 'Słowacki',
        sl: 'Słoweński',
        es: 'Hiszpański',
        sw: 'Suahili',
        sv: 'Szwedzki',
        th: 'Tajski',
        tr: 'Turecki',
        uk: 'Ukraiński',
        vi: 'Wietnamski',
    },

    // Settings page
    settings: {
        title: 'Ustawienia',
        sections: {
            appearance: 'Wygląd',
            apiKeys: 'Klucze API',
            language: 'Język',
        },
        appearance: {
            theme: 'Motyw',
            light: 'Jasny',
            dark: 'Ciemny',
            system: 'Systemowy',
        },
        language: {
            title: 'Język',
            description: 'Wybierz preferowany język interfejsu',
            conversationLanguage: 'Język rozmowy',
            conversationLanguageDescription: 'Język używany do rozmów AI będzie odpowiadał językowi interfejsu',
        },
        apiKeys: {
            title: 'Klucze API',
            description: 'Zarządzaj swoimi kluczami API dla różnych dostawców AI',
            saved: 'Zapisano',
            notSet: 'Nie ustawiono',
            setKey: 'Ustaw klucz',
            updateKey: 'Zaktualizuj klucz',
            removeKey: 'Usuń klucz',
            getKeyInstructions: 'Pobierz swój klucz API',
        },
    },

    // Main page
    main: {
        title: 'Rozmowa AI',
        setupForm: {
            title: 'Skonfiguruj swoją rozmowę',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Wybierz model',
            tts: {
                title: 'Tekst na mowę',
                enable: 'Włącz tekst na mowę',
                provider: 'Dostawca TTS',
                selectProvider: 'Wybierz dostawcę TTS',
                voice: 'Głos',
                selectVoice: 'Wybierz głos',
                model: 'Model TTS',
                selectModel: 'Wybierz model TTS',
            },
            startConversation: 'Rozpocznij rozmowę',
            conversationPrompt: 'Rozpocznij rozmowę.',
        },
        conversation: {
            thinking: 'myśli...',
            stop: 'Zatrzymaj',
            restart: 'Zacznij rozmowę od nowa',
        },
        pricing: {
            estimatedCost: 'Szacowany koszt',
            perMillionTokens: 'za milion tokenów',
            input: 'Wejście',
            output: 'Wyjście',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Zaloguj się do Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Hasło',
            signIn: 'Zaloguj się',
            signInWithGoogle: 'Zaloguj się przez Google',
            noAccount: "Nie masz konta?",
            signUp: 'Zarejestruj się',
            forgotPassword: 'Zapomniałeś hasła?',
        },
        signup: {
            title: 'Utwórz konto',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Hasło (co najmniej 6 znaków)',
            signUp: 'Zarejestruj się',
            signUpWithGoogle: 'Zarejestruj się przez Google',
            hasAccount: 'Masz już konto?',
            signIn: 'Zaloguj się',
        },
        errors: {
            invalidCredentials: 'Nieprawidłowy adres e-mail lub hasło',
            userNotFound: 'Użytkownik nie znaleziony',
            weakPassword: 'Hasło musi mieć co najmniej 6 znaków',
            emailInUse: 'Adres e-mail jest już używany',
            generic: 'Wystąpił błąd. Spróbuj ponownie.',
        },
    },

    // Common
    common: {
        loading: 'Ładowanie...',
        error: 'Błąd',
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usuń',
        confirm: 'Potwierdź',
        or: 'lub',
    },
}; 