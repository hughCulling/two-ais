// src/lib/translations/hr.ts
export const hr = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Postavke',
        signIn: 'Prijava',
        signOut: 'Odjava',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arapski',
        bn: 'Bengalski',
        bg: 'Bugarski',
        zh: 'Kineski',
        hr: 'Hrvatski',
        cs: 'Češki',
        da: 'Danski',
        nl: 'Nizozemski',
        en: 'Engleski',
        et: 'Estonski',
        fi: 'Finski',
        fr: 'Francuski',
        de: 'Njemački',
        el: 'Grčki',
        iw: 'Hebrejski',
        hi: 'Hindski',
        hu: 'Mađarski',
        id: 'Indonezijski',
        it: 'Talijanski',
        ja: 'Japanski',
        ko: 'Korejski',
        lv: 'Latvijski',
        lt: 'Litavski',
        no: 'Norveški',
        pl: 'Poljski',
        pt: 'Portugalski',
        ro: 'Rumunjski',
        ru: 'Ruski',
        sr: 'Srpski',
        sk: 'Slovački',
        sl: 'Slovenski',
        es: 'Španjolski',
        sw: 'Svahili',
        sv: 'Švedski',
        th: 'Tajlandski',
        tr: 'Turski',
        uk: 'Ukrajinski',
        vi: 'Vijetnamski',
        mt: 'Malteški',
        bs: 'Bosanski',
        ca: 'Katalonski',
        gu: 'Gudžaratski',
        hy: 'Armenski',
        is: 'Islandski',
        ka: 'Gruzijski',
        kk: 'Kazaški',
        kn: 'Kannadski',
        mk: 'Makedonski',
        ml: 'Malajalamski',
        mr: 'Marathski',
        ms: 'Malajski',
        my: 'Burmanski',
        pa: 'Pandžapski',
        so: 'Somalski',
        sq: 'Albanski',
        ta: 'Tamilski',
        te: 'Telugu',
        tl: 'Tagaloški',
        ur: 'Urdski',
        am: 'Amharski',
        mn: 'Mongolski',
    },

    // Settings page
    settings: {
        title: 'Postavke',
        sections: {
            appearance: 'Izgled',
            apiKeys: 'API ključevi',
            language: 'Jezik',
        },
        appearance: {
            theme: 'Tema',
            light: 'Svijetla',
            dark: 'Tamna',
            system: 'Sustav',
            description: "Prilagodite izgled i dojam aplikacije."
        },
        language: {
            title: 'Jezik',
            description: 'Odaberite željeni jezik za sučelje',
            conversationLanguage: 'Jezik razgovora',
            conversationLanguageDescription: 'Jezik koji se koristi za AI razgovore odgovarat će jeziku vašeg sučelja',
        },
        apiKeys: {
            title: 'API ključevi',
            description: 'Upravljajte svojim API ključevima za različite AI pružatelje usluga',
            saved: 'Spremljeno',
            notSet: 'Nije postavljeno',
            setKey: 'Postavi ključ',
            updateKey: 'Ažuriraj ključ',
            removeKey: 'Ukloni ključ',
            getKeyInstructions: 'Nabavite svoj API ključ',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Nisu uneseni novi API ključevi za spremanje.",
            unexpectedResponse: "Primljen je neočekivani odgovor od poslužitelja.",
            failedToSaveKey: "Spremanje ključa {serviceName} nije uspjelo.",
            someKeysNotSaved: "Neki API ključevi nisu mogli biti spremljeni. Molimo provjerite detalje u nastavku.",
            keyStatus: "status ključa...",
            apiKeySecurelySaved: "API ključ sigurno spremljen",
            confirmRemoveTitle: "Potvrdite uklanjanje",
            confirmRemoveDescription: "Jeste li sigurni da želite ukloniti API ključ za {serviceName}? Ova se radnja ne može poništiti.",
            failedToRemoveKey: "Uklanjanje ključa {serviceName} nije uspjelo.",
            successfullyRemovedKey: "Ključ {serviceName} uspješno uklonjen.",
            keyNotSet: "Status ključa: Nije postavljeno",
            keySet: "Status ključa: Postavljeno",
            saveButton: "Spremi API ključ(eve)"
        },
    },

    // Main page
    main: {
        title: 'AI Razgovor',
        setupForm: {
            title: 'Postavite svoj razgovor',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Odaberite model',
            tts: {
                title: 'Tekst u govor',
                enable: 'Omogući tekst u govor',
                provider: 'TTS pružatelj',
                selectProvider: 'Odaberite TTS pružatelja',
                voice: 'Glas',
                selectVoice: 'Odaberite glas',
                model: 'TTS model',
                selectModel: 'Odaberite TTS model',
            },
            startConversation: 'Započni razgovor',
            conversationPrompt: 'Započnite razgovor.',
        },
        conversation: {
            thinking: 'razmišlja...',
            stop: 'Zaustavi',
            restart: 'Ponovno pokreni razgovor',
        },
        pricing: {
            estimatedCost: 'Procijenjeni trošak',
            perMillionTokens: 'po milijunu tokena',
            input: 'Unos',
            output: 'Izlaz',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Prijavite se na Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Lozinka',
            signIn: 'Prijava',
            signInWithGoogle: 'Prijavite se putem Googlea',
            noAccount: "Nemate račun?",
            signUp: 'Registrirajte se',
            forgotPassword: 'Zaboravili ste lozinku?',
            orContinueWith: "Ili nastavite s",
            signingIn: "Prijavljivanje..."
        },
        signup: {
            title: 'Stvorite račun',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Lozinka (najmanje 6 znakova)',
            signUp: 'Registrirajte se',
            signUpWithGoogle: 'Registrirajte se putem Googlea',
            hasAccount: 'Već imate račun?',
            signIn: 'Prijava',
            emailLabel: "Email adresa",
            confirmPasswordPlaceholder: "Potvrdite lozinku",
            signingUp: "Registriranje..."
        },
        errors: {
            invalidCredentials: 'Nevažeći email ili lozinka',
            userNotFound: 'Korisnik nije pronađen',
            weakPassword: 'Lozinka mora imati najmanje 6 znakova',
            emailInUse: 'Email se već koristi',
            generic: 'Došlo je do pogreške. Molimo pokušajte ponovo.',
            initialization: "Pogreška pri inicijalizaciji. Molimo pokušajte kasnije.",
            invalidEmail: "Molimo unesite važeću email adresu.",
            tooManyRequests: "Pristup je privremeno onemogućen zbog previše neuspjelih pokušaja prijave. Molimo resetirajte lozinku ili pokušajte kasnije.",
            signInFailedPrefix: "Prijava nije uspjela: ",
            unknownSignInError: "Došlo je do nepoznate pogreške prilikom prijave.",
            profileSaveFailedPrefix: "Prijavljeni ste, ali spremanje podataka profila nije uspjelo: ",
            profileCheckSaveFailedPrefix: "Prijavljeni ste, ali provjera/spremanje podataka profila nije uspjelo: ",
            accountExistsWithDifferentCredential: "Račun s ovom e-poštom već postoji i koristi drugu metodu prijave.",
            googleSignInFailedPrefix: "Google prijava nije uspjela: ",
            unknownGoogleSignInError: "Došlo je do nepoznate pogreške prilikom Google prijave.",
            passwordsDoNotMatch: "Lozinke se ne podudaraju.",
            accountCreatedProfileSaveFailedPrefix: "Račun je stvoren, ali spremanje podataka profila nije uspjelo: ",
            unknownProfileSaveError: "Došlo je do nepoznate pogreške prilikom spremanja profila.",
            emailAlreadyRegistered: "Ova email adresa je već registrirana.",
            passwordTooShortSignUp: "Lozinka mora imati najmanje 6 znakova.",
            signUpFailedPrefix: "Registracija nije uspjela: ",
            unknownSignUpError: "Došlo je do nepoznate pogreške prilikom registracije."
        },
    },

    // Common
    common: {
        loading: 'Učitavanje...',
        error: 'Greška',
        save: 'Spremi',
        cancel: 'Odustani',
        delete: 'Izbriši',
        confirm: 'Potvrdi',
        or: 'ili',
        MoreInformation: "Više informacija",
        Example: "Primjer:",
        ShowMore: "Prikaži više",
        ShowLess: "Prikaži manje",
        AwaitingApproval: "Čeka se odobrenje...",
        OpenInNewTab: "Otvori u novoj kartici",
        AdvancedSettings: "Napredne postavke",
        Name: "Naziv",
        Created: "Stvoreno",
        Updated: "Ažurirano",
        Launched: "Pokrenuto",
        Docs: "Dokumentacija",
        Blog: "Blog",
        Pricing: "Cijene",
        Terms: "Uvjeti",
        Privacy: "Privatnost",
        Changelog: "Dnevnik promjena",
        Copy: "Kopiraj",
        Copied: "Kopirano",
        TryAgain: "Pokušaj ponovno"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Nedostaje API ključ",
    apiKeyMissingSubtext: "API ključ za ovog pružatelja usluga nedostaje ili je nevažeći. Molimo dodajte ga u postavkama.",
    apiKeyNotNeeded: "API ključ nije potreban",
    apiKeyNotNeededSubtext: "Ovaj pružatelj usluga ne zahtijeva API ključ za svoju besplatnu razinu ili određene modele.",
    apiKeyFound: "API ključ postavljen",
    apiKeyFoundSubtext: "Za ovog pružatelja usluga konfiguriran je API ključ.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Vodeći modeli za chat",
    modelCategory_Reasoning: "Modeli za zaključivanje",
    modelCategory_CostOptimized: "Modeli optimizirani za troškove",
    modelCategory_OlderGPT: "Stariji GPT modeli",
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
    modelCategory_LlamaVision: "Llama Vision modeli",
    modelCategory_MetaLlama: "Meta Llama modeli",
    modelCategory_Gemma2: "Gemma 2 serija",
    modelCategory_Gemma: "Gemma serija",
    modelCategory_GoogleGemma: "Google Gemma modeli",
    modelCategory_DeepSeekR1: "DeepSeek R1 serija",
    modelCategory_DeepSeekV3: "DeepSeek V3 serija",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill serija",
    modelCategory_DeepSeekModels: "DeepSeek modeli",
    modelCategory_MistralAIModels: "Mistral AI modeli",
    modelCategory_Qwen3: "Qwen3 serija",
    modelCategory_QwQwQ: "Qwen QwQ serija",
    modelCategory_Qwen2_5: "Qwen2.5 serija",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision serija",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder serija",
    modelCategory_Qwen2: "Qwen2 serija",
    modelCategory_Qwen2Vision: "Qwen2 Vision serija",
    modelCategory_QwenModels: "Qwen modeli",
    modelCategory_OtherModels: "Ostali modeli",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Učitavanje korisničkih podataka nije uspjelo: {errorMessage}. Molimo pokušajte osvježiti stranicu.",
    page_ErrorUserNotFound: "Korisnik nije pronađen. Molimo prijavite se ponovno.",
    page_ErrorUserApiKeyConfig: "Konfiguracija API ključa korisnika nije se mogla učitati. Molimo osvježite stranicu ili provjerite postavke.",
    page_ErrorStartingSessionAPI: "API pogreška: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Pogreška pri pokretanju sesije: {errorMessage}",
    page_ErrorSessionIdMissing: "API odgovor je uspješan, ali nije uključivao ID razgovora.",
    page_LoadingUserData: "Učitavanje korisničkih podataka...",
    page_ErrorAlertTitle: "Greška",
    page_WelcomeTitle: "Dobrodošli u Two AIs",
    page_WelcomeSubtitle: "Ova web stranica omogućuje vam slušanje razgovora između dva LLM-a.",
    page_ApiKeysRequiredTitle: "Potrebni su API ključevi",
    page_ApiKeysRequiredDescription: "Da biste pokrenuli razgovore, morat ćete nakon prijave navesti vlastite API ključeve za AI modele koje želite koristiti (npr. OpenAI, Google, Anthropic). Detaljne upute za svakog pružatelja usluga možete pronaći na stranici Postavke / API ključevi nakon prijave.",
    page_SignInPrompt: "Da biste započeli vlastitu sesiju, možete se prijaviti ili stvoriti račun pomoću veze u zaglavlju.",
    page_VideoTitle: "Demo razgovora Two AIs",
    page_AvailableLLMsTitle: "Trenutno dostupni LLM-ovi",
    page_TooltipGoogleThinkingBudget: "Ovaj Googleov model koristi \"proračun za razmišljanje\". Izlaz \"razmišljanja\" se naplaćuje, ali nije vidljiv u chatu.",
    page_TooltipAnthropicExtendedThinking: "Ovaj Anthropicov model koristi \"prošireno razmišljanje\". Izlaz \"razmišljanja\" se naplaćuje, ali nije vidljiv u chatu.",
    page_TooltipXaiThinking: "Ovaj xAI model koristi \"razmišljanje\". Ovaj se izlaz naplaćuje, ali nije vidljiv u chatu.",
    page_TooltipQwenReasoning: "Ovaj Qwen model koristi \"zaključivanje/razmišljanje\". Ovaj se izlaz naplaćuje, ali nije vidljiv u chatu.",
    page_TooltipDeepSeekReasoning: "Ovaj DeepSeek model koristi \"zaključivanje/razmišljanje\". Izlaz se naplaćuje, ali nije vidljiv u chatu.",
    page_TooltipGenericReasoning: "Ovaj model koristi tokene za zaključivanje koji nisu vidljivi u chatu, ali se naplaćuju kao izlazni tokeni.",
    page_TooltipRequiresVerification: "Zahtijeva potvrđenu OpenAI organizaciju. Ovdje možete potvrditi.",
    page_TooltipSupportsLanguage: "Podržava {languageName}",
    page_TooltipMayNotSupportLanguage: "Možda ne podržava {languageName}",
    page_BadgePreview: "Pregled",
    page_BadgeExperimental: "Eksperimentalno",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Trenutno dostupni TTS-ovi",
    page_NoTTSOptions: "Trenutno nema dostupnih TTS opcija.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Unesite novi {serviceName} API ključ",
    apiKeyManager_TestKey: "Testiraj ključ",
    apiKeyManager_TestingKey: "Testiranje ključa...",
    apiKeyManager_KeyIsValid: "Ključ je važeći.",
    apiKeyManager_KeyIsInvalid: "Ključ je nevažeći.",
    apiKeyManager_FailedToTestKey: "Testiranje ključa nije uspjelo.",
    apiKeyManager_ErrorTestingKey: "Pogreška pri testiranju ključa: {error}",
    apiKeyManager_KeyProvider: "Pružatelj",
    apiKeyManager_KeyName: "Naziv ključa",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Radnja",

    // Model capabilities
    modelCapability_Vision: "Vid",
    modelCapability_JSON: "JSON način rada",
    modelCapability_Tools: "Korištenje alata",
    modelCapability_ImageGen: "Generiranje slika",
    modelCapability_Multilingual: "Višejezično",
    modelCapability_WebSearch: "Pretraživanje weba",
    modelCapability_LargeContext: "Veliki kontekst",
    modelCapability_LongContext: "Dugi kontekst",
    modelCapability_FastResponse: "Brzi odgovor",
    modelCapability_CostEffective: "Isplativo",
    modelCapability_AdvancedReasoning: "Napredno zaključivanje",
    modelCapability_Coding: "Kodiranje",
    modelCapability_Foundation: "Osnovni model",
    modelCapability_Experimental: "Eksperimentalno",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Pregled",
    modelCapability_RequiresVerification: "Zahtijeva provjeru",
    modelCapability_RequiresAccount: "Zahtijeva račun",

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