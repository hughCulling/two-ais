// src/lib/translations/el.ts
export const el = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Ρυθμίσεις',
        signIn: 'Σύνδεση',
        signOut: 'Αποσύνδεση',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Αραβικά',
        bn: 'Μπενγκάλι',
        bg: 'Βουλγαρικά',
        zh: 'Κινέζικα',
        hr: 'Κροατικά',
        cs: 'Τσεχικά',
        da: 'Δανικά',
        nl: 'Ολλανδικά',
        en: 'Αγγλικά',
        et: 'Εσθονικά',
        fi: 'Φινλανδικά',
        fr: 'Γαλλικά',
        de: 'Γερμανικά',
        el: 'Ελληνικά',
        iw: 'Εβραϊκά',
        hi: 'Χίντι',
        hu: 'Ουγγρικά',
        id: 'Ινδονησιακά',
        it: 'Ιταλικά',
        ja: 'Ιαπωνικά',
        ko: 'Κορεατικά',
        lv: 'Λετονικά',
        lt: 'Λιθουανικά',
        no: 'Νορβηγικά',
        pl: 'Πολωνικά',
        pt: 'Πορτογαλικά',
        ro: 'Ρουμανικά',
        ru: 'Ρωσικά',
        sr: 'Σερβικά',
        sk: 'Σλοβακικά',
        sl: 'Σλοβενικά',
        es: 'Ισπανικά',
        sw: 'Σουαχίλι',
        sv: 'Σουηδικά',
        th: 'Ταϊλανδικά',
        tr: 'Τουρκικά',
        uk: 'Ουκρανικά',
        vi: 'Βιετναμέζικα',
    },

    // Settings page
    settings: {
        title: 'Ρυθμίσεις',
        sections: {
            appearance: 'Εμφάνιση',
            apiKeys: 'Κλειδιά API',
            language: 'Γλώσσα',
        },
        appearance: {
            theme: 'Θέμα',
            light: 'Φωτεινό',
            dark: 'Σκοτεινό',
            system: 'Σύστημα',
            description: "Προσαρμόστε την εμφάνιση και την αίσθηση της εφαρμογής."
        },
        language: {
            title: 'Γλώσσα',
            description: 'Επιλέξτε την προτιμώμενη γλώσσα για τη διεπαφή',
            conversationLanguage: 'Γλώσσα συνομιλίας',
            conversationLanguageDescription: 'Η γλώσσα που χρησιμοποιείται για τις συνομιλίες AI θα αντιστοιχεί στη γλώσσα της διεπαφής σας',
        },
        apiKeys: {
            title: 'Κλειδιά API',
            description: 'Διαχειριστείτε τα κλειδιά API σας για διαφορετικούς παρόχους AI',
            saved: 'Αποθηκεύτηκε',
            notSet: 'Δεν έχει οριστεί',
            setKey: 'Ορισμός κλειδιού',
            updateKey: 'Αλλαγή κλειδιού',
            removeKey: 'Κατάργηση κλειδιού',
            getKeyInstructions: 'Get your API key',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Δεν έχουν εισαχθεί νέα κλειδιά API για αποθήκευση.",
            unexpectedResponse: "Ελήφθη μη αναμενόμενη απάντηση από τον διακομιστή.",
            failedToSaveKey: "Η αποθήκευση του κλειδιού {serviceName} απέτυχε.",
            someKeysNotSaved: "Ορισμένα κλειδιά API δεν ήταν δυνατό να αποθηκευτούν. Ελέγξτε τις παρακάτω λεπτομέρειες.",
            keyStatus: "κατάσταση κλειδιού...",
            apiKeySecurelySaved: "Το κλειδί API αποθηκεύτηκε με ασφάλεια",
            confirmRemoveTitle: "Επιβεβαίωση κατάργησης",
            confirmRemoveDescription: "Είστε βέβαιοι ότι θέλετε να καταργήσετε το κλειδί API για το {serviceName}; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.",
            failedToRemoveKey: "Η κατάργηση του κλειδιού {serviceName} απέτυχε.",
            successfullyRemovedKey: "Το κλειδί {serviceName} καταργήθηκε με επιτυχία.",
            keyNotSet: "Κατάσταση κλειδιού: Δεν έχει οριστεί",
            keySet: "Κατάσταση κλειδιού: Έχει οριστεί",
            saveButton: "Αποθήκευση κλειδιού(ών) API"
        },
    },

    // Main page
    main: {
        title: 'Συνομιλία AI',
        setupForm: {
            title: 'Ρυθμίστε τη συνομιλία σας',
            agentA: 'Πράκτορας Α',
            agentB: 'Πράκτορας Β',
            model: 'Μοντέλο',
            selectModel: 'Επιλέξτε μοντέλο',
            tts: {
                title: 'Κείμενο σε ομιλία',
                enable: 'Ενεργοποίηση κειμένου σε ομιλία',
                provider: 'Πάροχος TTS',
                selectProvider: 'Επιλέξτε πάροχο TTS',
                voice: 'Φωνή',
                selectVoice: 'Επιλέξτε φωνή',
                model: 'Μοντέλο TTS',
                selectModel: 'Επιλέξτε μοντέλο TTS',
            },
            startConversation: 'Έναρξη συνομιλίας',
            conversationPrompt: 'Ξεκινήστε τη συνομιλία.',
        },
        conversation: {
            thinking: 'σκέφτεται...',
            stop: 'Διακοπή',
            restart: 'Επανεκκίνηση συνομιλίας',
        },
        pricing: {
            estimatedCost: 'Εκτιμώμενο κόστος',
            perMillionTokens: 'ανά εκατομμύριο tokens',
            input: 'Είσοδος',
            output: 'Έξοδος',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Σύνδεση στο Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Κωδικός πρόσβασης',
            signIn: 'Σύνδεση',
            signInWithGoogle: 'Σύνδεση με Google',
            noAccount: "Δεν έχετε λογαριασμό;",
            signUp: 'Εγγραφή',
            forgotPassword: 'Ξεχάσατε τον κωδικό πρόσβασης;',
            orContinueWith: "Ή συνεχίστε με",
            signingIn: "Σύνδεση..."
        },
        signup: {
            title: 'Δημιουργία λογαριασμού',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Κωδικός πρόσβασης (τουλάχιστον 6 χαρακτήρες)',
            signUp: 'Εγγραφή',
            signUpWithGoogle: 'Εγγραφή με Google',
            hasAccount: 'Έχετε ήδη λογαριασμό;',
            signIn: 'Σύνδεση',
            emailLabel: "Διεύθυνση ηλεκτρονικού ταχυδρομείου",
            confirmPasswordPlaceholder: "Επιβεβαίωση κωδικού πρόσβασης",
            signingUp: "Εγγραφή..."
        },
        errors: {
            invalidCredentials: 'Μη έγκυρο email ή κωδικός πρόσβασης',
            userNotFound: 'Ο χρήστης δεν βρέθηκε',
            weakPassword: 'Ο κωδικός πρόσβασης πρέπει να αποτελείται από τουλάχιστον 6 χαρακτήρες',
            emailInUse: 'Το email χρησιμοποιείται ήδη',
            generic: 'Παρουσιάστηκε σφάλμα. Παρακαλώ προσπαθήστε ξανά.',
            initialization: "Σφάλμα αρχικοποίησης. Παρακαλώ δοκιμάστε ξανά αργότερα.",
            invalidEmail: "Παρακαλώ εισάγετε μια έγκυρη διεύθυνση email.",
            tooManyRequests: "Η πρόσβαση έχει απενεργοποιηθεί προσωρινά λόγω υπερβολικά πολλών αποτυχημένων προσπαθειών σύνδεσης. Παρακαλώ επαναφέρετε τον κωδικό πρόσβασής σας ή δοκιμάστε ξανά αργότερα.",
            signInFailedPrefix: "Η σύνδεση απέτυχε: ",
            unknownSignInError: "Παρουσιάστηκε άγνωστο σφάλμα κατά τη σύνδεση.",
            profileSaveFailedPrefix: "Συνδεθήκατε, αλλά η αποθήκευση των δεδομένων προφίλ απέτυχε: ",
            profileCheckSaveFailedPrefix: "Συνδεθήκατε, αλλά ο έλεγχος/αποθήκευση των δεδομένων προφίλ απέτυχε: ",
            accountExistsWithDifferentCredential: "Υπάρχει ήδη λογαριασμός με αυτό το email που χρησιμοποιεί διαφορετική μέθοδο σύνδεσης.",
            googleSignInFailedPrefix: "Η σύνδεση με Google απέτυχε: ",
            unknownGoogleSignInError: "Παρουσιάστηκε άγνωστο σφάλμα κατά τη σύνδεση με Google.",
            passwordsDoNotMatch: "Οι κωδικοί πρόσβασης δεν ταιριάζουν.",
            accountCreatedProfileSaveFailedPrefix: "Ο λογαριασμός δημιουργήθηκε, αλλά η αποθήκευση των δεδομένων προφίλ απέτυχε: ",
            unknownProfileSaveError: "Παρουσιάστηκε άγνωστο σφάλμα κατά την αποθήκευση του προφίλ.",
            emailAlreadyRegistered: "Αυτή η διεύθυνση email είναι ήδη καταχωρημένη.",
            passwordTooShortSignUp: "Ο κωδικός πρόσβασης πρέπει να αποτελείται από τουλάχιστον 6 χαρακτήρες.",
            signUpFailedPrefix: "Η εγγραφή απέτυχε: ",
            unknownSignUpError: "Παρουσιάστηκε άγνωστο σφάλμα κατά την εγγραφή."
        },
    },

    // Common
    common: {
        loading: 'Φόρτωση...',
        error: 'Σφάλμα',
        save: 'Αποθήκευση',
        cancel: 'Ακύρωση',
        delete: 'Διαγραφή',
        confirm: 'Επιβεβαίωση',
        or: 'ή',
        MoreInformation: "Περισσότερες πληροφορίες",
        Example: "Παράδειγμα:",
        ShowMore: "Εμφάνιση περισσότερων",
        ShowLess: "Εμφάνιση λιγότερων",
        AwaitingApproval: "Αναμονή έγκρισης...",
        OpenInNewTab: "Άνοιγμα σε νέα καρτέλα",
        AdvancedSettings: "Ρυθμίσεις για προχωρημένους",
        Name: "Όνομα",
        Created: "Δημιουργήθηκε",
        Updated: "Ενημερώθηκε",
        Launched: "Ξεκίνησε",
        Docs: "Τεκμηρίωση",
        Blog: "Ιστολόγιο",
        Pricing: "Τιμολόγηση",
        Terms: "Όροι",
        Privacy: "Απόρρητο",
        Changelog: "Αρχείο αλλαγών",
        Copy: "Αντιγραφή",
        Copied: "Αντιγράφηκε",
        TryAgain: "Προσπαθήστε ξανά"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Λείπει το κλειδί API",
    apiKeyMissingSubtext: "Το κλειδί API για αυτόν τον πάροχο λείπει ή δεν είναι έγκυρο. Προσθέστε το στις ρυθμίσεις.",
    apiKeyNotNeeded: "Δεν απαιτείται κλειδί API",
    apiKeyNotNeededSubtext: "Αυτός ο πάροχος δεν απαιτεί κλειδί API για το δωρεάν επίπεδό του ή για ορισμένα μοντέλα.",
    apiKeyFound: "Το κλειδί API έχει οριστεί",
    apiKeyFoundSubtext: "Έχει διαμορφωθεί ένα κλειδί API για αυτόν τον πάροχο.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Κορυφαία μοντέλα συνομιλίας",
    modelCategory_Reasoning: "Μοντέλα συλλογισμού",
    modelCategory_CostOptimized: "Μοντέλα βελτιστοποιημένα ως προς το κόστος",
    modelCategory_OlderGPT: "Παλαιότερα μοντέλα GPT",
    modelCategory_Gemini2_5: "Σειρά Gemini 2.5",
    modelCategory_Gemini2_0: "Σειρά Gemini 2.0",
    modelCategory_Gemini1_5: "Σειρά Gemini 1.5",
    modelCategory_Claude3_7: "Σειρά Claude 3.7",
    modelCategory_Claude3_5: "Σειρά Claude 3.5",
    modelCategory_Claude3: "Σειρά Claude 3",
    modelCategory_Grok3: "Σειρά Grok 3",
    modelCategory_Grok3Mini: "Σειρά Grok 3 Mini",
    modelCategory_Llama4: "Σειρά Llama 4",
    modelCategory_Llama3_3: "Σειρά Llama 3.3",
    modelCategory_Llama3_2: "Σειρά Llama 3.2",
    modelCategory_Llama3_1: "Σειρά Llama 3.1",
    modelCategory_Llama3: "Σειρά Llama 3",
    modelCategory_LlamaVision: "Μοντέλα Llama Vision",
    modelCategory_MetaLlama: "Μοντέλα Meta Llama",
    modelCategory_Gemma2: "Σειρά Gemma 2",
    modelCategory_Gemma: "Σειρά Gemma",
    modelCategory_GoogleGemma: "Μοντέλα Google Gemma",
    modelCategory_DeepSeekR1: "Σειρά DeepSeek R1",
    modelCategory_DeepSeekV3: "Σειρά DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Σειρά DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Μοντέλα DeepSeek",
    modelCategory_MistralAIModels: "Μοντέλα Mistral AI",
    modelCategory_Qwen3: "Σειρά Qwen3",
    modelCategory_QwQwQ: "Σειρά Qwen QwQ",
    modelCategory_Qwen2_5: "Σειρά Qwen2.5",
    modelCategory_Qwen2_5Vision: "Σειρά Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Σειρά Qwen2.5 Coder",
    modelCategory_Qwen2: "Σειρά Qwen2",
    modelCategory_Qwen2Vision: "Σειρά Qwen2 Vision",
    modelCategory_QwenModels: "Μοντέλα Qwen",
    modelCategory_OtherModels: "Άλλα μοντέλα",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Η φόρτωση των δεδομένων χρήστη απέτυχε: {errorMessage}. Δοκιμάστε να ανανεώσετε τη σελίδα.",
    page_ErrorUserNotFound: "Ο χρήστης δεν βρέθηκε. Συνδεθείτε ξανά.",
    page_ErrorUserApiKeyConfig: "Η διαμόρφωση του κλειδιού API χρήστη δεν ήταν δυνατό να φορτωθεί. Ανανεώστε τη σελίδα ή ελέγξτε τις ρυθμίσεις.",
    page_ErrorStartingSessionAPI: "Σφάλμα API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Σφάλμα κατά την έναρξη της περιόδου λειτουργίας: {errorMessage}",
    page_ErrorSessionIdMissing: "Η απάντηση του API ήταν επιτυχής αλλά δεν περιελάμβανε conversationId.",
    page_LoadingUserData: "Φόρτωση δεδομένων χρήστη...",
    page_ErrorAlertTitle: "Σφάλμα",
    page_WelcomeTitle: "Καλώς ορίσατε στο Two AIs",
    page_WelcomeSubtitle: "Αυτός ο ιστότοπος σας επιτρέπει να ακούτε συνομιλίες μεταξύ δύο LLM.",
    page_ApiKeysRequiredTitle: "Απαιτούνται κλειδιά API",
    page_ApiKeysRequiredDescription: "Για την εκτέλεση συνομιλιών, θα πρέπει να παρέχετε τα δικά σας κλειδιά API για τα μοντέλα AI που θέλετε να χρησιμοποιήσετε (π.χ. OpenAI, Google, Anthropic) μετά τη σύνδεση. Λεπτομερείς οδηγίες για κάθε πάροχο μπορείτε να βρείτε στη σελίδα Ρυθμίσεις / Κλειδιά API μετά τη σύνδεση.",
    page_SignInPrompt: "Για να ξεκινήσετε τη δική σας περίοδο λειτουργίας, μπορείτε να συνδεθείτε ή να δημιουργήσετε έναν λογαριασμό χρησιμοποιώντας τον σύνδεσμο στην κεφαλίδα.",
    page_VideoTitle: "Επίδειξη συνομιλίας Two AIs",
    page_AvailableLLMsTitle: "Τρέχοντα διαθέσιμα LLM",
    page_TooltipGoogleThinkingBudget: "Αυτό το μοντέλο Google χρησιμοποιεί έναν «προϋπολογισμό σκέψης». Η έξοδος «σκέψης» χρεώνεται αλλά δεν είναι ορατή στη συνομιλία.",
    page_TooltipAnthropicExtendedThinking: "Αυτό το μοντέλο Anthropic χρησιμοποιεί «εκτεταμένη σκέψη». Η έξοδος «σκέψης» χρεώνεται αλλά δεν είναι ορατή στη συνομιλία.",
    page_TooltipXaiThinking: "Αυτό το μοντέλο xAI χρησιμοποιεί «σκέψη». Αυτή η έξοδος χρεώνεται αλλά δεν είναι ορατή στη συνομιλία.",
    page_TooltipQwenReasoning: "Αυτό το μοντέλο Qwen χρησιμοποιεί «συλλογισμό/σκέψη». Αυτή η έξοδος χρεώνεται αλλά δεν είναι ορατή στη συνομιλία.",
    page_TooltipDeepSeekReasoning: "Αυτό το μοντέλο DeepSeek χρησιμοποιεί «συλλογισμό/σκέψη». Η έξοδος χρεώνεται αλλά δεν είναι ορατή στη συνομιλία.",
    page_TooltipGenericReasoning: "Αυτό το μοντέλο χρησιμοποιεί token συλλογισμού που δεν είναι ορατά στη συνομιλία αλλά χρεώνονται ως token εξόδου.",
    page_TooltipRequiresVerification: "Απαιτεί επαληθευμένο οργανισμό OpenAI. Μπορείτε να επαληθεύσετε εδώ.",
    page_TooltipSupportsLanguage: "Υποστηρίζει {languageName}",
    page_TooltipMayNotSupportLanguage: "Ενδέχεται να μην υποστηρίζει {languageName}",
    page_BadgePreview: "Προεπισκόπηση",
    page_BadgeExperimental: "Πειραματικό",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Τρέχοντα διαθέσιμα TTS",
    page_NoTTSOptions: "Δεν υπάρχουν διαθέσιμες επιλογές TTS αυτήν τη στιγμή.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Εισαγάγετε νέο κλειδί API {serviceName}",
    apiKeyManager_TestKey: "Δοκιμή κλειδιού",
    apiKeyManager_TestingKey: "Δοκιμή κλειδιού...",
    apiKeyManager_KeyIsValid: "Το κλειδί είναι έγκυρο.",
    apiKeyManager_KeyIsInvalid: "Το κλειδί δεν είναι έγκυρο.",
    apiKeyManager_FailedToTestKey: "Η δοκιμή του κλειδιού απέτυχε.",
    apiKeyManager_ErrorTestingKey: "Σφάλμα κατά τη δοκιμή του κλειδιού: {error}",
    apiKeyManager_KeyProvider: "Πάροχος",
    apiKeyManager_KeyName: "Όνομα κλειδιού",
    apiKeyManager_Status: "Κατάσταση",
    apiKeyManager_Action: "Ενέργεια",

    // Model capabilities
    modelCapability_Vision: "Όραση",
    modelCapability_JSON: "Λειτουργία JSON",
    modelCapability_Tools: "Χρήση εργαλείων",
    modelCapability_ImageGen: "Δημιουργία εικόνων",
    modelCapability_Multilingual: "Πολύγλωσσο",
    modelCapability_WebSearch: "Αναζήτηση στον Ιστό",
    modelCapability_LargeContext: "Μεγάλο περιβάλλον",
    modelCapability_LongContext: "Μακρύ περιβάλλον",
    modelCapability_FastResponse: "Γρήγορη απόκριση",
    modelCapability_CostEffective: "Οικονομικά αποδοτικό",
    modelCapability_AdvancedReasoning: "Προηγμένος συλλογισμός",
    modelCapability_Coding: "Κωδικοποίηση",
    modelCapability_Foundation: "Θεμελιώδες μοντέλο",
    modelCapability_Experimental: "Πειραματικό",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Προεπισκόπηση",
    modelCapability_RequiresVerification: "Απαιτεί επαλήθευση",
    modelCapability_RequiresAccount: "Απαιτεί λογαριασμό",

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