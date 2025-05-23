// src/lib/translations/lt.ts
export const lt = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Nustatymai',
        signIn: 'Prisijungti',
        signOut: 'Atsijungti',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabų',
        bn: 'Bengalų',
        bg: 'Bulgarų',
        zh: 'Kinų',
        hr: 'Kroatų',
        cs: 'Čekų',
        da: 'Danų',
        nl: 'Olandų',
        en: 'Anglų',
        et: 'Estų',
        fi: 'Suomių',
        fr: 'Prancūzų',
        de: 'Vokiečių',
        el: 'Graikų',
        iw: 'Hebrajų',
        hi: 'Indų',
        hu: 'Vengrų',
        id: 'Indoneziečių',
        it: 'Italų',
        ja: 'Japonų',
        ko: 'Korėjiečių',
        lv: 'Latvių',
        lt: 'Lietuvių',
        no: 'Norvegų',
        pl: 'Lenkų',
        pt: 'Portugalų',
        ro: 'Rumunų',
        ru: 'Rusų',
        sr: 'Serbų',
        sk: 'Slovakų',
        sl: 'Slovėnų',
        es: 'Ispanų',
        sw: 'Svahilių',
        sv: 'Švedų',
        th: 'Tajų',
        tr: 'Turkų',
        uk: 'Ukrainiečių',
        vi: 'Vietnamiečių',
    },

    // Settings page
    settings: {
        title: 'Nustatymai',
        sections: {
            appearance: 'Išvaizda',
            apiKeys: 'API Raktai',
            language: 'Kalba',
        },
        appearance: {
            theme: 'Tema',
            light: 'Šviesi',
            dark: 'Tamsi',
            system: 'Sistema',
            description: "Pritaikykite programos išvaizdą ir pojūtį."
        },
        language: {
            title: 'Kalba',
            description: 'Pasirinkite norimą sąsajos kalbą',
            conversationLanguage: 'Pokalbio kalba',
            conversationLanguageDescription: 'AI pokalbiams naudojama kalba atitiks jūsų sąsajos kalbą',
            getKeyInstructions: 'Gaukite API raktą',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Naujų API raktų neįvesta, kad būtų galima išsaugoti.",
            unexpectedResponse: "Gautas netikėtas atsakymas iš serverio.",
            failedToSaveKey: "Nepavyko išsaugoti {serviceName} rakto.",
            someKeysNotSaved: "Kai kurių API raktų nepavyko išsaugoti. Patikrinkite išsamią informaciją žemiau.",
            keyStatus: "rakto būsena...",
            apiKeySecurelySaved: "API raktas saugiai išsaugotas",
            confirmRemoveTitle: "Patvirtinti pašalinimą",
            confirmRemoveDescription: "Ar tikrai norite pašalinti {serviceName} API raktą? Šio veiksmo negalima anuliuoti.",
            failedToRemoveKey: "Nepavyko pašalinti {serviceName} rakto.",
            successfullyRemovedKey: "Sėkmingai pašalintas {serviceName} raktas.",
            keyNotSet: "Rakto būsena: nenustatyta",
            keySet: "Rakto būsena: nustatyta",
            saveButton: "Išsaugoti API raktą (-us)"
        },
        apiKeys: {
            title: 'API Raktai',
            description: 'Tvarkykite savo API raktus skirtingiems AI teikėjams',
            saved: 'Išsaugota',
            notSet: 'Nenustatyta',
            setKey: 'Nustatyti raktą',
            updateKey: 'Atnaujinti raktą',
            removeKey: 'Pašalinti raktą',
            getKeyInstructions: 'Gaukite API raktą',
            // --- New keys for ApiKeyManager.tsx ---
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
        title: 'AI Pokalbis',
        setupForm: {
            title: 'Nustatykite savo pokalbį',
            agentA: 'Agentas A',
            agentB: 'Agentas B',
            model: 'Modelis',
            selectModel: 'Pasirinkite modelį',
            tts: {
                title: 'Tekstas į kalbą',
                enable: 'Įjungti tekstą į kalbą',
                provider: 'TTS Teikėjas',
                selectProvider: 'Pasirinkite TTS teikėją',
                voice: 'Balsas',
                selectVoice: 'Pasirinkite balsą',
                model: 'TTS Modelis',
                selectModel: 'Pasirinkite TTS modelį',
            },
            startConversation: 'Pradėti pokalbį',
            conversationPrompt: 'Pradėkite pokalbį.',
        },
        conversation: {
            thinking: 'galvoja...',
            stop: 'Sustabdyti',
            restart: 'Paleisti pokalbį iš naujo',
        },
        pricing: {
            estimatedCost: 'Numatoma kaina',
            perMillionTokens: 'už milijoną žetonų',
            input: 'Įvestis',
            output: 'Išvestis',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Prisijungti prie Two AIs', // Keep brand name
            emailPlaceholder: 'El. paštas',
            passwordPlaceholder: 'Slaptažodis',
            signIn: 'Prisijungti',
            signInWithGoogle: 'Prisijungti su Google',
            noAccount: "Neturite paskyros?",
            signUp: 'Registruotis',
            forgotPassword: 'Pamiršote slaptažodį?',
        },
        signup: {
            title: 'Sukurti paskyrą',
            emailPlaceholder: 'El. paštas',
            passwordPlaceholder: 'Slaptažodis (mažiausiai 6 simboliai)',
            signUp: 'Registruotis',
            signUpWithGoogle: 'Registruotis su Google',
            hasAccount: 'Jau turite paskyrą?',
            signIn: 'Prisijungti',
            emailLabel: "El. pašto adresas",
            confirmPasswordPlaceholder: "Patvirtinkite slaptažodį",
            signingUp: "Registruojamasi..."
        },
        errors: {
            invalidCredentials: 'Neteisingas el. paštas arba slaptažodis',
            userNotFound: 'Vartotojas nerastas',
            weakPassword: 'Slaptažodis turi būti bent 6 simbolių ilgio',
            emailInUse: 'El. paštas jau naudojamas',
            generic: 'Įvyko klaida. Bandykite dar kartą.',
            initialization: "Inicializavimo klaida. Bandykite vėliau.",
            invalidEmail: "Įveskite galiojantį el. pašto adresą.",
            tooManyRequests: "Prieiga laikinai išjungta dėl per daug nepavykusių prisijungimo bandymų. Nustatykite slaptažodį iš naujo arba bandykite vėliau.",
            signInFailedPrefix: "Prisijungti nepavyko: ",
            unknownSignInError: "Prisijungiant įvyko nežinoma klaida.",
            profileSaveFailedPrefix: "Prisijungta, bet nepavyko išsaugoti profilio duomenų: ",
            profileCheckSaveFailedPrefix: "Prisijungta, bet nepavyko patikrinti/išsaugoti profilio duomenų: ",
            accountExistsWithDifferentCredential: "Paskyra su šiuo el. pašto adresu jau egzistuoja naudojant kitą prisijungimo būdą.",
            googleSignInFailedPrefix: "Prisijungti naudojant „Google“ nepavyko: ",
            unknownGoogleSignInError: "Prisijungiant naudojant „Google“ įvyko nežinoma klaida.",
            passwordsDoNotMatch: "Slaptažodžiai nesutampa.",
            accountCreatedProfileSaveFailedPrefix: "Paskyra sukurta, bet nepavyko išsaugoti profilio duomenų: ",
            unknownProfileSaveError: "Išsaugant profilį įvyko nežinoma klaida.",
            emailAlreadyRegistered: "Šis el. pašto adresas jau užregistruotas.",
            passwordTooShortSignUp: "Slaptažodis turi būti bent 6 simbolių ilgio.",
            signUpFailedPrefix: "Registruotis nepavyko: ",
            unknownSignUpError: "Registruojantis įvyko nežinoma klaida."
        },
    },

    // Common
    common: {
        loading: 'Kraunama...',
        error: 'Klaida',
        save: 'Išsaugoti',
        cancel: 'Atšaukti',
        delete: 'Ištrinti',
        confirm: 'Patvirtinti',
        or: 'arba',
        MoreInformation: "Daugiau informacijos",
        Example: "Pavyzdys:",
        ShowMore: "Rodyti daugiau",
        ShowLess: "Rodyti mažiau",
        AwaitingApproval: "Laukiama patvirtinimo...",
        OpenInNewTab: "Atidaryti naujame skirtuke",
        AdvancedSettings: "Išplėstiniai nustatymai",
        Name: "Pavadinimas",
        Created: "Sukurta",
        Updated: "Atnaujinta",
        Launched: "Paleista",
        Docs: "Dokumentacija",
        Blog: "Tinklaraštis",
        Pricing: "Kainodara",
        Terms: "Sąlygos",
        Privacy: "Privatumas",
        Changelog: "Pakeitimų žurnalas",
        Copy: "Kopijuoti",
        Copied: "Nukopijuota",
        TryAgain: "Bandyti dar kartą"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Trūksta API rakto",
    apiKeyMissingSubtext: "Šio teikėjo API raktas trūksta arba yra neteisingas. Pridėkite jį nustatymuose.",
    apiKeyNotNeeded: "API raktas nereikalingas",
    apiKeyNotNeededSubtext: "Šiam teikėjui nereikia API rakto nemokamam lygiui ar tam tikriems modeliams.",
    apiKeyFound: "API raktas nustatytas",
    apiKeyFoundSubtext: "Šiam teikėjui sukonfigūruotas API raktas.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Pagrindiniai pokalbių modeliai",
    modelCategory_Reasoning: "Samprotavimo modeliai",
    modelCategory_CostOptimized: "Kainos požiūriu optimizuoti modeliai",
    modelCategory_OlderGPT: "Senesni GPT modeliai",
    modelCategory_Gemini2_5: "Gemini 2.5 serija",
    modelCategory_Gemini2_0: "Gemini 2.0 serija",
    modelCategory_Gemini1_5: "Gemini 1.5 serija",
    modelCategory_Claude3_7: "Claude 3.7 serija",
    modelCategory_Claude3_5: "Claude 3.5 serija",
    modelCategory_Claude3: "Claude 3 serija",
    modelCategory_Grok3: "Grok 3 serija",
    modelCategory_Grok3Mini: "Grok 3 Mini serija",
    modelCategory_Llama4: "Llama 4 serija",
    modelCategory_Llama3_3: "Llama 3.3 serija",
    modelCategory_Llama3_2: "Llama 3.2 serija",
    modelCategory_Llama3_1: "Llama 3.1 serija",
    modelCategory_Llama3: "Llama 3 serija",
    modelCategory_LlamaVision: "Llama Vision modeliai",
    modelCategory_MetaLlama: "Meta Llama modeliai",
    modelCategory_Gemma2: "Gemma 2 serija",
    modelCategory_Gemma: "Gemma serija",
    modelCategory_GoogleGemma: "Google Gemma modeliai",
    modelCategory_DeepSeekR1: "DeepSeek R1 serija",
    modelCategory_DeepSeekV3: "DeepSeek V3 serija",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill serija",
    modelCategory_DeepSeekModels: "DeepSeek modeliai",
    modelCategory_MistralAIModels: "Mistral AI modeliai",
    modelCategory_Qwen3: "Qwen3 serija",
    modelCategory_QwQwQ: "Qwen QwQ serija",
    modelCategory_Qwen2_5: "Qwen2.5 serija",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision serija",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder serija",
    modelCategory_Qwen2: "Qwen2 serija",
    modelCategory_Qwen2Vision: "Qwen2 Vision serija",
    modelCategory_QwenModels: "Qwen modeliai",
    modelCategory_OtherModels: "Kiti modeliai",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Nepavyko įkelti vartotojo duomenų: {errorMessage}. Bandykite atnaujinti.",
    page_ErrorUserNotFound: "Vartotojas nerastas. Prisijunkite iš naujo.",
    page_ErrorUserApiKeyConfig: "Nepavyko įkelti vartotojo API rakto konfigūracijos. Atnaujinkite arba patikrinkite nustatymus.",
    page_ErrorStartingSessionAPI: "API klaida: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Klaida pradedant seansą: {errorMessage}",
    page_ErrorSessionIdMissing: "API atsakymas sėkmingas, bet jame nebuvo pokalbio ID.",
    page_LoadingUserData: "Kraunami vartotojo duomenys...",
    page_ErrorAlertTitle: "Klaida",
    page_WelcomeTitle: "Sveiki atvykę į „Two AIs“",
    page_WelcomeSubtitle: "Ši svetainė leidžia klausytis dviejų LLM pokalbių.",
    page_ApiKeysRequiredTitle: "Reikalingi API raktai",
    page_ApiKeysRequiredDescription: "Norėdami vykdyti pokalbius, prisijungę turėsite pateikti savo API raktus AI modeliams, kuriuos norite naudoti (pvz., „OpenAI“, „Google“, „Anthropic“). Išsamias instrukcijas kiekvienam teikėjui rasite prisijungę puslapyje „Nustatymai / API raktai“.",
    page_SignInPrompt: "Norėdami pradėti savo seansą, galite prisijungti arba susikurti paskyrą naudodami nuorodą antraštėje.",
    page_VideoTitle: "„Two AIs“ pokalbio demonstracija",
    page_AvailableLLMsTitle: "Šiuo metu galimi LLM",
    page_TooltipGoogleThinkingBudget: "Šis „Google“ modelis naudoja „mąstymo biudžetą“. „Mąstymo“ rezultatai apmokestinami, bet pokalbyje nematomi.",
    page_TooltipAnthropicExtendedThinking: "Šis „Anthropic“ modelis naudoja „išplėstinį mąstymą“. „Mąstymo“ rezultatai apmokestinami, bet pokalbyje nematomi.",
    page_TooltipXaiThinking: "Šis xAI modelis naudoja „mąstymą“. Šie rezultatai apmokestinami, bet pokalbyje nematomi.",
    page_TooltipQwenReasoning: "Šis „Qwen“ modelis naudoja „samprotavimą/mąstymą“. Šie rezultatai apmokestinami, bet pokalbyje nematomi.",
    page_TooltipDeepSeekReasoning: "Šis „DeepSeek“ modelis naudoja „samprotavimą/mąstymą“. Rezultatai apmokestinami, bet pokalbyje nematomi.",
    page_TooltipGenericReasoning: "Šis modelis naudoja samprotavimo žetonus, kurie pokalbyje nematomi, bet apmokestinami kaip išvesties žetonai.",
    page_TooltipRequiresVerification: "Reikalinga patvirtinta „OpenAI“ organizacija. Patvirtinti galite čia.",
    page_TooltipSupportsLanguage: "Palaiko {languageName}",
    page_TooltipMayNotSupportLanguage: "Gali nepalaikyti {languageName}",
    page_BadgePreview: "Peržiūra",
    page_BadgeExperimental: "Eksperimentinis",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Šiuo metu galimi TTS",
    page_NoTTSOptions: "Šiuo metu TTS parinkčių nėra.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Įveskite naują {serviceName} API raktą",
    apiKeyManager_TestKey: "Testuoti raktą",
    apiKeyManager_TestingKey: "Testuojamas raktas...",
    apiKeyManager_KeyIsValid: "Raktas galioja.",
    apiKeyManager_KeyIsInvalid: "Raktas negalioja.",
    apiKeyManager_FailedToTestKey: "Nepavyko testuoti rakto.",
    apiKeyManager_ErrorTestingKey: "Klaida testuojant raktą: {error}",
    apiKeyManager_KeyProvider: "Teikėjas",
    apiKeyManager_KeyName: "Rakto pavadinimas",
    apiKeyManager_Status: "Būsena",
    apiKeyManager_Action: "Veiksmas",

    // Model capabilities
    modelCapability_Vision: "Vaizdas",
    modelCapability_JSON: "JSON režimas",
    modelCapability_Tools: "Įrankių naudojimas",
    modelCapability_ImageGen: "Vaizdų generavimas",
    modelCapability_Multilingual: "Daugiakalbis",
    modelCapability_WebSearch: "Žiniatinklio paieška",
    modelCapability_LargeContext: "Didelis kontekstas",
    modelCapability_LongContext: "Ilgas kontekstas",
    modelCapability_FastResponse: "Greitas atsakymas",
    modelCapability_CostEffective: "Ekonomiškas",
    modelCapability_AdvancedReasoning: "Pažangus samprotavimas",
    modelCapability_Coding: "Kodavimas",
    modelCapability_Foundation: "Pagrindinis modelis",
    modelCapability_Experimental: "Eksperimentinis",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Peržiūra",
    modelCapability_RequiresVerification: "Reikalingas patikrinimas",
    modelCapability_RequiresAccount: "Reikalinga paskyra",

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