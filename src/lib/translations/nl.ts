// src/lib/translations/nl.ts
const nl = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Instellingen',
        signIn: 'Inloggen',
        signOut: 'Uitloggen',
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
        title: 'Instellingen',
        sections: {
            appearance: 'Uiterlijk',
            apiKeys: 'API-sleutels',
            language: 'Taal',
        },
        appearance: {
            theme: 'Thema',
            light: 'Licht',
            dark: 'Donker',
            system: 'Systeem',
            description: "Pas het uiterlijk en de werking van de applicatie aan."
        },
        language: {
            title: 'Taal',
            description: 'Kies uw voorkeurstaal voor de interface',
            conversationLanguage: 'Gesprekstaal',
            conversationLanguageDescription: 'De taal die voor AI-gesprekken wordt gebruikt, komt overeen met uw interfacetail',
        },
        apiKeys: {
            title: 'API-sleutels',
            description: 'Beheer uw API-sleutels voor verschillende AI-providers',
            saved: 'Opgeslagen',
            notSet: 'Niet ingesteld',
            setKey: 'Sleutel instellen',
            updateKey: 'Sleutel bijwerken',
            removeKey: 'Sleutel verwijderen',
            getKeyInstructions: 'Haal je API-sleutel op',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Geen nieuwe API-sleutels ingevoerd om op te slaan.",
            unexpectedResponse: "Onverwacht antwoord van de server ontvangen.",
            failedToSaveKey: "Opslaan van {serviceName}-sleutel mislukt.",
            someKeysNotSaved: "Sommige API-sleutels konden niet worden opgeslagen. Controleer de onderstaande gegevens.",
            keyStatus: "sleutelstatus...",
            apiKeySecurelySaved: "API-sleutel veilig opgeslagen",
            confirmRemoveTitle: "Verwijderen bevestigen",
            confirmRemoveDescription: "Weet u zeker dat u de API-sleutel voor {serviceName} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.",
            failedToRemoveKey: "Verwijderen van {serviceName}-sleutel mislukt.",
            successfullyRemovedKey: "{serviceName}-sleutel succesvol verwijderd.",
            keyNotSet: "Sleutelstatus: niet ingesteld",
            keySet: "Sleutelstatus: ingesteld",
            saveButton: "API-sleutel(s) opslaan"
        },
    },

    // Main page
    main: {
        title: 'AI-gesprek',
        setupForm: {
            title: 'Stel uw gesprek in',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Selecteer een model',
            tts: {
                title: 'Tekst-naar-spraak',
                enable: 'Tekst-naar-spraak inschakelen',
                provider: 'TTS-provider',
                selectProvider: 'Selecteer TTS-provider',
                voice: 'Stem',
                selectVoice: 'Selecteer stem',
                model: 'TTS-model',
                selectModel: 'Selecteer TTS-model',
            },
            startConversation: 'Gesprek starten',
            conversationPrompt: 'Start het gesprek.',
        },
        conversation: {
            thinking: 'denkt na...',
            stop: 'Stoppen',
            restart: 'Gesprek opnieuw starten',
        },
        pricing: {
            estimatedCost: 'Geschatte kosten',
            perMillionTokens: 'per miljoen tokens',
            input: 'Invoer',
            output: 'Uitvoer',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Inloggen bij Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Wachtwoord',
            signIn: 'Inloggen',
            signInWithGoogle: 'Inloggen met Google',
            noAccount: "Geen account?",
            signUp: 'Registreren',
            forgotPassword: 'Wachtwoord vergeten?',
            orContinueWith: "Of ga verder met",
            signingIn: "Inloggen..."
        },
        signup: {
            title: 'Account aanmaken',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Wachtwoord (minimaal 6 tekens)',
            signUp: 'Registreren',
            signUpWithGoogle: 'Registreren met Google',
            hasAccount: 'Al een account?',
            signIn: 'Inloggen',
            emailLabel: "E-mailadres",
            confirmPasswordPlaceholder: "Bevestig wachtwoord",
            signingUp: "Registreren..."
        },
        errors: {
            invalidCredentials: 'Ongeldige e-mail of wachtwoord',
            userNotFound: 'Gebruiker niet gevonden',
            weakPassword: 'Wachtwoord moet minimaal 6 tekens lang zijn',
            emailInUse: 'E-mailadres is al in gebruik',
            generic: 'Er is een fout opgetreden. Probeer het opnieuw.',
            initialization: "Initialisatiefout. Probeer het later opnieuw.",
            invalidEmail: "Voer een geldig e-mailadres in.",
            tooManyRequests: "Toegang tijdelijk uitgeschakeld vanwege te veel mislukte inlogpogingen. Reset uw wachtwoord of probeer het later opnieuw.",
            signInFailedPrefix: "Inloggen mislukt: ",
            unknownSignInError: "Onbekende fout opgetreden tijdens inloggen.",
            profileSaveFailedPrefix: "Ingelogd, maar opslaan van profielgegevens mislukt: ",
            profileCheckSaveFailedPrefix: "Ingelogd, maar controleren/opslaan van profielgegevens mislukt: ",
            accountExistsWithDifferentCredential: "Er bestaat al een account met dit e-mailadres via een andere inlogmethode.",
            googleSignInFailedPrefix: "Inloggen met Google mislukt: ",
            unknownGoogleSignInError: "Onbekende fout opgetreden tijdens inloggen met Google.",
            passwordsDoNotMatch: "Wachtwoorden komen niet overeen.",
            accountCreatedProfileSaveFailedPrefix: "Account aangemaakt, maar opslaan van profielgegevens mislukt: ",
            unknownProfileSaveError: "Onbekende fout opgetreden tijdens opslaan van profiel.",
            emailAlreadyRegistered: "Dit e-mailadres is al geregistreerd.",
            passwordTooShortSignUp: "Wachtwoord moet minimaal 6 tekens lang zijn.",
            signUpFailedPrefix: "Registreren mislukt: ",
            unknownSignUpError: "Onbekende fout opgetreden tijdens registreren."
        },
    },

    // Common
    common: {
        loading: 'Laden...',
        error: 'Fout',
        save: 'Opslaan',
        cancel: 'Annuleren',
        delete: 'Verwijderen',
        confirm: 'Bevestigen',
        or: 'of',
        MoreInformation: "Meer informatie",
        Example: "Voorbeeld:",
        ShowMore: "Meer weergeven",
        ShowLess: "Minder weergeven",
        AwaitingApproval: "Wachten op goedkeuring...",
        OpenInNewTab: "Openen in nieuw tabblad",
        AdvancedSettings: "Geavanceerde instellingen",
        Name: "Naam",
        Created: "Aangemaakt",
        Updated: "Bijgewerkt",
        Launched: "Gelanceerd",
        Docs: "Documentatie",
        Blog: "Blog",
        Pricing: "Prijzen",
        Terms: "Voorwaarden",
        Privacy: "Privacy",
        Changelog: "Wijzigingslogboek",
        Copy: "Kopiëren",
        Copied: "Gekopieerd",
        TryAgain: "Probeer opnieuw"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API-sleutel ontbreekt",
    apiKeyMissingSubtext: "De API-sleutel voor deze provider ontbreekt of is ongeldig. Voeg deze toe in de instellingen.",
    apiKeyNotNeeded: "API-sleutel niet nodig",
    apiKeyNotNeededSubtext: "Deze provider vereist geen API-sleutel voor de gratis laag of bepaalde modellen.",
    apiKeyFound: "API-sleutel ingesteld",
    apiKeyFoundSubtext: "Er is een API-sleutel geconfigureerd voor deze provider.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Toonaangevende chatmodellen",
    modelCategory_Reasoning: "Redeneermodellen",
    modelCategory_CostOptimized: "Kostengeoptimaliseerde modellen",
    modelCategory_OlderGPT: "Oudere GPT-modellen",
    modelCategory_Gemini2_5: "Gemini 2.5-serie",
    modelCategory_Gemini2_0: "Gemini 2.0-serie",
    modelCategory_Gemini1_5: "Gemini 1.5-serie",
    modelCategory_Claude3_7: "Claude 3.7-serie",
    modelCategory_Claude3_5: "Claude 3.5-serie",
    modelCategory_Claude3: "Claude 3-serie",
    modelCategory_Grok3: "Grok 3-serie",
    modelCategory_Grok3Mini: "Grok 3 Mini-serie",
    modelCategory_Llama4: "Llama 4-serie",
    modelCategory_Llama3_3: "Llama 3.3-serie",
    modelCategory_Llama3_2: "Llama 3.2-serie",
    modelCategory_Llama3_1: "Llama 3.1-serie",
    modelCategory_Llama3: "Llama 3-serie",
    modelCategory_LlamaVision: "Llama Vision-modellen",
    modelCategory_MetaLlama: "Meta Llama-modellen",
    modelCategory_Gemma2: "Gemma 2-serie",
    modelCategory_Gemma: "Gemma-serie",
    modelCategory_GoogleGemma: "Google Gemma-modellen",
    modelCategory_DeepSeekR1: "DeepSeek R1-serie",
    modelCategory_DeepSeekV3: "DeepSeek V3-serie",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill-serie",
    modelCategory_DeepSeekModels: "DeepSeek-modellen",
    modelCategory_MistralAIModels: "Mistral AI-modellen",
    modelCategory_Qwen3: "Qwen3-serie",
    modelCategory_QwQwQ: "Qwen QwQ-serie",
    modelCategory_Qwen2_5: "Qwen2.5-serie",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision-serie",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder-serie",
    modelCategory_Qwen2: "Qwen2-serie",
    modelCategory_Qwen2Vision: "Qwen2 Vision-serie",
    modelCategory_QwenModels: "Qwen-modellen",
    modelCategory_OtherModels: "Andere modellen",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Laden van gebruikersgegevens mislukt: {errorMessage}. Probeer opnieuw te laden.",
    page_ErrorUserNotFound: "Gebruiker niet gevonden. Log opnieuw in.",
    page_ErrorUserApiKeyConfig: "Configuratie van API-sleutel voor gebruiker kon niet worden geladen. Laad opnieuw of controleer de instellingen.",
    page_ErrorStartingSessionAPI: "API-fout: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Fout bij starten van sessie: {errorMessage}",
    page_ErrorSessionIdMissing: "API-antwoord succesvol, maar bevatte geen gespreks-ID.",
    page_LoadingUserData: "Gebruikersgegevens laden...",
    page_ErrorAlertTitle: "Fout",
    page_WelcomeTitle: "Welkom bij Two AIs",
    page_WelcomeSubtitle: "Deze website laat u luisteren naar gesprekken tussen twee LLM's.",
    page_ApiKeysRequiredTitle: "API-sleutels vereist",
    page_ApiKeysRequiredDescription: "Om gesprekken te kunnen voeren, moet u na het inloggen uw eigen API-sleutels opgeven voor de AI-modellen die u wilt gebruiken (bijv. OpenAI, Google, Anthropic). Gedetailleerde instructies voor elke provider vindt u na het inloggen op de pagina Instellingen / API-sleutels.",
    page_SignInPrompt: "Om uw eigen sessie te starten, kunt u inloggen of een account aanmaken via de link in de koptekst.",
    page_VideoTitle: "Two AIs-gespreksdemo",
    page_AvailableLLMsTitle: "Momenteel beschikbare LLM's",
    page_TooltipGoogleThinkingBudget: "Dit Google-model gebruikt een 'denkbudget'. De 'denk'-output wordt gefactureerd maar is niet zichtbaar in de chat.",
    page_TooltipAnthropicExtendedThinking: "Dit Anthropic-model gebruikt 'uitgebreid denken'. De 'denk'-output wordt gefactureerd maar is niet zichtbaar in de chat.",
    page_TooltipXaiThinking: "Dit xAI-model gebruikt 'denken'. Deze output wordt gefactureerd maar is niet zichtbaar in de chat.",
    page_TooltipQwenReasoning: "Dit Qwen-model gebruikt 'redeneren/denken'. Deze output wordt gefactureerd maar is niet zichtbaar in de chat.",
    page_TooltipDeepSeekReasoning: "Dit DeepSeek-model gebruikt 'redeneren/denken'. Output wordt gefactureerd maar is niet zichtbaar in de chat.",
    page_TooltipGenericReasoning: "Dit model gebruikt redeneertokens die niet zichtbaar zijn in de chat, maar wel worden gefactureerd als outputtokens.",
    page_TooltipRequiresVerification: "Vereist geverifieerde OpenAI-organisatie. U kunt hier verifiëren.",
    page_TooltipSupportsLanguage: "Ondersteunt {languageName}",
    page_TooltipMayNotSupportLanguage: "Ondersteunt mogelijk {languageName} niet",
    page_BadgePreview: "Voorbeeld",
    page_BadgeExperimental: "Experimenteel",
    page_BadgeBeta: "Bèta",
    page_AvailableTTSTitle: "Momenteel beschikbare TTS",
    page_NoTTSOptions: "Momenteel geen TTS-opties beschikbaar.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Voer nieuwe {serviceName} API-sleutel in",
    apiKeyManager_TestKey: "Sleutel testen",
    apiKeyManager_TestingKey: "Sleutel testen...",
    apiKeyManager_KeyIsValid: "Sleutel is geldig.",
    apiKeyManager_KeyIsInvalid: "Sleutel is ongeldig.",
    apiKeyManager_FailedToTestKey: "Testen van sleutel mislukt.",
    apiKeyManager_ErrorTestingKey: "Fout bij testen van sleutel: {error}",
    apiKeyManager_KeyProvider: "Provider",
    apiKeyManager_KeyName: "Sleutelnaam",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Actie",

    // Model capabilities
    modelCapability_Vision: "Visie",
    modelCapability_JSON: "JSON-modus",
    modelCapability_Tools: "Toolgebruik",
    modelCapability_ImageGen: "Afbeelding genereren",
    modelCapability_Multilingual: "Meertalig",
    modelCapability_WebSearch: "Web zoeken",
    modelCapability_LargeContext: "Grote context",
    modelCapability_LongContext: "Lange context",
    modelCapability_FastResponse: "Snelle reactie",
    modelCapability_CostEffective: "Kosteneffectief",
    modelCapability_AdvancedReasoning: "Geavanceerd redeneren",
    modelCapability_Coding: "Coderen",
    modelCapability_Foundation: "Basismodel",
    modelCapability_Experimental: "Experimenteel",
    modelCapability_Beta: "Bèta",
    modelCapability_Preview: "Voorbeeld",
    modelCapability_RequiresVerification: "Verificatie vereist",
    modelCapability_RequiresAccount: "Account vereist",

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
export default nl; 