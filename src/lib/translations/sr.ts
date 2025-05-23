// src/lib/translations/sr.ts
export const sr = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Подешавања',
        signIn: 'Пријава',
        signOut: 'Одјава',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Арапски',
        bn: 'Бенгалски',
        bg: 'Бугарски',
        zh: 'Кинески',
        hr: 'Хрватски',
        cs: 'Чешки',
        da: 'Дански',
        nl: 'Холандски',
        en: 'Енглески',
        et: 'Естонски',
        fi: 'Фински',
        fr: 'Француски',
        de: 'Немачки',
        el: 'Грчки',
        iw: 'Хебрејски',
        hi: 'Хинди',
        hu: 'Мађарски',
        id: 'Индонежански',
        it: 'Италијански',
        ja: 'Јапански',
        ko: 'Корејски',
        lv: 'Летонки',
        lt: 'Литвански',
        no: 'Норвешки',
        pl: 'Пољски',
        pt: 'Португалски',
        ro: 'Румунски',
        ru: 'Руски',
        sr: 'Српски',
        sk: 'Словачки',
        sl: 'Словеначки',
        es: 'Шпански',
        sw: 'Свахили',
        sv: 'Шведски',
        th: 'Тајландски',
        tr: 'Турски',
        uk: 'Украјински',
        vi: 'Вијетнамски',
    },

    // Settings page
    settings: {
        title: 'Подешавања',
        sections: {
            appearance: 'Изглед',
            apiKeys: 'АПИ кључеви',
            language: 'Језик',
        },
        appearance: {
            theme: 'Тема',
            light: 'Светла',
            dark: 'Тамна',
            system: 'Систем',
        },
        language: {
            title: 'Језик',
            description: 'Изаберите жељени језик за интерфејс',
            conversationLanguage: 'Језик разговора',
            conversationLanguageDescription: 'Језик који се користи за АИ разговоре ће одговарати језику вашег интерфејса',
        },
        apiKeys: {
            title: 'АПИ кључеви',
            description: 'Управљајте својим АПИ кључевима за различите АИ провајдере',
            saved: 'Сачувано',
            notSet: 'Није постављено',
            setKey: 'Постави кључ',
            updateKey: 'Ажурирај кључ',
            removeKey: 'Уклони кључ',
            getKeyInstructions: 'Преузмите свој АПИ кључ',
        },
    },

    // Main page
    main: {
        title: 'АИ Разговор',
        setupForm: {
            title: 'Подесите свој разговор',
            agentA: 'Агент А',
            agentB: 'Агент Б',
            model: 'Модел',
            selectModel: 'Изаберите модел',
            tts: {
                title: 'Текст у говор',
                enable: 'Омогући текст у говор',
                provider: 'ТТС провајдер',
                selectProvider: 'Изаберите ТТС провајдера',
                voice: 'Глас',
                selectVoice: 'Изаберите глас',
                model: 'ТТС модел',
                selectModel: 'Изаберите ТТС модел',
            },
            startConversation: 'Започни разговор',
            conversationPrompt: 'Започните разговор.',
        },
        conversation: {
            thinking: 'размишља...',
            stop: 'Заустави',
            restart: 'Поново покрени разговор',
        },
        pricing: {
            estimatedCost: 'Процењени трошак',
            perMillionTokens: 'по милиону токена',
            input: 'Унос',
            output: 'Излаз',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Пријавите се на Two AIs', // Keep brand name
            emailPlaceholder: 'Имејл',
            passwordPlaceholder: 'Лозинка',
            signIn: 'Пријава',
            signInWithGoogle: 'Пријавите се преко Гоогле-а',
            noAccount: "Немате налог?",
            signUp: 'Региструјте се',
            forgotPassword: 'Заборављена лозинка?',
        },
        signup: {
            title: 'Креирајте налог',
            emailPlaceholder: 'Имејл',
            passwordPlaceholder: 'Лозинка (најмање 6 знакова)',
            signUp: 'Региструјте се',
            signUpWithGoogle: 'Региструјте се преко Гоогле-а',
            hasAccount: 'Већ имате налог?',
            signIn: 'Пријава',
        },
        errors: {
            invalidCredentials: 'Неважећи имејл или лозинка',
            userNotFound: 'Корисник није пронађен',
            weakPassword: 'Лозинка мора имати најмање 6 знакова',
            emailInUse: 'Имејл се већ користи',
            generic: 'Догодила се грешка. Покушајте поново.',
        },
    },

    // Common
    common: {
        loading: 'Учитавање...',
        error: 'Грешка',
        save: 'Сачувај',
        cancel: 'Откажи',
        delete: 'Обриши',
        confirm: 'Потврди',
        or: 'или',
    },
}; 