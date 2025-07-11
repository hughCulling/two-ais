// src/lib/translations/lt.ts
const lt = {
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
        hi: 'Hindi',
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
        mt: 'Maltiečių',
        bs: 'Bosnių',
        ca: 'Katalonų',
        gu: 'Gudžaratų',
        hy: 'Armėnų',
        is: 'Islandų',
        ka: 'Gruzinų',
        kk: 'Kazachų',
        kn: 'Kanadų',
        mk: 'Makedonų',
        ml: 'Malajalių',
        mr: 'Marathų',
        ms: 'Malajų',
        my: 'Birmiečių',
        pa: 'Pendžabų',
        so: 'Somalių',
        sq: 'Albanų',
        ta: 'Tamilų',
        te: 'Telugų',
        tl: 'Tagalų',
        ur: 'Urdų',
        am: 'Amharų',
        mn: 'Mongolų',
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
            description: 'Pasirinkite pageidaujamą sąsajos kalbą',
            conversationLanguage: 'Pokalbio kalba',
            conversationLanguageDescription: 'AI pokalbiams naudojama kalba atitiks jūsų sąsajos kalbą',
        },
        apiKeys: {
            title: 'API Raktai',
            description: 'Tvarkykite savo API raktus skirtingiems AI teikėjams',
            saved: 'Išsaugota',
            notSet: 'Nenustatyta',
            setKey: 'Nustatyti raktą',
            updateKey: 'Atnaujinti raktą',
            removeKey: 'Pašalinti raktą',
            getKeyInstructions: 'Gaukite savo API raktą',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Neįvesta naujų API raktų, kuriuos būtų galima išsaugoti.",
            unexpectedResponse: "Gautas netikėtas atsakymas iš serverio.",
            failedToSaveKey: "Nepavyko išsaugoti {serviceName} rakto.",
            someKeysNotSaved: "Kai kurių API raktų nepavyko išsaugoti. Patikrinkite išsamią informaciją žemiau.",
            keyStatus: "rakto būsena...",
            apiKeySecurelySaved: "API Raktas Saugiai Išsaugotas",
            confirmRemoveTitle: "Patvirtinti Pašalinimą",
            confirmRemoveDescription: "Ar tikrai norite pašalinti API raktą {serviceName}? Šio veiksmo negalima anuliuoti.",
            failedToRemoveKey: "Nepavyko pašalinti {serviceName} rakto.",
            successfullyRemovedKey: "Sėkmingai pašalintas {serviceName} raktas.",
            keyNotSet: "Rakto Būsena: Nenustatyta",
            keySet: "Rakto Būsena: Nustatyta",
            saveButton: "Išsaugoti API Raktą (-us)"
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
            thinking: 'mąsto...',
            stop: 'Sustabdyti',
            restart: 'Perkrauti pokalbį',
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
            title: 'Prisijunkite prie Two AIs', // Keep brand name
            emailPlaceholder: 'El. paštas',
            passwordPlaceholder: 'Slaptažodis',
            signIn: 'Prisijungti',
            signInWithGoogle: 'Prisijungti su Google',
            noAccount: "Neturite paskyros?",
            signUp: 'Registruotis',
            forgotPassword: 'Pamiršote slaptažodį?',
            orContinueWith: "Arba tęskite su",
            signingIn: "Prisijungiama..."
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
            initialization: "Inicializacijos klaida. Bandykite vėliau.",
            invalidEmail: "Įveskite galiojantį el. pašto adresą.",
            tooManyRequests: "Prieiga laikinai išjungta dėl per daug nesėkmingų prisijungimo bandymų. Atstatykite slaptažodį arba bandykite vėliau.",
            signInFailedPrefix: "Prisijungimas nepavyko: ",
            unknownSignInError: "Prisijungimo metu įvyko nežinoma klaida.",
            profileSaveFailedPrefix: "Prisijungta, bet profilio duomenų išsaugoti nepavyko: ",
            profileCheckSaveFailedPrefix: "Prisijungta, bet profilio duomenų patikrinti/išsaugoti nepavyko: ",
            accountExistsWithDifferentCredential: "Paskyra su šiuo el. pašto adresu jau egzistuoja naudojant kitą prisijungimo metodą.",
            googleSignInFailedPrefix: "Google prisijungimas nepavyko: ",
            unknownGoogleSignInError: "Google prisijungimo metu įvyko nežinoma klaida.",
            passwordsDoNotMatch: "Slaptažodžiai nesutampa.",
            accountCreatedProfileSaveFailedPrefix: "Paskyra sukurta, bet profilio duomenų išsaugoti nepavyko: ",
            unknownProfileSaveError: "Profilio išsaugojimo metu įvyko nežinoma klaida.",
            emailAlreadyRegistered: "Šis el. pašto adresas jau užregistruotas.",
            passwordTooShortSignUp: "Slaptažodis turi būti bent 6 simbolių ilgio.",
            signUpFailedPrefix: "Registracija nepavyko: ",
            unknownSignUpError: "Registracijos metu įvyko nežinoma klaida."
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
    apiKeyMissing: "Trūkstamas API Raktas",
    apiKeyMissingSubtext: "Šio teikėjo API raktas trūkstamas arba neteisingas. Prašome pridėti jį nustatymuose.",
    apiKeyNotNeeded: "API Raktas Nereikalingas",
    apiKeyNotNeededSubtext: "Šiam teikėjui nereikia API rakto nemokamam lygiui ar tam tikriems modeliams.",
    apiKeyFound: "API Raktas Nustatytas",
    apiKeyFoundSubtext: "Šiam teikėjui sukonfigūruotas API raktas.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Flagmanų Pokalbių Modeliai",
    modelCategory_Reasoning: "Samprotavimo Modeliai",
    modelCategory_CostOptimized: "Kainos Optimizuoti Modeliai",
    modelCategory_OlderGPT: "Senesni GPT Modeliai",
    modelCategory_Gemini2_5: "Gemini 2.5 Serija",
    modelCategory_Gemini2_0: "Gemini 2.0 Serija",
    modelCategory_Gemini1_5: "Gemini 1.5 Serija",
    modelCategory_Claude3_7: "Claude 3.7 Serija",
    modelCategory_Claude3_5: "Claude 3.5 Serija",
    modelCategory_Claude3: "Claude 3 Serija",
    modelCategory_Grok3: "Grok 3 Serija",
    modelCategory_Grok3Mini: "Grok 3 Mini Serija",
    modelCategory_Llama4: "Llama 4 Serija",
    modelCategory_Llama3_3: "Llama 3.3 Serija",
    modelCategory_Llama3_2: "Llama 3.2 Serija",
    modelCategory_Llama3_1: "Llama 3.1 Serija",
    modelCategory_Llama3: "Llama 3 Serija",
    modelCategory_LlamaVision: "Llama Vision Modeliai",
    modelCategory_MetaLlama: "Meta Llama Modeliai",
    modelCategory_Gemma2: "Gemma 2 Serija",
    modelCategory_Gemma: "Gemma Serija",
    modelCategory_GoogleGemma: "Google Gemma Modeliai",
    modelCategory_DeepSeekR1: "DeepSeek R1 Serija",
    modelCategory_DeepSeekV3: "DeepSeek V3 Serija",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill Serija",
    modelCategory_DeepSeekModels: "DeepSeek Modeliai",
    modelCategory_MistralAIModels: "Mistral AI Modeliai",
    modelCategory_Qwen3: "Qwen3 Serija",
    modelCategory_QwQwQ: "Qwen QwQ Serija",
    modelCategory_Qwen2_5: "Qwen2.5 Serija",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision Serija",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder Serija",
    modelCategory_Qwen2: "Qwen2 Serija",
    modelCategory_Qwen2Vision: "Qwen2 Vision Serija",
    modelCategory_QwenModels: "Qwen Modeliai",
    modelCategory_OtherModels: "Kiti Modeliai",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Nepavyko įkelti vartotojo duomenų: {errorMessage}. Bandykite atnaujinti.",
    page_ErrorUserNotFound: "Vartotojas nerastas. Prisijunkite iš naujo.",
    page_ErrorUserApiKeyConfig: "Nepavyko įkelti vartotojo API rakto konfigūracijos. Atnaujinkite arba patikrinkite nustatymus.",
    page_ErrorStartingSessionAPI: "API Klaida: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Klaida pradedant sesiją: {errorMessage}",
    page_ErrorSessionIdMissing: "API atsakymas sėkmingas, bet jame nebuvo pokalbio ID.",
    page_LoadingUserData: "Kraunami vartotojo duomenys...",
    page_ErrorAlertTitle: "Klaida",
    page_WelcomeTitle: "Sveiki atvykę į Two AIs",
    page_WelcomeSubtitle: "Ši svetainė leidžia klausytis pokalbių tarp dviejų LLM.",
    page_ApiKeysRequiredTitle: "Reikalingi API Raktai",
    page_ApiKeysRequiredDescription: "Norėdami vykdyti pokalbius, po prisijungimo turėsite pateikti savo API raktus norimiems AI modeliams (pvz., OpenAI, Google, Anthropic). Išsamias instrukcijas kiekvienam teikėjui rasite Nustatymų / API Raktų puslapyje po prisijungimo.",
    page_SignInPrompt: "Norėdami pradėti savo sesiją, galite prisijungti arba susikurti paskyrą naudodami nuorodą antraštėje.",
    page_VideoTitle: "Two AIs Pokalbio Demonstracija",
    page_AvailableLLMsTitle: "Šiuo Metu Prieinami LLM",
    page_TooltipGoogleThinkingBudget: "Šis Google modelis naudoja 'mąstymo biudžetą'. 'Mąstymo' išvestis apmokestinama, bet pokalbyje nerodoma.",
    page_TooltipAnthropicExtendedThinking: "Šis Anthropic modelis naudoja 'išplėstą mąstymą'. 'Mąstymo' išvestis apmokestinama, bet pokalbyje nerodoma.",
    page_TooltipXaiThinking: "Šis xAI modelis naudoja 'mąstymą'. Ši išvestis apmokestinama, bet pokalbyje nerodoma.",
    page_TooltipQwenReasoning: "Šis Qwen modelis naudoja 'samprotavimą/mąstymą'. Ši išvestis apmokestinama, bet pokalbyje nerodoma.",
    page_TooltipDeepSeekReasoning: "Šis DeepSeek modelis naudoja 'samprotavimą/mąstymą'. Išvestis apmokestinama, bet pokalbyje nerodoma.",
    page_TooltipGenericReasoning: "Šis modelis naudoja samprotavimo žetonus, kurie pokalbyje nerodomi, bet apmokestinami kaip išvesties žetonai.",
    page_TooltipRequiresVerification: "Reikalinga patikrinta OpenAI organizacija. Galite patikrinti čia.",
    page_TooltipSupportsLanguage: "Palaiko {languageName}",
    page_TooltipMayNotSupportLanguage: "Gali nepalaikyti {languageName}",
    page_BadgePreview: "Peržiūra",
    page_BadgeExperimental: "Eksperimentinis",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Šiuo Metu Prieinami TTS",
    page_NoTTSOptions: "Šiuo metu nėra prieinamų TTS parinkčių.",
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
    modelCapability_Vision: "Regėjimas",
    modelCapability_JSON: "JSON Režimas",
    modelCapability_Tools: "Įrankių Naudojimas",
    modelCapability_ImageGen: "Vaizdų Generavimas",
    modelCapability_Multilingual: "Daugiakalbis",
    modelCapability_WebSearch: "Žiniatinklio Paieška",
    modelCapability_LargeContext: "Didelis Kontekstas",
    modelCapability_LongContext: "Ilgas Kontekstas",
    modelCapability_FastResponse: "Greitas Atsakymas",
    modelCapability_CostEffective: "Ekonomiškas",
    modelCapability_AdvancedReasoning: "Pažangus Samprotavimas",
    modelCapability_Coding: "Kodavimas",
    modelCapability_Foundation: "Pagrindinis Modelis",
    modelCapability_Experimental: "Eksperimentinis",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Peržiūra",
    modelCapability_RequiresVerification: "Reikalingas Patikrinimas",
    modelCapability_RequiresAccount: "Reikalinga Paskyra",

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
export default lt; 