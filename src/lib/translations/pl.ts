// src/lib/translations/pl.ts
export const pl = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Ustawienia',
        signIn: 'Zaloguj się',
        signOut: 'Wyloguj się',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabski',
        bn: 'Bengalski',
        bg: 'Bułgarski',
        zh: 'Chiński',
        hr: 'Chorwacki',
        cs: 'Czeski',
        da: 'Duński',
        nl: 'Holenderski',
        en: 'Angielski',
        et: 'Estoński',
        fi: 'Fiński',
        fr: 'Francuski',
        de: 'Niemiecki',
        el: 'Grecki',
        iw: 'Hebrajski',
        hi: 'Hinduski',
        hu: 'Węgierski',
        id: 'Indonezyjski',
        it: 'Włoski',
        ja: 'Japoński',
        ko: 'Koreański',
        lv: 'Łotewski',
        lt: 'Litewski',
        no: 'Norweski',
        pl: 'Polski',
        pt: 'Portugalski',
        ro: 'Rumuński',
        ru: 'Rosyjski',
        sr: 'Serbski',
        sk: 'Słowacki',
        sl: 'Słoweński',
        es: 'Hiszpański',
        sw: 'Suahili',
        sv: 'Szwedzki',
        th: 'Tajski',
        tr: 'Turecki',
        uk: 'Ukraiński',
        vi: 'Wietnamski',
    },

    // Settings page
    settings: {
        title: 'Ustawienia',
        sections: {
            appearance: 'Wygląd',
            apiKeys: 'Klucze API',
            language: 'Język',
        },
        appearance: {
            theme: 'Motyw',
            light: 'Jasny',
            dark: 'Ciemny',
            system: 'Systemowy',
            description: "Dostosuj wygląd i działanie aplikacji."
        },
        language: {
            title: 'Język',
            description: 'Wybierz preferowany język interfejsu',
            conversationLanguage: 'Język rozmowy',
            conversationLanguageDescription: 'Język używany do rozmów AI będzie odpowiadał językowi interfejsu',
            getKeyInstructions: 'Zdobądź swój klucz API',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Nie wprowadzono nowych kluczy API do zapisania.",
            unexpectedResponse: "Otrzymano nieoczekiwaną odpowiedź z serwera.",
            failedToSaveKey: "Nie udało się zapisać klucza {serviceName}.",
            someKeysNotSaved: "Niektórych kluczy API nie udało się zapisać. Sprawdź szczegóły poniżej.",
            keyStatus: "status klucza...",
            apiKeySecurelySaved: "Klucz API bezpiecznie zapisany",
            confirmRemoveTitle: "Potwierdź usunięcie",
            confirmRemoveDescription: "Czy na pewno chcesz usunąć klucz API dla {serviceName}? Tej czynności nie można cofnąć.",
            failedToRemoveKey: "Nie udało się usunąć klucza {serviceName}.",
            successfullyRemovedKey: "Pomyślnie usunięto klucz {serviceName}.",
            keyNotSet: "Status klucza: nie ustawiono",
            keySet: "Status klucza: ustawiono",
            saveButton: "Zapisz klucz(e) API"
        },
        apiKeys: {
            title: 'Klucze API',
            description: 'Zarządzaj swoimi kluczami API dla różnych dostawców AI',
            saved: 'Zapisano',
            notSet: 'Nie ustawiono',
            setKey: 'Ustaw klucz',
            updateKey: 'Zaktualizuj klucz',
            removeKey: 'Usuń klucz',
            getKeyInstructions: "Get your API key",
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
        title: 'Rozmowa AI',
        setupForm: {
            title: 'Skonfiguruj swoją rozmowę',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Model',
            selectModel: 'Wybierz model',
            tts: {
                title: 'Tekst na mowę',
                enable: 'Włącz tekst na mowę',
                provider: 'Dostawca TTS',
                selectProvider: 'Wybierz dostawcę TTS',
                voice: 'Głos',
                selectVoice: 'Wybierz głos',
                model: 'Model TTS',
                selectModel: 'Wybierz model TTS',
            },
            startConversation: 'Rozpocznij rozmowę',
            conversationPrompt: 'Rozpocznij rozmowę.',
        },
        conversation: {
            thinking: 'myśli...',
            stop: 'Zatrzymaj',
            restart: 'Zacznij rozmowę od nowa',
        },
        pricing: {
            estimatedCost: 'Szacowany koszt',
            perMillionTokens: 'za milion tokenów',
            input: 'Wejście',
            output: 'Wyjście',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Zaloguj się do Two AIs', // Keep brand name
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Hasło',
            signIn: 'Zaloguj się',
            signInWithGoogle: 'Zaloguj się przez Google',
            noAccount: "Nie masz konta?",
            signUp: 'Zarejestruj się',
            forgotPassword: 'Zapomniałeś hasła?',
            orContinueWith: "Lub kontynuuj za pomocą",
            signingIn: "Logowanie..."
        },
        signup: {
            title: 'Utwórz konto',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Hasło (co najmniej 6 znaków)',
            signUp: 'Zarejestruj się',
            signUpWithGoogle: 'Zarejestruj się przez Google',
            hasAccount: 'Masz już konto?',
            signIn: 'Zaloguj się',
            emailLabel: "Adres e-mail",
            confirmPasswordPlaceholder: "Potwierdź hasło",
            signingUp: "Rejestracja..."
        },
        errors: {
            invalidCredentials: 'Nieprawidłowy adres e-mail lub hasło',
            userNotFound: 'Użytkownik nie znaleziony',
            weakPassword: 'Hasło musi mieć co najmniej 6 znaków',
            emailInUse: 'Adres e-mail jest już używany',
            generic: 'Wystąpił błąd. Spróbuj ponownie.',
            initialization: "Błąd inicjalizacji. Spróbuj ponownie później.",
            invalidEmail: "Wprowadź prawidłowy adres e-mail.",
            tooManyRequests: "Dostęp tymczasowo zablokowany z powodu zbyt wielu nieudanych prób logowania. Zresetuj hasło lub spróbuj ponownie później.",
            signInFailedPrefix: "Logowanie nie powiodło się: ",
            unknownSignInError: "Wystąpił nieznany błąd podczas logowania.",
            profileSaveFailedPrefix: "Zalogowano, ale nie udało się zapisać danych profilu: ",
            profileCheckSaveFailedPrefix: "Zalogowano, ale nie udało się sprawdzić/zapisać danych profilu: ",
            accountExistsWithDifferentCredential: "Konto z tym adresem e-mail już istnieje i korzysta z innej metody logowania.",
            googleSignInFailedPrefix: "Logowanie przez Google nie powiodło się: ",
            unknownGoogleSignInError: "Wystąpił nieznany błąd podczas logowania przez Google.",
            passwordsDoNotMatch: "Hasła nie są zgodne.",
            accountCreatedProfileSaveFailedPrefix: "Konto zostało utworzone, ale nie udało się zapisać danych profilu: ",
            unknownProfileSaveError: "Wystąpił nieznany błąd podczas zapisywania profilu.",
            emailAlreadyRegistered: "Ten adres e-mail jest już zarejestrowany.",
            passwordTooShortSignUp: "Hasło musi mieć co najmniej 6 znaków.",
            signUpFailedPrefix: "Rejestracja nie powiodła się: ",
            unknownSignUpError: "Wystąpił nieznany błąd podczas rejestracji."
        },
    },

    // Common
    common: {
        loading: 'Ładowanie...',
        error: 'Błąd',
        save: 'Zapisz',
        cancel: 'Anuluj',
        delete: 'Usuń',
        confirm: 'Potwierdź',
        or: 'lub',
        MoreInformation: "Więcej informacji",
        Example: "Przykład:",
        ShowMore: "Pokaż więcej",
        ShowLess: "Pokaż mniej",
        AwaitingApproval: "Oczekiwanie na zatwierdzenie...",
        OpenInNewTab: "Otwórz w nowej karcie",
        AdvancedSettings: "Ustawienia zaawansowane",
        Name: "Nazwa",
        Created: "Utworzono",
        Updated: "Zaktualizowano",
        Launched: "Uruchomiono",
        Docs: "Dokumentacja",
        Blog: "Blog",
        Pricing: "Cennik",
        Terms: "Warunki",
        Privacy: "Prywatność",
        Changelog: "Dziennik zmian",
        Copy: "Kopiuj",
        Copied: "Skopiowano",
        TryAgain: "Spróbuj ponownie"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Brak klucza API",
    apiKeyMissingSubtext: "Brak lub nieprawidłowy klucz API dla tego dostawcy. Dodaj go w ustawieniach.",
    apiKeyNotNeeded: "Klucz API nie jest potrzebny",
    apiKeyNotNeededSubtext: "Ten dostawca nie wymaga klucza API dla swojego bezpłatnego planu lub niektórych modeli.",
    apiKeyFound: "Klucz API ustawiony",
    apiKeyFoundSubtext: "Dla tego dostawcy skonfigurowano klucz API.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Główne modele czatu",
    modelCategory_Reasoning: "Modele rozumowania",
    modelCategory_CostOptimized: "Modele zoptymalizowane pod kątem kosztów",
    modelCategory_OlderGPT: "Starsze modele GPT",
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
    modelCategory_OtherModels: "Inne modele",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Nie udało się załadować danych użytkownika: {errorMessage}. Spróbuj odświeżyć.",
    page_ErrorUserNotFound: "Nie znaleziono użytkownika. Zaloguj się ponownie.",
    page_ErrorUserApiKeyConfig: "Nie można załadować konfiguracji klucza API użytkownika. Odśwież lub sprawdź ustawienia.",
    page_ErrorStartingSessionAPI: "Błąd API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Błąd podczas uruchamiania sesji: {errorMessage}",
    page_ErrorSessionIdMissing: "Odpowiedź API pomyślna, ale nie zawierała identyfikatora conversationId.",
    page_LoadingUserData: "Ładowanie danych użytkownika...",
    page_ErrorAlertTitle: "Błąd",
    page_WelcomeTitle: "Witaj w Two AIs",
    page_WelcomeSubtitle: "Ta strona internetowa pozwala słuchać rozmów między dwoma LLM.",
    page_ApiKeysRequiredTitle: "Wymagane klucze API",
    page_ApiKeysRequiredDescription: "Aby prowadzić rozmowy, po zalogowaniu musisz podać własne klucze API dla modeli AI, których chcesz używać (np. OpenAI, Google, Anthropic). Szczegółowe instrukcje dla każdego dostawcy można znaleźć na stronie Ustawienia / Klucze API po zalogowaniu.",
    page_SignInPrompt: "Aby rozpocząć własną sesję, możesz zalogować się lub utworzyć konto, korzystając z linku w nagłówku.",
    page_VideoTitle: "Demonstracja rozmowy Two AIs",
    page_AvailableLLMsTitle: "Obecnie dostępne LLM",
    page_TooltipGoogleThinkingBudget: "Ten model Google używa \"budżetu na myślenie\". Wynik \"myślenia\" jest rozliczany, ale nie jest widoczny na czacie.",
    page_TooltipAnthropicExtendedThinking: "Ten model Anthropic używa \"rozszerzonego myślenia\". Wynik \"myślenia\" jest rozliczany, ale nie jest widoczny na czacie.",
    page_TooltipXaiThinking: "Ten model xAI używa \"myślenia\". Ten wynik jest rozliczany, ale nie jest widoczny na czacie.",
    page_TooltipQwenReasoning: "Ten model Qwen używa \"rozumowania/myślenia\". Ten wynik jest rozliczany, ale nie jest widoczny na czacie.",
    page_TooltipDeepSeekReasoning: "Ten model DeepSeek używa \"rozumowania/myślenia\". Wynik jest rozliczany, ale nie jest widoczny na czacie.",
    page_TooltipGenericReasoning: "Ten model wykorzystuje tokeny rozumowania, które nie są widoczne na czacie, ale są rozliczane jako tokeny wyjściowe.",
    page_TooltipRequiresVerification: "Wymaga zweryfikowanej organizacji OpenAI. Możesz ją zweryfikować tutaj.",
    page_TooltipSupportsLanguage: "Obsługuje {languageName}",
    page_TooltipMayNotSupportLanguage: "Może nie obsługiwać {languageName}",
    page_BadgePreview: "Podgląd",
    page_BadgeExperimental: "Eksperymentalny",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Obecnie dostępne TTS",
    page_NoTTSOptions: "Obecnie brak dostępnych opcji TTS.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Wprowadź nowy klucz API {serviceName}",
    apiKeyManager_TestKey: "Testuj klucz",
    apiKeyManager_TestingKey: "Testowanie klucza...",
    apiKeyManager_KeyIsValid: "Klucz jest prawidłowy.",
    apiKeyManager_KeyIsInvalid: "Klucz jest nieprawidłowy.",
    apiKeyManager_FailedToTestKey: "Testowanie klucza nie powiodło się.",
    apiKeyManager_ErrorTestingKey: "Błąd podczas testowania klucza: {error}",
    apiKeyManager_KeyProvider: "Dostawca",
    apiKeyManager_KeyName: "Nazwa klucza",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Akcja",

    // Model capabilities
    modelCapability_Vision: "Wizja",
    modelCapability_JSON: "Tryb JSON",
    modelCapability_Tools: "Użycie narzędzi",
    modelCapability_ImageGen: "Generowanie obrazów",
    modelCapability_Multilingual: "Wielojęzyczny",
    modelCapability_WebSearch: "Wyszukiwanie w Internecie",
    modelCapability_LargeContext: "Duży kontekst",
    modelCapability_LongContext: "Długi kontekst",
    modelCapability_FastResponse: "Szybka odpowiedź",
    modelCapability_CostEffective: "Ekonomiczny",
    modelCapability_AdvancedReasoning: "Zaawansowane rozumowanie",
    modelCapability_Coding: "Kodowanie",
    modelCapability_Foundation: "Model podstawowy",
    modelCapability_Experimental: "Eksperymentalny",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Podgląd",
    modelCapability_RequiresVerification: "Wymaga weryfikacji",
    modelCapability_RequiresAccount: "Wymaga konta",

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