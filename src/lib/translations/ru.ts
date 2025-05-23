// src/lib/translations/ru.ts
export const ru = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Настройки',
        signIn: 'Войти',
        signOut: 'Выйти',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Арабский',
        bn: 'Бенгальский',
        bg: 'Болгарский',
        zh: 'Китайский',
        hr: 'Хорватский',
        cs: 'Чешский',
        da: 'Датский',
        nl: 'Голландский',
        en: 'Английский',
        et: 'Эстонский',
        fi: 'Финский',
        fr: 'Французский',
        de: 'Немецкий',
        el: 'Греческий',
        iw: 'Иврит',
        hi: 'Хинди',
        hu: 'Венгерский',
        id: 'Индонезийский',
        it: 'Итальянский',
        ja: 'Японский',
        ko: 'Корейский',
        lv: 'Латышский',
        lt: 'Литовский',
        no: 'Норвежский',
        pl: 'Польский',
        pt: 'Португальский',
        ro: 'Румынский',
        ru: 'Русский',
        sr: 'Сербский',
        sk: 'Словацкий',
        sl: 'Словенский',
        es: 'Испанский',
        sw: 'Суахили',
        sv: 'Шведский',
        th: 'Тайский',
        tr: 'Турецкий',
        uk: 'Украинский',
        vi: 'Вьетнамский',
    },

    // Settings page
    settings: {
        title: 'Настройки',
        sections: {
            appearance: 'Внешний вид',
            apiKeys: 'Ключи API',
            language: 'Язык',
        },
        appearance: {
            theme: 'Тема',
            light: 'Светлая',
            dark: 'Темная',
            system: 'Системная',
        },
        language: {
            title: 'Язык',
            description: 'Выберите предпочитаемый язык интерфейса',
            conversationLanguage: 'Язык беседы',
            conversationLanguageDescription: 'Язык, используемый для разговоров с ИИ, будет соответствовать языку вашего интерфейса',
        },
        apiKeys: {
            title: 'Ключи API',
            description: 'Управляйте своими ключами API для различных поставщиков ИИ',
            saved: 'Сохранено',
            notSet: 'Не установлено',
            setKey: 'Установить ключ',
            updateKey: 'Обновить ключ',
            removeKey: 'Удалить ключ',
            getKeyInstructions: 'Получить свой ключ API',
        },
    },

    // Main page
    main: {
        title: 'Беседа с ИИ',
        setupForm: {
            title: 'Настройте вашу беседу',
            agentA: 'Агент А',
            agentB: 'Агент Б',
            model: 'Модель',
            selectModel: 'Выберите модель',
            tts: {
                title: 'Преобразование текста в речь',
                enable: 'Включить преобразование текста в речь',
                provider: 'Поставщик TTS',
                selectProvider: 'Выберите поставщика TTS',
                voice: 'Голос',
                selectVoice: 'Выберите голос',
                model: 'Модель TTS',
                selectModel: 'Выберите модель TTS',
            },
            startConversation: 'Начать беседу',
            conversationPrompt: 'Начать беседу.',
        },
        conversation: {
            thinking: 'думает...',
            stop: 'Остановить',
            restart: 'Начать беседу заново',
        },
        pricing: {
            estimatedCost: 'Ориентировочная стоимость',
            perMillionTokens: 'за миллион токенов',
            input: 'Вход',
            output: 'Выход',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Войти в Two AIs', // Keep brand name
            emailPlaceholder: 'Электронная почта',
            passwordPlaceholder: 'Пароль',
            signIn: 'Войти',
            signInWithGoogle: 'Войти через Google',
            noAccount: "Нет учетной записи?",
            signUp: 'Зарегистрироваться',
            forgotPassword: 'Забыли пароль?',
        },
        signup: {
            title: 'Создать учетную запись',
            emailPlaceholder: 'Электронная почта',
            passwordPlaceholder: 'Пароль (не менее 6 символов)',
            signUp: 'Зарегистрироваться',
            signUpWithGoogle: 'Зарегистрироваться через Google',
            hasAccount: 'Уже есть учетная запись?',
            signIn: 'Войти',
        },
        errors: {
            invalidCredentials: 'Неверный адрес электронной почты или пароль',
            userNotFound: 'Пользователь не найден',
            weakPassword: 'Пароль должен содержать не менее 6 символов',
            emailInUse: 'Адрес электронной почты уже используется',
            generic: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
        },
    },

    // Common
    common: {
        loading: 'Загрузка...',
        error: 'Ошибка',
        save: 'Сохранить',
        cancel: 'Отмена',
        delete: 'Удалить',
        confirm: 'Подтвердить',
        or: 'или',
    },
}; 