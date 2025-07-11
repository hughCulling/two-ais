// src/lib/translations/sl.ts
const sl = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Nastavitve',
        signIn: 'Prijava',
        signOut: 'Odjava',
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
        title: 'Nastavitve',
        sections: {
            appearance: 'Videz',
            apiKeys: 'API ključi',
            language: 'Jezik',
        },
        appearance: {
            theme: 'Tema',
            light: 'Svetla',
            dark: 'Temna',
            system: 'Sistemska',
            description: "Prilagodite videz in občutek aplikacije."
        },
        language: {
            title: 'Jezik',
            description: 'Izberite želeni jezik za vmesnik',
            conversationLanguage: 'Jezik pogovora',
            conversationLanguageDescription: 'Jezik, uporabljen za pogovore z UI, se bo ujemal z jezikom vašega vmesnika',
        },
        apiKeys: {
            title: 'API ključi',
            description: 'Upravljajte svoje API ključe za različne ponudnike UI',
            saved: 'Shranjeno',
            notSet: 'Ni nastavljeno',
            setKey: 'Nastavi ključ',
            updateKey: 'Posodobi ključ',
            removeKey: 'Odstrani ključ',
            getKeyInstructions: 'Pridobite svoj API ključ',
            noNewKeys: "Vnesenih ni novih API ključev za shranjevanje.",
            unexpectedResponse: "Prejet nepričakovan odziv s strežnika.",
            failedToSaveKey: "Shranjevanje ključa {serviceName} ni uspelo.",
            someKeysNotSaved: "Nekaterih API ključev ni bilo mogoče shraniti. Preverite podrobnosti spodaj.",
            keyStatus: "stanje ključa...",
            apiKeySecurelySaved: "API ključ varno shranjen",
            confirmRemoveTitle: "Potrdi odstranitev",
            confirmRemoveDescription: "Ali ste prepričani, da želite odstraniti API ključ za {serviceName}? Tega dejanja ni mogoče razveljaviti.",
            failedToRemoveKey: "Odstranjevanje ključa {serviceName} ni uspelo.",
            successfullyRemovedKey: "Ključ {serviceName} uspešno odstranjen.",
            keyNotSet: "Stanje ključa: Ni nastavljeno",
            keySet: "Stanje ključa: Nastavljeno",
            saveButton: "Shrani API ključ(e)"
        },
    },

    // Main page
    main: {
        title: 'Pogovor z UI',
        setupForm: {
            title: 'Nastavite svoj pogovor',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Izberite model',
            tts: {
                title: 'Besedilo v govor',
                enable: 'Omogoči besedilo v govor',
                provider: 'Ponudnik TTS',
                selectProvider: 'Izberite ponudnika TTS',
                voice: 'Glas',
                selectVoice: 'Izberite glas',
                model: 'Model TTS',
                selectModel: 'Izberite model TTS',
            },
            startConversation: 'Začni pogovor',
            conversationPrompt: 'Začnite pogovor.',
        },
        conversation: {
            thinking: 'razmišlja...',
            stop: 'Ustavi',
            restart: 'Ponovno zaženi pogovor',
        },
        pricing: {
            estimatedCost: 'Ocenjeni stroški',
            perMillionTokens: 'na milijon žetonov',
            input: 'Vnos',
            output: 'Izhod',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Prijavite se v Two AIs', // Keep brand name
            emailPlaceholder: 'E-pošta',
            passwordPlaceholder: 'Geslo',
            signIn: 'Prijava',
            signInWithGoogle: 'Prijavite se z Googlom',
            noAccount: "Nimate računa?",
            signUp: 'Registracija',
            forgotPassword: 'Ste pozabili geslo?',
            orContinueWith: "Ali nadaljujte z",
            signingIn: "Prijavljanje..."
        },
        signup: {
            title: 'Ustvari račun',
            emailPlaceholder: 'E-pošta',
            passwordPlaceholder: 'Geslo (vsaj 6 znakov)',
            signUp: 'Registracija',
            signUpWithGoogle: 'Registrirajte se z Googlom',
            hasAccount: 'Že imate račun?',
            signIn: 'Prijava',
            emailLabel: "Elektronski naslov",
            confirmPasswordPlaceholder: "Potrdite geslo",
            signingUp: "Registriranje..."
        },
        errors: {
            invalidCredentials: 'Napačna e-pošta ali geslo',
            userNotFound: 'Uporabnik ni bil najden',
            weakPassword: 'Geslo mora vsebovati vsaj 6 znakov',
            emailInUse: 'E-pošta je že v uporabi',
            generic: 'Prišlo je do napake. Poskusite znova.',
            initialization: "Napaka pri inicializaciji. Poskusite znova pozneje.",
            invalidEmail: "Vnesite veljaven elektronski naslov.",
            tooManyRequests: "Dostop je začasno onemogočen zaradi preveč neuspelih poskusov prijave. Ponastavite geslo ali poskusite znova pozneje.",
            signInFailedPrefix: "Prijava ni uspela: ",
            unknownSignInError: "Med prijavo je prišlo do neznane napake.",
            profileSaveFailedPrefix: "Prijava uspešna, vendar shranjevanje podatkov profila ni uspelo: ",
            profileCheckSaveFailedPrefix: "Prijava uspešna, vendar preverjanje/shranjevanje podatkov profila ni uspelo: ",
            accountExistsWithDifferentCredential: "Račun s tem elektronskim naslovom že obstaja z drugačnim načinom prijave.",
            googleSignInFailedPrefix: "Prijava z Googlom ni uspela: ",
            unknownGoogleSignInError: "Med prijavo z Googlom je prišlo do neznane napake.",
            passwordsDoNotMatch: "Gesli se ne ujemata.",
            accountCreatedProfileSaveFailedPrefix: "Račun ustvarjen, vendar shranjevanje podatkov profila ni uspelo: ",
            unknownProfileSaveError: "Med shranjevanjem profila je prišlo do neznane napake.",
            emailAlreadyRegistered: "Ta elektronski naslov je že registriran.",
            passwordTooShortSignUp: "Geslo mora imeti vsaj 6 znakov.",
            signUpFailedPrefix: "Registracija ni uspela: ",
            unknownSignUpError: "Med registracijo je prišlo do neznane napake."
        },
    },

    // Common
    common: {
        loading: 'Nalaganje...',
        error: 'Napaka',
        save: 'Shrani',
        cancel: 'Prekliči',
        delete: 'Izbriši',
        confirm: 'Potrdi',
        or: 'ali',
        MoreInformation: "Več informacij",
        Example: "Primer:",
        ShowMore: "Pokaži več",
        ShowLess: "Pokaži manj",
        AwaitingApproval: "Čakanje na odobritev...",
        OpenInNewTab: "Odpri v novem zavihku",
        AdvancedSettings: "Napredne nastavitve",
        Name: "Ime",
        Created: "Ustvarjeno",
        Updated: "Posodobljeno",
        Launched: "Zagnano",
        Docs: "Dokumentacija",
        Blog: "Blog",
        Pricing: "Cene",
        Terms: "Pogoji",
        Privacy: "Zasebnost",
        Changelog: "Dnevnik sprememb",
        Copy: "Kopiraj",
        Copied: "Kopirano",
        TryAgain: "Poskusi znova"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Manjkajoč API ključ",
    apiKeyMissingSubtext: "API ključ za tega ponudnika manjka ali je neveljaven. Dodajte ga v nastavitvah.",
    apiKeyNotNeeded: "API ključ ni potreben",
    apiKeyNotNeededSubtext: "Ta ponudnik ne zahteva API ključa za svojo brezplačno stopnjo ali določene modele.",
    apiKeyFound: "API ključ nastavljen",
    apiKeyFoundSubtext: "Za tega ponudnika je konfiguriran API ključ.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Vodilni modeli za klepet",
    modelCategory_Reasoning: "Modeli za sklepanje",
    modelCategory_CostOptimized: "Stroškovno optimizirani modeli",
    modelCategory_OlderGPT: "Starejši modeli GPT",
    modelCategory_Gemini2_5: "Serija Gemini 2.5",
    modelCategory_Gemini2_0: "Serija Gemini 2.0",
    modelCategory_Gemini1_5: "Serija Gemini 1.5",
    modelCategory_Claude3_7: "Serija Claude 3.7",
    modelCategory_Claude3_5: "Serija Claude 3.5",
    modelCategory_Claude3: "Serija Claude 3",
    modelCategory_Grok3: "Serija Grok 3",
    modelCategory_Grok3Mini: "Serija Grok 3 Mini",
    modelCategory_Llama4: "Serija Llama 4",
    modelCategory_Llama3_3: "Serija Llama 3.3",
    modelCategory_Llama3_2: "Serija Llama 3.2",
    modelCategory_Llama3_1: "Serija Llama 3.1",
    modelCategory_Llama3: "Serija Llama 3",
    modelCategory_LlamaVision: "Modeli Llama Vision",
    modelCategory_MetaLlama: "Modeli Meta Llama",
    modelCategory_Gemma2: "Serija Gemma 2",
    modelCategory_Gemma: "Serija Gemma",
    modelCategory_GoogleGemma: "Modeli Google Gemma",
    modelCategory_DeepSeekR1: "Serija DeepSeek R1",
    modelCategory_DeepSeekV3: "Serija DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Serija DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Modeli DeepSeek",
    modelCategory_MistralAIModels: "Modeli Mistral AI",
    modelCategory_Qwen3: "Serija Qwen3",
    modelCategory_QwQwQ: "Serija Qwen QwQ",
    modelCategory_Qwen2_5: "Serija Qwen2.5",
    modelCategory_Qwen2_5Vision: "Serija Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Serija Qwen2.5 Coder",
    modelCategory_Qwen2: "Serija Qwen2",
    modelCategory_Qwen2Vision: "Serija Qwen2 Vision",
    modelCategory_QwenModels: "Modeli Qwen",
    modelCategory_OtherModels: "Drugi modeli",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Nalaganje uporabniških podatkov ni uspelo: {errorMessage}. Poskusite osvežiti.",
    page_ErrorUserNotFound: "Uporabnik ni najden. Prijavite se znova.",
    page_ErrorUserApiKeyConfig: "Konfiguracije API ključa uporabnika ni bilo mogoče naložiti. Osvežite ali preverite nastavitve.",
    page_ErrorStartingSessionAPI: "Napaka API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Napaka pri zagonu seje: {errorMessage}",
    page_ErrorSessionIdMissing: "Odgovor API uspešen, vendar ni vključeval ID-ja pogovora.",
    page_LoadingUserData: "Nalaganje uporabniških podatkov...",
    page_ErrorAlertTitle: "Napaka",
    page_WelcomeTitle: "Dobrodošli v Two AIs",
    page_WelcomeSubtitle: "Ta spletna stran vam omogoča poslušanje pogovorov med dvema LLM.",
    page_ApiKeysRequiredTitle: "Potrebni API ključi",
    page_ApiKeysRequiredDescription: "Za izvajanje pogovorov boste morali po prijavi vnesti svoje API ključe za modele UI, ki jih želite uporabiti (npr. OpenAI, Google, Anthropic). Podrobna navodila za vsakega ponudnika najdete na strani Nastavitve / API ključi po prijavi.",
    page_SignInPrompt: "Če želite začeti svojo sejo, se lahko prijavite ali ustvarite račun s povezavo v glavi.",
    page_VideoTitle: "Predstavitev pogovora Two AIs",
    page_AvailableLLMsTitle: "Trenutno razpoložljivi LLM-ji",
    page_TooltipGoogleThinkingBudget: "Ta model Google uporablja 'proračun za razmišljanje'. Izhod 'razmišljanja' se zaračuna, vendar ni viden v klepetu.",
    page_TooltipAnthropicExtendedThinking: "Ta model Anthropic uporablja 'razširjeno razmišljanje'. Izhod 'razmišljanja' se zaračuna, vendar ni viden v klepetu.",
    page_TooltipXaiThinking: "Ta model xAI uporablja 'razmišljanje'. Ta izhod se zaračuna, vendar ni viden v klepetu.",
    page_TooltipQwenReasoning: "Ta model Qwen uporablja 'sklepanje/razmišljanje'. Ta izhod se zaračuna, vendar ni viden v klepetu.",
    page_TooltipDeepSeekReasoning: "Ta model DeepSeek uporablja 'sklepanje/razmišljanje'. Izhod se zaračuna, vendar ni viden v klepetu.",
    page_TooltipGenericReasoning: "Ta model uporablja žetone za sklepanje, ki niso vidni v klepetu, vendar se zaračunajo kot izhodni žetoni.",
    page_TooltipRequiresVerification: "Zahteva preverjeno organizacijo OpenAI. Preverite lahko tukaj.",
    page_TooltipSupportsLanguage: "Podpira {languageName}",
    page_TooltipMayNotSupportLanguage: "Morda ne podpira {languageName}",
    page_BadgePreview: "Predogled",
    page_BadgeExperimental: "Eksperimentalno",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Trenutno razpoložljivi TTS",
    page_NoTTSOptions: "Trenutno ni na voljo nobenih možnosti TTS.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Vnesite nov API ključ {serviceName}",
    apiKeyManager_TestKey: "Preizkusi ključ",
    apiKeyManager_TestingKey: "Preizkušanje ključa...",
    apiKeyManager_KeyIsValid: "Ključ je veljaven.",
    apiKeyManager_KeyIsInvalid: "Ključ ni veljaven.",
    apiKeyManager_FailedToTestKey: "Preizkus ključa ni uspel.",
    apiKeyManager_ErrorTestingKey: "Napaka pri preizkusu ključa: {error}",
    apiKeyManager_KeyProvider: "Ponudnik",
    apiKeyManager_KeyName: "Ime ključa",
    apiKeyManager_Status: "Stanje",
    apiKeyManager_Action: "Dejanje",

    // Model capabilities
    modelCapability_Vision: "Vid",
    modelCapability_JSON: "Način JSON",
    modelCapability_Tools: "Uporaba orodij",
    modelCapability_ImageGen: "Generiranje slik",
    modelCapability_Multilingual: "Večjezično",
    modelCapability_WebSearch: "Iskanje po spletu",
    modelCapability_LargeContext: "Velik kontekst",
    modelCapability_LongContext: "Dolg kontekst",
    modelCapability_FastResponse: "Hiter odziv",
    modelCapability_CostEffective: "Stroškovno učinkovito",
    modelCapability_AdvancedReasoning: "Napredno sklepanje",
    modelCapability_Coding: "Kodiranje",
    modelCapability_Foundation: "Osnovni model",
    modelCapability_Experimental: "Eksperimentalno",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Predogled",
    modelCapability_RequiresVerification: "Zahteva preverjanje",
    modelCapability_RequiresAccount: "Zahteva račun",

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
export default sl; 