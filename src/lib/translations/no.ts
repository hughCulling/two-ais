// src/lib/translations/no.ts
export const no = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Innstillinger',
        signIn: 'Logg inn',
        signOut: 'Logg ut',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabisk',
        bn: 'Bengali',
        bg: 'Bulgarsk',
        zh: 'Kinesisk',
        hr: 'Kroatisk',
        cs: 'Tsjekkisk',
        da: 'Dansk',
        nl: 'Nederlandsk',
        en: 'Engelsk',
        et: 'Estisk',
        fi: 'Finsk',
        fr: 'Fransk',
        de: 'Tysk',
        el: 'Gresk',
        iw: 'Hebraisk',
        hi: 'Hindi',
        hu: 'Ungarsk',
        id: 'Indonesisk',
        it: 'Italiensk',
        ja: 'Japansk',
        ko: 'Koreansk',
        lv: 'Latvisk',
        lt: 'Litauisk',
        no: 'Norsk',
        pl: 'Polsk',
        pt: 'Portugisisk',
        ro: 'Rumensk',
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
        title: 'Innstillinger',
        sections: {
            appearance: 'Utseende',
            apiKeys: 'API-nøkler',
            language: 'Språk',
        },
        appearance: {
            theme: 'Tema',
            light: 'Lys',
            dark: 'Mørk',
            system: 'System',
            description: "Tilpass utseendet og følelsen til applikasjonen."
        },
        language: {
            title: 'Språk',
            description: 'Velg ditt foretrukne språk for grensesnittet',
            conversationLanguage: 'Samtalespråk',
            conversationLanguageDescription: 'Språket som brukes for AI-samtaler vil matche språket i grensesnittet ditt',
        },
        apiKeys: {
            title: 'API-nøkler',
            description: 'Administrer API-nøklene dine for forskjellige AI-leverandører',
            saved: 'Lagret',
            notSet: 'Ikke angitt',
            setKey: 'Angi nøkkel',
            updateKey: 'Oppdater nøkkel',
            removeKey: 'Fjern nøkkel',
            getKeyInstructions: 'Få API-nøkkelen din',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Ingen nye API-nøkler er lagt inn for lagring.",
            unexpectedResponse: "Mottok et uventet svar fra serveren.",
            failedToSaveKey: "Kunne ikke lagre {serviceName}-nøkkel.",
            someKeysNotSaved: "Noen API-nøkler kunne ikke lagres. Vennligst sjekk detaljene nedenfor.",
            keyStatus: "nøkkelstatus...",
            apiKeySecurelySaved: "API-nøkkel lagret sikkert",
            confirmRemoveTitle: "Bekreft fjerning",
            confirmRemoveDescription: "Er du sikker på at du vil fjerne API-nøkkelen for {serviceName}? Denne handlingen kan ikke angres.",
            failedToRemoveKey: "Kunne ikke fjerne {serviceName}-nøkkel.",
            successfullyRemovedKey: "{serviceName}-nøkkel fjernet.",
            keyNotSet: "Nøkkelstatus: Ikke angitt",
            keySet: "Nøkkelstatus: Angitt",
            saveButton: "Lagre API-nøkkel(er)"
        },
    },

    // Main page
    main: {
        title: 'AI-samtale',
        setupForm: {
            title: 'Sett opp samtalen din',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Modell',
            selectModel: 'Velg en modell',
            tts: {
                title: 'Tekst-til-tale',
                enable: 'Aktiver tekst-til-tale',
                provider: 'TTS-leverandør',
                selectProvider: 'Velg TTS-leverandør',
                voice: 'Stemme',
                selectVoice: 'Velg stemme',
                model: 'TTS-modell',
                selectModel: 'Velg TTS-modell',
            },
            startConversation: 'Start samtale',
            conversationPrompt: 'Start samtalen.',
        },
        conversation: {
            thinking: 'tenker...',
            stop: 'Stopp',
            restart: 'Start samtalen på nytt',
        },
        pricing: {
            estimatedCost: 'Estimert kostnad',
            perMillionTokens: 'per million tokens',
            input: 'Input',
            output: 'Output',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Logg inn på Two AIs', // Keep brand name
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Passord',
            signIn: 'Logg inn',
            signInWithGoogle: 'Logg inn med Google',
            noAccount: "Har du ikke konto?",
            signUp: 'Registrer deg',
            forgotPassword: 'Glemt passord?',
            signingIn: "Logger inn..."
        },
        signup: {
            title: 'Opprett konto',
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Passord (minimum 6 tegn)',
            signUp: 'Registrer deg',
            signUpWithGoogle: 'Registrer deg med Google',
            hasAccount: 'Har du allerede konto?',
            signIn: 'Logg inn',
            emailLabel: "E-postadresse",
            confirmPasswordPlaceholder: "Bekreft passord",
            signingUp: "Registrerer..."
        },
        errors: {
            invalidCredentials: 'Ugyldig e-post eller passord',
            userNotFound: 'Bruker ikke funnet',
            weakPassword: 'Passordet må være på minst 6 tegn',
            emailInUse: 'E-posten er allerede i bruk',
            generic: 'Det oppstod en feil. Vennligst prøv igjen.',
            initialization: "Initialiseringsfeil. Vennligst prøv igjen senere.",
            invalidEmail: "Vennligst skriv inn en gyldig e-postadresse.",
            tooManyRequests: "Tilgang midlertidig deaktivert på grunn av for mange mislykkede påloggingsforsøk. Tilbakestill passordet ditt eller prøv igjen senere.",
            signInFailedPrefix: "Innlogging mislyktes: ",
            unknownSignInError: "Ukjent feil oppstod under innlogging.",
            profileSaveFailedPrefix: "Innlogget, men lagring av profildata mislyktes: ",
            profileCheckSaveFailedPrefix: "Innlogget, men kontroll/lagring av profildata mislyktes: ",
            accountExistsWithDifferentCredential: "En konto med denne e-postadressen eksisterer allerede med en annen påloggingsmetode.",
            googleSignInFailedPrefix: "Google-innlogging mislyktes: ",
            unknownGoogleSignInError: "Ukjent feil oppstod under Google-innlogging.",
            passwordsDoNotMatch: "Passordene stemmer ikke overens.",
            accountCreatedProfileSaveFailedPrefix: "Konto opprettet, men lagring av profildata mislyktes: ",
            unknownProfileSaveError: "Ukjent feil oppstod under lagring av profil.",
            emailAlreadyRegistered: "Denne e-postadressen er allerede registrert.",
            passwordTooShortSignUp: "Passordet må være på minst 6 tegn.",
            signUpFailedPrefix: "Registrering mislyktes: ",
            unknownSignUpError: "Ukjent feil oppstod under registrering."
        },
    },

    // Common
    common: {
        loading: 'Laster...',
        error: 'Feil',
        save: 'Lagre',
        cancel: 'Avbryt',
        delete: 'Slett',
        confirm: 'Bekreft',
        or: 'eller',
        MoreInformation: "Mer informasjon",
        Example: "Eksempel:",
        ShowMore: "Vis mer",
        ShowLess: "Vis mindre",
        AwaitingApproval: "Venter på godkjenning...",
        OpenInNewTab: "Åpne i ny fane",
        AdvancedSettings: "Avanserte innstillinger",
        Name: "Navn",
        Created: "Opprettet",
        Updated: "Oppdatert",
        Launched: "Lansert",
        Docs: "Dokumentasjon",
        Blog: "Blogg",
        Pricing: "Priser",
        Terms: "Vilkår",
        Privacy: "Personvern",
        Changelog: "Endringslogg",
        Copy: "Kopier",
        Copied: "Kopiert",
        TryAgain: "Prøv igjen"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API-nøkkel mangler",
    apiKeyMissingSubtext: "API-nøkkelen for denne leverandøren mangler eller er ugyldig. Legg den til i innstillingene.",
    apiKeyNotNeeded: "API-nøkkel ikke nødvendig",
    apiKeyNotNeededSubtext: "Denne leverandøren krever ikke API-nøkkel for gratisnivået eller visse modeller.",
    apiKeyFound: "API-nøkkel angitt",
    apiKeyFoundSubtext: "En API-nøkkel er konfigurert for denne leverandøren.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Flaggskip-chatmodeller",
    modelCategory_Reasoning: "Resonneringsmodeller",
    modelCategory_CostOptimized: "Kostnadsoptimaliserte modeller",
    modelCategory_OlderGPT: "Eldre GPT-modeller",
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
    page_ErrorLoadingUserData: "Kunne ikke laste brukerdata: {errorMessage}. Prøv å laste inn på nytt.",
    page_ErrorUserNotFound: "Bruker ikke funnet. Logg inn på nytt.",
    page_ErrorUserApiKeyConfig: "Brukerens API-nøkkelkonfigurasjon kunne ikke lastes. Last inn på nytt eller sjekk innstillingene.",
    page_ErrorStartingSessionAPI: "API-feil: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Feil ved start av økt: {errorMessage}",
    page_ErrorSessionIdMissing: "API-svar vellykket, men inkluderte ikke en samtale-ID.",
    page_LoadingUserData: "Laster brukerdata...",
    page_ErrorAlertTitle: "Feil",
    page_WelcomeTitle: "Velkommen til Two AIs",
    page_WelcomeSubtitle: "Denne nettsiden lar deg lytte til samtaler mellom to LLM-er.",
    page_ApiKeysRequiredTitle: "API-nøkler kreves",
    page_ApiKeysRequiredDescription: "For å kjøre samtaler, må du oppgi dine egne API-nøkler for AI-modellene du ønsker å bruke (f.eks. OpenAI, Google, Anthropic) etter pålogging. Detaljerte instruksjoner for hver leverandør finner du på siden Innstillinger / API-nøkler etter pålogging.",
    page_SignInPrompt: "For å starte din egen økt, kan du logge inn eller opprette en konto via lenken i toppteksten.",
    page_VideoTitle: "Two AIs-samtaledemo",
    page_AvailableLLMsTitle: "Tilgjengelige LLM-er",
    page_TooltipGoogleThinkingBudget: "Denne Google-modellen bruker et 'tenkebudsjett'. 'Tenke'-output faktureres, men er ikke synlig i chatten.",
    page_TooltipAnthropicExtendedThinking: "Denne Anthropic-modellen bruker 'utvidet tenkning'. 'Tenke'-output faktureres, men er ikke synlig i chatten.",
    page_TooltipXaiThinking: "Denne xAI-modellen bruker 'tenkning'. Denne outputen faktureres, men er ikke synlig i chatten.",
    page_TooltipQwenReasoning: "Denne Qwen-modellen bruker 'resonnering/tenkning'. Denne outputen faktureres, men er ikke synlig i chatten.",
    page_TooltipDeepSeekReasoning: "Denne DeepSeek-modellen bruker 'resonnering/tenkning'. Output faktureres, men er ikke synlig i chatten.",
    page_TooltipGenericReasoning: "Denne modellen bruker resonneringstokener som ikke er synlige i chatten, men som faktureres som outputtokener.",
    page_TooltipRequiresVerification: "Krever verifisert OpenAI-organisasjon. Du kan verifisere her.",
    page_TooltipSupportsLanguage: "Støtter {languageName}",
    page_TooltipMayNotSupportLanguage: "Støtter kanskje ikke {languageName}",
    page_BadgePreview: "Forhåndsvisning",
    page_BadgeExperimental: "Eksperimentell",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Tilgjengelige TTS",
    page_NoTTSOptions: "Ingen TTS-alternativer er tilgjengelige for øyeblikket.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Skriv inn ny {serviceName} API-nøkkel",
    apiKeyManager_TestKey: "Test nøkkel",
    apiKeyManager_TestingKey: "Tester nøkkel...",
    apiKeyManager_KeyIsValid: "Nøkkelen er gyldig.",
    apiKeyManager_KeyIsInvalid: "Nøkkelen er ugyldig.",
    apiKeyManager_FailedToTestKey: "Testing av nøkkel mislyktes.",
    apiKeyManager_ErrorTestingKey: "Feil ved testing av nøkkel: {error}",
    apiKeyManager_KeyProvider: "Leverandør",
    apiKeyManager_KeyName: "Nøkkelnavn",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Handling",

    // Model capabilities
    modelCapability_Vision: "Syn",
    modelCapability_JSON: "JSON-modus",
    modelCapability_Tools: "Verktøybruk",
    modelCapability_ImageGen: "Bildegenerering",
    modelCapability_Multilingual: "Flerspråklig",
    modelCapability_WebSearch: "Nettsøk",
    modelCapability_LargeContext: "Stor kontekst",
    modelCapability_LongContext: "Lang kontekst",
    modelCapability_FastResponse: "Rask respons",
    modelCapability_CostEffective: "Kostnadseffektiv",
    modelCapability_AdvancedReasoning: "Avansert resonnering",
    modelCapability_Coding: "Koding",
    modelCapability_Foundation: "Grunnmodell",
    modelCapability_Experimental: "Eksperimentell",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Forhåndsvisning",
    modelCapability_RequiresVerification: "Krever verifisering",
    modelCapability_RequiresAccount: "Krever konto",

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
    ttsVoice_Ugne: "Ugne", // Keep name (Lithuanian)

    // --------------- END OF FILE ---------------
}; 