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
        ar: 'Arabic',
        bn: 'Bengali',
        bg: 'Bulgarian',
        zh: 'Chinese',
        hr: 'Croatian',
        cs: 'Czech',
        da: 'Danish',
        nl: 'Dutch',
        en: 'English',
        et: 'Estonian',
        fi: 'Finnish',
        fr: 'French',
        de: 'German',
        el: 'Greek',
        iw: 'Hebrew',
        hi: 'Hindi',
        hu: 'Hungarian',
        id: 'Indonesian',
        it: 'Italian',
        ja: 'Japanese',
        ko: 'Korean',
        lv: 'Latvian',
        lt: 'Lithuanian',
        no: 'Norwegian',
        pl: 'Polish',
        pt: 'Portuguese',
        ro: 'Romanian',
        ru: 'Russian',
        sr: 'Serbian',
        sk: 'Slovak',
        sl: 'Slovenian',
        es: 'Spanish',
        sw: 'Swahili',
        sv: 'Swedish',
        th: 'Thai',
        tr: 'Turkish',
        uk: 'Ukrainian',
        vi: 'Vietnamese',
        mt: 'Maltese',
        bs: 'Bosnian',
        ca: 'Catalan',
        gu: 'Gujarati',
        hy: 'Armenian',
        is: 'Icelandic',
        ka: 'Georgian',
        kk: 'Kazakh',
        kn: 'Kannada',
        mk: 'Macedonian',
        ml: 'Malayalam',
        mr: 'Marathi',
        ms: 'Malay',
        my: 'Burmese',
        pa: 'Punjabi',
        so: 'Somali',
        sq: 'Albanian',
        ta: 'Tamil',
        te: 'Telugu',
        tl: 'Tagalog',
        ur: 'Urdu',
        am: 'Amharic',
        mn: 'Mongolian',
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
            description: "Настройте внешний вид и возможности приложения."
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
            getKeyInstructions: 'Получите свой API-ключ',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Новые ключи API для сохранения не введены.",
            unexpectedResponse: "Получен непредвиденный ответ от сервера.",
            failedToSaveKey: "Не удалось сохранить ключ {serviceName}.",
            someKeysNotSaved: "Некоторые ключи API не удалось сохранить. Пожалуйста, проверьте детали ниже.",
            keyStatus: "статус ключа...",
            apiKeySecurelySaved: "Ключ API надежно сохранен",
            confirmRemoveTitle: "Подтвердить удаление",
            confirmRemoveDescription: "Вы уверены, что хотите удалить ключ API для {serviceName}? Это действие нельзя отменить.",
            failedToRemoveKey: "Не удалось удалить ключ {serviceName}.",
            successfullyRemovedKey: "Ключ {serviceName} успешно удален.",
            keyNotSet: "Статус ключа: Не установлен",
            keySet: "Статус ключа: Установлен",
            saveButton: "Сохранить ключ(и) API"
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
            orContinueWith: "Или продолжить с",
            signingIn: "Вход..."
        },
        signup: {
            title: 'Создать учетную запись',
            emailPlaceholder: 'Электронная почта',
            passwordPlaceholder: 'Пароль (не менее 6 символов)',
            signUp: 'Зарегистрироваться',
            signUpWithGoogle: 'Зарегистрироваться через Google',
            hasAccount: 'Уже есть учетная запись?',
            signIn: 'Войти',
            emailLabel: "Адрес электронной почты",
            confirmPasswordPlaceholder: "Подтвердите пароль",
            signingUp: "Регистрация..."
        },
        errors: {
            invalidCredentials: 'Неверный адрес электронной почты или пароль',
            userNotFound: 'Пользователь не найден',
            weakPassword: 'Пароль должен содержать не менее 6 символов',
            emailInUse: 'Адрес электронной почты уже используется',
            generic: 'Произошла ошибка. Пожалуйста, попробуйте еще раз.',
            initialization: "Ошибка инициализации. Пожалуйста, попробуйте позже.",
            invalidEmail: "Пожалуйста, введите действительный адрес электронной почты.",
            tooManyRequests: "Доступ временно отключен из-за слишком большого количества неудачных попыток входа. Пожалуйста, сбросьте пароль или попробуйте позже.",
            signInFailedPrefix: "Ошибка входа: ",
            unknownSignInError: "Произошла неизвестная ошибка при входе.",
            profileSaveFailedPrefix: "Вход выполнен, но не удалось сохранить данные профиля: ",
            profileCheckSaveFailedPrefix: "Вход выполнен, но не удалось проверить/сохранить данные профиля: ",
            accountExistsWithDifferentCredential: "Учетная запись с этим адресом электронной почты уже существует с другим методом входа.",
            googleSignInFailedPrefix: "Ошибка входа через Google: ",
            unknownGoogleSignInError: "Произошла неизвестная ошибка при входе через Google.",
            passwordsDoNotMatch: "Пароли не совпадают.",
            accountCreatedProfileSaveFailedPrefix: "Учетная запись создана, но не удалось сохранить данные профиля: ",
            unknownProfileSaveError: "Произошла неизвестная ошибка при сохранении профиля.",
            emailAlreadyRegistered: "Этот адрес электронной почты уже зарегистрирован.",
            passwordTooShortSignUp: "Пароль должен содержать не менее 6 символов.",
            signUpFailedPrefix: "Ошибка регистрации: ",
            unknownSignUpError: "Произошла неизвестная ошибка при регистрации."
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
        MoreInformation: "Дополнительная информация",
        Example: "Пример:",
        ShowMore: "Показать больше",
        ShowLess: "Показать меньше",
        AwaitingApproval: "Ожидание одобрения...",
        OpenInNewTab: "Открыть в новой вкладке",
        AdvancedSettings: "Расширенные настройки",
        Name: "Имя",
        Created: "Создано",
        Updated: "Обновлено",
        Launched: "Запущено",
        Docs: "Документация",
        Blog: "Блог",
        Pricing: "Цены",
        Terms: "Условия",
        Privacy: "Конфиденциальность",
        Changelog: "Журнал изменений",
        Copy: "Копировать",
        Copied: "Скопировано",
        TryAgain: "Попробовать еще раз"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Отсутствует API-ключ",
    apiKeyMissingSubtext: "API-ключ для этого провайдера отсутствует или недействителен. Пожалуйста, добавьте его в настройках.",
    apiKeyNotNeeded: "API-ключ не требуется",
    apiKeyNotNeededSubtext: "Этот провайдер не требует API-ключа для бесплатного уровня или определенных моделей.",
    apiKeyFound: "API-ключ установлен",
    apiKeyFoundSubtext: "Для этого провайдера настроен API-ключ.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Флагманские чат-модели",
    modelCategory_Reasoning: "Модели для рассуждений",
    modelCategory_CostOptimized: "Модели, оптимизированные по стоимости",
    modelCategory_OlderGPT: "Старые модели GPT",
    modelCategory_Gemini2_5: "Серия Gemini 2.5",
    modelCategory_Gemini2_0: "Серия Gemini 2.0",
    modelCategory_Gemini1_5: "Серия Gemini 1.5",
    modelCategory_Claude3_7: "Серия Claude 3.7",
    modelCategory_Claude3_5: "Серия Claude 3.5",
    modelCategory_Claude3: "Серия Claude 3",
    modelCategory_Grok3: "Серия Grok 3",
    modelCategory_Grok3Mini: "Серия Grok 3 Mini",
    modelCategory_Llama4: "Серия Llama 4",
    modelCategory_Llama3_3: "Серия Llama 3.3",
    modelCategory_Llama3_2: "Серия Llama 3.2",
    modelCategory_Llama3_1: "Серия Llama 3.1",
    modelCategory_Llama3: "Серия Llama 3",
    modelCategory_LlamaVision: "Модели Llama Vision",
    modelCategory_MetaLlama: "Модели Meta Llama",
    modelCategory_Gemma2: "Серия Gemma 2",
    modelCategory_Gemma: "Серия Gemma",
    modelCategory_GoogleGemma: "Модели Google Gemma",
    modelCategory_DeepSeekR1: "Серия DeepSeek R1",
    modelCategory_DeepSeekV3: "Серия DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Серия DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Модели DeepSeek",
    modelCategory_MistralAIModels: "Модели Mistral AI",
    modelCategory_Qwen3: "Серия Qwen3",
    modelCategory_QwQwQ: "Серия Qwen QwQ",
    modelCategory_Qwen2_5: "Серия Qwen2.5",
    modelCategory_Qwen2_5Vision: "Серия Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Серия Qwen2.5 Coder",
    modelCategory_Qwen2: "Серия Qwen2",
    modelCategory_Qwen2Vision: "Серия Qwen2 Vision",
    modelCategory_QwenModels: "Модели Qwen",
    modelCategory_OtherModels: "Другие модели",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Не удалось загрузить данные пользователя: {errorMessage}. Пожалуйста, попробуйте обновить.",
    page_ErrorUserNotFound: "Пользователь не найден. Пожалуйста, войдите снова.",
    page_ErrorUserApiKeyConfig: "Не удалось загрузить конфигурацию API-ключа пользователя. Пожалуйста, обновите или проверьте настройки.",
    page_ErrorStartingSessionAPI: "Ошибка API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Ошибка при запуске сеанса: {errorMessage}",
    page_ErrorSessionIdMissing: "Ответ API успешен, но не содержит идентификатор сеанса.",
    page_LoadingUserData: "Загрузка данных пользователя...",
    page_ErrorAlertTitle: "Ошибка",
    page_WelcomeTitle: "Добро пожаловать в Two AIs",
    page_WelcomeSubtitle: "Этот веб-сайт позволяет вам слушать разговоры между двумя LLM.",
    page_ApiKeysRequiredTitle: "Требуются API-ключи",
    page_ApiKeysRequiredDescription: "Для запуска разговоров вам необходимо предоставить свои собственные API-ключи для моделей ИИ, которые вы хотите использовать (например, OpenAI, Google, Anthropic) после входа в систему. Подробные инструкции для каждого поставщика можно найти на странице «Настройки / API-ключи» после входа в систему.",
    page_SignInPrompt: "Чтобы начать собственный сеанс, вы можете войти или создать учетную запись, используя ссылку в заголовке.",
    page_VideoTitle: "Демонстрация разговора Two AIs",
    page_AvailableLLMsTitle: "Доступные в настоящее время LLM",
    page_TooltipGoogleThinkingBudget: "Эта модель Google использует \"бюджет на размышления\". Результат \"размышлений\" оплачивается, но не отображается в чате.",
    page_TooltipAnthropicExtendedThinking: "Эта модель Anthropic использует \"расширенные размышления\". Результат \"размышлений\" оплачивается, но не отображается в чате.",
    page_TooltipXaiThinking: "Эта модель xAI использует \"размышления\". Этот результат оплачивается, но не отображается в чате.",
    page_TooltipQwenReasoning: "Эта модель Qwen использует \"рассуждения/размышления\". Этот результат оплачивается, но не отображается в чате.",
    page_TooltipDeepSeekReasoning: "Эта модель DeepSeek использует \"рассуждения/размышления\". Результат оплачивается, но не отображается в чате.",
    page_TooltipGenericReasoning: "Эта модель использует токены рассуждений, которые не видны в чате, но оплачиваются как выходные токены.",
    page_TooltipRequiresVerification: "Требуется проверенная организация OpenAI. Вы можете проверить здесь.",
    page_TooltipSupportsLanguage: "Поддерживает {languageName}",
    page_TooltipMayNotSupportLanguage: "Может не поддерживать {languageName}",
    page_BadgePreview: "Предварительный просмотр",
    page_BadgeExperimental: "Экспериментальный",
    page_BadgeBeta: "Бета",
    page_AvailableTTSTitle: "Доступные в настоящее время TTS",
    page_NoTTSOptions: "В настоящее время нет доступных опций TTS.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Введите новый API-ключ {serviceName}",
    apiKeyManager_TestKey: "Проверить ключ",
    apiKeyManager_TestingKey: "Проверка ключа...",
    apiKeyManager_KeyIsValid: "Ключ действителен.",
    apiKeyManager_KeyIsInvalid: "Ключ недействителен.",
    apiKeyManager_FailedToTestKey: "Не удалось проверить ключ.",
    apiKeyManager_ErrorTestingKey: "Ошибка при проверке ключа: {error}",
    apiKeyManager_KeyProvider: "Поставщик",
    apiKeyManager_KeyName: "Имя ключа",
    apiKeyManager_Status: "Статус",
    apiKeyManager_Action: "Действие",

    // Model capabilities
    modelCapability_Vision: "Зрение",
    modelCapability_JSON: "Режим JSON",
    modelCapability_Tools: "Использование инструментов",
    modelCapability_ImageGen: "Генерация изображений",
    modelCapability_Multilingual: "Многоязычный",
    modelCapability_WebSearch: "Поиск в Интернете",
    modelCapability_LargeContext: "Большой контекст",
    modelCapability_LongContext: "Длинный контекст",
    modelCapability_FastResponse: "Быстрый ответ",
    modelCapability_CostEffective: "Экономичный",
    modelCapability_AdvancedReasoning: "Расширенные рассуждения",
    modelCapability_Coding: "Кодирование",
    modelCapability_Foundation: "Базовая модель",
    modelCapability_Experimental: "Экспериментальный",
    modelCapability_Beta: "Бета",
    modelCapability_Preview: "Предварительный просмотр",
    modelCapability_RequiresVerification: "Требуется проверка",
    modelCapability_RequiresAccount: "Требуется учетная запись",

    // TTS Voices (ElevenLabs specific)
    ttsVoice_Adam: "Adam", // Keep name
    ttsVoice_Antoni: "Antoni", // Keep name
    ttsVoice_Arnold: "Arnold", // Keep name
    ttsVoice_Bella: "Bella", // Keep name
    ttsVoice_Callum: "Callum", // Keep name
    ttsVoice_Charlie: "Charlie", // Keep name
    ttsVoice_Charlotte: "Charlotte", // Keep name
    ttsVoice_Clyde: "Clyde", // Keep name
    ttsVoice_Daniel: "Daniel", // Keep name
    ttsVoice_Dave: "Dave", // Keep name
    ttsVoice_Domi: "Domi", // Keep name
    ttsVoice_Dorothy: "Dorothy", // Keep name
    ttsVoice_Drew: "Drew", // Keep name
    ttsVoice_Elli: "Elli", // Keep name
    ttsVoice_Emily: "Emily", // Keep name
    ttsVoice_Ethan: "Ethan", // Keep name
    ttsVoice_Fin: "Fin", // Keep name
    ttsVoice_Freya: "Freya", // Keep name
    ttsVoice_Gigi: "Gigi", // Keep name
    ttsVoice_Giovanni: "Giovanni", // Keep name
    ttsVoice_Glinda: "Glinda", // Keep name
    ttsVoice_Grace: "Grace", // Keep name
    ttsVoice_Harry: "Harry", // Keep name
    ttsVoice_James: "James", // Keep name
    ttsVoice_Jeremy: "Jeremy", // Keep name
    ttsVoice_Jessie: "Jessie", // Keep name
    ttsVoice_Joseph: "Joseph", // Keep name
    ttsVoice_Josh: "Josh", // Keep name
    ttsVoice_Liam: "Liam", // Keep name
    ttsVoice_Lottie: "Lottie", // Keep name
    ttsVoice_Matilda: "Matilda", // Keep name
    ttsVoice_Matthew: "Matthew", // Keep name
    ttsVoice_Michael: "Michael", // Keep name
    ttsVoice_Mimi: "Mimi", // Keep name
    ttsVoice_Nicole: "Nicole", // Keep name
    ttsVoice_Olivia: "Olivia", // Keep name
    ttsVoice_Patrick: "Patrick", // Keep name
    ttsVoice_Paul: "Paul", // Keep name
    ttsVoice_Rachel: "Rachel", // Keep name
    ttsVoice_Ryan: "Ryan", // Keep name // DEFAULT VOICE
    ttsVoice_Sam: "Sam", // Keep name
    ttsVoice_Sarah: "Sarah", // Keep name
    ttsVoice_Serena: "Serena", // Keep name
    ttsVoice_Thomas: "Thomas", // Keep name
    ttsVoice_Rem: "Rem", // Keep name (Japanese)
    ttsVoice_Ren: "Ren", // Keep name (Japanese)
    ttsVoice_Santa: "Santa Claus", // Keep name
    ttsVoice_Alice: "Alice", // Keep name (French)
    ttsVoice_Marcus: "Marcus", // Keep name (German)
    ttsVoice_Aurora: "Aurora", // Keep name (Spanish)
    ttsVoice_Luna: "Luna", // Keep name (Portuguese)
    ttsVoice_Leo: "Leo", // Keep name (Italian)
    ttsVoice_Victoria: "Victoria", // Keep name (Polish)
    ttsVoice_Jasper: "Jasper", // Keep name (Dutch)
    ttsVoice_Felix: "Felix", // Keep name (Finnish)
    ttsVoice_Oscar: "Oscar", // Keep name (Swedish)
    ttsVoice_Maya: "Maya", // Keep name (Hindi)
    ttsVoice_Noah: "Noah", // Keep name (Korean)
    ttsVoice_Kenji: "Kenji", // Keep name (Japanese)
    ttsVoice_Isabelle: "Isabelle", // Keep name (Chinese)
    ttsVoice_Layla: "Layla", // Keep name (Arabic)
    ttsVoice_Zoe: "Zoe", // Keep name (Turkish)
    ttsVoice_Alex: "Alex", // Keep name (Russian)
    ttsVoice_George: "George", // Keep name (Greek)
    ttsVoice_Valentina: "Valentina", // Keep name (Romanian)
    ttsVoice_Sofia: "Sofia", // Keep name (Bulgarian)
    ttsVoice_Viktor: "Viktor", // Keep name (Ukrainian)
    ttsVoice_Milos: "Milos", // Keep name (Czech)
    ttsVoice_Matej: "Matej", // Keep name (Slovak)
    ttsVoice_Luka: "Luka", // Keep name (Croatian)
    ttsVoice_Andrej: "Andrej", // Keep name (Slovenian)
    ttsVoice_Ivan: "Ivan", // Keep name (Serbian)
    ttsVoice_Janos: "Janos", // Keep name (Hungarian)
    ttsVoice_Elias: "Elias", // Keep name (Norwegian)
    ttsVoice_Olivia_DA: "Olivia", // Keep name (Danish)
    ttsVoice_Anna: "Anna", // Keep name (Estonian)
    ttsVoice_Roberts: "Roberts", // Keep name (Latvian)
    ttsVoice_Ugne: "Ugne" // Keep name (Lithuanian)

    // --------------- END OF FILE ---------------
}; 