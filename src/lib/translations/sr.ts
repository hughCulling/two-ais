// src/lib/translations/sr.ts
const sr = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Подешавања',
        signIn: 'Пријава',
        signOut: 'Одјава',
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
            description: "Прилагодите изглед и осећај апликације."
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
            noNewKeys: "Нису унети нови АПИ кључеви за чување.",
            unexpectedResponse: "Примљен је неочекивани одговор од сервера.",
            failedToSaveKey: "Чување кључа {serviceName} није успело.",
            someKeysNotSaved: "Неки АПИ кључеви нису могли бити сачувани. Молимо проверите детаље испод.",
            keyStatus: "статус кључа...",
            apiKeySecurelySaved: "АПИ кључ безбедно сачуван",
            confirmRemoveTitle: "Потврди уклањање",
            confirmRemoveDescription: "Да ли сте сигурни да желите да уклоните АПИ кључ за {serviceName}? Ова радња се не може опозвати.",
            failedToRemoveKey: "Уклањање кључа {serviceName} није успело.",
            successfullyRemovedKey: "Кључ {serviceName} је успешно уклоњен.",
            keyNotSet: "Статус кључа: Није постављен",
            keySet: "Статус кључа: Постављен",
            saveButton: "Сачувај АПИ кључ(еве)"
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
            orContinueWith: "Или наставите са",
            signingIn: "Пријављивање..."
        },
        signup: {
            title: 'Креирајте налог',
            emailPlaceholder: 'Имејл',
            passwordPlaceholder: 'Лозинка (најмање 6 знакова)',
            signUp: 'Региструјте се',
            signUpWithGoogle: 'Региструјте се преко Гоогле-а',
            hasAccount: 'Већ имате налог?',
            signIn: 'Пријава',
            emailLabel: "Имејл адреса",
            confirmPasswordPlaceholder: "Потврдите лозинку",
            signingUp: "Регистрација..."
        },
        errors: {
            invalidCredentials: 'Неважећи имејл или лозинка',
            userNotFound: 'Корисник није пронађен',
            weakPassword: 'Лозинка мора имати најмање 6 знакова',
            emailInUse: 'Имејл се већ користи',
            generic: 'Догодила се грешка. Покушајте поново.',
            initialization: "Грешка при иницијализацији. Покушајте касније.",
            invalidEmail: "Унесите важећу имејл адресу.",
            tooManyRequests: "Приступ је привремено онемогућен због превише неуспешних покушаја пријаве. Ресетујте лозинку или покушајте касније.",
            signInFailedPrefix: "Пријава неуспешна: ",
            unknownSignInError: "Дошло је до непознате грешке током пријаве.",
            profileSaveFailedPrefix: "Пријава успешна, али чување података профила није успело: ",
            profileCheckSaveFailedPrefix: "Пријава успешна, али провера/чување података профила није успело: ",
            accountExistsWithDifferentCredential: "Налог са овим имејлом већ постоји са другим начином пријаве.",
            googleSignInFailedPrefix: "Пријава преко Гоогле-а неуспешна: ",
            unknownGoogleSignInError: "Дошло је до непознате грешке током пријаве преко Гоогле-а.",
            passwordsDoNotMatch: "Лозинке се не подударају.",
            accountCreatedProfileSaveFailedPrefix: "Налог је креиран, али чување података профила није успело: ",
            unknownProfileSaveError: "Дошло је до непознате грешке током чувања профила.",
            emailAlreadyRegistered: "Ова имејл адреса је већ регистрована.",
            passwordTooShortSignUp: "Лозинка мора имати најмање 6 карактера.",
            signUpFailedPrefix: "Регистрација неуспешна: ",
            unknownSignUpError: "Дошло је до непознате грешке током регистрације."
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
        MoreInformation: "Више информација",
        Example: "Пример:",
        ShowMore: "Прикажи више",
        ShowLess: "Прикажи мање",
        AwaitingApproval: "Чека се одобрење...",
        OpenInNewTab: "Отвори у новој картици",
        AdvancedSettings: "Напредна подешавања",
        Name: "Име",
        Created: "Креирано",
        Updated: "Ажурирано",
        Launched: "Покренуто",
        Docs: "Документација",
        Blog: "Блог",
        Pricing: "Цене",
        Terms: "Услови",
        Privacy: "Приватност",
        Changelog: "Дневник измена",
        Copy: "Копирај",
        Copied: "Копирано",
        TryAgain: "Покушај поново"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Недостаје АПИ кључ",
    apiKeyMissingSubtext: "АПИ кључ за овог провајдера недостаје или је неважећи. Додајте га у подешавањима.",
    apiKeyNotNeeded: "АПИ кључ није потребан",
    apiKeyNotNeededSubtext: "Овај провајдер не захтева АПИ кључ за свој бесплатни ниво или одређене моделе.",
    apiKeyFound: "АПИ кључ је постављен",
    apiKeyFoundSubtext: "АПИ кључ је конфигурисан за овог провајдера.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Водећи модели за ћаскање",
    modelCategory_Reasoning: "Модели за резоновање",
    modelCategory_CostOptimized: "Модели оптимизовани по цени",
    modelCategory_OlderGPT: "Старији ГПТ модели",
    modelCategory_Gemini2_5: "Gemini 2.5 серија",
    modelCategory_Gemini2_0: "Gemini 2.0 серија",
    modelCategory_Gemini1_5: "Gemini 1.5 серија",
    modelCategory_Claude3_7: "Claude 3.7 серија",
    modelCategory_Claude3_5: "Claude 3.5 серија",
    modelCategory_Claude3: "Claude 3 серија",
    modelCategory_Grok3: "Grok 3 серија",
    modelCategory_Grok3Mini: "Grok 3 Mini серија",
    modelCategory_Llama4: "Llama 4 серија",
    modelCategory_Llama3_3: "Llama 3.3 серија",
    modelCategory_Llama3_2: "Llama 3.2 серија",
    modelCategory_Llama3_1: "Llama 3.1 серија",
    modelCategory_Llama3: "Llama 3 серија",
    modelCategory_LlamaVision: "Llama Vision модели",
    modelCategory_MetaLlama: "Meta Llama модели",
    modelCategory_Gemma2: "Gemma 2 серија",
    modelCategory_Gemma: "Gemma серија",
    modelCategory_GoogleGemma: "Google Gemma модели",
    modelCategory_DeepSeekR1: "DeepSeek R1 серија",
    modelCategory_DeepSeekV3: "DeepSeek V3 серија",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill серија",
    modelCategory_DeepSeekModels: "DeepSeek модели",
    modelCategory_MistralAIModels: "Mistral AI модели",
    modelCategory_Qwen3: "Qwen3 серија",
    modelCategory_QwQwQ: "Qwen QwQ серија",
    modelCategory_Qwen2_5: "Qwen2.5 серија",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision серија",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder серија",
    modelCategory_Qwen2: "Qwen2 серија",
    modelCategory_Qwen2Vision: "Qwen2 Vision серија",
    modelCategory_QwenModels: "Qwen модели",
    modelCategory_OtherModels: "Остали модели",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Учитавање корисничких података није успело: {errorMessage}. Покушајте да освежите.",
    page_ErrorUserNotFound: "Корисник није пронађен. Пријавите се поново.",
    page_ErrorUserApiKeyConfig: "Конфигурација АПИ кључа корисника није могла бити учитана. Освежите или проверите подешавања.",
    page_ErrorStartingSessionAPI: "АПИ грешка: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Грешка при покретању сесије: {errorMessage}",
    page_ErrorSessionIdMissing: "АПИ одговор успешан, али није укључивао ИД разговора.",
    page_LoadingUserData: "Учитавање корисничких података...",
    page_ErrorAlertTitle: "Грешка",
    page_WelcomeTitle: "Добродошли у Two AIs",
    page_WelcomeSubtitle: "Ова веб локација вам омогућава да слушате разговоре између два ЛЛМ-а.",
    page_ApiKeysRequiredTitle: "Потребни АПИ кључеви",
    page_ApiKeysRequiredDescription: "Да бисте покренули разговоре, мораћете да унесете сопствене АПИ кључеве за АИ моделе које желите да користите (нпр. OpenAI, Google, Anthropic) након пријаве. Детаљна упутства за сваког провајдера можете пронаћи на страници Подешавања / АПИ кључеви након пријаве.",
    page_SignInPrompt: "Да бисте започели сопствену сесију, можете се пријавити или креирати налог помоћу везе у заглављу.",
    page_VideoTitle: "Демонстрација разговора Two AIs",
    page_AvailableLLMsTitle: "Тренутно доступни ЛЛМ-ови",
    page_TooltipGoogleThinkingBudget: "Овај Гоогле модел користи 'буџет за размишљање'. Излаз 'размишљања' се наплаћује, али није видљив у ћаскању.",
    page_TooltipAnthropicExtendedThinking: "Овај Anthropic модел користи 'проширено размишљање'. Излаз 'размишљања' се наплаћује, али није видљив у ћаскању.",
    page_TooltipXaiThinking: "Овај xAI модел користи 'размишљање'. Овај излаз се наплаћује, али није видљив у ћаскању.",
    page_TooltipQwenReasoning: "Овај Qwen модел користи 'резоновање/размишљање'. Овај излаз се наплаћује, али није видљив у ћаскању.",
    page_TooltipDeepSeekReasoning: "Овај DeepSeek модел користи 'резоновање/размишљање'. Излаз се наплаћује, али није видљив у ћаскању.",
    page_TooltipGenericReasoning: "Овај модел користи токене за резоновање који нису видљиви у ћаскању, али се наплаћују као излазни токени.",
    page_TooltipRequiresVerification: "Захтева верификовану OpenAI организацију. Овде можете верификовати.",
    page_TooltipSupportsLanguage: "Подржава {languageName}",
    page_TooltipMayNotSupportLanguage: "Можда не подржава {languageName}",
    page_BadgePreview: "Преглед",
    page_BadgeExperimental: "Експериментално",
    page_BadgeBeta: "Бета",
    page_AvailableTTSTitle: "Тренутно доступан ТТС",
    page_NoTTSOptions: "Тренутно нема доступних ТТС опција.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Унесите нови АПИ кључ {serviceName}",
    apiKeyManager_TestKey: "Тестирај кључ",
    apiKeyManager_TestingKey: "Тестирање кључа...",
    apiKeyManager_KeyIsValid: "Кључ је важећи.",
    apiKeyManager_KeyIsInvalid: "Кључ није важећи.",
    apiKeyManager_FailedToTestKey: "Тестирање кључа није успело.",
    apiKeyManager_ErrorTestingKey: "Грешка при тестирању кључа: {error}",
    apiKeyManager_KeyProvider: "Провајдер",
    apiKeyManager_KeyName: "Назив кључа",
    apiKeyManager_Status: "Статус",
    apiKeyManager_Action: "Радња",

    // Model capabilities
    modelCapability_Vision: "Визија",
    modelCapability_JSON: "ЈСОН режим",
    modelCapability_Tools: "Коришћење алата",
    modelCapability_ImageGen: "Генерисање слика",
    modelCapability_Multilingual: "Вишејезично",
    modelCapability_WebSearch: "Претрага веба",
    modelCapability_LargeContext: "Велики контекст",
    modelCapability_LongContext: "Дуги контекст",
    modelCapability_FastResponse: "Брз одговор",
    modelCapability_CostEffective: "Исплативо",
    modelCapability_AdvancedReasoning: "Напредно резоновање",
    modelCapability_Coding: "Кодирање",
    modelCapability_Foundation: "Основни модел",
    modelCapability_Experimental: "Експериментално",
    modelCapability_Beta: "Бета",
    modelCapability_Preview: "Преглед",
    modelCapability_RequiresVerification: "Захтева верификацију",
    modelCapability_RequiresAccount: "Захтева налог",

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
export default sr; 