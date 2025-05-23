// src/lib/translations/ro.ts
export const ro = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Setări',
        signIn: 'Conectare',
        signOut: 'Deconectare',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabă',
        bn: 'Bengali',
        bg: 'Bulgară',
        zh: 'Chineză',
        hr: 'Croată',
        cs: 'Cehă',
        da: 'Daneză',
        nl: 'Olandeză',
        en: 'Engleză',
        et: 'Estonă',
        fi: 'Finlandeză',
        fr: 'Franceză',
        de: 'Germană',
        el: 'Greacă',
        iw: 'Ebraică',
        hi: 'Hindi',
        hu: 'Maghiară',
        id: 'Indoneziană',
        it: 'Italiană',
        ja: 'Japoneză',
        ko: 'Coreeană',
        lv: 'Letonă',
        lt: 'Lituaniană',
        no: 'Norvegiană',
        pl: 'Poloneză',
        pt: 'Portugheză',
        ro: 'Română',
        ru: 'Rusă',
        sr: 'Sârbă',
        sk: 'Slovacă',
        sl: 'Slovenă',
        es: 'Spaniolă',
        sw: 'Swahili',
        sv: 'Suedeză',
        th: 'Thailandeză',
        tr: 'Turcă',
        uk: 'Ucraineană',
        vi: 'Vietnameză',
    },

    // Settings page
    settings: {
        title: 'Setări',
        sections: {
            appearance: 'Aspect',
            apiKeys: 'Chei API',
            language: 'Limbă',
        },
        appearance: {
            theme: 'Temă',
            light: 'Luminos',
            dark: 'Întunecat',
            system: 'Sistem',
            description: "Personalizați aspectul și experiența aplicației."
        },
        language: {
            title: 'Limbă',
            description: 'Alegeți limba preferată pentru interfață',
            conversationLanguage: 'Limba conversației',
            conversationLanguageDescription: 'Limba utilizată pentru conversațiile AI se va potrivi cu limba interfeței dvs.',
            getKeyInstructions: 'Obțineți cheia API',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Nu au fost introduse chei API noi pentru salvare.",
            unexpectedResponse: "S-a primit un răspuns neașteptat de la server.",
            failedToSaveKey: "Salvarea cheii {serviceName} a eșuat.",
            someKeysNotSaved: "Unele chei API nu au putut fi salvate. Verificați detaliile de mai jos.",
            keyStatus: "starea cheii...",
            apiKeySecurelySaved: "Cheie API salvată în siguranță",
            confirmRemoveTitle: "Confirmați eliminarea",
            confirmRemoveDescription: "Sigur doriți să eliminați cheia API pentru {serviceName}? Această acțiune nu poate fi anulată.",
            failedToRemoveKey: "Eliminarea cheii {serviceName} a eșuat.",
            successfullyRemovedKey: "Cheia {serviceName} a fost eliminată cu succes.",
            keyNotSet: "Starea cheii: nesetată",
            keySet: "Starea cheii: setată",
            saveButton: "Salvați cheia(ile) API"
        },
        apiKeys: {
            title: 'Chei API',
            description: 'Gestionați-vă cheile API pentru diferiți furnizori AI',
            saved: 'Salvat',
            notSet: 'Nu este setat',
            setKey: 'Setează cheia',
            updateKey: 'Actualizează cheia',
            removeKey: 'Elimină cheia',
            getKeyInstructions: 'Obțineți cheia API',
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
        title: 'Conversație AI',
        setupForm: {
            title: 'Configurați-vă conversația',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Selectați un model',
            tts: {
                title: 'Text-în-Vorbire',
                enable: 'Activați Text-în-Vorbire',
                provider: 'Furnizor TTS',
                selectProvider: 'Selectați furnizorul TTS',
                voice: 'Voce',
                selectVoice: 'Selectați vocea',
                model: 'Model TTS',
                selectModel: 'Selectați modelul TTS',
            },
            startConversation: 'Începe conversația',
            conversationPrompt: 'Începeți conversația.',
        },
        conversation: {
            thinking: 'gândește...',
            stop: 'Oprește',
            restart: 'Repornește conversația',
        },
        pricing: {
            estimatedCost: 'Cost estimat',
            perMillionTokens: 'pe milion de jetoane',
            input: 'Intrare',
            output: 'Ieșire',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Conectați-vă la Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Parolă',
            signIn: 'Conectare',
            signInWithGoogle: 'Conectați-vă cu Google',
            noAccount: "Nu aveți cont?",
            signUp: 'Înregistrare',
            forgotPassword: 'Ați uitat parola?',
            signingIn: "Conectare..."
        },
        signup: {
            title: 'Creați un cont',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Parolă (cel puțin 6 caractere)',
            signUp: 'Înregistrare',
            signUpWithGoogle: 'Înregistrați-vă cu Google',
            hasAccount: 'Aveți deja un cont?',
            signIn: 'Conectare',
            emailLabel: "Adresă de email",
            confirmPasswordPlaceholder: "Confirmați parola",
            signingUp: "Înregistrare..."
        },
        errors: {
            invalidCredentials: 'Email sau parolă incorecte',
            userNotFound: 'Utilizator negăsit',
            weakPassword: 'Parola trebuie să conțină cel puțin 6 caractere',
            emailInUse: 'Emailul este deja utilizat',
            generic: 'A apărut o eroare. Vă rugăm să încercați din nou.',
            initialization: "Eroare de inițializare. Vă rugăm să încercați mai târziu.",
            invalidEmail: "Vă rugăm să introduceți o adresă de email validă.",
            tooManyRequests: "Accesul a fost dezactivat temporar din cauza prea multor încercări de conectare eșuate. Resetați parola sau încercați din nou mai târziu.",
            signInFailedPrefix: "Conectarea a eșuat: ",
            unknownSignInError: "A apărut o eroare necunoscută la conectare.",
            profileSaveFailedPrefix: "Conectat, dar salvarea datelor de profil a eșuat: ",
            profileCheckSaveFailedPrefix: "Conectat, dar verificarea/salvarea datelor de profil a eșuat: ",
            accountExistsWithDifferentCredential: "Există deja un cont cu această adresă de email folosind o altă metodă de conectare.",
            googleSignInFailedPrefix: "Conectarea cu Google a eșuat: ",
            unknownGoogleSignInError: "A apărut o eroare necunoscută la conectarea cu Google.",
            passwordsDoNotMatch: "Parolele nu se potrivesc.",
            accountCreatedProfileSaveFailedPrefix: "Contul a fost creat, dar salvarea datelor de profil a eșuat: ",
            unknownProfileSaveError: "A apărut o eroare necunoscută la salvarea profilului.",
            emailAlreadyRegistered: "Această adresă de email este deja înregistrată.",
            passwordTooShortSignUp: "Parola trebuie să conțină cel puțin 6 caractere.",
            signUpFailedPrefix: "Înregistrarea a eșuat: ",
            unknownSignUpError: "A apărut o eroare necunoscută la înregistrare."
        },
    },

    // Common
    common: {
        loading: 'Se încarcă...',
        error: 'Eroare',
        save: 'Salvează',
        cancel: 'Anulează',
        delete: 'Șterge',
        confirm: 'Confirmă',
        or: 'sau',
        MoreInformation: "Mai multe informații",
        Example: "Exemplu:",
        ShowMore: "Arată mai mult",
        ShowLess: "Arată mai puțin",
        AwaitingApproval: "Așteaptă aprobarea...",
        OpenInNewTab: "Deschide în filă nouă",
        AdvancedSettings: "Setări avansate",
        Name: "Nume",
        Created: "Creat",
        Updated: "Actualizat",
        Launched: "Lansat",
        Docs: "Documentație",
        Blog: "Blog",
        Pricing: "Prețuri",
        Terms: "Termeni",
        Privacy: "Confidențialitate",
        Changelog: "Jurnal de modificări",
        Copy: "Copiază",
        Copied: "Copiat",
        TryAgain: "Încearcă din nou"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Cheie API lipsă",
    apiKeyMissingSubtext: "Cheia API pentru acest furnizor lipsește sau este invalidă. Adăugați-o în setări.",
    apiKeyNotNeeded: "Cheie API nu este necesară",
    apiKeyNotNeededSubtext: "Acest furnizor nu necesită o cheie API pentru nivelul său gratuit sau pentru anumite modele.",
    apiKeyFound: "Cheie API setată",
    apiKeyFoundSubtext: "O cheie API este configurată pentru acest furnizor.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Modele de chat emblematice",
    modelCategory_Reasoning: "Modele de raționament",
    modelCategory_CostOptimized: "Modele optimizate pentru costuri",
    modelCategory_OlderGPT: "Modele GPT mai vechi",
    modelCategory_Gemini2_5: "Seria Gemini 2.5",
    modelCategory_Gemini2_0: "Seria Gemini 2.0",
    modelCategory_Gemini1_5: "Seria Gemini 1.5",
    modelCategory_Claude3_7: "Seria Claude 3.7",
    modelCategory_Claude3_5: "Seria Claude 3.5",
    modelCategory_Claude3: "Seria Claude 3",
    modelCategory_Grok3: "Seria Grok 3",
    modelCategory_Grok3Mini: "Seria Grok 3 Mini",
    modelCategory_Llama4: "Seria Llama 4",
    modelCategory_Llama3_3: "Seria Llama 3.3",
    modelCategory_Llama3_2: "Seria Llama 3.2",
    modelCategory_Llama3_1: "Seria Llama 3.1",
    modelCategory_Llama3: "Seria Llama 3",
    modelCategory_LlamaVision: "Modele Llama Vision",
    modelCategory_MetaLlama: "Modele Meta Llama",
    modelCategory_Gemma2: "Seria Gemma 2",
    modelCategory_Gemma: "Seria Gemma",
    modelCategory_GoogleGemma: "Modele Google Gemma",
    modelCategory_DeepSeekR1: "Seria DeepSeek R1",
    modelCategory_DeepSeekV3: "Seria DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Seria DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Modele DeepSeek",
    modelCategory_MistralAIModels: "Modele Mistral AI",
    modelCategory_Qwen3: "Seria Qwen3",
    modelCategory_QwQwQ: "Seria Qwen QwQ",
    modelCategory_Qwen2_5: "Seria Qwen2.5",
    modelCategory_Qwen2_5Vision: "Seria Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Seria Qwen2.5 Coder",
    modelCategory_Qwen2: "Seria Qwen2",
    modelCategory_Qwen2Vision: "Seria Qwen2 Vision",
    modelCategory_QwenModels: "Modele Qwen",
    modelCategory_OtherModels: "Alte modele",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Eroare la încărcarea datelor utilizatorului: {errorMessage}. Vă rugăm să încercați să reîncărcați.",
    page_ErrorUserNotFound: "Utilizator negăsit. Vă rugăm să vă conectați din nou.",
    page_ErrorUserApiKeyConfig: "Configurația cheii API a utilizatorului nu a putut fi încărcată. Vă rugăm să reîncărcați sau să verificați setările.",
    page_ErrorStartingSessionAPI: "Eroare API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Eroare la pornirea sesiunii: {errorMessage}",
    page_ErrorSessionIdMissing: "Răspuns API reușit, dar nu a inclus un ID de conversație.",
    page_LoadingUserData: "Se încarcă datele utilizatorului...",
    page_ErrorAlertTitle: "Eroare",
    page_WelcomeTitle: "Bun venit la Two AIs",
    page_WelcomeSubtitle: "Acest site web vă permite să ascultați conversații între două LLM-uri.",
    page_ApiKeysRequiredTitle: "Chei API necesare",
    page_ApiKeysRequiredDescription: "Pentru a rula conversații, va trebui să furnizați propriile chei API pentru modelele AI pe care doriți să le utilizați (de exemplu, OpenAI, Google, Anthropic) după conectare. Instrucțiuni detaliate pentru fiecare furnizor pot fi găsite pe pagina Setări / Chei API după conectare.",
    page_SignInPrompt: "Pentru a începe propria sesiune, vă puteți conecta sau crea un cont folosind linkul din antet.",
    page_VideoTitle: "Demonstrație conversație Two AIs",
    page_AvailableLLMsTitle: "LLM-uri disponibile în prezent",
    page_TooltipGoogleThinkingBudget: "Acest model Google folosește un \"buget de gândire\". Rezultatul \"gândirii\" este facturat, dar nu este vizibil în chat.",
    page_TooltipAnthropicExtendedThinking: "Acest model Anthropic folosește \"gândire extinsă\". Rezultatul \"gândirii\" este facturat, dar nu este vizibil în chat.",
    page_TooltipXaiThinking: "Acest model xAI folosește \"gândire\". Acest rezultat este facturat, dar nu este vizibil în chat.",
    page_TooltipQwenReasoning: "Acest model Qwen folosește \"raționament/gândire\". Acest rezultat este facturat, dar nu este vizibil în chat.",
    page_TooltipDeepSeekReasoning: "Acest model DeepSeek folosește \"raționament/gândire\". Rezultatul este facturat, dar nu este vizibil în chat.",
    page_TooltipGenericReasoning: "Acest model utilizează jetoane de raționament care nu sunt vizibile în chat, dar sunt facturate ca jetoane de ieșire.",
    page_TooltipRequiresVerification: "Necesită organizație OpenAI verificată. Puteți verifica aici.",
    page_TooltipSupportsLanguage: "Suportă {languageName}",
    page_TooltipMayNotSupportLanguage: "Este posibil să nu suporte {languageName}",
    page_BadgePreview: "Previzualizare",
    page_BadgeExperimental: "Experimental",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "TTS disponibil în prezent",
    page_NoTTSOptions: "Nicio opțiune TTS disponibilă în prezent.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Introduceți o nouă cheie API {serviceName}",
    apiKeyManager_TestKey: "Testați cheia",
    apiKeyManager_TestingKey: "Se testează cheia...",
    apiKeyManager_KeyIsValid: "Cheia este validă.",
    apiKeyManager_KeyIsInvalid: "Cheia este invalidă.",
    apiKeyManager_FailedToTestKey: "Testarea cheii a eșuat.",
    apiKeyManager_ErrorTestingKey: "Eroare la testarea cheii: {error}",
    apiKeyManager_KeyProvider: "Furnizor",
    apiKeyManager_KeyName: "Nume cheie",
    apiKeyManager_Status: "Stare",
    apiKeyManager_Action: "Acțiune",

    // Model capabilities
    modelCapability_Vision: "Viziune",
    modelCapability_JSON: "Mod JSON",
    modelCapability_Tools: "Utilizare instrumente",
    modelCapability_ImageGen: "Generare imagini",
    modelCapability_Multilingual: "Multilingv",
    modelCapability_WebSearch: "Căutare web",
    modelCapability_LargeContext: "Context mare",
    modelCapability_LongContext: "Context lung",
    modelCapability_FastResponse: "Răspuns rapid",
    modelCapability_CostEffective: "Eficient din punct de vedere al costurilor",
    modelCapability_AdvancedReasoning: "Raționament avansat",
    modelCapability_Coding: "Codificare",
    modelCapability_Foundation: "Model de bază",
    modelCapability_Experimental: "Experimental",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Previzualizare",
    modelCapability_RequiresVerification: "Necesită verificare",
    modelCapability_RequiresAccount: "Necesită cont",

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