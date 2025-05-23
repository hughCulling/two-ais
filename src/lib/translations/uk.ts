// src/lib/translations/uk.ts
export const uk = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Налаштування',
        signIn: 'Увійти',
        signOut: 'Вийти',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Арабська',
        bn: 'Бенгальська',
        bg: 'Болгарська',
        zh: 'Китайська',
        hr: 'Хорватська',
        cs: 'Чеська',
        da: 'Данська',
        nl: 'Нідерландська',
        en: 'Англійська',
        et: 'Естонська',
        fi: 'Фінська',
        fr: 'Французька',
        de: 'Німецька',
        el: 'Грецька',
        iw: 'Іврит', // Hebrew
        hi: 'Гінді',
        hu: 'Угорська',
        id: 'Індонезійська',
        it: 'Італійська',
        ja: 'Японська',
        ko: 'Корейська',
        lv: 'Латвійська',
        lt: 'Литовська',
        no: 'Норвезька',
        pl: 'Польська',
        pt: 'Португальська',
        ro: 'Румунська',
        ru: 'Російська',
        sr: 'Сербська',
        sk: 'Словацька',
        sl: 'Словенська',
        es: 'Іспанська',
        sw: 'Суахілі',
        sv: 'Шведська',
        th: 'Тайська',
        tr: 'Турецька',
        uk: 'Українська',
        vi: 'В\'єтнамська',
    },

    // Settings page
    settings: {
        title: 'Налаштування',
        sections: {
            appearance: 'Зовнішній вигляд',
            apiKeys: 'Ключі API',
            language: 'Мова',
        },
        appearance: {
            theme: 'Тема',
            light: 'Світла',
            dark: 'Темна',
            system: 'Системна',
        },
        language: {
            title: 'Мова',
            description: 'Виберіть бажану мову для інтерфейсу',
            conversationLanguage: 'Мова розмови',
            conversationLanguageDescription: 'Мова, яка використовується для розмов зі штучним інтелектом, відповідатиме мові вашого інтерфейсу',
        },
        apiKeys: {
            title: 'Ключі API',
            description: 'Керуйте своїми ключами API для різних постачальників ШІ',
            saved: 'Збережено',
            notSet: 'Не встановлено',
            setKey: 'Встановити ключ',
            updateKey: 'Оновити ключ',
            removeKey: 'Видалити ключ',
            getKeyInstructions: 'Отримайте свій ключ API',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Немає нових ключів API для збереження.",
            unexpectedResponse: "Отримано неочікувану відповідь від сервера.",
            failedToSaveKey: "Не вдалося зберегти ключ {serviceName}.",
            someKeysNotSaved: "Деякі ключі API не вдалося зберегти. Будь ласка, перевірте деталі нижче.",
            keyStatus: "статус ключа...",
            apiKeySecurelySaved: "Ключ API надійно збережено",
            confirmRemoveTitle: "Підтвердити видалення",
            confirmRemoveDescription: "Ви впевнені, що хочете видалити ключ API для {serviceName}? Цю дію неможливо скасувати.",
            failedToRemoveKey: "Не вдалося видалити ключ {serviceName}.",
            successfullyRemovedKey: "Ключ {serviceName} успішно видалено.",
            keyNotSet: "Статус ключа: Не встановлено",
            keySet: "Статус ключа: Встановлено",
            saveButton: "Зберегти ключ(і) API"
        },
    },

    // Main page
    main: {
        title: 'Розмова зі ШІ',
        setupForm: {
            title: 'Налаштуйте свою розмову',
            agentA: 'Агент А',
            agentB: 'Агент Б',
            model: 'Модель',
            selectModel: 'Виберіть модель',
            tts: {
                title: 'Текст-в-мовлення',
                enable: 'Увімкнути Текст-в-мовлення',
                provider: 'Постачальник TTS',
                selectProvider: 'Виберіть постачальника TTS',
                voice: 'Голос',
                selectVoice: 'Виберіть голос',
                model: 'Модель TTS',
                selectModel: 'Виберіть модель TTS',
            },
            startConversation: 'Почати розмову',
            conversationPrompt: 'Почніть розмову.',
        },
        conversation: {
            thinking: 'думає...',
            stop: 'Зупинити',
            restart: 'Перезапустити розмову',
        },
        pricing: {
            estimatedCost: 'Орієнтовна вартість',
            perMillionTokens: 'за мільйон токенів',
            input: 'Вхід',
            output: 'Вихід',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Увійти до Two AIs', // Keep brand name
            emailPlaceholder: 'Електронна пошта',
            passwordPlaceholder: 'Пароль',
            signIn: 'Увійти',
            signInWithGoogle: 'Увійти через Google',
            noAccount: "Немає облікового запису?",
            signUp: 'Зареєструватися',
            forgotPassword: 'Забули пароль?',
            signingIn: "Вхід..."
        },
        signup: {
            title: 'Створити обліковий запис',
            emailPlaceholder: 'Електронна пошта',
            passwordPlaceholder: 'Пароль (принаймні 6 символів)',
            signUp: 'Зареєструватися',
            signUpWithGoogle: 'Зареєструватися через Google',
            hasAccount: 'Вже є обліковий запис?',
            signIn: 'Увійти',
            emailLabel: "Адреса електронної пошти",
            confirmPasswordPlaceholder: "Підтвердьте пароль",
            signingUp: "Реєстрація..."
        },
        errors: {
            invalidCredentials: 'Неправильна адреса електронної пошти або пароль',
            userNotFound: 'Користувача не знайдено',
            weakPassword: 'Пароль має містити принаймні 6 символів',
            emailInUse: 'Ця адреса електронної пошти вже використовується',
            generic: 'Сталася помилка. Будь ласка, спробуйте ще раз.',
            initialization: "Помилка ініціалізації. Будь ласка, спробуйте пізніше.",
            invalidEmail: "Будь ласка, введіть дійсну адресу електронної пошти.",
            tooManyRequests: "Доступ тимчасово вимкнено через занадто велику кількість невдалих спроб входу. Будь ласка, скиньте пароль або спробуйте пізніше.",
            signInFailedPrefix: "Помилка входу: ",
            unknownSignInError: "Під час входу сталася невідома помилка.",
            profileSaveFailedPrefix: "Вхід успішний, але не вдалося зберегти дані профілю: ",
            profileCheckSaveFailedPrefix: "Вхід успішний, але не вдалося перевірити/зберегти дані профілю: ",
            accountExistsWithDifferentCredential: "Обліковий запис із цією адресою електронної пошти вже існує з іншим методом входу.",
            googleSignInFailedPrefix: "Помилка входу через Google: ",
            unknownGoogleSignInError: "Під час входу через Google сталася невідома помилка.",
            passwordsDoNotMatch: "Паролі не збігаються.",
            accountCreatedProfileSaveFailedPrefix: "Обліковий запис створено, але не вдалося зберегти дані профілю: ",
            unknownProfileSaveError: "Під час збереження профілю сталася невідома помилка.",
            emailAlreadyRegistered: "Ця адреса електронної пошти вже зареєстрована.",
            passwordTooShortSignUp: "Пароль повинен містити щонайменше 6 символів.",
            signUpFailedPrefix: "Помилка реєстрації: ",
            unknownSignUpError: "Під час реєстрації сталася невідома помилка."
        },
    },

    // Common
    common: {
        loading: 'Завантаження...',
        error: 'Помилка',
        save: 'Зберегти',
        cancel: 'Скасувати',
        delete: 'Видалити',
        confirm: 'Підтвердити',
        or: 'або',
        MoreInformation: "Більше інформації",
        Example: "Приклад:",
        ShowMore: "Показати більше",
        ShowLess: "Показати менше",
        AwaitingApproval: "Очікування схвалення...",
        OpenInNewTab: "Відкрити в новій вкладці",
        AdvancedSettings: "Розширені налаштування",
        Name: "Ім\'я",
        Created: "Створено",
        Updated: "Оновлено",
        Launched: "Запущено",
        Docs: "Документація",
        Blog: "Блог",
        Pricing: "Ціни",
        Terms: "Умови",
        Privacy: "Конфіденційність",
        Changelog: "Журнал змін",
        Copy: "Копіювати",
        Copied: "Скопійовано",
        TryAgain: "Спробувати ще раз"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Відсутній ключ API",
    apiKeyMissingSubtext: "Ключ API для цього провайдера відсутній або недійсний. Будь ласка, додайте його в налаштуваннях.",
    apiKeyNotNeeded: "Ключ API не потрібен",
    apiKeyNotNeededSubtext: "Цей провайдер не вимагає ключа API для свого безкоштовного рівня або певних моделей.",
    apiKeyFound: "Ключ API встановлено",
    apiKeyFoundSubtext: "Для цього провайдера налаштовано ключ API.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Флагманські моделі чату",
    modelCategory_Reasoning: "Моделі для міркувань",
    modelCategory_CostOptimized: "Моделі, оптимізовані за вартістю",
    modelCategory_OlderGPT: "Старіші моделі GPT",
    modelCategory_Gemini2_5: "Серія Gemini 2.5",
    modelCategory_Gemini2_0: "Серія Gemini 2.0",
    modelCategory_Gemini1_5: "Серія Gemini 1.5",
    modelCategory_Claude3_7: "Серія Claude 3.7",
    modelCategory_Claude3_5: "Серія Claude 3.5",
    modelCategory_Claude3: "Серія Claude 3",
    modelCategory_Grok3: "Серія Grok 3",
    modelCategory_Grok3Mini: "Серія Grok 3 Mini",
    modelCategory_Llama4: "Серія Llama 4",
    modelCategory_Llama3_3: "Серія Llama 3.3",
    modelCategory_Llama3_2: "Серія Llama 3.2",
    modelCategory_Llama3_1: "Серія Llama 3.1",
    modelCategory_Llama3: "Серія Llama 3",
    modelCategory_LlamaVision: "Моделі Llama Vision",
    modelCategory_MetaLlama: "Моделі Meta Llama",
    modelCategory_Gemma2: "Серія Gemma 2",
    modelCategory_Gemma: "Серія Gemma",
    modelCategory_GoogleGemma: "Моделі Google Gemma",
    modelCategory_DeepSeekR1: "Серія DeepSeek R1",
    modelCategory_DeepSeekV3: "Серія DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Серія DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Моделі DeepSeek",
    modelCategory_MistralAIModels: "Моделі Mistral AI",
    modelCategory_Qwen3: "Серія Qwen3",
    modelCategory_QwQwQ: "Серія Qwen QwQ",
    modelCategory_Qwen2_5: "Серія Qwen2.5",
    modelCategory_Qwen2_5Vision: "Серія Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Серія Qwen2.5 Coder",
    modelCategory_Qwen2: "Серія Qwen2",
    modelCategory_Qwen2Vision: "Серія Qwen2 Vision",
    modelCategory_QwenModels: "Моделі Qwen",
    modelCategory_OtherModels: "Інші моделі",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Не вдалося завантажити дані користувача: {errorMessage}. Будь ласка, спробуйте оновити.",
    page_ErrorUserNotFound: "Користувача не знайдено. Будь ласка, увійдіть знову.",
    page_ErrorUserApiKeyConfig: "Не вдалося завантажити конфігурацію ключа API користувача. Будь ласка, оновіть або перевірте налаштування.",
    page_ErrorStartingSessionAPI: "Помилка API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Помилка під час запуску сеансу: {errorMessage}",
    page_ErrorSessionIdMissing: "Відповідь API успішна, але не містить ідентифікатор сеансу.",
    page_LoadingUserData: "Завантаження даних користувача...",
    page_ErrorAlertTitle: "Помилка",
    page_WelcomeTitle: "Ласкаво просимо до Two AIs",
    page_WelcomeSubtitle: "Цей веб-сайт дозволяє вам слухати розмови між двома LLM.",
    page_ApiKeysRequiredTitle: "Потрібні ключі API",
    page_ApiKeysRequiredDescription: "Щоб розпочати розмову, вам потрібно буде надати власні ключі API для моделей ШІ, які ви хочете використовувати (наприклад, OpenAI, Google, Anthropic) після входу. Детальні інструкції для кожного провайдера можна знайти на сторінці Налаштування / Ключі API після входу.",
    page_SignInPrompt: "Щоб розпочати власний сеанс, ви можете увійти або створити обліковий запис за посиланням у заголовку.",
    page_VideoTitle: "Демонстрація розмови Two AIs",
    page_AvailableLLMsTitle: "Доступні на даний момент LLM",
    page_TooltipGoogleThinkingBudget: "Ця модель Google використовує 'бюджет на роздуми'. Результат 'роздумів' оплачується, але не відображається в чаті.",
    page_TooltipAnthropicExtendedThinking: "Ця модель Anthropic використовує 'розширені роздуми'. Результат 'роздумів' оплачується, але не відображається в чаті.",
    page_TooltipXaiThinking: "Ця модель xAI використовує 'роздуми'. Цей результат оплачується, але не відображається в чаті.",
    page_TooltipQwenReasoning: "Ця модель Qwen використовує 'міркування/роздуми'. Цей результат оплачується, але не відображається в чаті.",
    page_TooltipDeepSeekReasoning: "Ця модель DeepSeek використовує 'міркування/роздуми'. Результат оплачується, але не відображається в чаті.",
    page_TooltipGenericReasoning: "Ця модель використовує токени для міркувань, які не видно в чаті, але оплачуються як вихідні токени.",
    page_TooltipRequiresVerification: "Потрібна перевірена організація OpenAI. Ви можете перевірити тут.",
    page_TooltipSupportsLanguage: "Підтримує {languageName}",
    page_TooltipMayNotSupportLanguage: "Може не підтримувати {languageName}",
    page_BadgePreview: "Попередній перегляд",
    page_BadgeExperimental: "Експериментальний",
    page_BadgeBeta: "Бета",
    page_AvailableTTSTitle: "Доступні на даний момент TTS",
    page_NoTTSOptions: "На даний момент немає доступних опцій TTS.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Введіть новий ключ API {serviceName}",
    apiKeyManager_TestKey: "Перевірити ключ",
    apiKeyManager_TestingKey: "Перевірка ключа...",
    apiKeyManager_KeyIsValid: "Ключ дійсний.",
    apiKeyManager_KeyIsInvalid: "Ключ недійсний.",
    apiKeyManager_FailedToTestKey: "Не вдалося перевірити ключ.",
    apiKeyManager_ErrorTestingKey: "Помилка під час перевірки ключа: {error}",
    apiKeyManager_KeyProvider: "Постачальник",
    apiKeyManager_KeyName: "Назва ключа",
    apiKeyManager_Status: "Статус",
    apiKeyManager_Action: "Дія",

    // Model capabilities
    modelCapability_Vision: "Зір",
    modelCapability_JSON: "Режим JSON",
    modelCapability_Tools: "Використання інструментів",
    modelCapability_ImageGen: "Генерація зображень",
    modelCapability_Multilingual: "Багатомовний",
    modelCapability_WebSearch: "Пошук в Інтернеті",
    modelCapability_LargeContext: "Великий контекст",
    modelCapability_LongContext: "Довгий контекст",
    modelCapability_FastResponse: "Швидка відповідь",
    modelCapability_CostEffective: "Економічно вигідний",
    modelCapability_AdvancedReasoning: "Розширені міркування",
    modelCapability_Coding: "Кодування",
    modelCapability_Foundation: "Базова модель",
    modelCapability_Experimental: "Експериментальний",
    modelCapability_Beta: "Бета",
    modelCapability_Preview: "Попередній перегляд",
    modelCapability_RequiresVerification: "Потрібна перевірка",
    modelCapability_RequiresAccount: "Потрібен обліковий запис",

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