// src/lib/translations/fi.ts
export const fi = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Asetukset',
        signIn: 'Kirjaudu sisään',
        signOut: 'Kirjaudu ulos',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabia',
        bn: 'Bengali',
        bg: 'Bulgaria',
        zh: 'Kiina',
        hr: 'Kroatia',
        cs: 'Tšekki',
        da: 'Tanska',
        nl: 'Hollanti',
        en: 'Englanti',
        et: 'Viro',
        fi: 'Suomi',
        fr: 'Ranska',
        de: 'Saksa',
        el: 'Kreikka',
        iw: 'Heprea',
        hi: 'Hindi',
        hu: 'Unkari',
        id: 'Indonesia',
        it: 'Italia',
        ja: 'Japani',
        ko: 'Korea',
        lv: 'Latvia',
        lt: 'Liettua',
        no: 'Norja',
        pl: 'Puola',
        pt: 'Portugali',
        ro: 'Romania',
        ru: 'Venäjä',
        sr: 'Serbia',
        sk: 'Slovakia',
        sl: 'Slovenia',
        es: 'Espanja',
        sw: 'Swahili',
        sv: 'Ruotsi',
        th: 'Thai',
        tr: 'Turkki',
        uk: 'Ukraina',
        vi: 'Vietnam',
        mt: 'Malta',
        bs: 'Bosnia',
        ca: 'Katalaani',
        gu: 'Gujarati',
        hy: 'Armenia',
        is: 'Islanti',
        ka: 'Georgia',
        kk: 'Kazakki',
        kn: 'Kannada',
        mk: 'Makedonia',
        ml: 'Malayalam',
        mr: 'Marathi',
        ms: 'Malaiji',
        my: 'Burma',
        pa: 'Punjabi',
        so: 'Somali',
        sq: 'Albania',
        ta: 'Tamili',
        te: 'Telugu',
        tl: 'Tagalog',
        ur: 'Urdu',
        am: 'Amhara',
        mn: 'Mongolia',
    },

    // Settings page
    settings: {
        title: 'Asetukset',
        sections: {
            appearance: 'Ulkoasu',
            apiKeys: 'API-avaimet',
            language: 'Kieli',
        },
        appearance: {
            theme: 'Teema',
            light: 'Vaalea',
            dark: 'Tumma',
            system: 'Järjestelmä',
            description: "Mukauta sovelluksen ulkoasua ja tuntumaa."
        },
        language: {
            title: 'Kieli',
            description: 'Valitse haluamasi kieli käyttöliittymälle',
            conversationLanguage: 'Keskustelukieli',
            conversationLanguageDescription: 'Tekoälykeskusteluissa käytetty kieli vastaa käyttöliittymän kieltä',
        },
        apiKeys: {
            title: 'API-avaimet',
            description: 'Hallinnoi API-avaimiasi eri tekoälypalveluntarjoajille',
            saved: 'Tallennettu',
            notSet: 'Ei asetettu',
            setKey: 'Aseta avain',
            updateKey: 'Päivitä avain',
            removeKey: 'Poista avain',
            getKeyInstructions: 'Hanki API-avaimesi', // TODO: Translate
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Uusia API-avaimia ei ole syötetty tallennettavaksi.", // TODO: Translate
            unexpectedResponse: "Palvelimelta saatiin odottamaton vastaus.", // TODO: Translate
            failedToSaveKey: "Avaimen {serviceName} tallentaminen epäonnistui.", // TODO: Translate
            someKeysNotSaved: "Joitakin API-avaimia ei voitu tallentaa. Tarkista alla olevat tiedot.", // TODO: Translate
            keyStatus: "avaimen tila...", // TODO: Translate
            apiKeySecurelySaved: "API-avain tallennettu turvallisesti", // TODO: Translate
            confirmRemoveTitle: "Vahvista poisto", // TODO: Translate
            confirmRemoveDescription: "Haluatko varmasti poistaa API-avaimen palvelulle {serviceName}? Toimintoa ei voi kumota.", // TODO: Translate
            failedToRemoveKey: "Avaimen {serviceName} poistaminen epäonnistui.", // TODO: Translate
            successfullyRemovedKey: "Avain {serviceName} poistettu onnistuneesti.", // TODO: Translate
            keyNotSet: "Avaimen tila: Ei asetettu", // TODO: Translate
            keySet: "Avaimen tila: Asetettu", // TODO: Translate
            saveButton: "Tallenna API-avain/avaimet" // TODO: Translate
        },
    },

    // Main page
    main: {
        title: 'Tekoälykeskustelu',
        setupForm: {
            title: 'Määritä keskustelusi',
            agentA: 'Agentti A',
            agentB: 'Agentti B',
            model: 'Malli',
            selectModel: 'Valitse malli',
            tts: {
                title: 'Tekstistä puheeksi',
                enable: 'Ota tekstistä puheeksi käyttöön',
                provider: 'TTS-palveluntarjoaja',
                selectProvider: 'Valitse TTS-palveluntarjoaja',
                voice: 'Ääni',
                selectVoice: 'Valitse ääni',
                model: 'TTS-malli',
                selectModel: 'Valitse TTS-malli',
            },
            startConversation: 'Aloita keskustelu',
            conversationPrompt: 'Aloita keskustelu.',
        },
        conversation: {
            thinking: 'miettii...',
            stop: 'Pysäytä',
            restart: 'Aloita keskustelu uudelleen',
        },
        pricing: {
            estimatedCost: 'Arvioitu hinta',
            perMillionTokens: 'miljoonaa tokenia kohti',
            input: 'Syöte',
            output: 'Tuloste',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Kirjaudu sisään Two AIs -palveluun', // Keep brand name
            emailPlaceholder: 'Sähköposti',
            passwordPlaceholder: 'Salasana',
            signIn: 'Kirjaudu sisään',
            signInWithGoogle: 'Kirjaudu sisään Google-tunnuksilla',
            noAccount: "Eikö sinulla ole tiliä?",
            signUp: 'Rekisteröidy',
            forgotPassword: 'Unohditko salasanasi?',
            orContinueWith: "Tai jatka",
            signingIn: "Kirjaudutaan sisään..."
        },
        signup: {
            title: 'Luo tili',
            emailPlaceholder: 'Sähköposti',
            passwordPlaceholder: 'Salasana (vähintään 6 merkkiä)',
            signUp: 'Rekisteröidy',
            signUpWithGoogle: 'Rekisteröidy Google-tunnuksilla',
            hasAccount: 'Onko sinulla jo tili?',
            signIn: 'Kirjaudu sisään',
            emailLabel: "Sähköpostiosoite",
            confirmPasswordPlaceholder: "Vahvista salasana",
            signingUp: "Rekisteröidytään..."
        },
        errors: {
            invalidCredentials: 'Virheellinen sähköpostiosoite tai salasana',
            userNotFound: 'Käyttäjää ei löytynyt',
            weakPassword: 'Salasanan on oltava vähintään 6 merkkiä pitkä',
            emailInUse: 'Sähköpostiosoite on jo käytössä',
            generic: 'Tapahtui virhe. Yritä uudelleen.',
            initialization: "Alustusvirhe. Yritä myöhemmin uudelleen.",
            invalidEmail: "Anna kelvollinen sähköpostiosoite.",
            tooManyRequests: "Pääsy on väliaikaisesti estetty liian monien epäonnistuneiden kirjautumisyritysten vuoksi. Nollaa salasanasi tai yritä myöhemmin uudelleen.",
            signInFailedPrefix: "Kirjautuminen epäonnistui: ",
            unknownSignInError: "Tuntematon virhe kirjautumisessa.",
            profileSaveFailedPrefix: "Kirjauduttu sisään, mutta profiilitietojen tallennus epäonnistui: ",
            profileCheckSaveFailedPrefix: "Kirjauduttu sisään, mutta profiilitietojen tarkistus/tallennus epäonnistui: ",
            accountExistsWithDifferentCredential: "Tällä sähköpostilla on jo tili, joka käyttää toista kirjautumistapaa.",
            googleSignInFailedPrefix: "Google-kirjautuminen epäonnistui: ",
            unknownGoogleSignInError: "Tuntematon virhe Google-kirjautumisessa.",
            passwordsDoNotMatch: "Salasanat eivät täsmää.",
            accountCreatedProfileSaveFailedPrefix: "Tili luotu, mutta profiilitietojen tallennus epäonnistui: ",
            unknownProfileSaveError: "Tuntematon virhe profiilin tallennuksessa.",
            emailAlreadyRegistered: "Tämä sähköpostiosoite on jo rekisteröity.",
            passwordTooShortSignUp: "Salasanan on oltava vähintään 6 merkkiä pitkä.",
            signUpFailedPrefix: "Rekisteröityminen epäonnistui: ",
            unknownSignUpError: "Tuntematon virhe rekisteröitymisessä."
        },
    },

    // Common
    common: {
        loading: 'Ladataan...',
        error: 'Virhe',
        save: 'Tallenna',
        cancel: 'Peruuta',
        delete: 'Poista',
        confirm: 'Vahvista',
        or: 'tai',
        MoreInformation: "Lisätietoja",
        Example: "Esimerkki:",
        ShowMore: "Näytä lisää",
        ShowLess: "Näytä vähemmän",
        AwaitingApproval: "Odottaa hyväksyntää...",
        OpenInNewTab: "Avaa uudessa välilehdessä",
        AdvancedSettings: "Lisäasetukset",
        Name: "Nimi",
        Created: "Luotu",
        Updated: "Päivitetty",
        Launched: "Käynnistetty",
        Docs: "Dokumentaatio",
        Blog: "Blogi",
        Pricing: "Hinnoittelu",
        Terms: "Käyttöehdot",
        Privacy: "Tietosuoja",
        Changelog: "Muutosloki",
        Copy: "Kopioi",
        Copied: "Kopioitu",
        TryAgain: "Yritä uudelleen"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API-avain puuttuu",
    apiKeyMissingSubtext: "Tämän palveluntarjoajan API-avain puuttuu tai on virheellinen. Lisää se asetuksista.",
    apiKeyNotNeeded: "API-avainta ei tarvita",
    apiKeyNotNeededSubtext: "Tämä palveluntarjoaja ei vaadi API-avainta ilmaistasolleen tai tietyille malleille.",
    apiKeyFound: "API-avain asetettu",
    apiKeyFoundSubtext: "Tälle palveluntarjoajalle on määritetty API-avain.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Lippulaiva-chat-mallit",
    modelCategory_Reasoning: "Päättelymallit",
    modelCategory_CostOptimized: "Kustannusoptimoidut mallit",
    modelCategory_OlderGPT: "Vanhemmat GPT-mallit",
    modelCategory_Gemini2_5: "Gemini 2.5 -sarja",
    modelCategory_Gemini2_0: "Gemini 2.0 -sarja",
    modelCategory_Gemini1_5: "Gemini 1.5 -sarja",
    modelCategory_Claude3_7: "Claude 3.7 -sarja",
    modelCategory_Claude3_5: "Claude 3.5 -sarja",
    modelCategory_Claude3: "Claude 3 -sarja",
    modelCategory_Grok3: "Grok 3 -sarja",
    modelCategory_Grok3Mini: "Grok 3 Mini -sarja",
    modelCategory_Llama4: "Llama 4 -sarja",
    modelCategory_Llama3_3: "Llama 3.3 -sarja",
    modelCategory_Llama3_2: "Llama 3.2 -sarja",
    modelCategory_Llama3_1: "Llama 3.1 -sarja",
    modelCategory_Llama3: "Llama 3 -sarja",
    modelCategory_LlamaVision: "Llama Vision -mallit",
    modelCategory_MetaLlama: "Meta Llama -mallit",
    modelCategory_Gemma2: "Gemma 2 -sarja",
    modelCategory_Gemma: "Gemma-sarja",
    modelCategory_GoogleGemma: "Google Gemma -mallit",
    modelCategory_DeepSeekR1: "DeepSeek R1 -sarja",
    modelCategory_DeepSeekV3: "DeepSeek V3 -sarja",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill -sarja",
    modelCategory_DeepSeekModels: "DeepSeek-mallit",
    modelCategory_MistralAIModels: "Mistral AI -mallit",
    modelCategory_Qwen3: "Qwen3-sarja",
    modelCategory_QwQwQ: "Qwen QwQ -sarja",
    modelCategory_Qwen2_5: "Qwen2.5-sarja",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision -sarja",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder -sarja",
    modelCategory_Qwen2: "Qwen2-sarja",
    modelCategory_Qwen2Vision: "Qwen2 Vision -sarja",
    modelCategory_QwenModels: "Qwen-mallit",
    modelCategory_OtherModels: "Muut mallit",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Käyttäjätietojen lataaminen epäonnistui: {errorMessage}. Yritä päivittää sivu.",
    page_ErrorUserNotFound: "Käyttäjää ei löytynyt. Kirjaudu sisään uudelleen.",
    page_ErrorUserApiKeyConfig: "Käyttäjän API-avainmäärityksiä ei voitu ladata. Päivitä sivu tai tarkista asetukset.",
    page_ErrorStartingSessionAPI: "API-virhe: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Virhe istunnon aloittamisessa: {errorMessage}",
    page_ErrorSessionIdMissing: "API-vastaus onnistui, mutta ei sisältänyt conversationId-tunnusta.",
    page_LoadingUserData: "Ladataan käyttäjätietoja...",
    page_ErrorAlertTitle: "Virhe",
    page_WelcomeTitle: "Tervetuloa Two AIs -palveluun",
    page_WelcomeSubtitle: "Tällä sivustolla voit kuunnella kahden LLM:n välisiä keskusteluja.",
    page_ApiKeysRequiredTitle: "API-avaimet vaaditaan",
    page_ApiKeysRequiredDescription: "Keskustelujen suorittamiseksi sinun on annettava omat API-avaimesi haluamillesi tekoälymalleille (esim. OpenAI, Google, Anthropic) sisäänkirjautumisen jälkeen. Yksityiskohtaiset ohjeet kullekin palveluntarjoajalle löytyvät Asetukset / API-avaimet -sivulta sisäänkirjautumisen jälkeen.",
    page_SignInPrompt: "Aloittaaksesi oman istuntosi, voit kirjautua sisään tai luoda tilin yläpalkin linkistä.",
    page_VideoTitle: "Two AIs -keskusteludemo",
    page_AvailableLLMsTitle: "Tällä hetkellä saatavilla olevat LLM:t",
    page_TooltipGoogleThinkingBudget: "Tämä Google-malli käyttää \"ajattelubudjettia\". \"Ajattelu\"-tuotos laskutetaan, mutta se ei näy chatissa.",
    page_TooltipAnthropicExtendedThinking: "Tämä Anthropic-malli käyttää \"laajennettua ajattelua\". \"Ajattelu\"-tuotos laskutetaan, mutta se ei näy chatissa.",
    page_TooltipXaiThinking: "Tämä xAI-malli käyttää \"ajattelua\". Tämä tuotos laskutetaan, mutta se ei näy chatissa.",
    page_TooltipQwenReasoning: "Tämä Qwen-malli käyttää \"päättelyä/ajattelua\". Tämä tuotos laskutetaan, mutta se ei näy chatissa.",
    page_TooltipDeepSeekReasoning: "Tämä DeepSeek-malli käyttää \"päättelyä/ajattelua\". Tuotos laskutetaan, mutta se ei näy chatissa.",
    page_TooltipGenericReasoning: "Tämä malli käyttää päättelytokeneita, jotka eivät näy chatissa, mutta laskutetaan tulostokeneina.",
    page_TooltipRequiresVerification: "Vaatii vahvistuksen",
    page_TooltipSupportsLanguage: "Tukee kieltä {languageName}",
    page_TooltipMayNotSupportLanguage: "Ei välttämättä tue kieltä {languageName}",
    page_BadgePreview: "Esikatselu",
    page_BadgeExperimental: "Kokeellinen",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Tällä hetkellä saatavilla olevat TTS:t",
    page_NoTTSOptions: "TTS-vaihtoehtoja ei ole tällä hetkellä saatavilla.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Syötä uusi {serviceName} API-avain",
    apiKeyManager_TestKey: "Testaa avain",
    apiKeyManager_TestingKey: "Testataan avainta...",
    apiKeyManager_KeyIsValid: "Avain on kelvollinen.",
    apiKeyManager_KeyIsInvalid: "Avain on virheellinen.",
    apiKeyManager_FailedToTestKey: "Avaimen testaaminen epäonnistui.",
    apiKeyManager_ErrorTestingKey: "Virhe avaimen testauksessa: {error}",
    apiKeyManager_KeyProvider: "Palveluntarjoaja",
    apiKeyManager_KeyName: "Avaimen nimi",
    apiKeyManager_Status: "Tila",
    apiKeyManager_Action: "Toiminto",

    // Model capabilities
    modelCapability_Vision: "Näkökyky",
    modelCapability_JSON: "JSON-tila",
    modelCapability_Tools: "Työkalujen käyttö",
    modelCapability_ImageGen: "Kuvien luonti",
    modelCapability_Multilingual: "Monikielinen",
    modelCapability_WebSearch: "Verkkohaku",
    modelCapability_LargeContext: "Laaja konteksti",
    modelCapability_LongContext: "Pitkä konteksti",
    modelCapability_FastResponse: "Nopea vastaus",
    modelCapability_CostEffective: "Kustannustehokas",
    modelCapability_AdvancedReasoning: "Edistynyt päättely",
    modelCapability_Coding: "Koodaus",
    modelCapability_Foundation: "Perusmalli",
    modelCapability_Experimental: "Kokeellinen",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Esikatselu",
    modelCapability_RequiresVerification: "Vaatii vahvistuksen",
    modelCapability_RequiresAccount: "Vaatii tilin",

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