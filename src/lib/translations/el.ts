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
            updateKey: 'Ενημέρωση κλειδιού',
            removeKey: 'Κατάργηση κλειδιού',
            getKeyInstructions: 'Λάβετε το κλειδί API σας',
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
        },
        signup: {
            title: 'Δημιουργία λογαριασμού',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Κωδικός πρόσβασης (τουλάχιστον 6 χαρακτήρες)',
            signUp: 'Εγγραφή',
            signUpWithGoogle: 'Εγγραφή με Google',
            hasAccount: 'Έχετε ήδη λογαριασμό;',
            signIn: 'Σύνδεση',
        },
        errors: {
            invalidCredentials: 'Μη έγκυρο email ή κωδικός πρόσβασης',
            userNotFound: 'Ο χρήστης δεν βρέθηκε',
            weakPassword: 'Ο κωδικός πρόσβασης πρέπει να αποτελείται από τουλάχιστον 6 χαρακτήρες',
            emailInUse: 'Το email χρησιμοποιείται ήδη',
            generic: 'Παρουσιάστηκε σφάλμα. Παρακαλώ προσπαθήστε ξανά.',
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
    },
}; 