// src/lib/translations/de.ts
const de = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Einstellungen',
        signIn: 'Anmelden',
        signOut: 'Abmelden',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabisch',
        bn: 'Bengalisch',
        bg: 'Bulgarisch',
        zh: 'Chinesisch',
        hr: 'Kroatisch',
        cs: 'Tschechisch',
        da: 'Dänisch',
        nl: 'Niederländisch',
        en: 'Englisch',
        et: 'Estnisch',
        fi: 'Finnisch',
        fr: 'Französisch',
        de: 'Deutsch',
        el: 'Griechisch',
        iw: 'Hebräisch',
        hi: 'Hindi',
        hu: 'Ungarisch',
        id: 'Indonesisch',
        it: 'Italienisch',
        ja: 'Japanisch',
        ko: 'Koreanisch',
        lv: 'Lettisch',
        lt: 'Litauisch',
        no: 'Norwegisch',
        pl: 'Polnisch',
        pt: 'Portugiesisch',
        ro: 'Rumänisch',
        ru: 'Russisch',
        sr: 'Serbisch',
        sk: 'Slowakisch',
        sl: 'Slowenisch',
        es: 'Spanisch',
        sw: 'Swahili',
        sv: 'Schwedisch',
        th: 'Thailändisch',
        tr: 'Türkisch',
        uk: 'Ukrainisch',
        vi: 'Vietnamesisch',
        mt: 'Maltesisch',
        bs: 'Bosnisch',
        ca: 'Katalanisch',
        gu: 'Gujarati',
        hy: 'Armenisch',
        is: 'Isländisch',
        ka: 'Georgisch',
        kk: 'Kasachisch',
        kn: 'Kannada',
        mk: 'Mazedonisch',
        ml: 'Malayalam',
        mr: 'Marathi',
        ms: 'Malaiisch',
        my: 'Birmanisch',
        pa: 'Punjabi',
        so: 'Somali',
        sq: 'Albanisch',
        ta: 'Tamil',
        te: 'Telugu',
        tl: 'Tagalog',
        ur: 'Urdu',
        am: 'Amharisch',
        mn: 'Mongolisch',
    },
    // Settings page
    settings: {
        title: 'Einstellungen',
        sections: {
            appearance: 'Erscheinungsbild',
            apiKeys: 'API-Schlüssel',
            language: 'Sprache',
        },
        appearance: {
            theme: 'Design',
            light: 'Hell',
            dark: 'Dunkel',
            system: 'System',
            description: "Passen Sie das Erscheinungsbild und die Bedienung der Anwendung an."
        },
        language: {
            title: 'Sprache',
            description: 'Wählen Sie Ihre bevorzugte Sprache für die Benutzeroberfläche',
            conversationLanguage: 'Konversationssprache',
            conversationLanguageDescription: 'Die für KI-Konversationen verwendete Sprache entspricht Ihrer Oberflächensprache',
        },
        apiKeys: {
            title: 'API-Schlüssel',
            description: 'Verwalten Sie Ihre API-Schlüssel für verschiedene KI-Anbieter',
            saved: 'Gespeichert',
            notSet: 'Nicht festgelegt',
            setKey: 'Schlüssel festlegen',
            updateKey: 'Setze Schlüssel',
            removeKey: 'Schlüssel entfernen',
            getKeyInstructions: 'TRANSLATE: Get your API key',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Es wurden keine neuen API-Schlüssel zum Speichern eingegeben.",
            unexpectedResponse: "Eine unerwartete Antwort vom Server wurde empfangen.",
            failedToSaveKey: "Speichern des {serviceName}-Schlüssels fehlgeschlagen.",
            someKeysNotSaved: "Einige API-Schlüssel konnten nicht gespeichert werden. Bitte überprüfen Sie die Details unten.",
            keyStatus: "Schlüsselstatus...",
            apiKeySecurelySaved: "API-Schlüssel sicher gespeichert",
            confirmRemoveTitle: "Entfernung bestätigen",
            confirmRemoveDescription: "Sind Sie sicher, dass Sie den API-Schlüssel für {serviceName} entfernen möchten? Diese Aktion kann nicht rückgängig gemacht werden.",
            failedToRemoveKey: "Entfernen des {serviceName}-Schlüssels fehlgeschlagen.",
            successfullyRemovedKey: "{serviceName}-Schlüssel erfolgreich entfernt.",
            keyNotSet: "Schlüsselstatus: Nicht festgelegt",
            keySet: "Schlüsselstatus: Festgelegt",
            saveButton: "API-Schlüssel speichern"
        },
    },

    // Main page
    main: {
        title: 'KI-Konversation',
        setupForm: {
            title: 'Konfigurieren Sie Ihre Konversation',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Modell',
            selectModel: 'Modell auswählen',
            tts: {
                title: 'Text-zu-Sprache',
                enable: 'Text-zu-Sprache aktivieren',
                provider: 'TTS-Anbieter',
                selectProvider: 'TTS-Anbieter auswählen',
                voice: 'Stimme',
                selectVoice: 'Stimme auswählen',
                model: 'TTS-Modell',
                selectModel: 'TTS-Modell auswählen',
            },
            startConversation: 'Konversation starten',
            conversationPrompt: 'Beginnen Sie das Gespräch.',
        },
        conversation: {
            thinking: 'denkt nach...',
            stop: 'Stoppen',
            restart: 'Konversation neu starten',
        },
        pricing: {
            estimatedCost: 'Geschätzte Kosten',
            perMillionTokens: 'pro Million Token',
            input: 'Eingabe',
            output: 'Ausgabe',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Bei Two AIs anmelden',
            emailPlaceholder: 'E-Mail',
            passwordPlaceholder: 'Passwort',
            signIn: 'Anmelden',
            signInWithGoogle: 'Mit Google anmelden',
            noAccount: 'Kein Konto?',
            signUp: 'Registrieren',
            forgotPassword: 'Passwort vergessen?',
            orContinueWith: "Oder fortfahren mit",
            signingIn: "Anmelden..."
        },
        signup: {
            title: 'Konto erstellen',
            emailPlaceholder: 'E-Mail',
            passwordPlaceholder: 'Passwort (mindestens 6 Zeichen)',
            signUp: 'Registrieren',
            signUpWithGoogle: 'Mit Google registrieren',
            hasAccount: 'Bereits ein Konto?',
            signIn: 'Anmelden',
            emailLabel: "E-Mail-Adresse",
            confirmPasswordPlaceholder: "Passwort bestätigen",
            signingUp: "Registrieren..."
        },
        errors: {
            invalidCredentials: 'Ungültige E-Mail oder Passwort',
            userNotFound: 'Benutzer nicht gefunden',
            weakPassword: 'Das Passwort muss mindestens 6 Zeichen lang sein',
            emailInUse: 'E-Mail wird bereits verwendet',
            generic: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
            initialization: "Initialisierungsfehler. Bitte versuchen Sie es später erneut.",
            invalidEmail: "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
            tooManyRequests: "Der Zugriff wurde aufgrund zu vieler fehlgeschlagener Anmeldeversuche vorübergehend deaktiviert. Bitte setzen Sie Ihr Passwort zurück oder versuchen Sie es später erneut.",
            signInFailedPrefix: "Anmeldung fehlgeschlagen: ",
            unknownSignInError: "Bei der Anmeldung ist ein unbekannter Fehler aufgetreten.",
            profileSaveFailedPrefix: "Angemeldet, aber Speichern der Profildaten fehlgeschlagen: ",
            profileCheckSaveFailedPrefix: "Angemeldet, aber Überprüfen/Speichern der Profildaten fehlgeschlagen: ",
            accountExistsWithDifferentCredential: "Ein Konto mit dieser E-Mail existiert bereits und verwendet eine andere Anmeldemethode.",
            googleSignInFailedPrefix: "Google-Anmeldung fehlgeschlagen: ",
            unknownGoogleSignInError: "Bei der Google-Anmeldung ist ein unbekannter Fehler aufgetreten.",
            passwordsDoNotMatch: "Passwörter stimmen nicht überein.",
            accountCreatedProfileSaveFailedPrefix: "Konto erstellt, aber Speichern der Profildaten fehlgeschlagen: ",
            unknownProfileSaveError: "Beim Speichern des Profils ist ein unbekannter Fehler aufgetreten.",
            emailAlreadyRegistered: "Diese E-Mail-Adresse ist bereits registriert.",
            passwordTooShortSignUp: "Das Passwort muss mindestens 6 Zeichen lang sein.",
            signUpFailedPrefix: "Registrierung fehlgeschlagen: ",
            unknownSignUpError: "Bei der Registrierung ist ein unbekannter Fehler aufgetreten."
        },
    },

    // Common
    common: {
        loading: 'Lädt...',
        error: 'Fehler',
        save: 'Speichern',
        cancel: 'Abbrechen',
        delete: 'Löschen',
        confirm: 'Bestätigen',
        or: 'oder',
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API-Schlüssel fehlt",
    apiKeyMissingSubtext: "Der API-Schlüssel für diesen Anbieter fehlt oder ist ungültig. Bitte fügen Sie ihn in den Einstellungen hinzu.",
    apiKeyNotNeeded: "API-Schlüssel nicht erforderlich",
    apiKeyNotNeededSubtext: "Dieser Anbieter benötigt keinen API-Schlüssel für seine kostenlose Stufe oder bestimmte Modelle.",
    apiKeyFound: "API-Schlüssel festgelegt",
    apiKeyFoundSubtext: "Für diesen Anbieter ist ein API-Schlüssel konfiguriert.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Flaggschiff-Chat-Modelle",
    modelCategory_Reasoning: "Argumentationsmodelle",
    modelCategory_CostOptimized: "Kostenoptimierte Modelle",
    modelCategory_OlderGPT: "Ältere GPT-Modelle",
    modelCategory_Gemini2_5: "Gemini 2.5-Serie",
    modelCategory_Gemini2_0: "Gemini 2.0-Serie",
    modelCategory_Gemini1_5: "Gemini 1.5-Serie",
    modelCategory_Claude3_7: "Claude 3.7-Serie",
    modelCategory_Claude3_5: "Claude 3.5-Serie",
    modelCategory_Claude3: "Claude 3-Serie",
    modelCategory_Grok3: "Grok 3-Serie",
    modelCategory_Grok3Mini: "Grok 3 Mini-Serie",
    modelCategory_Llama4: "Llama 4-Serie",
    modelCategory_Llama3_3: "Llama 3.3-Serie",
    modelCategory_Llama3_2: "Llama 3.2-Serie",
    modelCategory_Llama3_1: "Llama 3.1-Serie",
    modelCategory_Llama3: "Llama 3-Serie",
    modelCategory_LlamaVision: "Llama Vision-Modelle",
    modelCategory_MetaLlama: "Meta Llama-Modelle",
    modelCategory_Gemma2: "Gemma 2-Serie",
    modelCategory_Gemma: "Gemma-Serie",
    modelCategory_GoogleGemma: "Google Gemma-Modelle",
    modelCategory_DeepSeekR1: "DeepSeek R1-Serie",
    modelCategory_DeepSeekV3: "DeepSeek V3-Serie",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill-Serie",
    modelCategory_DeepSeekModels: "DeepSeek-Modelle",
    modelCategory_MistralAIModels: "Mistral AI-Modelle",
    modelCategory_Qwen3: "Qwen3-Serie",
    modelCategory_QwQwQ: "Qwen QwQ-Serie",
    modelCategory_Qwen2_5: "Qwen2.5-Serie",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision-Serie",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder-Serie",
    modelCategory_Qwen2: "Qwen2-Serie",
    modelCategory_Qwen2Vision: "Qwen2 Vision-Serie",
    modelCategory_QwenModels: "Qwen-Modelle",
    modelCategory_OtherModels: "Andere Modelle",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Laden der Benutzerdaten fehlgeschlagen: {errorMessage}. Bitte versuchen Sie, die Seite zu aktualisieren.",
    page_ErrorUserNotFound: "Benutzer nicht gefunden. Bitte melden Sie sich erneut an.",
    page_ErrorUserApiKeyConfig: "Die API-Schlüsselkonfiguration des Benutzers konnte nicht geladen werden. Bitte aktualisieren Sie die Seite oder überprüfen Sie die Einstellungen.",
    page_ErrorStartingSessionAPI: "API-Fehler: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Fehler beim Starten der Sitzung: {errorMessage}",
    page_ErrorSessionIdMissing: "API-Antwort erfolgreich, enthielt aber keine conversationId.",
    page_LoadingUserData: "Benutzerdaten werden geladen...",
    page_ErrorAlertTitle: "Fehler",
    page_WelcomeTitle: "Willkommen bei Two AIs",
    page_WelcomeSubtitle: "Diese Website ermöglicht es Ihnen, Gesprächen zwischen zwei LLMs zuzuhören.",
    page_ApiKeysRequiredTitle: "API-Schlüssel erforderlich",
    page_ApiKeysRequiredDescription: "Um Konversationen auszuführen, müssen Sie nach der Anmeldung Ihre eigenen API-Schlüssel für die KI-Modelle angeben, die Sie verwenden möchten (z. B. OpenAI, Google, Anthropic). Detaillierte Anweisungen für jeden Anbieter finden Sie nach der Anmeldung auf der Seite Einstellungen / API-Schlüssel.",
    page_SignInPrompt: "Um Ihre eigene Sitzung zu starten, können Sie sich anmelden oder über den Link in der Kopfzeile ein Konto erstellen.",
    page_VideoTitle: "Two AIs Konversationsdemo",
    page_AvailableLLMsTitle: "Aktuell verfügbare LLMs",
    page_TooltipGoogleThinkingBudget: "Dieses Google-Modell verwendet ein 'Denkbudget'. Die 'Denk'-Ausgabe wird berechnet, ist aber im Chat nicht sichtbar.",
    page_TooltipAnthropicExtendedThinking: "Dieses Anthropic-Modell verwendet 'erweitertes Denken'. Die 'Denk'-Ausgabe wird berechnet, ist aber im Chat nicht sichtbar.",
    page_TooltipXaiThinking: "Dieses xAI-Modell verwendet 'Denken'. Diese Ausgabe wird berechnet, ist aber im Chat nicht sichtbar.",
    page_TooltipQwenReasoning: "Dieses Qwen-Modell verwendet 'Argumentation/Denken'. Diese Ausgabe wird berechnet, ist aber im Chat nicht sichtbar.",
    page_TooltipDeepSeekReasoning: "Dieses DeepSeek-Modell verwendet 'Argumentation/Denken'. Die Ausgabe wird berechnet, ist aber im Chat nicht sichtbar.",
    page_TooltipGenericReasoning: "Dieses Modell verwendet Argumentationstoken, die im Chat nicht sichtbar sind, aber als Ausgabetoken berechnet werden.",
    page_TooltipRequiresVerification: "Erfordert eine verifizierte OpenAI-Organisation. Sie können hier verifizieren.",
    page_TooltipSupportsLanguage: "Unterstützt {languageName}",
    page_TooltipMayNotSupportLanguage: "Unterstützt {languageName} möglicherweise nicht",
    page_BadgePreview: "Vorschau",
    page_BadgeExperimental: "Experimentell",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Aktuell verfügbare TTS",
    page_NoTTSOptions: "Derzeit sind keine TTS-Optionen verfügbar.",
    page_TruncatableNoteFormat: "({noteText})",

    // Common (shared across pages)
    common_MoreInformation: "Mehr Informationen",
    common_Example: "Beispiel:",
    common_ShowMore: "Mehr anzeigen",
    common_ShowLess: "Weniger anzeigen",
    common_AwaitingApproval: "Wartet auf Genehmigung...",
    common_OpenInNewTab: "In neuem Tab öffnen",
    common_AdvancedSettings: "Erweiterte Einstellungen",
    common_Name: "Name",
    common_Created: "Erstellt",
    common_Updated: "Aktualisiert",
    common_Launched: "Gestartet",
    common_Docs: "Dokumentation",
    common_Blog: "Blog",
    common_Pricing: "Preise",
    common_Terms: "Bedingungen",
    common_Privacy: "Datenschutz",
    common_Changelog: "Änderungsprotokoll",
    common_Copy: "Kopieren",
    common_Copied: "Kopiert",
    common_TryAgain: "Erneut versuchen",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Neuen {serviceName} API-Schlüssel eingeben",
    apiKeyManager_TestKey: "Schlüssel testen",
    apiKeyManager_TestingKey: "Schlüssel wird getestet...",
    apiKeyManager_KeyIsValid: "Schlüssel ist gültig.",
    apiKeyManager_KeyIsInvalid: "Schlüssel ist ungültig.",
    apiKeyManager_FailedToTestKey: "Schlüssel konnte nicht getestet werden.",
    apiKeyManager_ErrorTestingKey: "Fehler beim Testen des Schlüssels: {error}",
    apiKeyManager_KeyProvider: "Anbieter",
    apiKeyManager_KeyName: "Schlüsselname",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Aktion",

    // Model capabilities
    modelCapability_Vision: "Vision",
    modelCapability_JSON: "JSON-Modus",
    modelCapability_Tools: "Werkzeugnutzung",
    modelCapability_ImageGen: "Bilderzeugung",
    modelCapability_Multilingual: "Mehrsprachig",
    modelCapability_WebSearch: "Websuche",
    modelCapability_LargeContext: "Großer Kontext",
    modelCapability_LongContext: "Langer Kontext",
    modelCapability_FastResponse: "Schnelle Antwort",
    modelCapability_CostEffective: "Kosteneffizient",
    modelCapability_AdvancedReasoning: "Erweiterte Argumentation",
    modelCapability_Coding: "Codierung",
    modelCapability_Foundation: "Basismodell",
    modelCapability_Experimental: "Experimentell",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Vorschau",
    modelCapability_RequiresVerification: "Verifizierung erforderlich",
    modelCapability_RequiresAccount: "Konto erforderlich",

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
export default de; 