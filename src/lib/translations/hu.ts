// src/lib/translations/hu.ts
export const hu = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Beállítások',
        signIn: 'Bejelentkezés',
        signOut: 'Kijelentkezés',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arab',
        bn: 'Bengáli',
        bg: 'Bolgár',
        zh: 'Kínai',
        hr: 'Horvát',
        cs: 'Cseh',
        da: 'Dán',
        nl: 'Holland',
        en: 'Angol',
        et: 'Észt',
        fi: 'Finn',
        fr: 'Francia',
        de: 'Német',
        el: 'Görög',
        iw: 'Héber',
        hi: 'Hindi',
        hu: 'Magyar',
        id: 'Indonéz',
        it: 'Olasz',
        ja: 'Japán',
        ko: 'Koreai',
        lv: 'Lett',
        lt: 'Litván',
        no: 'Norvég',
        pl: 'Lengyel',
        pt: 'Portugál',
        ro: 'Román',
        ru: 'Orosz',
        sr: 'Szerb',
        sk: 'Szlovák',
        sl: 'Szlovén',
        es: 'Spanyol',
        sw: 'Szuahéli',
        sv: 'Svéd',
        th: 'Thai',
        tr: 'Török',
        uk: 'Ukrán',
        vi: 'Vietnami',
    },

    // Settings page
    settings: {
        title: 'Beállítások',
        sections: {
            appearance: 'Megjelenés',
            apiKeys: 'API kulcsok',
            language: 'Nyelv',
        },
        appearance: {
            theme: 'Téma',
            light: 'Világos',
            dark: 'Sötét',
            system: 'Rendszer',
            description: "Szabja testre az alkalmazás megjelenését és hangulatát."
        },
        language: {
            title: 'Nyelv',
            description: 'Válassza ki a felület preferált nyelvét',
            conversationLanguage: 'Beszélgetés nyelve',
            conversationLanguageDescription: 'Az AI beszélgetésekhez használt nyelv megegyezik a felület nyelvével',
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
        title: 'AI Beszélgetés',
        setupForm: {
            title: 'Állítsa be a beszélgetést',
            agentA: 'A ügynök',
            agentB: 'B ügynök',
            model: 'Modell',
            selectModel: 'Válasszon modellt',
            tts: {
                title: 'Szövegfelolvasás',
                enable: 'Szövegfelolvasás engedélyezése',
                provider: 'TTS szolgáltató',
                selectProvider: 'Válasszon TTS szolgáltatót',
                voice: 'Hang',
                selectVoice: 'Válasszon hangot',
                model: 'TTS modell',
                selectModel: 'Válasszon TTS modellt',
            },
            startConversation: 'Beszélgetés indítása',
            conversationPrompt: 'Indítsa el a beszélgetést.',
        },
        conversation: {
            thinking: 'gondolkodik...',
            stop: 'Stop',
            restart: 'Beszélgetés újraindítása',
        },
        pricing: {
            estimatedCost: 'Becsült költség',
            perMillionTokens: 'millió tokenenként',
            input: 'Bemenet',
            output: 'Kimenet',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Bejelentkezés a Two AIs-ba', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Jelszó',
            signIn: 'Bejelentkezés',
            signInWithGoogle: 'Bejelentkezés Google-fiókkal',
            noAccount: "Nincs fiókja?",
            signUp: 'Regisztráció',
            forgotPassword: 'Elfelejtette a jelszavát?',
            orContinueWith: "Vagy folytassa ezzel",
            signingIn: "Bejelentkezés..."
        },
        signup: {
            title: 'Fiók létrehozása',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Jelszó (legalább 6 karakter)',
            signUp: 'Regisztráció',
            signUpWithGoogle: 'Regisztráció Google-fiókkal',
            hasAccount: 'Már van fiókja?',
            signIn: 'Bejelentkezés',
            emailLabel: "E-mail cím",
            confirmPasswordPlaceholder: "Jelszó megerősítése",
            signingUp: "Regisztráció..."
        },
        errors: {
            invalidCredentials: 'Érvénytelen e-mail cím vagy jelszó',
            userNotFound: 'Felhasználó nem található',
            weakPassword: 'A jelszónak legalább 6 karakter hosszúnak kell lennie',
            emailInUse: 'Az e-mail cím már használatban van',
            generic: 'Hiba történt. Kérjük, próbálja újra.',
            initialization: "Inicializálási hiba. Kérjük, próbálja meg később.",
            invalidEmail: "Kérjük, adjon meg egy érvényes e-mail címet.",
            tooManyRequests: "A hozzáférés ideiglenesen le van tiltva a túl sok sikertelen bejelentkezési kísérlet miatt. Kérjük, állítsa vissza jelszavát, vagy próbálkozzon később.",
            signInFailedPrefix: "Bejelentkezés sikertelen: ",
            unknownSignInError: "Ismeretlen hiba történt a bejelentkezés során.",
            profileSaveFailedPrefix: "Bejelentkezve, de a profiladatok mentése sikertelen: ",
            profileCheckSaveFailedPrefix: "Bejelentkezve, de a profiladatok ellenőrzése/mentése sikertelen: ",
            accountExistsWithDifferentCredential: "Ezzel az e-mail címmel már létezik fiók, amely más bejelentkezési módot használ.",
            googleSignInFailedPrefix: "Google bejelentkezés sikertelen: ",
            unknownGoogleSignInError: "Ismeretlen hiba történt a Google bejelentkezés során.",
            passwordsDoNotMatch: "A jelszavak nem egyeznek.",
            accountCreatedProfileSaveFailedPrefix: "Fiók létrehozva, de a profiladatok mentése sikertelen: ",
            unknownProfileSaveError: "Ismeretlen hiba történt a profil mentése során.",
            emailAlreadyRegistered: "Ez az e-mail cím már regisztrálva van.",
            passwordTooShortSignUp: "A jelszónak legalább 6 karakter hosszúnak kell lennie.",
            signUpFailedPrefix: "Regisztráció sikertelen: ",
            unknownSignUpError: "Ismeretlen hiba történt a regisztráció során."
        },
    },

    // Common
    common: {
        loading: 'Betöltés...',
        error: 'Hiba',
        save: 'Mentés',
        cancel: 'Mégse',
        delete: 'Törlés',
        confirm: 'Megerősítés',
        or: 'vagy',
        MoreInformation: "További információ",
        Example: "Példa:",
        ShowMore: "Több mutatása",
        ShowLess: "Kevesebb mutatása",
        AwaitingApproval: "Jóváhagyásra vár...",
        OpenInNewTab: "Megnyitás új lapon",
        AdvancedSettings: "Haladó beállítások",
        Name: "Név",
        Created: "Létrehozva",
        Updated: "Frissítve",
        Launched: "Elindítva",
        Docs: "Dokumentáció",
        Blog: "Blog",
        Pricing: "Árképzés",
        Terms: "Feltételek",
        Privacy: "Adatvédelem",
        Changelog: "Változási napló",
        Copy: "Másolás",
        Copied: "Másolva",
        TryAgain: "Próbálja újra"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Hiányzó API-kulcs",
    apiKeyMissingSubtext: "Ennek a szolgáltatónak az API-kulcsa hiányzik vagy érvénytelen. Kérjük, adja hozzá a beállításokban.",
    apiKeyNotNeeded: "API-kulcs nem szükséges",
    apiKeyNotNeededSubtext: "Ez a szolgáltató nem igényel API-kulcsot az ingyenes szintjéhez vagy bizonyos modelljeihez.",
    apiKeyFound: "API-kulcs beállítva",
    apiKeyFoundSubtext: "Ehhez a szolgáltatóhoz API-kulcs van konfigurálva.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Kiemelt csevegőmodellek",
    modelCategory_Reasoning: "Következtetési modellek",
    modelCategory_CostOptimized: "Költségoptimalizált modellek",
    modelCategory_OlderGPT: "Régebbi GPT modellek",
    modelCategory_Gemini2_5: "Gemini 2.5 sorozat",
    modelCategory_Gemini2_0: "Gemini 2.0 sorozat",
    modelCategory_Gemini1_5: "Gemini 1.5 sorozat",
    modelCategory_Claude3_7: "Claude 3.7 sorozat",
    modelCategory_Claude3_5: "Claude 3.5 sorozat",
    modelCategory_Claude3: "Claude 3 sorozat",
    modelCategory_Grok3: "Grok 3 sorozat",
    modelCategory_Grok3Mini: "Grok 3 Mini sorozat",
    modelCategory_Llama4: "Llama 4 sorozat",
    modelCategory_Llama3_3: "Llama 3.3 sorozat",
    modelCategory_Llama3_2: "Llama 3.2 sorozat",
    modelCategory_Llama3_1: "Llama 3.1 sorozat",
    modelCategory_Llama3: "Llama 3 sorozat",
    modelCategory_LlamaVision: "Llama Vision modellek",
    modelCategory_MetaLlama: "Meta Llama modellek",
    modelCategory_Gemma2: "Gemma 2 sorozat",
    modelCategory_Gemma: "Gemma sorozat",
    modelCategory_GoogleGemma: "Google Gemma modellek",
    modelCategory_DeepSeekR1: "DeepSeek R1 sorozat",
    modelCategory_DeepSeekV3: "DeepSeek V3 sorozat",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill sorozat",
    modelCategory_DeepSeekModels: "DeepSeek modellek",
    modelCategory_MistralAIModels: "Mistral AI modellek",
    modelCategory_Qwen3: "Qwen3 sorozat",
    modelCategory_QwQwQ: "Qwen QwQ sorozat",
    modelCategory_Qwen2_5: "Qwen2.5 sorozat",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision sorozat",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder sorozat",
    modelCategory_Qwen2: "Qwen2 sorozat",
    modelCategory_Qwen2Vision: "Qwen2 Vision sorozat",
    modelCategory_QwenModels: "Qwen modellek",
    modelCategory_OtherModels: "Egyéb modellek",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Nem sikerült betölteni a felhasználói adatokat: {errorMessage}. Kérjük, próbálja frissíteni.",
    page_ErrorUserNotFound: "Felhasználó nem található. Kérjük, jelentkezzen be újra.",
    page_ErrorUserApiKeyConfig: "A felhasználói API-kulcs konfigurációját nem sikerült betölteni. Kérjük, frissítse vagy ellenőrizze a beállításokat.",
    page_ErrorStartingSessionAPI: "API hiba: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Hiba a munkamenet indításakor: {errorMessage}",
    page_ErrorSessionIdMissing: "Az API-válasz sikeres volt, de nem tartalmazott beszélgetésazonosítót.",
    page_LoadingUserData: "Felhasználói adatok betöltése...",
    page_ErrorAlertTitle: "Hiba",
    page_WelcomeTitle: "Üdvözöljük a Two AIs-ban",
    page_WelcomeSubtitle: "Ez a webhely lehetővé teszi, hogy két LLM közötti beszélgetéseket hallgasson.",
    page_ApiKeysRequiredTitle: "API-kulcsok szükségesek",
    page_ApiKeysRequiredDescription: "A beszélgetések futtatásához bejelentkezés után meg kell adnia saját API-kulcsait a használni kívánt AI-modellekhez (pl. OpenAI, Google, Anthropic). Az egyes szolgáltatókra vonatkozó részletes utasítások a Beállítások / API-kulcsok oldalon találhatók bejelentkezés után.",
    page_SignInPrompt: "Saját munkamenet indításához bejelentkezhet vagy fiókot hozhat létre a fejlécben található hivatkozás segítségével.",
    page_VideoTitle: "Two AIs beszélgetési bemutató",
    page_AvailableLLMsTitle: "Jelenleg elérhető LLM-ek",
    page_TooltipGoogleThinkingBudget: "Ez a Google-modell \"gondolkodási költségvetést\" használ. A \"gondolkodási\" kimenet számlázásra kerül, de nem látható a csevegésben.",
    page_TooltipAnthropicExtendedThinking: "Ez az Anthropic-modell \"kiterjesztett gondolkodást\" használ. A \"gondolkodási\" kimenet számlázásra kerül, de nem látható a csevegésben.",
    page_TooltipXaiThinking: "Ez az xAI-modell \"gondolkodást\" használ. Ez a kimenet számlázásra kerül, de nem látható a csevegésben.",
    page_TooltipQwenReasoning: "Ez a Qwen-modell \"következtetést/gondolkodást\" használ. Ez a kimenet számlázásra kerül, de nem látható a csevegésben.",
    page_TooltipDeepSeekReasoning: "Ez a DeepSeek-modell \"következtetést/gondolkodást\" használ. A kimenet számlázásra kerül, de nem látható a csevegésben.",
    page_TooltipGenericReasoning: "Ez a modell olyan következtetési tokeneket használ, amelyek nem láthatók a csevegésben, de kimeneti tokenként kerülnek számlázásra.",
    page_TooltipRequiresVerification: "Ellenőrzött OpenAI-szervezetet igényel. Itt ellenőrizheti.",
    page_TooltipSupportsLanguage: "Támogatja a(z) {languageName} nyelvet",
    page_TooltipMayNotSupportLanguage: "Lehet, hogy nem támogatja a(z) {languageName} nyelvet",
    page_BadgePreview: "Előnézet",
    page_BadgeExperimental: "Kísérleti",
    page_BadgeBeta: "Béta",
    page_AvailableTTSTitle: "Jelenleg elérhető TTS-ek",
    page_NoTTSOptions: "Jelenleg nincsenek elérhető TTS-opciók.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Adja meg az új {serviceName} API-kulcsot",
    apiKeyManager_TestKey: "Kulcs tesztelése",
    apiKeyManager_TestingKey: "Kulcs tesztelése...",
    apiKeyManager_KeyIsValid: "A kulcs érvényes.",
    apiKeyManager_KeyIsInvalid: "A kulcs érvénytelen.",
    apiKeyManager_FailedToTestKey: "A kulcs tesztelése sikertelen.",
    apiKeyManager_ErrorTestingKey: "Hiba a kulcs tesztelésekor: {error}",
    apiKeyManager_KeyProvider: "Szolgáltató",
    apiKeyManager_KeyName: "Kulcs neve",
    apiKeyManager_Status: "Állapot",
    apiKeyManager_Action: "Művelet",

    // Model capabilities
    modelCapability_Vision: "Látás",
    modelCapability_JSON: "JSON mód",
    modelCapability_Tools: "Eszközhasználat",
    modelCapability_ImageGen: "Képgenerálás",
    modelCapability_Multilingual: "Többnyelvű",
    modelCapability_WebSearch: "Webes keresés",
    modelCapability_LargeContext: "Nagy kontextus",
    modelCapability_LongContext: "Hosszú kontextus",
    modelCapability_FastResponse: "Gyors válasz",
    modelCapability_CostEffective: "Költséghatékony",
    modelCapability_AdvancedReasoning: "Fejlett következtetés",
    modelCapability_Coding: "Kódolás",
    modelCapability_Foundation: "Alapmodell",
    modelCapability_Experimental: "Kísérleti",
    modelCapability_Beta: "Béta",
    modelCapability_Preview: "Előnézet",
    modelCapability_RequiresVerification: "Ellenőrzést igényel",
    modelCapability_RequiresAccount: "Fiókot igényel",

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