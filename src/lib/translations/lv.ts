// src/lib/translations/lv.ts
export const lv = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Iestatījumi',
        signIn: 'Pieteikties',
        signOut: 'Izrakstīties',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arābu',
        bn: 'Bengāļu',
        bg: 'Bulgāru',
        zh: 'Ķīniešu',
        hr: 'Horvātu',
        cs: 'Čehu',
        da: 'Dāņu',
        nl: 'Holandiešu',
        en: 'Angļu',
        et: 'Igauņu',
        fi: 'Somu',
        fr: 'Franču',
        de: 'Vācu',
        el: 'Grieķu',
        iw: 'Ebreju',
        hi: 'Hindi',
        hu: 'Ungāru',
        id: 'Indonēziešu',
        it: 'Itāļu',
        ja: 'Japāņu',
        ko: 'Korejiešu',
        lv: 'Latviešu',
        lt: 'Lietuviešu',
        no: 'Norvēģu',
        pl: 'Poļu',
        pt: 'Portugāļu',
        ro: 'Rumāņu',
        ru: 'Krievu',
        sr: 'Serbu',
        sk: 'Slovāku',
        sl: 'Slovēņu',
        es: 'Spāņu',
        sw: 'Svahili',
        sv: 'Zviedru',
        th: 'Taju',
        tr: 'Turku',
        uk: 'Ukraiņu',
        vi: 'Vjetnamiešu',
    },

    // Settings page
    settings: {
        title: 'Iestatījumi',
        sections: {
            appearance: 'Izskats',
            apiKeys: 'API atslēgas',
            language: 'Valoda',
        },
        appearance: {
            theme: 'Tēma',
            light: 'Gaišs',
            dark: 'Tumšs',
            system: 'Sistēma',
            description: "Pielāgojiet lietojumprogrammas izskatu un darbību."
        },
        language: {
            title: 'Valoda',
            description: 'Izvēlieties vēlamo valodu saskarnei',
            conversationLanguage: 'Sarunvaloda',
            conversationLanguageDescription: 'AI sarunām izmantotā valoda atbildīs jūsu saskarnes valodai',
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
        title: 'AI Saruna',
        setupForm: {
            title: 'Iestatiet savu sarunu',
            agentA: 'Aģents A',
            agentB: 'Aģents B',
            model: 'Modelis',
            selectModel: 'Izvēlieties modeli',
            tts: {
                title: 'Teksts uz runu',
                enable: 'Iespējot tekstu uz runu',
                provider: 'TTS nodrošinātājs',
                selectProvider: 'Izvēlieties TTS nodrošinātāju',
                voice: 'Balss',
                selectVoice: 'Izvēlieties balsi',
                model: 'TTS modelis',
                selectModel: 'Izvēlieties TTS modeli',
            },
            startConversation: 'Sākt sarunu',
            conversationPrompt: 'Sāciet sarunu.',
        },
        conversation: {
            thinking: 'domā...',
            stop: 'Pārtraukt',
            restart: 'Restartēt sarunu',
        },
        pricing: {
            estimatedCost: 'Aprēķinātās izmaksas',
            perMillionTokens: 'par miljonu žetonu',
            input: 'Ievade',
            output: 'Izvade',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Pieteikties Two AIs', // Keep brand name
            emailPlaceholder: 'E-pasts',
            passwordPlaceholder: 'Parole',
            signIn: 'Pieteikties',
            signInWithGoogle: 'Pieteikties ar Google',
            noAccount: "Nav konta?",
            signUp: 'Reģistrēties',
            forgotPassword: 'Aizmirsāt paroli?',
            orContinueWith: "Or continue with", // TODO: Translate
            signingIn: "Pierakstās..."
        },
        signup: {
            title: 'Izveidot kontu',
            emailPlaceholder: 'E-pasts',
            passwordPlaceholder: 'Parole (vismaz 6 rakstzīmes)',
            signUp: 'Reģistrēties',
            signUpWithGoogle: 'Reģistrēties ar Google',
            hasAccount: 'Jau ir konts?',
            signIn: 'Pieteikties',
            emailLabel: "E-pasta adrese",
            confirmPasswordPlaceholder: "Apstipriniet paroli",
            signingUp: "Reģistrējas..."
        },
        errors: {
            invalidCredentials: 'Nederīgs e-pasts vai parole',
            userNotFound: 'Lietotājs nav atrasts',
            weakPassword: 'Parolei jābūt vismaz 6 rakstzīmēm garai',
            emailInUse: 'E-pasts jau tiek izmantots',
            generic: 'Radās kļūda. Lūdzu, mēģiniet vēlreiz.',
            initialization: "Inicializācijas kļūda. Lūdzu, mēģiniet vēlāk.",
            invalidEmail: "Lūdzu, ievadiet derīgu e-pasta adresi.",
            tooManyRequests: "Piekļuve īslaicīgi atspējota pārāk daudzu neveiksmīgu pieteikšanās mēģinājumu dēļ. Lūdzu, atiestatiet paroli vai mēģiniet vēlāk.",
            signInFailedPrefix: "Pieteikšanās neizdevās: ",
            unknownSignInError: "Pieteikšanās laikā radās nezināma kļūda.",
            profileSaveFailedPrefix: "Pieteicās, bet neizdevās saglabāt profila datus: ",
            profileCheckSaveFailedPrefix: "Pieteicās, bet neizdevās pārbaudīt/saglabāt profila datus: ",
            accountExistsWithDifferentCredential: "Konts ar šo e-pasta adresi jau pastāv, izmantojot citu pieteikšanās metodi.",
            googleSignInFailedPrefix: "Google pieteikšanās neizdevās: ",
            unknownGoogleSignInError: "Google pieteikšanās laikā radās nezināma kļūda.",
            passwordsDoNotMatch: "Paroles nesakrīt.",
            accountCreatedProfileSaveFailedPrefix: "Konts tika izveidots, bet neizdevās saglabāt profila datus: ",
            unknownProfileSaveError: "Profila saglabāšanas laikā radās nezināma kļūda.",
            emailAlreadyRegistered: "Šī e-pasta adrese jau ir reģistrēta.",
            passwordTooShortSignUp: "Parolei jābūt vismaz 6 rakstzīmēm garai.",
            signUpFailedPrefix: "Reģistrēšanās neizdevās: ",
            unknownSignUpError: "Reģistrēšanās laikā radās nezināma kļūda."
        },
    },

    // Common
    common: {
        loading: 'Notiek ielāde...',
        error: 'Kļūda',
        save: 'Saglabāt',
        cancel: 'Atcelt',
        delete: 'Dzēst',
        confirm: 'Apstiprināt',
        or: 'vai',
        MoreInformation: "Vairāk informācijas",
        Example: "Piemērs:",
        ShowMore: "Rādīt vairāk",
        ShowLess: "Rādīt mazāk",
        AwaitingApproval: "Gaida apstiprinājumu...",
        OpenInNewTab: "Atvērt jaunā cilnē",
        AdvancedSettings: "Papildu iestatījumi",
        Name: "Nosaukums",
        Created: "Izveidots",
        Updated: "Atjaunināts",
        Launched: "Palaists",
        Docs: "Dokumentācija",
        Blog: "Blogs",
        Pricing: "Cenas",
        Terms: "Noteikumi",
        Privacy: "Privātums",
        Changelog: "Izmaiņu žurnāls",
        Copy: "Kopēt",
        Copied: "Nokopēts",
        TryAgain: "Mēģiniet vēlreiz"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Trūkst API atslēgas",
    apiKeyMissingSubtext: "Šī nodrošinātāja API atslēga trūkst vai ir nederīga. Lūdzu, pievienojiet to iestatījumos.",
    apiKeyNotNeeded: "API atslēga nav nepieciešama",
    apiKeyNotNeededSubtext: "Šis nodrošinātājs neprasa API atslēgu savam bezmaksas līmenim vai noteiktiem modeļiem.",
    apiKeyFound: "API atslēga ir iestatīta",
    apiKeyFoundSubtext: "Šim nodrošinātājam ir konfigurēta API atslēga.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Vadošie tērzēšanas modeļi",
    modelCategory_Reasoning: "Spriešanas modeļi",
    modelCategory_CostOptimized: "Izmaksu optimizēti modeļi",
    modelCategory_OlderGPT: "Vecāki GPT modeļi",
    modelCategory_Gemini2_5: "Gemini 2.5 sērija",
    modelCategory_Gemini2_0: "Gemini 2.0 sērija",
    modelCategory_Gemini1_5: "Gemini 1.5 sērija",
    modelCategory_Claude3_7: "Claude 3.7 sērija",
    modelCategory_Claude3_5: "Claude 3.5 sērija",
    modelCategory_Claude3: "Claude 3 sērija",
    modelCategory_Grok3: "Grok 3 sērija",
    modelCategory_Grok3Mini: "Grok 3 Mini sērija",
    modelCategory_Llama4: "Llama 4 sērija",
    modelCategory_Llama3_3: "Llama 3.3 sērija",
    modelCategory_Llama3_2: "Llama 3.2 sērija",
    modelCategory_Llama3_1: "Llama 3.1 sērija",
    modelCategory_Llama3: "Llama 3 sērija",
    modelCategory_LlamaVision: "Llama Vision modeļi",
    modelCategory_MetaLlama: "Meta Llama modeļi",
    modelCategory_Gemma2: "Gemma 2 sērija",
    modelCategory_Gemma: "Gemma sērija",
    modelCategory_GoogleGemma: "Google Gemma modeļi",
    modelCategory_DeepSeekR1: "DeepSeek R1 sērija",
    modelCategory_DeepSeekV3: "DeepSeek V3 sērija",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill sērija",
    modelCategory_DeepSeekModels: "DeepSeek modeļi",
    modelCategory_MistralAIModels: "Mistral AI modeļi",
    modelCategory_Qwen3: "Qwen3 sērija",
    modelCategory_QwQwQ: "Qwen QwQ sērija",
    modelCategory_Qwen2_5: "Qwen2.5 sērija",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision sērija",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder sērija",
    modelCategory_Qwen2: "Qwen2 sērija",
    modelCategory_Qwen2Vision: "Qwen2 Vision sērija",
    modelCategory_QwenModels: "Qwen modeļi",
    modelCategory_OtherModels: "Citi modeļi",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Neizdevās ielādēt lietotāja datus: {errorMessage}. Lūdzu, mēģiniet atsvaidzināt.",
    page_ErrorUserNotFound: "Lietotājs nav atrasts. Lūdzu, piesakieties vēlreiz.",
    page_ErrorUserApiKeyConfig: "Lietotāja API atslēgas konfigurāciju nevarēja ielādēt. Lūdzu, atsvaidziniet vai pārbaudiet iestatījumus.",
    page_ErrorStartingSessionAPI: "API kļūda: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Kļūda, sākot sesiju: {errorMessage}",
    page_ErrorSessionIdMissing: "API atbilde bija veiksmīga, bet tajā nebija iekļauts sarunas ID.",
    page_LoadingUserData: "Notiek lietotāja datu ielāde...",
    page_ErrorAlertTitle: "Kļūda",
    page_WelcomeTitle: "Laipni lūdzam Two AIs",
    page_WelcomeSubtitle: "Šī vietne ļauj klausīties sarunas starp diviem LLM.",
    page_ApiKeysRequiredTitle: "Nepieciešamas API atslēgas",
    page_ApiKeysRequiredDescription: "Lai palaistu sarunas, pēc pieteikšanās jums būs jānorāda savas API atslēgas AI modeļiem, kurus vēlaties izmantot (piemēram, OpenAI, Google, Anthropic). Sīkākas instrukcijas katram nodrošinātājam var atrast sadaļā Iestatījumi / API atslēgas pēc pieteikšanās.",
    page_SignInPrompt: "Lai sāktu savu sesiju, varat pieteikties vai izveidot kontu, izmantojot saiti galvenē.",
    page_VideoTitle: "Two AIs sarunas demonstrācija",
    page_AvailableLLMsTitle: "Pašlaik pieejamie LLM",
    page_TooltipGoogleThinkingBudget: "Šis Google modelis izmanto \"domāšanas budžetu\". \"Domāšanas\" izvade tiek apmaksāta, bet tērzēšanā nav redzama.",
    page_TooltipAnthropicExtendedThinking: "Šis Anthropic modelis izmanto \"paplašinātu domāšanu\". \"Domāšanas\" izvade tiek apmaksāta, bet tērzēšanā nav redzama.",
    page_TooltipXaiThinking: "Šis xAI modelis izmanto \"domāšanu\". Šī izvade tiek apmaksāta, bet tērzēšanā nav redzama.",
    page_TooltipQwenReasoning: "Šis Qwen modelis izmanto \"spriešanu/domāšanu\". Šī izvade tiek apmaksāta, bet tērzēšanā nav redzama.",
    page_TooltipDeepSeekReasoning: "Šis DeepSeek modelis izmanto \"spriešanu/domāšanu\". Izvade tiek apmaksāta, bet tērzēšanā nav redzama.",
    page_TooltipGenericReasoning: "Šis modelis izmanto spriešanas marķierus, kas nav redzami tērzēšanā, bet tiek apmaksāti kā izvades marķieri.",
    page_TooltipRequiresVerification: "Nepieciešama verificēta OpenAI organizācija. Šeit varat verificēt.",
    page_TooltipSupportsLanguage: "Atbalsta {languageName}",
    page_TooltipMayNotSupportLanguage: "Var neatbalstīt {languageName}",
    page_BadgePreview: "Priekšskatījums",
    page_BadgeExperimental: "Eksperimentāls",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Pašlaik pieejamie TTS",
    page_NoTTSOptions: "Pašlaik nav pieejamu TTS opciju.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Ievadiet jaunu {serviceName} API atslēgu",
    apiKeyManager_TestKey: "Pārbaudīt atslēgu",
    apiKeyManager_TestingKey: "Notiek atslēgas pārbaude...",
    apiKeyManager_KeyIsValid: "Atslēga ir derīga.",
    apiKeyManager_KeyIsInvalid: "Atslēga ir nederīga.",
    apiKeyManager_FailedToTestKey: "Neizdevās pārbaudīt atslēgu.",
    apiKeyManager_ErrorTestingKey: "Kļūda, pārbaudot atslēgu: {error}",
    apiKeyManager_KeyProvider: "Nodrošinātājs",
    apiKeyManager_KeyName: "Atslēgas nosaukums",
    apiKeyManager_Status: "Statuss",
    apiKeyManager_Action: "Darbība",

    // Model capabilities
    modelCapability_Vision: "Redze",
    modelCapability_JSON: "JSON režīms",
    modelCapability_Tools: "Rīku izmantošana",
    modelCapability_ImageGen: "Attēlu ģenerēšana",
    modelCapability_Multilingual: "Daudzvalodu",
    modelCapability_WebSearch: "Tīmekļa meklēšana",
    modelCapability_LargeContext: "Liels konteksts",
    modelCapability_LongContext: "Garš konteksts",
    modelCapability_FastResponse: "Ātra reakcija",
    modelCapability_CostEffective: "Rentabls",
    modelCapability_AdvancedReasoning: "Progresīva spriešana",
    modelCapability_Coding: "Kodēšana",
    modelCapability_Foundation: "Pamata modelis",
    modelCapability_Experimental: "Eksperimentāls",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Priekšskatījums",
    modelCapability_RequiresVerification: "Nepieciešama verifikācija",
    modelCapability_RequiresAccount: "Nepieciešams konts",

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