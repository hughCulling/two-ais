// src/lib/translations/it.ts
export const it = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Impostazioni',
        signIn: 'Accedi',
        signOut: 'Esci',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabo',
        bn: 'Bengalese',
        bg: 'Bulgaro',
        zh: 'Cinese',
        hr: 'Croato',
        cs: 'Ceco',
        da: 'Danese',
        nl: 'Olandese',
        en: 'Inglese',
        et: 'Estone',
        fi: 'Finlandese',
        fr: 'Francese',
        de: 'Tedesco',
        el: 'Greco',
        iw: 'Ebraico',
        hi: 'Hindi',
        hu: 'Ungherese',
        id: 'Indonesiano',
        it: 'Italiano',
        ja: 'Giapponese',
        ko: 'Coreano',
        lv: 'Lettone',
        lt: 'Lituano',
        no: 'Norvegese',
        pl: 'Polacco',
        pt: 'Portoghese',
        ro: 'Rumeno',
        ru: 'Russo',
        sr: 'Serbo',
        sk: 'Slovacco',
        sl: 'Sloveno',
        es: 'Spagnolo',
        sw: 'Swahili',
        sv: 'Svedese',
        th: 'Thailandese',
        tr: 'Turco',
        uk: 'Ucraino',
        vi: 'Vietnamita',
    },

    // Settings page
    settings: {
        title: 'Impostazioni',
        sections: {
            appearance: 'Aspetto',
            apiKeys: 'Chiavi API',
            language: 'Lingua',
        },
        appearance: {
            theme: 'Tema',
            light: 'Chiaro',
            dark: 'Scuro',
            system: 'Sistema',
            description: "Personalizza l'aspetto e l'esperienza dell'applicazione."
        },
        language: {
            title: 'Lingua',
            description: 'Scegli la tua lingua preferita per l\'interfaccia',
            conversationLanguage: 'Lingua della conversazione',
            conversationLanguageDescription: 'La lingua utilizzata per le conversazioni AI corrisponderà alla lingua della tua interfaccia',
            signingIn: "Accesso in corso..."
        },
        apiKeys: {
            title: 'TRANSLATE: API Keys',
            description: 'TRANSLATE: Manage your API keys for different AI providers',
            saved: 'TRANSLATE: Saved',
            notSet: 'TRANSLATE: Not set',
            setKey: 'TRANSLATE: Set key',
            updateKey: 'TRANSLATE: Update key',
            removeKey: 'TRANSLATE: Remove key',
            getKeyInstructions: 'TRANSLATE: Get your API key',
            noNewKeys: "TRANSLATE: No new API keys entered to save.",
            unexpectedResponse: "TRANSLATE: Received an unexpected response from the server.",
            failedToSaveKey: "TRANSLATE: Failed to save {serviceName} key.",
            someKeysNotSaved: "TRANSLATE: Some API keys could not be saved. Please check the details below.",
            keyStatus: "TRANSLATE: key status...",
            apiKeySecurelySaved: "TRANSLATE: API Key Securely Saved",
            confirmRemoveTitle: "TRANSLATE: Confirm Removal",
            confirmRemoveDescription: "TRANSLATE: Are you sure you want to remove the API key for {serviceName}? This action cannot be undone.",
            failedToRemoveKey: "TRANSLATE: Failed to remove {serviceName} key.",
            successfullyRemovedKey: "TRANSLATE: Successfully removed {serviceName} key.",
            keyNotSet: "TRANSLATE: Key Status: Not Set",
            keySet: "TRANSLATE: Key Status: Set",
            saveButton: "TRANSLATE: Save API Key(s)"
        },
    },

    // Main page
    main: {
        title: 'Conversazione AI',
        setupForm: {
            title: 'Imposta la tua conversazione',
            agentA: 'Agente A',
            agentB: 'Agente B',
            model: 'Modello',
            selectModel: 'Seleziona un modello',
            tts: {
                title: 'Sintesi vocale',
                enable: 'Abilita sintesi vocale',
                provider: 'Provider TTS',
                selectProvider: 'Seleziona provider TTS',
                voice: 'Voce',
                selectVoice: 'Seleziona voce',
                model: 'Modello TTS',
                selectModel: 'Seleziona modello TTS',
            },
            startConversation: 'Inizia conversazione',
            conversationPrompt: 'Inizia la conversazione.',
        },
        conversation: {
            thinking: 'sta pensando...',
            stop: 'Ferma',
            restart: 'Riavvia conversazione',
        },
        pricing: {
            estimatedCost: 'Costo stimato',
            perMillionTokens: 'per milione di token',
            input: 'Input',
            output: 'Output',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Accedi a Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Password',
            signIn: 'Accedi',
            signInWithGoogle: 'Accedi con Google',
            noAccount: "Non hai un account?",
            signUp: 'Registrati',
            forgotPassword: 'Password dimenticata?',
            orContinueWith: "Oppure continua con",
            signingIn: "Accesso in corso..."
        },
        signup: {
            title: 'Crea un account',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Password (almeno 6 caratteri)',
            signUp: 'Registrati',
            signUpWithGoogle: 'Registrati con Google',
            hasAccount: 'Hai già un account?',
            signIn: 'Accedi',
            emailLabel: "Indirizzo email",
            confirmPasswordPlaceholder: "Conferma password",
            signingUp: "Registrazione in corso..."
        },
        errors: {
            invalidCredentials: 'Email o password non validi',
            userNotFound: 'Utente non trovato',
            weakPassword: 'La password deve contenere almeno 6 caratteri',
            emailInUse: 'Email già in uso',
            generic: 'Si è verificato un errore. Riprova.',
            initialization: "Errore di inizializzazione. Riprova più tardi.",
            invalidEmail: "Inserisci un indirizzo email valido.",
            tooManyRequests: "Accesso temporaneamente disabilitato a causa di troppi tentativi di accesso falliti. Reimposta la password o riprova più tardi.",
            signInFailedPrefix: "Accesso fallito: ",
            unknownSignInError: "Si è verificato un errore sconosciuto durante l'accesso.",
            profileSaveFailedPrefix: "Accesso effettuato, ma salvataggio dei dati del profilo fallito: ",
            profileCheckSaveFailedPrefix: "Accesso effettuato, ma controllo/salvataggio dei dati del profilo fallito: ",
            accountExistsWithDifferentCredential: "Esiste già un account con questa email che utilizza un metodo di accesso diverso.",
            googleSignInFailedPrefix: "Accesso con Google fallito: ",
            unknownGoogleSignInError: "Si è verificato un errore sconosciuto durante l'accesso con Google.",
            passwordsDoNotMatch: "Le password non coincidono.",
            accountCreatedProfileSaveFailedPrefix: "Account creato, ma salvataggio dei dati del profilo fallito: ",
            unknownProfileSaveError: "Si è verificato un errore sconosciuto durante il salvataggio del profilo.",
            emailAlreadyRegistered: "Questo indirizzo email è già registrato.",
            passwordTooShortSignUp: "La password deve contenere almeno 6 caratteri.",
            signUpFailedPrefix: "Registrazione fallita: ",
            unknownSignUpError: "Si è verificato un errore sconosciuto durante la registrazione."
        },
    },

    // Common
    common: {
        loading: 'Caricamento in corso...',
        error: 'Errore',
        save: 'Salva',
        cancel: 'Annulla',
        delete: 'Elimina',
        confirm: 'Conferma',
        or: 'o',
        MoreInformation: "Maggiori informazioni",
        Example: "Esempio:",
        ShowMore: "Mostra di più",
        ShowLess: "Mostra di meno",
        AwaitingApproval: "In attesa di approvazione...",
        OpenInNewTab: "Apri in una nuova scheda",
        AdvancedSettings: "Impostazioni avanzate",
        Name: "Nome",
        Created: "Creato",
        Updated: "Aggiornato",
        Launched: "Lanciato",
        Docs: "Documentazione",
        Blog: "Blog",
        Pricing: "Prezzi",
        Terms: "Termini",
        Privacy: "Privacy",
        Changelog: "Registro delle modifiche",
        Copy: "Copia",
        Copied: "Copiato",
        TryAgain: "Riprova"
    },
    page_TruncatableNoteFormat: "({noteText})",

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Chiave API Mancante",
    apiKeyMissingSubtext: "La chiave API per questo provider manca o non è valida. Aggiungila nelle impostazioni.",
    apiKeyNotNeeded: "Chiave API Non Necessaria",
    apiKeyNotNeededSubtext: "Questo provider non richiede una chiave API per il suo livello gratuito o per determinati modelli.",
    apiKeyFound: "Chiave API Impostata",
    apiKeyFoundSubtext: "È stata configurata una chiave API per questo provider.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Modelli di Chat Flagship",
    modelCategory_Reasoning: "Modelli di Ragionamento",
    modelCategory_CostOptimized: "Modelli Ottimizzati per i Costi",
    modelCategory_OlderGPT: "Modelli GPT Più Vecchi",
    modelCategory_Gemini2_5: "Serie Gemini 2.5",
    modelCategory_Gemini2_0: "Serie Gemini 2.0",
    modelCategory_Gemini1_5: "Serie Gemini 1.5",
    modelCategory_Claude3_7: "Serie Claude 3.7",
    modelCategory_Claude3_5: "Serie Claude 3.5",
    modelCategory_Claude3: "Serie Claude 3",
    modelCategory_Grok3: "Serie Grok 3",
    modelCategory_Grok3Mini: "Serie Grok 3 Mini",
    modelCategory_Llama4: "Serie Llama 4",
    modelCategory_Llama3_3: "Serie Llama 3.3",
    modelCategory_Llama3_2: "Serie Llama 3.2",
    modelCategory_Llama3_1: "Serie Llama 3.1",
    modelCategory_Llama3: "Serie Llama 3",
    modelCategory_LlamaVision: "Modelli Llama Vision",
    modelCategory_MetaLlama: "Modelli Meta Llama",
    modelCategory_Gemma2: "Serie Gemma 2",
    modelCategory_Gemma: "Serie Gemma",
    modelCategory_GoogleGemma: "Modelli Google Gemma",
    modelCategory_DeepSeekR1: "Serie DeepSeek R1",
    modelCategory_DeepSeekV3: "Serie DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Serie DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Modelli DeepSeek",
    modelCategory_MistralAIModels: "Modelli Mistral AI",
    modelCategory_Qwen3: "Serie Qwen3",
    modelCategory_QwQwQ: "Serie Qwen QwQ",
    modelCategory_Qwen2_5: "Serie Qwen2.5",
    modelCategory_Qwen2_5Vision: "Serie Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Serie Qwen2.5 Coder",
    modelCategory_Qwen2: "Serie Qwen2",
    modelCategory_Qwen2Vision: "Serie Qwen2 Vision",
    modelCategory_QwenModels: "Modelli Qwen",
    modelCategory_OtherModels: "Altri Modelli",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Errore durante il caricamento dei dati utente: {errorMessage}. Prova ad aggiornare.",
    page_ErrorUserNotFound: "Utente non trovato. Accedi di nuovo.",
    page_ErrorUserApiKeyConfig: "Impossibile caricare la configurazione della chiave API utente. Aggiorna o controlla le impostazioni.",
    page_ErrorStartingSessionAPI: "Errore API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Errore durante l'avvio della sessione: {errorMessage}",
    page_ErrorSessionIdMissing: "La risposta dell'API è andata a buon fine ma non includeva un ID conversazione.",
    page_LoadingUserData: "Caricamento dati utente in corso...",
    page_ErrorAlertTitle: "Errore",
    page_WelcomeTitle: "Benvenuto in Two AIs",
    page_WelcomeSubtitle: "Questo sito web ti permette di ascoltare conversazioni tra due LLM.",
    page_ApiKeysRequiredTitle: "Chiavi API Richieste",
    page_ApiKeysRequiredDescription: "Per eseguire le conversazioni, dovrai fornire le tue chiavi API per i modelli IA che desideri utilizzare (ad es. OpenAI, Google, Anthropic) dopo aver effettuato l'accesso. Le istruzioni dettagliate per ciascun provider sono disponibili nella pagina Impostazioni / Chiavi API dopo l'accesso.",
    page_SignInPrompt: "Per avviare la tua sessione, puoi accedere o creare un account utilizzando il link nell'intestazione.",
    page_VideoTitle: "Demo Conversazione Two AIs",
    page_AvailableLLMsTitle: "LLM Attualmente Disponibili",
    page_TooltipGoogleThinkingBudget: "Questo modello Google utilizza un 'budget di pensiero'. L'output del 'pensiero' viene addebitato ma non è visibile nella chat.",
    page_TooltipAnthropicExtendedThinking: "Questo modello Anthropic utilizza un 'pensiero esteso'. L'output del 'pensiero' viene addebitato ma non è visibile nella chat.",
    page_TooltipXaiThinking: "Questo modello xAI utilizza il 'pensiero'. Questo output viene addebitato ma non è visibile nella chat.",
    page_TooltipQwenReasoning: "Questo modello Qwen utilizza 'ragionamento/pensiero'. Questo output viene addebitato ma non è visibile nella chat.",
    page_TooltipDeepSeekReasoning: "Questo modello DeepSeek utilizza 'ragionamento/pensiero'. L'output viene addebitato ma non è visibile nella chat.",
    page_TooltipGenericReasoning: "Questo modello utilizza token di ragionamento che non sono visibili nella chat ma vengono addebitati come token di output.",
    page_TooltipRequiresVerification: "Richiede un'organizzazione OpenAI verificata. Puoi verificare qui.",
    page_TooltipSupportsLanguage: "Supporta {languageName}",
    page_TooltipMayNotSupportLanguage: "Potrebbe non supportare {languageName}",
    page_BadgePreview: "Anteprima",
    page_BadgeExperimental: "Sperimentale",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "TTS Attualmente Disponibili",
    page_NoTTSOptions: "Nessuna opzione TTS attualmente disponibile.",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Inserisci nuova chiave API {serviceName}",
    apiKeyManager_TestKey: "Testa chiave",
    apiKeyManager_TestingKey: "Test chiave in corso...",
    apiKeyManager_KeyIsValid: "La chiave è valida.",
    apiKeyManager_KeyIsInvalid: "La chiave non è valida.",
    apiKeyManager_FailedToTestKey: "Test della chiave fallito.",
    apiKeyManager_ErrorTestingKey: "Errore durante il test della chiave: {error}",
    apiKeyManager_KeyProvider: "Provider",
    apiKeyManager_KeyName: "Nome chiave",
    apiKeyManager_Status: "Stato",
    apiKeyManager_Action: "Azione",

    // Model capabilities
    modelCapability_Vision: "Visione",
    modelCapability_JSON: "Modalità JSON",
    modelCapability_Tools: "Utilizzo Strumenti",
    modelCapability_ImageGen: "Generazione Immagini",
    modelCapability_Multilingual: "Multilingue",
    modelCapability_WebSearch: "Ricerca Web",
    modelCapability_LargeContext: "Contesto Ampio",
    modelCapability_LongContext: "Contesto Lungo",
    modelCapability_FastResponse: "Risposta Rapida",
    modelCapability_CostEffective: "Conveniente",
    modelCapability_AdvancedReasoning: "Ragionamento Avanzato",
    modelCapability_Coding: "Codifica",
    modelCapability_Foundation: "Modello Fondamentale",
    modelCapability_Experimental: "Sperimentale",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Anteprima",
    modelCapability_RequiresVerification: "Richiede Verifica",
    modelCapability_RequiresAccount: "Richiede Account",

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