// src/lib/translations/bg.ts
export const bg = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Настройки',
        signIn: 'Вход',
        signOut: 'Изход',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Арабски',
        bn: 'Бенгалски',
        bg: 'Български',
        zh: 'Китайски',
        hr: 'Хърватски',
        cs: 'Чешки',
        da: 'Датски',
        nl: 'Нидерландски',
        en: 'Английски',
        et: 'Естонски',
        fi: 'Фински',
        fr: 'Френски',
        de: 'Немски',
        el: 'Гръцки',
        iw: 'Иврит',
        hi: 'Хинди',
        hu: 'Унгарски',
        id: 'Индонезийски',
        it: 'Италиански',
        ja: 'Японски',
        ko: 'Корейски',
        lv: 'Латвийски',
        lt: 'Литовски',
        no: 'Норвежки',
        pl: 'Полски',
        pt: 'Португалски',
        ro: 'Румънски',
        ru: 'Руски',
        sr: 'Сръбски',
        sk: 'Словашки',
        sl: 'Словенски',
        es: 'Испански',
        sw: 'Суахили',
        sv: 'Шведски',
        th: 'Тайландски',
        tr: 'Турски',
        uk: 'Украински',
        vi: 'Виетнамски',
    },

    // Settings page
    settings: {
        title: 'Настройки',
        sections: {
            appearance: 'Външен вид',
            apiKeys: 'API ключове',
            language: 'Език',
        },
        appearance: {
            theme: 'Тема',
            light: 'Светла',
            dark: 'Тъмна',
            system: 'Системна',
        },
        language: {
            title: 'Език',
            description: 'Изберете предпочитания от вас език за интерфейса',
            conversationLanguage: 'Език на разговора',
            conversationLanguageDescription: 'Езикът, използван за AI разговори, ще съответства на езика на вашия интерфейс',
        },
        apiKeys: {
            title: 'API ключоve',
            description: 'Управлявайте своите API ключове за различни AI доставчици',
            saved: 'Запазено',
            notSet: 'Не е зададено',
            setKey: 'Задайте ключ',
            updateKey: 'Актуализирайте ключ',
            removeKey: 'Премахнете ключ',
            getKeyInstructions: 'Вземете своя API ключ',
        },
    },

    // Main page
    main: {
        title: 'AI Разговор',
        setupForm: {
            title: 'Настройте своя разговор',
            agentA: 'Агент А',
            agentB: 'Агент Б',
            model: 'Модел',
            selectModel: 'Изберете модел',
            tts: {
                title: 'Текст-към-говор',
                enable: 'Активирайте текст-към-говор',
                provider: 'TTS доставчик',
                selectProvider: 'Изберете TTS доставчик',
                voice: 'Глас',
                selectVoice: 'Изберете глас',
                model: 'TTS модел',
                selectModel: 'Изберете TTS модел',
            },
            startConversation: 'Започнете разговор',
            conversationPrompt: 'Започнете разговора.',
        },
        conversation: {
            thinking: 'мисли...',
            stop: 'Спри',
            restart: 'Рестартирайте разговора',
        },
        pricing: {
            estimatedCost: 'Очаквана цена',
            perMillionTokens: 'на милион токени',
            input: 'Вход',
            output: 'Изход',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Влезте в Two AIs', // Keep brand name
            emailPlaceholder: 'Имейл',
            passwordPlaceholder: 'Парола',
            signIn: 'Вход',
            signInWithGoogle: 'Влезте с Google',
            noAccount: "Нямате акаунт?",
            signUp: 'Регистрирайте се',
            forgotPassword: 'Забравена парола?',
        },
        signup: {
            title: 'Създайте акаунт',
            emailPlaceholder: 'Имейл',
            passwordPlaceholder: 'Парола (поне 6 знака)',
            signUp: 'Регистрирайте се',
            signUpWithGoogle: 'Регистрирайте се с Google',
            hasAccount: 'Вече имате акаунт?',
            signIn: 'Вход',
        },
        errors: {
            invalidCredentials: 'Невалиден имейл или парола',
            userNotFound: 'Потребителят не е намерен',
            weakPassword: 'Паролата трябва да е поне 6 знака',
            emailInUse: 'Имейлът вече се използва',
            generic: 'Възникна грешка. Моля, опитайте отново.',
        },
    },

    // Common
    common: {
        loading: 'Зареждане...',
        error: 'Грешка',
        save: 'Запази',
        cancel: 'Отказ',
        delete: 'Изтрий',
        confirm: 'Потвърди',
        or: 'или',
    },
}; 