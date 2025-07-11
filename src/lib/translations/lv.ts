// src/lib/translations/lv.ts
const lv = {
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
        hi: 'Hindu',
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
        mt: 'Maltiešu',
        bs: 'Bosniešu',
        ca: 'Katalāņu',
        gu: 'Gudžaratu',
        hy: 'Armēņu',
        is: 'Islandiešu',
        ka: 'Gruzīnu',
        kk: 'Kazahu',
        kn: 'Kannadu',
        mk: 'Maķedoniešu',
        ml: 'Malajalu',
        mr: 'Maratu',
        ms: 'Malajiešu',
        my: 'Birmiešu',
        pa: 'Pendžabu',
        so: 'Somāļu',
        sq: 'Albāņu',
        ta: 'Tamilu',
        te: 'Telugu',
        tl: 'Tagalu',
        ur: 'Urdu',
        am: 'Amharu',
        mn: 'Mongoļu',
    },

    // Settings page
    settings: {
        title: 'Iestatījumi',
        sections: {
            appearance: 'Izskats',
            apiKeys: 'API Atslēgas',
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
            title: 'API Atslēgas',
            description: 'Pārvaldiet savas API atslēgas dažādiem AI nodrošinātājiem',
            saved: 'Saglabāts',
            notSet: 'Nav iestatīts',
            setKey: 'Iestatīt atslēgu',
            updateKey: 'Atjaunināt atslēgu',
            removeKey: 'Noņemt atslēgu',
            getKeyInstructions: 'Iegūstiet savu API atslēgu',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Nav ievadītas jaunas API atslēgas, ko saglabāt.",
            unexpectedResponse: "Saņemts neparedzēts atbildes signāls no servera.",
            failedToSaveKey: "Neizdevās saglabāt {serviceName} atslēgu.",
            someKeysNotSaved: "Dažas API atslēgas nevarēja saglabāt. Lūdzu, pārbaudiet sīkāku informāciju zemāk.",
            keyStatus: "atslēgas statuss...",
            apiKeySecurelySaved: "API Atslēga Droši Saglabāta",
            confirmRemoveTitle: "Apstiprināt Noņemšanu",
            confirmRemoveDescription: "Vai tiešām vēlaties noņemt API atslēgu {serviceName}? Šo darbību nevar atsaukt.",
            failedToRemoveKey: "Neizdevās noņemt {serviceName} atslēgu.",
            successfullyRemovedKey: "Veiksmīgi noņemta {serviceName} atslēga.",
            keyNotSet: "Atslēgas Statuss: Nav Iestatīts",
            keySet: "Atslēgas Statuss: Iestatīts",
            saveButton: "Saglabāt API Atslēgu(-as)"
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
                provider: 'TTS Nodrošinātājs',
                selectProvider: 'Izvēlieties TTS nodrošinātāju',
                voice: 'Balss',
                selectVoice: 'Izvēlieties balsi',
                model: 'TTS Modelis',
                selectModel: 'Izvēlieties TTS modeli',
            },
            startConversation: 'Sākt sarunu',
            conversationPrompt: 'Sāciet sarunu.',
        },
        conversation: {
            thinking: 'domā...',
            stop: 'Apturēt',
            restart: 'Restartēt sarunu',
        },
        pricing: {
            estimatedCost: 'Paredzamās izmaksas',
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
            orContinueWith: "Vai turpiniet ar",
            signingIn: "Piesakās..."
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
            profileSaveFailedPrefix: "Pieteicāties, bet profila datu saglabāšana neizdevās: ",
            profileCheckSaveFailedPrefix: "Pieteicāties, bet profila datu pārbaude/saglabāšana neizdevās: ",
            accountExistsWithDifferentCredential: "Konts ar šo e-pasta adresi jau pastāv, izmantojot citu pieteikšanās metodi.",
            googleSignInFailedPrefix: "Google pieteikšanās neizdevās: ",
            unknownGoogleSignInError: "Google pieteikšanās laikā radās nezināma kļūda.",
            passwordsDoNotMatch: "Paroles nesakrīt.",
            accountCreatedProfileSaveFailedPrefix: "Konts izveidots, bet profila datu saglabāšana neizdevās: ",
            unknownProfileSaveError: "Profila saglabāšanas laikā radās nezināma kļūda.",
            emailAlreadyRegistered: "Šī e-pasta adrese jau ir reģistrēta.",
            passwordTooShortSignUp: "Parolei jābūt vismaz 6 rakstzīmēm garai.",
            signUpFailedPrefix: "Reģistrācija neizdevās: ",
            unknownSignUpError: "Reģistrācijas laikā radās nezināma kļūda."
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
    apiKeyMissing: "Trūkst API Atslēgas",
    apiKeyMissingSubtext: "Šī nodrošinātāja API atslēga trūkst vai ir nederīga. Lūdzu, pievienojiet to iestatījumos.",
    apiKeyNotNeeded: "API Atslēga Nav Nepieciešama",
    apiKeyNotNeededSubtext: "Šis nodrošinātājs neprasa API atslēgu savam bezmaksas līmenim vai noteiktiem modeļiem.",
    apiKeyFound: "API Atslēga Iestatīta",
    apiKeyFoundSubtext: "Šim nodrošinātājam ir konfigurēta API atslēga.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Vadošie Tērzēšanas Modeļi",
    modelCategory_Reasoning: "Spriešanas Modeļi",
    modelCategory_CostOptimized: "Izmaksu Optimizēti Modeļi",
    modelCategory_OlderGPT: "Vecāki GPT Modeļi",
    modelCategory_Gemini2_5: "Gemini 2.5 Sērija",
    modelCategory_Gemini2_0: "Gemini 2.0 Sērija",
    modelCategory_Gemini1_5: "Gemini 1.5 Sērija",
    modelCategory_Claude3_7: "Claude 3.7 Sērija",
    modelCategory_Claude3_5: "Claude 3.5 Sērija",
    modelCategory_Claude3: "Claude 3 Sērija",
    modelCategory_Grok3: "Grok 3 Sērija",
    modelCategory_Grok3Mini: "Grok 3 Mini Sērija",
    modelCategory_Llama4: "Llama 4 Sērija",
    modelCategory_Llama3_3: "Llama 3.3 Sērija",
    modelCategory_Llama3_2: "Llama 3.2 Sērija",
    modelCategory_Llama3_1: "Llama 3.1 Sērija",
    modelCategory_Llama3: "Llama 3 Sērija",
    modelCategory_LlamaVision: "Llama Vision Modeļi",
    modelCategory_MetaLlama: "Meta Llama Modeļi",
    modelCategory_Gemma2: "Gemma 2 Sērija",
    modelCategory_Gemma: "Gemma Sērija",
    modelCategory_GoogleGemma: "Google Gemma Modeļi",
    modelCategory_DeepSeekR1: "DeepSeek R1 Sērija",
    modelCategory_DeepSeekV3: "DeepSeek V3 Sērija",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill Sērija",
    modelCategory_DeepSeekModels: "DeepSeek Modeļi",
    modelCategory_MistralAIModels: "Mistral AI Modeļi",
    modelCategory_Qwen3: "Qwen3 Sērija",
    modelCategory_QwQwQ: "Qwen QwQ Sērija",
    modelCategory_Qwen2_5: "Qwen2.5 Sērija",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision Sērija",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder Sērija",
    modelCategory_Qwen2: "Qwen2 Sērija",
    modelCategory_Qwen2Vision: "Qwen2 Vision Sērija",
    modelCategory_QwenModels: "Qwen Modeļi",
    modelCategory_OtherModels: "Citi Modeļi",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Neizdevās ielādēt lietotāja datus: {errorMessage}. Lūdzu, mēģiniet atsvaidzināt.",
    page_ErrorUserNotFound: "Lietotājs nav atrasts. Lūdzu, piesakieties vēlreiz.",
    page_ErrorUserApiKeyConfig: "Nevarēja ielādēt lietotāja API atslēgas konfigurāciju. Lūdzu, atsvaidziniet vai pārbaudiet iestatījumus.",
    page_ErrorStartingSessionAPI: "API Kļūda: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Kļūda, sākot sesiju: {errorMessage}",
    page_ErrorSessionIdMissing: "API atbilde bija veiksmīga, bet tajā nebija sarunas ID.",
    page_LoadingUserData: "Notiek lietotāja datu ielāde...",
    page_ErrorAlertTitle: "Kļūda",
    page_WelcomeTitle: "Laipni lūdzam Two AIs",
    page_WelcomeSubtitle: "Šī vietne ļauj jums klausīties sarunas starp diviem LLM.",
    page_ApiKeysRequiredTitle: "Nepieciešamas API Atslēgas",
    page_ApiKeysRequiredDescription: "Lai palaistu sarunas, pēc pieteikšanās jums būs jānorāda savas API atslēgas AI modeļiem, kurus vēlaties izmantot (piemēram, OpenAI, Google, Anthropic). Detalizētas instrukcijas katram nodrošinātājam var atrast Iestatījumu / API Atslēgu lapā pēc pieteikšanās.",
    page_SignInPrompt: "Lai sāktu savu sesiju, varat pieteikties vai izveidot kontu, izmantojot saiti galvenē.",
    page_VideoTitle: "Two AIs Sarunas Demonstrācija",
    page_AvailableLLMsTitle: "Pašlaik Pieejamie LLM",
    page_TooltipGoogleThinkingBudget: "Šis Google modelis izmanto 'domāšanas budžetu'. 'Domāšanas' izvade tiek apmaksāta, bet nav redzama tērzēšanā.",
    page_TooltipAnthropicExtendedThinking: "Šis Anthropic modelis izmanto 'paplašinātu domāšanu'. 'Domāšanas' izvade tiek apmaksāta, bet nav redzama tērzēšanā.",
    page_TooltipXaiThinking: "Šis xAI modelis izmanto 'domāšanu'. Šī izvade tiek apmaksāta, bet nav redzama tērzēšanā.",
    page_TooltipQwenReasoning: "Šis Qwen modelis izmanto 'spriešanu/domāšanu'. Šī izvade tiek apmaksāta, bet nav redzama tērzēšanā.",
    page_TooltipDeepSeekReasoning: "Šis DeepSeek modelis izmanto 'spriešanu/domāšanu'. Izvade tiek apmaksāta, bet nav redzama tērzēšanā.",
    page_TooltipGenericReasoning: "Šis modelis izmanto spriešanas žetonus, kas nav redzami tērzēšanā, bet tiek apmaksāti kā izvades žetoni.",
    page_TooltipRequiresVerification: "Nepieciešama verificēta OpenAI organizācija. Jūs varat verificēt šeit.",
    page_TooltipSupportsLanguage: "Atbalsta {languageName}",
    page_TooltipMayNotSupportLanguage: "Var neatbalstīt {languageName}",
    page_BadgePreview: "Priekšskatījums",
    page_BadgeExperimental: "Eksperimentāls",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Pašlaik Pieejamie TTS",
    page_NoTTSOptions: "Pašlaik nav pieejamu TTS opciju.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Ievadiet jaunu {serviceName} API atslēgu",
    apiKeyManager_TestKey: "Pārbaudīt atslēgu",
    apiKeyManager_TestingKey: "Notiek atslēgas pārbaude...",
    apiKeyManager_KeyIsValid: "Atslēga ir derīga.",
    apiKeyManager_KeyIsInvalid: "Atslēga nav derīga.",
    apiKeyManager_FailedToTestKey: "Neizdevās pārbaudīt atslēgu.",
    apiKeyManager_ErrorTestingKey: "Kļūda, pārbaudot atslēgu: {error}",
    apiKeyManager_KeyProvider: "Nodrošinātājs",
    apiKeyManager_KeyName: "Atslēgas nosaukums",
    apiKeyManager_Status: "Statuss",
    apiKeyManager_Action: "Darbība",

    // Model capabilities
    modelCapability_Vision: "Redze",
    modelCapability_JSON: "JSON Režīms",
    modelCapability_Tools: "Rīku Lietošana",
    modelCapability_ImageGen: "Attēlu Ģenerēšana",
    modelCapability_Multilingual: "Daudzvalodu",
    modelCapability_WebSearch: "Tīmekļa Meklēšana",
    modelCapability_LargeContext: "Liels Konteksts",
    modelCapability_LongContext: "Garš Konteksts",
    modelCapability_FastResponse: "Ātra Atbilde",
    modelCapability_CostEffective: "Rentabls",
    modelCapability_AdvancedReasoning: "Progresīva Spriešana",
    modelCapability_Coding: "Kodēšana",
    modelCapability_Foundation: "Pamata Modelis",
    modelCapability_Experimental: "Eksperimentāls",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Priekšskatījums",
    modelCapability_RequiresVerification: "Nepieciešama Verifikācija",
    modelCapability_RequiresAccount: "Nepieciešams Konts",

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
export default lv;