// src/lib/translations/sk.ts
const sk = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Nastavenia',
        signIn: 'Prihlásiť sa',
        signOut: 'Odhlásiť sa',
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
        title: 'Nastavenia',
        sections: {
            appearance: 'Vzhľad',
            apiKeys: 'API kľúče',
            language: 'Jazyk',
        },
        appearance: {
            theme: 'Téma',
            light: 'Svetlá',
            dark: 'Tmavá',
            system: 'Systémová',
            description: "Prispôsobte vzhľad a dojem aplikácie."
        },
        language: {
            title: 'Jazyk',
            description: 'Vyberte preferovaný jazyk pre rozhranie',
            conversationLanguage: 'Jazyk konverzácie',
            conversationLanguageDescription: 'Jazyk používaný pre konverzácie s AI bude zodpovedať jazyku vášho rozhrania',
        },
        apiKeys: {
            title: 'API kľúče',
            description: 'Spravujte svoje API kľúče pre rôznych poskytovateľov AI',
            saved: 'Uložené',
            notSet: 'Nenastavené',
            setKey: 'Nastaviť kľúč',
            updateKey: 'Aktualizovať kľúč',
            removeKey: 'Odstrániť kľúč',
            getKeyInstructions: 'Získajte svoj API kľúč',
            noNewKeys: "Neboli zadané žiadne nové API kľúče na uloženie.",
            unexpectedResponse: "Prijatá neočakávaná odpoveď zo servera.",
            failedToSaveKey: "Nepodarilo sa uložiť kľúč {serviceName}.",
            someKeysNotSaved: "Niektoré API kľúče sa nepodarilo uložiť. Skontrolujte podrobnosti nižšie.",
            keyStatus: "stav kľúča...",
            apiKeySecurelySaved: "API kľúč bezpečne uložený",
            confirmRemoveTitle: "Potvrdiť odstránenie",
            confirmRemoveDescription: "Naozaj chcete odstrániť API kľúč pre {serviceName}? Táto akcia sa nedá vrátiť späť.",
            failedToRemoveKey: "Nepodarilo sa odstrániť kľúč {serviceName}.",
            successfullyRemovedKey: "Kľúč {serviceName} úspešne odstránený.",
            keyNotSet: "Stav kľúča: Nenastavený",
            keySet: "Stav kľúča: Nastavený",
            saveButton: "Uložiť API kľúč(e)"
        },
    },

    // Main page
    main: {
        title: 'Konverzácia s AI',
        setupForm: {
            title: 'Nastavte si konverzáciu',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Vyberte model',
            tts: {
                title: 'Prevod textu na reč',
                enable: 'Povoliť prevod textu na reč',
                provider: 'Poskytovateľ TTS',
                selectProvider: 'Vyberte poskytovateľa TTS',
                voice: 'Hlas',
                selectVoice: 'Vyberte hlas',
                model: 'Model TTS',
                selectModel: 'Vyberte model TTS',
            },
            startConversation: 'Začať konverzáciu',
            conversationPrompt: 'Začnite konverzáciu.',
        },
        conversation: {
            thinking: 'rozmýšľa...',
            stop: 'Zastaviť',
            restart: 'Reštartovať konverzáciu',
        },
        pricing: {
            estimatedCost: 'Odhadované náklady',
            perMillionTokens: 'na milión tokenov',
            input: 'Vstup',
            output: 'Výstup',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Prihlásiť sa do Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Heslo',
            signIn: 'Prihlásiť sa',
            signInWithGoogle: 'Prihlásiť sa cez Google',
            noAccount: "Nemáte účet?",
            signUp: 'Zaregistrovať sa',
            forgotPassword: 'Zabudli ste heslo?',
            orContinueWith: "Alebo pokračujte s",
            signingIn: "Prihlasovanie..."
        },
        signup: {
            title: 'Vytvoriť účet',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Heslo (aspoň 6 znakov)',
            signUp: 'Zaregistrovať sa',
            signUpWithGoogle: 'Zaregistrovať sa cez Google',
            hasAccount: 'Máte už účet?',
            signIn: 'Prihlásiť sa',
            emailLabel: "E-mailová adresa",
            confirmPasswordPlaceholder: "Potvrďte heslo",
            signingUp: "Registrácia..."
        },
        errors: {
            invalidCredentials: 'Neplatný e-mail alebo heslo',
            userNotFound: 'Používateľ sa nenašiel',
            weakPassword: 'Heslo musí mať aspoň 6 znakov',
            emailInUse: 'E-mail sa už používa',
            generic: 'Vyskytla sa chyba. Skúste to znova.',
            initialization: "Chyba inicializácie. Skúste to prosím neskôr.",
            invalidEmail: "Zadajte platnú e-mailovú adresu.",
            tooManyRequests: "Prístup je dočasne zakázaný z dôvodu príliš veľkého počtu neúspešných pokusov o prihlásenie. Obnovte si heslo alebo to skúste neskôr.",
            signInFailedPrefix: "Prihlásenie zlyhalo: ",
            unknownSignInError: "Počas prihlasovania sa vyskytla neznáma chyba.",
            profileSaveFailedPrefix: "Prihlásenie úspešné, ale uloženie profilových údajov zlyhalo: ",
            profileCheckSaveFailedPrefix: "Prihlásenie úspešné, ale kontrola/uloženie profilových údajov zlyhalo: ",
            accountExistsWithDifferentCredential: "Účet s týmto e-mailom už existuje a používa iný spôsob prihlásenia.",
            googleSignInFailedPrefix: "Prihlásenie cez Google zlyhalo: ",
            unknownGoogleSignInError: "Počas prihlasovania cez Google sa vyskytla neznáma chyba.",
            passwordsDoNotMatch: "Heslá sa nezhodujú.",
            accountCreatedProfileSaveFailedPrefix: "Účet bol vytvorený, ale uloženie profilových údajov zlyhalo: ",
            unknownProfileSaveError: "Počas ukladania profilu sa vyskytla neznáma chyba.",
            emailAlreadyRegistered: "Táto e-mailová adresa je už zaregistrovaná.",
            passwordTooShortSignUp: "Heslo musí mať aspoň 6 znakov.",
            signUpFailedPrefix: "Registrácia zlyhala: ",
            unknownSignUpError: "Počas registrácie sa vyskytla neznáma chyba."
        },
    },

    // Common
    common: {
        loading: 'Načítava sa...',
        error: 'Chyba',
        save: 'Uložiť',
        cancel: 'Zrušiť',
        delete: 'Odstrániť',
        confirm: 'Potvrdiť',
        or: 'alebo',
        MoreInformation: "Viac informácií",
        Example: "Príklad:",
        ShowMore: "Zobraziť viac",
        ShowLess: "Zobraziť menej",
        AwaitingApproval: "Čaká na schválenie...",
        OpenInNewTab: "Otvoriť na novej karte",
        AdvancedSettings: "Rozšírené nastavenia",
        Name: "Názov",
        Created: "Vytvorené",
        Updated: "Aktualizované",
        Launched: "Spustené",
        Docs: "Dokumentácia",
        Blog: "Blog",
        Pricing: "Ceny",
        Terms: "Podmienky",
        Privacy: "Súkromie",
        Changelog: "Zoznam zmien",
        Copy: "Kopírovať",
        Copied: "Skopírované",
        TryAgain: "Skúsiť znova"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Chýba API kľúč",
    apiKeyMissingSubtext: "API kľúč pre tohto poskytovateľa chýba alebo je neplatný. Pridajte ho v nastaveniach.",
    apiKeyNotNeeded: "API kľúč nie je potrebný",
    apiKeyNotNeededSubtext: "Tento poskytovateľ nevyžaduje API kľúč pre svoju bezplatnú úroveň alebo niektoré modely.",
    apiKeyFound: "API kľúč je nastavený",
    apiKeyFoundSubtext: "Pre tohto poskytovateľa je nakonfigurovaný API kľúč.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Vlajkové chatovacie modely",
    modelCategory_Reasoning: "Modely na uvažovanie",
    modelCategory_CostOptimized: "Nákladovo optimalizované modely",
    modelCategory_OlderGPT: "Staršie modely GPT",
    modelCategory_Gemini2_5: "Séria Gemini 2.5",
    modelCategory_Gemini2_0: "Séria Gemini 2.0",
    modelCategory_Gemini1_5: "Séria Gemini 1.5",
    modelCategory_Claude3_7: "Séria Claude 3.7",
    modelCategory_Claude3_5: "Séria Claude 3.5",
    modelCategory_Claude3: "Séria Claude 3",
    modelCategory_Grok3: "Séria Grok 3",
    modelCategory_Grok3Mini: "Séria Grok 3 Mini",
    modelCategory_Llama4: "Séria Llama 4",
    modelCategory_Llama3_3: "Séria Llama 3.3",
    modelCategory_Llama3_2: "Séria Llama 3.2",
    modelCategory_Llama3_1: "Séria Llama 3.1",
    modelCategory_Llama3: "Séria Llama 3",
    modelCategory_LlamaVision: "Modely Llama Vision",
    modelCategory_MetaLlama: "Modely Meta Llama",
    modelCategory_Gemma2: "Séria Gemma 2",
    modelCategory_Gemma: "Séria Gemma",
    modelCategory_GoogleGemma: "Modely Google Gemma",
    modelCategory_DeepSeekR1: "Séria DeepSeek R1",
    modelCategory_DeepSeekV3: "Séria DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Séria DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Modely DeepSeek",
    modelCategory_MistralAIModels: "Modely Mistral AI",
    modelCategory_Qwen3: "Séria Qwen3",
    modelCategory_QwQwQ: "Séria Qwen QwQ",
    modelCategory_Qwen2_5: "Séria Qwen2.5",
    modelCategory_Qwen2_5Vision: "Séria Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Séria Qwen2.5 Coder",
    modelCategory_Qwen2: "Séria Qwen2",
    modelCategory_Qwen2Vision: "Séria Qwen2 Vision",
    modelCategory_QwenModels: "Modely Qwen",
    modelCategory_OtherModels: "Iné modely",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Nepodarilo sa načítať údaje používateľa: {errorMessage}. Skúste obnoviť stránku.",
    page_ErrorUserNotFound: "Používateľ sa nenašiel. Prihláste sa znova.",
    page_ErrorUserApiKeyConfig: "Konfiguráciu API kľúča používateľa sa nepodarilo načítať. Obnovte stránku alebo skontrolujte nastavenia.",
    page_ErrorStartingSessionAPI: "Chyba API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Chyba pri spustení relácie: {errorMessage}",
    page_ErrorSessionIdMissing: "Odpoveď API bola úspešná, ale neobsahovala ID konverzácie.",
    page_LoadingUserData: "Načítavajú sa údaje používateľa...",
    page_ErrorAlertTitle: "Chyba",
    page_WelcomeTitle: "Vitajte v Two AIs",
    page_WelcomeSubtitle: "Táto webová stránka vám umožňuje počúvať konverzácie medzi dvoma LLM.",
    page_ApiKeysRequiredTitle: "Vyžadujú sa API kľúče",
    page_ApiKeysRequiredDescription: "Na spustenie konverzácií budete musieť po prihlásení poskytnúť vlastné API kľúče pre modely AI, ktoré chcete použiť (napr. OpenAI, Google, Anthropic). Podrobné pokyny pre každého poskytovateľa nájdete po prihlásení na stránke Nastavenia / API kľúče.",
    page_SignInPrompt: "Ak chcete začať vlastnú reláciu, môžete sa prihlásiť alebo vytvoriť účet pomocou odkazu v hlavičke.",
    page_VideoTitle: "Ukážka konverzácie Two AIs",
    page_AvailableLLMsTitle: "Aktuálne dostupné LLM",
    page_TooltipGoogleThinkingBudget: "Tento model Google používa 'rozpočet na premýšľanie'. Výstup 'premýšľania' je spoplatnený, ale v chate nie je viditeľný.",
    page_TooltipAnthropicExtendedThinking: "Tento model Anthropic používa 'rozšírené premýšľanie'. Výstup 'premýšľania' je spoplatnený, ale v chate nie je viditeľný.",
    page_TooltipXaiThinking: "Tento model xAI používa 'premýšľanie'. Tento výstup je spoplatnený, ale v chate nie je viditeľný.",
    page_TooltipQwenReasoning: "Tento model Qwen používa 'uvažovanie/premýšľanie'. Tento výstup je spoplatnený, ale v chate nie je viditeľný.",
    page_TooltipDeepSeekReasoning: "Tento model DeepSeek používa 'uvažovanie/premýšľanie'. Výstup je spoplatnený, ale v chate nie je viditeľný.",
    page_TooltipGenericReasoning: "Tento model používa tokeny uvažovania, ktoré nie sú viditeľné v chate, ale sú spoplatnené ako výstupné tokeny.",
    page_TooltipRequiresVerification: "Vyžaduje overenú organizáciu OpenAI. Overiť môžete tu.",
    page_TooltipSupportsLanguage: "Podporuje {languageName}",
    page_TooltipMayNotSupportLanguage: "Nemusí podporovať {languageName}",
    page_BadgePreview: "Ukážka",
    page_BadgeExperimental: "Experimentálne",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Aktuálne dostupné TTS",
    page_NoTTSOptions: "Momentálne nie sú k dispozícii žiadne možnosti TTS.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Zadajte nový API kľúč {serviceName}",
    apiKeyManager_TestKey: "Otestovať kľúč",
    apiKeyManager_TestingKey: "Testuje sa kľúč...",
    apiKeyManager_KeyIsValid: "Kľúč je platný.",
    apiKeyManager_KeyIsInvalid: "Kľúč je neplatný.",
    apiKeyManager_FailedToTestKey: "Nepodarilo sa otestovať kľúč.",
    apiKeyManager_ErrorTestingKey: "Chyba pri testovaní kľúča: {error}",
    apiKeyManager_KeyProvider: "Poskytovateľ",
    apiKeyManager_KeyName: "Názov kľúča",
    apiKeyManager_Status: "Stav",
    apiKeyManager_Action: "Akcia",

    // Model capabilities
    modelCapability_Vision: "Videnie",
    modelCapability_JSON: "Režim JSON",
    modelCapability_Tools: "Používanie nástrojov",
    modelCapability_ImageGen: "Generovanie obrázkov",
    modelCapability_Multilingual: "Viacjazyčný",
    modelCapability_WebSearch: "Vyhľadávanie na webe",
    modelCapability_LargeContext: "Veľký kontext",
    modelCapability_LongContext: "Dlhý kontext",
    modelCapability_FastResponse: "Rýchla odpoveď",
    modelCapability_CostEffective: "Nákladovo efektívny",
    modelCapability_AdvancedReasoning: "Pokročilé uvažovanie",
    modelCapability_Coding: "Kódovanie",
    modelCapability_Foundation: "Základný model",
    modelCapability_Experimental: "Experimentálne",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Ukážka",
    modelCapability_RequiresVerification: "Vyžaduje overenie",
    modelCapability_RequiresAccount: "Vyžaduje účet",

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
export default sk; 