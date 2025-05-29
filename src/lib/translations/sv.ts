// src/lib/translations/sv.ts
export const sv = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Inställningar',
        signIn: 'Logga in',
        signOut: 'Logga ut',
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
        title: 'Inställningar',
        sections: {
            appearance: 'Utseende',
            apiKeys: 'API-nycklar',
            language: 'Språk',
        },
        appearance: {
            theme: 'Tema',
            light: 'Ljus',
            dark: 'Mörk',
            system: 'System',
            description: "Anpassa utseendet och känslan för applikationen."
        },
        language: {
            title: 'Språk',
            description: 'Välj önskat språk för gränssnittet',
            conversationLanguage: 'Konversationsspråk',
            conversationLanguageDescription: 'Språket som används för AI-konversationer matchar ditt gränssnittsspråk',
        },
        apiKeys: {
            title: 'API Keys',
            description: 'Manage your API keys for different AI providers',
            saved: 'Saved',
            notSet: 'Not set',
            setKey: 'Set key',
            updateKey: 'Update key',
            removeKey: 'Remove key',
            getKeyInstructions: 'Get your API key',
            noNewKeys: "No new API keys entered to save.",
            unexpectedResponse: "Received an unexpected response from the server.",
            failedToSaveKey: "Failed to save {serviceName} key.",
            someKeysNotSaved: "Some API keys could not be saved. Please check the details below.",
            keyStatus: "key status...",
            apiKeySecurelySaved: "API Key Securely Saved",
            confirmRemoveTitle: "Confirm Removal",
            confirmRemoveDescription: "Are you sure you want to remove the API key for {serviceName}? This action cannot be undone.",
            failedToRemoveKey: "Failed to remove {serviceName} key.",
            successfullyRemovedKey: "Successfully removed {serviceName} key.",
            keyNotSet: "Key Status: Not Set",
            keySet: "Key Status: Set",
            saveButton: "Save API Key(s)"
        },
    },

    // Main page
    main: {
        title: 'AI-konversation',
        setupForm: {
            title: 'Ställ in din konversation',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Modell',
            selectModel: 'Välj en modell',
            tts: {
                title: 'Text-till-tal',
                enable: 'Aktivera text-till-tal',
                provider: 'TTS-leverantör',
                selectProvider: 'Välj TTS-leverantör',
                voice: 'Röst',
                selectVoice: 'Välj röst',
                model: 'TTS-modell',
                selectModel: 'Välj TTS-modell',
            },
            startConversation: 'Starta konversation',
            conversationPrompt: 'Starta konversationen.',
        },
        conversation: {
            thinking: 'tänker...',
            stop: 'Stoppa',
            restart: 'Starta om konversation',
        },
        pricing: {
            estimatedCost: 'Beräknad kostnad',
            perMillionTokens: 'per miljon tokens',
            input: 'Indata',
            output: 'Utdata',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Logga in på Two AIs', // Keep brand name
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Lösenord',
            signIn: 'Logga in',
            signInWithGoogle: 'Logga in med Google',
            noAccount: "Har du inget konto?",
            signUp: 'Registrera dig',
            forgotPassword: 'Glömt lösenord?',
            orContinueWith: "Eller fortsätt med",
            signingIn: "Loggar in..."
        },
        signup: {
            title: 'Skapa konto',
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Lösenord (minst 6 tecken)',
            signUp: 'Registrera dig',
            signUpWithGoogle: 'Registrera dig med Google',
            hasAccount: 'Har du redan ett konto?',
            signIn: 'Logga in',
            emailLabel: "E-postadress",
            confirmPasswordPlaceholder: "Bekräfta lösenord",
            signingUp: "Registrerar..."
        },
        errors: {
            invalidCredentials: 'Ogiltig e-postadress eller lösenord',
            userNotFound: 'Användaren hittades inte',
            weakPassword: 'Lösenordet måste vara minst 6 tecken långt',
            emailInUse: 'E-postadressen används redan',
            generic: 'Ett fel uppstod. Försök igen.',
            initialization: "Initieringsfel. Försök igen senare.",
            invalidEmail: "Ange en giltig e-postadress.",
            tooManyRequests: "Åtkomst tillfälligt blockerad på grund av för många misslyckade inloggningsförsök. Återställ ditt lösenord eller försök igen senare.",
            signInFailedPrefix: "Inloggning misslyckades: ",
            unknownSignInError: "Ett okänt fel uppstod under inloggningen.",
            profileSaveFailedPrefix: "Inloggningen lyckades, men det gick inte att spara profildata: ",
            profileCheckSaveFailedPrefix: "Inloggningen lyckades, men det gick inte att kontrollera/spara profildata: ",
            accountExistsWithDifferentCredential: "Ett konto med den här e-postadressen finns redan med en annan inloggningsmetod.",
            googleSignInFailedPrefix: "Google-inloggning misslyckades: ",
            unknownGoogleSignInError: "Ett okänt fel uppstod under Google-inloggningen.",
            passwordsDoNotMatch: "Lösenorden matchar inte.",
            accountCreatedProfileSaveFailedPrefix: "Kontot skapades, men det gick inte att spara profildata: ",
            unknownProfileSaveError: "Ett okänt fel uppstod när profilen skulle sparas.",
            emailAlreadyRegistered: "Den här e-postadressen är redan registrerad.",
            passwordTooShortSignUp: "Lösenordet måste vara minst 6 tecken långt.",
            signUpFailedPrefix: "Registreringen misslyckades: ",
            unknownSignUpError: "Ett okänt fel uppstod under registreringen."
        },
    },

    // Common
    common: {
        loading: 'Laddar...',
        error: 'Fel',
        save: 'Spara',
        cancel: 'Avbryt',
        delete: 'Ta bort',
        confirm: 'Bekräfta',
        or: 'eller',
        MoreInformation: "Mer information",
        Example: "Exempel:",
        ShowMore: "Visa mer",
        ShowLess: "Visa mindre",
        AwaitingApproval: "Väntar på godkännande...",
        OpenInNewTab: "Öppna i ny flik",
        AdvancedSettings: "Avancerade inställningar",
        Name: "Namn",
        Created: "Skapad",
        Updated: "Uppdaterad",
        Launched: "Lanserad",
        Docs: "Dokumentation",
        Blog: "Blogg",
        Pricing: "Prissättning",
        Terms: "Villkor",
        Privacy: "Integritet",
        Changelog: "Ändringslogg",
        Copy: "Kopiera",
        Copied: "Kopierad",
        TryAgain: "Försök igen"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API-nyckel saknas",
    apiKeyMissingSubtext: "API-nyckeln för den här leverantören saknas eller är ogiltig. Lägg till den i inställningarna.",
    apiKeyNotNeeded: "API-nyckel behövs inte",
    apiKeyNotNeededSubtext: "Den här leverantören kräver ingen API-nyckel för sin kostnadsfria nivå eller vissa modeller.",
    apiKeyFound: "API-nyckel inställd",
    apiKeyFoundSubtext: "En API-nyckel är konfigurerad för den här leverantören.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Flaggskepps chattmodeller",
    modelCategory_Reasoning: "Resoneringsmodeller",
    modelCategory_CostOptimized: "Kostnadsoptimerade modeller",
    modelCategory_OlderGPT: "Äldre GPT-modeller",
    modelCategory_Gemini2_5: "Gemini 2.5-serien",
    modelCategory_Gemini2_0: "Gemini 2.0-serien",
    modelCategory_Gemini1_5: "Gemini 1.5-serien",
    modelCategory_Claude3_7: "Claude 3.7-serien",
    modelCategory_Claude3_5: "Claude 3.5-serien",
    modelCategory_Claude3: "Claude 3-serien",
    modelCategory_Grok3: "Grok 3-serien",
    modelCategory_Grok3Mini: "Grok 3 Mini-serien",
    modelCategory_Llama4: "Llama 4-serien",
    modelCategory_Llama3_3: "Llama 3.3-serien",
    modelCategory_Llama3_2: "Llama 3.2-serien",
    modelCategory_Llama3_1: "Llama 3.1-serien",
    modelCategory_Llama3: "Llama 3-serien",
    modelCategory_LlamaVision: "Llama Vision-modeller",
    modelCategory_MetaLlama: "Meta Llama-modeller",
    modelCategory_Gemma2: "Gemma 2-serien",
    modelCategory_Gemma: "Gemma-serien",
    modelCategory_GoogleGemma: "Google Gemma-modeller",
    modelCategory_DeepSeekR1: "DeepSeek R1-serien",
    modelCategory_DeepSeekV3: "DeepSeek V3-serien",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Destillera-serien",
    modelCategory_DeepSeekModels: "DeepSeek-modeller",
    modelCategory_MistralAIModels: "Mistral AI-modeller",
    modelCategory_Qwen3: "Qwen3-serien",
    modelCategory_QwQwQ: "Qwen QwQ-serien",
    modelCategory_Qwen2_5: "Qwen2.5-serien",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision-serien",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder-serien",
    modelCategory_Qwen2: "Qwen2-serien",
    modelCategory_Qwen2Vision: "Qwen2 Vision-serien",
    modelCategory_QwenModels: "Qwen-modeller",
    modelCategory_OtherModels: "Andra modeller",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Det gick inte att läsa in användardata: {errorMessage}. Försök att uppdatera.",
    page_ErrorUserNotFound: "Användaren hittades inte. Logga in igen.",
    page_ErrorUserApiKeyConfig: "Användarens API-nyckelkonfiguration kunde inte läsas in. Uppdatera eller kontrollera inställningarna.",
    page_ErrorStartingSessionAPI: "API-fel: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Fel vid start av session: {errorMessage}",
    page_ErrorSessionIdMissing: "API-svar lyckades men inkluderade inte ett konversations-ID.",
    page_LoadingUserData: "Läser in användardata...",
    page_ErrorAlertTitle: "Fel",
    page_WelcomeTitle: "Välkommen till Two AIs",
    page_WelcomeSubtitle: "Den här webbplatsen låter dig lyssna på konversationer mellan två LLM:er.",
    page_ApiKeysRequiredTitle: "API-nycklar krävs",
    page_ApiKeysRequiredDescription: "För att köra konversationer måste du ange dina egna API-nycklar för de AI-modeller du vill använda (t.ex. OpenAI, Google, Anthropic) efter inloggning. Detaljerade instruktioner för varje leverantör finns på sidan Inställningar / API-nycklar efter inloggning.",
    page_SignInPrompt: "För att starta din egen session kan du logga in eller skapa ett konto med länken i sidhuvudet.",
    page_VideoTitle: "Two AIs konversationsdemonstration",
    page_AvailableLLMsTitle: "För närvarande tillgängliga LLM:er",
    page_TooltipGoogleThinkingBudget: "Denna Google-modell använder en 'tänkebudget'. 'Tänkande'-utdata faktureras men syns inte i chatten.",
    page_TooltipAnthropicExtendedThinking: "Denna Anthropic-modell använder 'utökat tänkande'. 'Tänkande'-utdata faktureras men syns inte i chatten.",
    page_TooltipXaiThinking: "Denna xAI-modell använder 'tänkande'. Denna utdata faktureras men syns inte i chatten.",
    page_TooltipQwenReasoning: "Denna Qwen-modell använder 'resonemang/tänkande'. Denna utdata faktureras men syns inte i chatten.",
    page_TooltipDeepSeekReasoning: "Denna DeepSeek-modell använder 'resonemang/tänkande'. Utdata faktureras men syns inte i chatten.",
    page_TooltipGenericReasoning: "Denna modell använder resonemangstokens som inte syns i chatten men faktureras som utdatatokens.",
    page_TooltipRequiresVerification: "Kräver verifierad OpenAI-organisation. Du kan verifiera här.",
    page_TooltipSupportsLanguage: "Stöder {languageName}",
    page_TooltipMayNotSupportLanguage: "Kanske inte stöder {languageName}",
    page_BadgePreview: "Förhandsgranskning",
    page_BadgeExperimental: "Experimentell",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "För närvarande tillgänglig TTS",
    page_NoTTSOptions: "Inga TTS-alternativ är för närvarande tillgängliga.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Ange ny API-nyckel {serviceName}",
    apiKeyManager_TestKey: "Testa nyckel",
    apiKeyManager_TestingKey: "Testar nyckel...",
    apiKeyManager_KeyIsValid: "Nyckeln är giltig.",
    apiKeyManager_KeyIsInvalid: "Nyckeln är ogiltig.",
    apiKeyManager_FailedToTestKey: "Det gick inte att testa nyckeln.",
    apiKeyManager_ErrorTestingKey: "Fel vid testning av nyckel: {error}",
    apiKeyManager_KeyProvider: "Leverantör",
    apiKeyManager_KeyName: "Nyckelnamn",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Åtgärd",

    // Model capabilities
    modelCapability_Vision: "Syn",
    modelCapability_JSON: "JSON-läge",
    modelCapability_Tools: "Verktygsanvändning",
    modelCapability_ImageGen: "Bildgenerering",
    modelCapability_Multilingual: "Flerspråkig",
    modelCapability_WebSearch: "Webbsökning",
    modelCapability_LargeContext: "Stor kontext",
    modelCapability_LongContext: "Lång kontext",
    modelCapability_FastResponse: "Snabbt svar",
    modelCapability_CostEffective: "Kostnadseffektiv",
    modelCapability_AdvancedReasoning: "Avancerat resonemang",
    modelCapability_Coding: "Kodning",
    modelCapability_Foundation: "Grundmodell",
    modelCapability_Experimental: "Experimentell",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Förhandsgranskning",
    modelCapability_RequiresVerification: "Kräver verifiering",
    modelCapability_RequiresAccount: "Kräver konto",

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