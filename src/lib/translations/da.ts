// src/lib/translations/da.ts
export const da = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Indstillinger',
        signIn: 'Log ind',
        signOut: 'Log ud',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabisk',
        bn: 'Bengalsk',
        bg: 'Bulgarsk',
        zh: 'Kinesisk',
        hr: 'Kroatisk',
        cs: 'Tjekkisk',
        da: 'Dansk',
        nl: 'Hollandsk',
        en: 'Engelsk',
        et: 'Estisk',
        fi: 'Finsk',
        fr: 'Fransk',
        de: 'Tysk',
        el: 'Græsk',
        iw: 'Hebraisk',
        hi: 'Hindi',
        hu: 'Ungarsk',
        id: 'Indonesisk',
        it: 'Italiensk',
        ja: 'Japansk',
        ko: 'Koreansk',
        lv: 'Lettisk',
        lt: 'Litauisk',
        no: 'Norsk',
        pl: 'Polsk',
        pt: 'Portugisisk',
        ro: 'Rumænsk',
        ru: 'Russisk',
        sr: 'Serbisk',
        sk: 'Slovakisk',
        sl: 'Slovensk',
        es: 'Spansk',
        sw: 'Swahili',
        sv: 'Svensk',
        th: 'Thailandsk',
        tr: 'Tyrkisk',
        uk: 'Ukrainsk',
        vi: 'Vietnamesisk',
    },

    // Settings page
    settings: {
        title: 'Indstillinger',
        sections: {
            appearance: 'Udseende',
            apiKeys: 'API-nøgler',
            language: 'Sprog',
        },
        appearance: {
            theme: 'Tema',
            light: 'Lys',
            dark: 'Mørk',
            system: 'System',
            description: "Tilpas applikationens udseende og funktionalitet."
        },
        language: {
            title: 'Sprog',
            description: 'Vælg dit foretrukne sprog til grænsefladen',
            conversationLanguage: 'Samtalesprog',
            conversationLanguageDescription: 'Sproget, der bruges til AI-samtaler, matcher dit grænsefladesprog',
        },
        apiKeys: {
            title: 'API-nøgler',
            description: 'Administrer dine API-nøgler for forskellige AI-udbydere',
            saved: 'Gemt',
            notSet: 'Ikke indstillet',
            setKey: 'Indstil nøgle',
            updateKey: 'Opdater nøgle',
            removeKey: 'Fjern nøgle',
            getKeyInstructions: 'Få din API-nøgle',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Ingen nye API-nøgler indtastet for at gemme.",
            unexpectedResponse: "Modtog et uventet svar fra serveren.",
            failedToSaveKey: "Kunne ikke gemme {serviceName}-nøgle.",
            someKeysNotSaved: "Nogle API-nøgler kunne ikke gemmes. Kontroller venligst detaljerne nedenfor.",
            keyStatus: "nøglestatus...",
            apiKeySecurelySaved: "API-nøgle gemt sikkert",
            confirmRemoveTitle: "Bekræft fjernelse",
            confirmRemoveDescription: "Er du sikker på, at du vil fjerne API-nøglen for {serviceName}? Denne handling kan ikke fortrydes.",
            failedToRemoveKey: "Kunne ikke fjerne {serviceName}-nøgle.",
            successfullyRemovedKey: "{serviceName}-nøgle fjernet.",
            keyNotSet: "Nøglestatus: Ikke indstillet",
            keySet: "Nøglestatus: Indstillet",
            saveButton: "Gem API-nøgle(r)"
        },
    },

    // Main page
    main: {
        title: 'AI-samtale',
        setupForm: {
            title: 'Opsæt din samtale',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Vælg en model',
            tts: {
                title: 'Tekst-til-tale',
                enable: 'Aktiver tekst-til-tale',
                provider: 'TTS-udbyder',
                selectProvider: 'Vælg TTS-udbyder',
                voice: 'Stemme',
                selectVoice: 'Vælg stemme',
                model: 'TTS-model',
                selectModel: 'Vælg TTS-model',
            },
            startConversation: 'Start samtale',
            conversationPrompt: 'Start samtalen.',
        },
        conversation: {
            thinking: 'tænker...',
            stop: 'Stop',
            restart: 'Genstart samtale',
        },
        pricing: {
            estimatedCost: 'Anslåede omkostninger',
            perMillionTokens: 'pr. million tokens',
            input: 'Input',
            output: 'Output',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Log ind på Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Adgangskode',
            signIn: 'Log ind',
            signInWithGoogle: 'Log ind med Google',
            noAccount: "Har du ikke en konto?",
            signUp: 'Opret konto',
            forgotPassword: 'Glemt adgangskode?',
            orContinueWith: "Eller fortsæt med",
            signingIn: "Logger ind..."
        },
        signup: {
            title: 'Opret konto',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Adgangskode (mindst 6 tegn)',
            signUp: 'Opret konto',
            signUpWithGoogle: 'Opret konto med Google',
            hasAccount: 'Har du allerede en konto?',
            signIn: 'Log ind',
            emailLabel: "E-mailadresse",
            confirmPasswordPlaceholder: "Bekræft adgangskode",
            signingUp: "Opretter konto..."
        },
        errors: {
            invalidCredentials: 'Ugyldig e-mail eller adgangskode',
            userNotFound: 'Bruger ikke fundet',
            weakPassword: 'Adgangskoden skal være på mindst 6 tegn',
            emailInUse: 'E-mail er allerede i brug',
            generic: 'Der opstod en fejl. Prøv igen.',
            initialization: "Initialiseringsfejl. Prøv venligst igen senere.",
            invalidEmail: "Indtast venligst en gyldig e-mailadresse.",
            tooManyRequests: "Adgang midlertidigt deaktiveret på grund af for mange mislykkede loginforsøg. Nulstil venligst din adgangskode eller prøv igen senere.",
            signInFailedPrefix: "Login mislykkedes: ",
            unknownSignInError: "Der opstod en ukendt fejl under login.",
            profileSaveFailedPrefix: "Logget ind, men kunne ikke gemme profildata: ",
            profileCheckSaveFailedPrefix: "Logget ind, men kunne ikke kontrollere/gemme profildata: ",
            accountExistsWithDifferentCredential: "Der findes allerede en konto med denne e-mail ved hjælp af en anden loginmetode.",
            googleSignInFailedPrefix: "Google Login mislykkedes: ",
            unknownGoogleSignInError: "Der opstod en ukendt fejl under Google Login.",
            passwordsDoNotMatch: "Adgangskoderne stemmer ikke overens.",
            accountCreatedProfileSaveFailedPrefix: "Konto oprettet, men kunne ikke gemme profildata: ",
            unknownProfileSaveError: "Der opstod en ukendt fejl under lagring af profil.",
            emailAlreadyRegistered: "Denne e-mailadresse er allerede registreret.",
            passwordTooShortSignUp: "Adgangskoden skal være mindst 6 tegn lang.",
            signUpFailedPrefix: "Kunne ikke oprette konto: ",
            unknownSignUpError: "Der opstod en ukendt fejl under oprettelse af konto."
        },
    },

    // Common
    common: {
        loading: 'Indlæser...',
        error: 'Fejl',
        save: 'Gem',
        cancel: 'Annuller',
        delete: 'Slet',
        confirm: 'Bekræft',
        or: 'eller',
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API-nøgle mangler",
    apiKeyMissingSubtext: "API-nøglen for denne udbyder mangler eller er ugyldig. Tilføj den venligst i indstillingerne.",
    apiKeyNotNeeded: "API-nøgle ikke nødvendig",
    apiKeyNotNeededSubtext: "Denne udbyder kræver ikke en API-nøgle for dens gratis niveau eller visse modeller.",
    apiKeyFound: "API-nøgle indstillet",
    apiKeyFoundSubtext: "En API-nøgle er konfigureret for denne udbyder.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Førende chatmodeller",
    modelCategory_Reasoning: "Ræsonnementsmodeller",
    modelCategory_CostOptimized: "Omkostningsoptimerede modeller",
    modelCategory_OlderGPT: "Ældre GPT-modeller",
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
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill-serien",
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
    modelCategory_OtherModels: "Andre modeller",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Kunne ikke indlæse brugerdata: {errorMessage}. Prøv venligst at opdatere.",
    page_ErrorUserNotFound: "Bruger ikke fundet. Log venligst ind igen.",
    page_ErrorUserApiKeyConfig: "Brugerens API-nøglekonfiguration kunne ikke indlæses. Opdater venligst eller kontroller indstillingerne.",
    page_ErrorStartingSessionAPI: "API-fejl: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Fejl ved start af session: {errorMessage}",
    page_ErrorSessionIdMissing: "API-svar var vellykket, men inkluderede ikke et samtale-id.",
    page_LoadingUserData: "Indlæser brugerdata...",
    page_ErrorAlertTitle: "Fejl",
    page_WelcomeTitle: "Velkommen til Two AIs",
    page_WelcomeSubtitle: "Dette websted lader dig lytte til samtaler mellem to LLM'er.",
    page_ApiKeysRequiredTitle: "API-nøgler påkrævet",
    page_ApiKeysRequiredDescription: "For at køre samtaler skal du angive dine egne API-nøgler til de AI-modeller, du ønsker at bruge (f.eks. OpenAI, Google, Anthropic), efter du er logget ind. Detaljerede instruktioner for hver udbyder kan findes på siden Indstillinger / API-nøgler, efter du er logget ind.",
    page_SignInPrompt: "For at starte din egen session kan du logge ind eller oprette en konto ved hjælp af linket i sidehovedet.",
    page_VideoTitle: "Two AIs samtaledemo",
    page_AvailableLLMsTitle: "Aktuelt tilgængelige LLM'er",
    page_TooltipGoogleThinkingBudget: "Denne Google-model bruger et 'tænkebudget'. 'Tænke'-outputtet faktureres, men er ikke synligt i chatten.",
    page_TooltipAnthropicExtendedThinking: "Denne Anthropic-model bruger 'udvidet tænkning'. 'Tænke'-outputtet faktureres, men er ikke synligt i chatten.",
    page_TooltipXaiThinking: "Denne xAI-model bruger 'tænkning'. Dette output faktureres, men er ikke synligt i chatten.",
    page_TooltipQwenReasoning: "Denne Qwen-model bruger 'ræsonnement/tænkning'. Dette output faktureres, men er ikke synligt i chatten.",
    page_TooltipDeepSeekReasoning: "Denne DeepSeek-model bruger 'ræsonnement/tænkning'. Outputtet faktureres, men er ikke synligt i chatten.",
    page_TooltipGenericReasoning: "Denne model bruger ræsonnementstokens, der ikke er synlige i chatten, men faktureres som outputtokens.",
    page_TooltipRequiresVerification: "Kræver verificeret OpenAI-organisation. Du kan verificere her.",
    page_TooltipSupportsLanguage: "Understøtter {languageName}",
    page_TooltipMayNotSupportLanguage: "Understøtter muligvis ikke {languageName}",
    page_BadgePreview: "Forhåndsvisning",
    page_BadgeExperimental: "Eksperimentel",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Aktuelt tilgængelige TTS",
    page_NoTTSOptions: "Ingen TTS-muligheder er aktuelt tilgængelige.",
    page_TruncatableNoteFormat: "({noteText})",

    // Common (shared across pages)
    common_MoreInformation: "Mere information",
    common_Example: "Eksempel:",
    common_ShowMore: "Vis mere",
    common_ShowLess: "Vis mindre",
    common_AwaitingApproval: "Afventer godkendelse...",
    common_OpenInNewTab: "Åbn i ny fane",
    common_AdvancedSettings: "Avancerede indstillinger",
    common_Name: "Navn",
    common_Created: "Oprettet",
    common_Updated: "Opdateret",
    common_Launched: "Lanceret",
    common_Docs: "Dokumentation",
    common_Blog: "Blog",
    common_Pricing: "Priser",
    common_Terms: "Vilkår",
    common_Privacy: "Privatliv",
    common_Changelog: "Ændringslog",
    common_Copy: "Kopier",
    common_Copied: "Kopieret",
    common_TryAgain: "Prøv igen",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Indtast ny {serviceName} API-nøgle",
    apiKeyManager_TestKey: "Test nøgle",
    apiKeyManager_TestingKey: "Tester nøgle...",
    apiKeyManager_KeyIsValid: "Nøgle er gyldig.",
    apiKeyManager_KeyIsInvalid: "Nøgle er ugyldig.",
    apiKeyManager_FailedToTestKey: "Kunne ikke teste nøgle.",
    apiKeyManager_ErrorTestingKey: "Fejl under test af nøgle: {error}",
    apiKeyManager_KeyProvider: "Udbyder",
    apiKeyManager_KeyName: "Nøglenavn",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Handling",

    // Model capabilities
    modelCapability_Vision: "Vision",
    modelCapability_JSON: "JSON-tilstand",
    modelCapability_Tools: "Værktøjsbrug",
    modelCapability_ImageGen: "Billedgenerering",
    modelCapability_Multilingual: "Flersproget",
    modelCapability_WebSearch: "Websøgning",
    modelCapability_LargeContext: "Stor kontekst",
    modelCapability_LongContext: "Lang kontekst",
    modelCapability_FastResponse: "Hurtigt svar",
    modelCapability_CostEffective: "Omkostningseffektiv",
    modelCapability_AdvancedReasoning: "Avanceret ræsonnement",
    modelCapability_Coding: "Kodning",
    modelCapability_Foundation: "Grundmodel",
    modelCapability_Experimental: "Eksperimentel",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Forhåndsvisning",
    modelCapability_RequiresVerification: "Kræver verifikation",
    modelCapability_RequiresAccount: "Kræver konto",

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
}; 