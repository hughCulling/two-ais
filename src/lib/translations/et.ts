// src/lib/translations/et.ts
const et = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Seaded',
        signIn: 'Logi sisse',
        signOut: 'Logi välja',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Araabia',
        bn: 'Bengali',
        bg: 'Bulgaaria',
        zh: 'Hiina',
        hr: 'Horvaadi',
        cs: 'Tšehhi',
        da: 'Taani',
        nl: 'Hollandi',
        en: 'Inglise',
        et: 'Eesti',
        fi: 'Soome',
        fr: 'Prantsuse',
        de: 'Saksa',
        el: 'Kreeka',
        iw: 'Heebrea',
        hi: 'Hindi',
        hu: 'Ungari',
        id: 'Indoneesia',
        it: 'Itaalia',
        ja: 'Jaapani',
        ko: 'Korea',
        lv: 'Läti',
        lt: 'Leedu',
        no: 'Norra',
        pl: 'Poola',
        pt: 'Portugali',
        ro: 'Rumeenia',
        ru: 'Vene',
        sr: 'Serbia',
        sk: 'Slovaki',
        sl: 'Sloveeni',
        es: 'Hispaania',
        sw: 'Suahiili',
        sv: 'Rootsi',
        th: 'Tai',
        tr: 'Türgi',
        uk: 'Ukraina',
        vi: 'Vietnami',
        mt: 'Malta',
        bs: 'Bosnia',
        ca: 'Katalaani',
        gu: 'Gudžarati',
        hy: 'Armeenia',
        is: 'Islandi',
        ka: 'Gruusia',
        kk: 'Kasahhi',
        kn: 'Kannada',
        mk: 'Makedoonia',
        ml: 'Malajalami',
        mr: 'Marati',
        ms: 'Malai',
        my: 'Birma',
        pa: 'Pandžabi',
        so: 'Somaali',
        sq: 'Albaania',
        ta: 'Tamili',
        te: 'Telugu',
        tl: 'Tagalogi',
        ur: 'Urdu',
        am: 'Amhara',
        mn: 'Mongoolia',
    },

    // Settings page
    settings: {
        title: 'Seaded',
        sections: {
            appearance: 'Välimus',
            apiKeys: 'API võtmed',
            language: 'Keel',
        },
        appearance: {
            theme: 'Teema',
            light: 'Hele',
            dark: 'Tume',
            system: 'Süsteem',
            description: "Kohandage rakenduse välimust ja tunnetust."
        },
        language: {
            title: 'Keel',
            description: 'Valige eelistatud keel kasutajaliidese jaoks',
            conversationLanguage: 'Vestluskeel',
            conversationLanguageDescription: 'AI vestlustes kasutatav keel vastab teie kasutajaliidese keelele',
        },
        apiKeys: {
            title: 'API võtmed',
            description: 'Hallake oma API võtmeid erinevate AI pakkujate jaoks',
            saved: 'Salvestatud',
            notSet: 'Määramata',
            setKey: 'Määra võti',
            updateKey: 'Uuenda võtit',
            removeKey: 'Eemalda võti',
            getKeyInstructions: 'Hankige oma API võti',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Salvestamiseks pole uusi API-võtmeid sisestatud.",
            unexpectedResponse: "Serverist saadi ootamatu vastus.",
            failedToSaveKey: "Teenuse {serviceName} võtme salvestamine ebaõnnestus.",
            someKeysNotSaved: "Mõnda API-võtit ei õnnestunud salvestada. Palun kontrollige allolevaid üksikasju.",
            keyStatus: "võtme olek...",
            apiKeySecurelySaved: "API-võti on turvaliselt salvestatud",
            confirmRemoveTitle: "Kinnitage eemaldamine",
            confirmRemoveDescription: "Kas olete kindel, et soovite eemaldada API-võtme teenuse {serviceName} jaoks? Seda toimingut ei saa tagasi võtta.",
            failedToRemoveKey: "Teenuse {serviceName} võtme eemaldamine ebaõnnestus.",
            successfullyRemovedKey: "Teenuse {serviceName} võti on edukalt eemaldatud.",
            keyNotSet: "Võtme olek: määramata",
            keySet: "Võtme olek: määratud",
            saveButton: "Salvesta API-võti(med)"
        },
    },

    // Main page
    main: {
        title: 'AI Vestlus',
        setupForm: {
            title: 'Seadistage oma vestlus',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Mudel',
            selectModel: 'Valige mudel',
            tts: {
                title: 'Tekst kõneks',
                enable: 'Luba tekst kõneks',
                provider: 'TTS pakkuja',
                selectProvider: 'Valige TTS pakkuja',
                voice: 'Hääl',
                selectVoice: 'Valige hääl',
                model: 'TTS mudel',
                selectModel: 'Valige TTS mudel',
            },
            startConversation: 'Alusta vestlust',
            conversationPrompt: 'Alustage vestlust.',
        },
        conversation: {
            thinking: 'mõtleb...',
            stop: 'Peata',
            restart: 'Taaskäivita vestlus',
        },
        pricing: {
            estimatedCost: 'Eeldatav maksumus',
            perMillionTokens: 'miljoni märgi kohta',
            input: 'Sisend',
            output: 'Väljund',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Logi sisse Two AIs', // Keep brand name
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Parool',
            signIn: 'Logi sisse',
            signInWithGoogle: 'Logi sisse Google\'ga',
            noAccount: "Kas teil pole kontot?",
            signUp: 'Registreeru',
            forgotPassword: 'Unustasid parooli?',
            orContinueWith: "Või jätka",
            signingIn: "Sisselogimine..."
        },
        signup: {
            title: 'Loo konto',
            emailPlaceholder: 'E-post',
            passwordPlaceholder: 'Parool (vähemalt 6 tähemärki)',
            signUp: 'Registreeru',
            signUpWithGoogle: 'Registreeru Google\'ga',
            hasAccount: 'Kas teil on juba konto?',
            signIn: 'Logi sisse',
            emailLabel: "E-posti aadress",
            confirmPasswordPlaceholder: "Kinnitage parool",
            signingUp: "Registreerumine..."
        },
        errors: {
            invalidCredentials: 'Vale e-posti aadress või parool',
            userNotFound: 'Kasutajat ei leitud',
            weakPassword: 'Parool peab olema vähemalt 6 tähemärki pikk',
            emailInUse: 'E-posti aadress on juba kasutusel',
            generic: 'Ilmnes viga. Palun proovi uuesti.',
            initialization: "Lähtestamise viga. Palun proovige hiljem uuesti.",
            invalidEmail: "Palun sisestage kehtiv e-posti aadress.",
            tooManyRequests: "Juurdepääs on ajutiselt keelatud liiga paljude ebaõnnestunud sisselogimiskatsete tõttu. Palun lähtestage oma parool või proovige hiljem uuesti.",
            signInFailedPrefix: "Sisselogimine ebaõnnestus: ",
            unknownSignInError: "Sisselogimisel ilmnes tundmatu viga.",
            profileSaveFailedPrefix: "Sisse logitud, kuid profiiliandmete salvestamine ebaõnnestus: ",
            profileCheckSaveFailedPrefix: "Sisse logitud, kuid profiiliandmete kontrollimine/salvestamine ebaõnnestus: ",
            accountExistsWithDifferentCredential: "Selle e-postiga konto on juba olemas, kasutades teist sisselogimisviisi.",
            googleSignInFailedPrefix: "Google'i sisselogimine ebaõnnestus: ",
            unknownGoogleSignInError: "Google'i sisselogimisel ilmnes tundmatu viga.",
            passwordsDoNotMatch: "Paroolid ei ühti.",
            accountCreatedProfileSaveFailedPrefix: "Konto loodud, kuid profiiliandmete salvestamine ebaõnnestus: ",
            unknownProfileSaveError: "Profiili salvestamisel ilmnes tundmatu viga.",
            emailAlreadyRegistered: "See e-posti aadress on juba registreeritud.",
            passwordTooShortSignUp: "Parool peab olema vähemalt 6 tähemärki pikk.",
            signUpFailedPrefix: "Registreerumine ebaõnnestus: ",
            unknownSignUpError: "Registreerumisel ilmnes tundmatu viga."
        },
    },

    // Common
    common: {
        loading: 'Laadimine...',
        error: 'Viga',
        save: 'Salvesta',
        cancel: 'Tühista',
        delete: 'Kustuta',
        confirm: 'Kinnita',
        or: 'või',
        MoreInformation: "Rohkem informatsiooni",
        Example: "Näide:",
        ShowMore: "Näita rohkem",
        ShowLess: "Näita vähem",
        AwaitingApproval: "Ootab heakskiitu...",
        OpenInNewTab: "Ava uuel vahelehel",
        AdvancedSettings: "Täpsemad seaded",
        Name: "Nimi",
        Created: "Loodud",
        Updated: "Uuendatud",
        Launched: "Käivitatud",
        Docs: "Dokumentatsioon",
        Blog: "Blogi",
        Pricing: "Hinnakiri",
        Terms: "Tingimused",
        Privacy: "Privaatsus",
        Changelog: "Muudatuste logi",
        Copy: "Kopeeri",
        Copied: "Kopeeritud",
        TryAgain: "Proovi uuesti"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API võti puudub",
    apiKeyMissingSubtext: "Selle pakkuja API võti puudub või on kehtetu. Palun lisage see seadetes.",
    apiKeyNotNeeded: "API võtit pole vaja",
    apiKeyNotNeededSubtext: "See pakkuja ei vaja oma tasuta astme ega teatud mudelite jaoks API võtit.",
    apiKeyFound: "API võti on määratud",
    apiKeyFoundSubtext: "Selle pakkuja jaoks on konfigureeritud API võti.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Lipulaev vestlusmudelid",
    modelCategory_Reasoning: "Arutlusmudelid",
    modelCategory_CostOptimized: "Kuludele optimeeritud mudelid",
    modelCategory_OlderGPT: "Vanemad GPT mudelid",
    modelCategory_Gemini2_5: "Gemini 2.5 seeria",
    modelCategory_Gemini2_0: "Gemini 2.0 seeria",
    modelCategory_Gemini1_5: "Gemini 1.5 seeria",
    modelCategory_Claude3_7: "Claude 3.7 seeria",
    modelCategory_Claude3_5: "Claude 3.5 seeria",
    modelCategory_Claude3: "Claude 3 seeria",
    modelCategory_Grok3: "Grok 3 seeria",
    modelCategory_Grok3Mini: "Grok 3 Mini seeria",
    modelCategory_Llama4: "Llama 4 seeria",
    modelCategory_Llama3_3: "Llama 3.3 seeria",
    modelCategory_Llama3_2: "Llama 3.2 seeria",
    modelCategory_Llama3_1: "Llama 3.1 seeria",
    modelCategory_Llama3: "Llama 3 seeria",
    modelCategory_LlamaVision: "Llama Vision mudelid",
    modelCategory_MetaLlama: "Meta Llama mudelid",
    modelCategory_Gemma2: "Gemma 2 seeria",
    modelCategory_Gemma: "Gemma seeria",
    modelCategory_GoogleGemma: "Google Gemma mudelid",
    modelCategory_DeepSeekR1: "DeepSeek R1 seeria",
    modelCategory_DeepSeekV3: "DeepSeek V3 seeria",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill seeria",
    modelCategory_DeepSeekModels: "DeepSeek mudelid",
    modelCategory_MistralAIModels: "Mistral AI mudelid",
    modelCategory_Qwen3: "Qwen3 seeria",
    modelCategory_QwQwQ: "Qwen QwQ seeria",
    modelCategory_Qwen2_5: "Qwen2.5 seeria",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision seeria",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder seeria",
    modelCategory_Qwen2: "Qwen2 seeria",
    modelCategory_Qwen2Vision: "Qwen2 Vision seeria",
    modelCategory_QwenModels: "Qwen mudelid",
    modelCategory_OtherModels: "Muud mudelid",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Kasutajaandmete laadimine ebaõnnestus: {errorMessage}. Palun proovige värskendada.",
    page_ErrorUserNotFound: "Kasutajat ei leitud. Palun logige uuesti sisse.",
    page_ErrorUserApiKeyConfig: "Kasutaja API võtme konfiguratsiooni ei saanud laadida. Palun värskendage või kontrollige seadeid.",
    page_ErrorStartingSessionAPI: "API viga: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Sessiooni alustamisel ilmnes viga: {errorMessage}",
    page_ErrorSessionIdMissing: "API vastus oli edukas, kuid ei sisaldanud vestluse ID-d.",
    page_LoadingUserData: "Kasutajaandmete laadimine...",
    page_ErrorAlertTitle: "Viga",
    page_WelcomeTitle: "Tere tulemast Two AIs-i",
    page_WelcomeSubtitle: "See veebisait võimaldab teil kuulata kahe LLM-i vahelisi vestlusi.",
    page_ApiKeysRequiredTitle: "API võtmed on vajalikud",
    page_ApiKeysRequiredDescription: "Vestluste käivitamiseks peate pärast sisselogimist esitama oma API-võtmed nende AI-mudelite jaoks, mida soovite kasutada (nt OpenAI, Google, Anthropic). Üksikasjalikud juhised iga pakkuja kohta leiate pärast sisselogimist lehelt Seaded / API võtmed.",
    page_SignInPrompt: "Oma seansi alustamiseks saate sisse logida või luua konto päises oleva lingi abil.",
    page_VideoTitle: "Two AIs vestluse demo",
    page_AvailableLLMsTitle: "Praegu saadaval olevad LLM-id",
    page_TooltipGoogleThinkingBudget: "See Google'i mudel kasutab nn mõtlemiseelarvet. Mõtlemise väljund on tasuline, kuid vestluses seda ei kuvata.",
    page_TooltipAnthropicExtendedThinking: "See Anthropicu mudel kasutab laiendatud mõtlemist. Mõtlemise väljund on tasuline, kuid vestluses seda ei kuvata.",
    page_TooltipXaiThinking: "See xAI mudel kasutab mõtlemist. See väljund on tasuline, kuid vestluses seda ei kuvata.",
    page_TooltipQwenReasoning: "See Qweni mudel kasutab arutluskäiku/mõtlemist. See väljund on tasuline, kuid vestluses seda ei kuvata.",
    page_TooltipDeepSeekReasoning: "See DeepSeeki mudel kasutab arutluskäiku/mõtlemist. Väljund on tasuline, kuid vestluses seda ei kuvata.",
    page_TooltipGenericReasoning: "See mudel kasutab arutlusmärke, mis ei ole vestluses nähtavad, kuid mille eest tasutakse väljundmärkidena.",
    page_TooltipRequiresVerification: "Nõuab kinnitatud OpenAI organisatsiooni. Kinnitada saab siin.",
    page_TooltipSupportsLanguage: "Toetab keelt {languageName}",
    page_TooltipMayNotSupportLanguage: "Ei pruugi toetada keelt {languageName}",
    page_BadgePreview: "Eelvaade",
    page_BadgeExperimental: "Eksperimentaalne",
    page_BadgeBeta: "Beeta",
    page_AvailableTTSTitle: "Praegu saadaval olevad TTS-id",
    page_NoTTSOptions: "Praegu pole TTS-i valikuid saadaval.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Sisestage uus {serviceName} API-võti",
    apiKeyManager_TestKey: "Testi võtit",
    apiKeyManager_TestingKey: "Võtme testimine...",
    apiKeyManager_KeyIsValid: "Võti on kehtiv.",
    apiKeyManager_KeyIsInvalid: "Võti on kehtetu.",
    apiKeyManager_FailedToTestKey: "Võtme testimine ebaõnnestus.",
    apiKeyManager_ErrorTestingKey: "Võtme testimisel ilmnes viga: {error}",
    apiKeyManager_KeyProvider: "Pakkuja",
    apiKeyManager_KeyName: "Võtme nimi",
    apiKeyManager_Status: "Olek",
    apiKeyManager_Action: "Toiming",

    // Model capabilities
    modelCapability_Vision: "Nägemine",
    modelCapability_JSON: "JSON-režiim",
    modelCapability_Tools: "Tööriistade kasutamine",
    modelCapability_ImageGen: "Piltide genereerimine",
    modelCapability_Multilingual: "Mitmekeelne",
    modelCapability_WebSearch: "Veebiotsing",
    modelCapability_LargeContext: "Suur kontekst",
    modelCapability_LongContext: "Pikk kontekst",
    modelCapability_FastResponse: "Kiire vastus",
    modelCapability_CostEffective: "Kuluefektiivne",
    modelCapability_AdvancedReasoning: "Täiustatud arutluskäik",
    modelCapability_Coding: "Kodeerimine",
    modelCapability_Foundation: "Alusmudel",
    modelCapability_Experimental: "Eksperimentaalne",
    modelCapability_Beta: "Beeta",
    modelCapability_Preview: "Eelvaade",
    modelCapability_RequiresVerification: "Nõuab kinnitamist",
    modelCapability_RequiresAccount: "Nõuab kontot",

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
export default et; 