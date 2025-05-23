export const fr = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Paramètres',
        signIn: 'Se connecter',
        signOut: 'Se déconnecter',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabe',
        bn: 'Bengali',
        bg: 'Bulgare',
        zh: 'Chinois',
        hr: 'Croate',
        cs: 'Tchèque',
        da: 'Danois',
        nl: 'Néerlandais',
        en: 'Anglais',
        et: 'Estonien',
        fi: 'Finnois',
        fr: 'Français',
        de: 'Allemand',
        el: 'Grec',
        iw: 'Hébreu',
        hi: 'Hindi',
        hu: 'Hongrois',
        id: 'Indonésien',
        it: 'Italien',
        ja: 'Japonais',
        ko: 'Coréen',
        lv: 'Letton',
        lt: 'Lituanien',
        no: 'Norvégien',
        pl: 'Polonais',
        pt: 'Portugais',
        ro: 'Roumain',
        ru: 'Russe',
        sr: 'Serbe',
        sk: 'Slovaque',
        sl: 'Slovène',
        es: 'Espagnol',
        sw: 'Swahili',
        sv: 'Suédois',
        th: 'Thaï',
        tr: 'Turc',
        uk: 'Ukrainien',
        vi: 'Vietnamien',
    },

    // Settings page
    settings: {
        title: 'Paramètres',
        sections: {
            appearance: 'Apparence',
            apiKeys: 'Clés API',
            language: 'Langue',
        },
        appearance: {
            theme: 'Thème',
            light: 'Clair',
            dark: 'Sombre',
            system: 'Système',
        },
        language: {
            title: 'Langue',
            description: 'Choisissez votre langue préférée pour l\'interface',
            conversationLanguage: 'Langue de conversation',
            conversationLanguageDescription: 'La langue utilisée pour les conversations IA correspondra à la langue de votre interface',
        },
        apiKeys: {
            title: 'Clés API',
            description: 'Gérez vos clés API pour différents fournisseurs d\'IA',
            saved: 'Enregistrée',
            notSet: 'Non définie',
            setKey: 'Définir la clé',
            updateKey: 'Mettre à jour la clé',
            removeKey: 'Supprimer la clé',
            getKeyInstructions: 'Obtenir votre clé API',
        },
    },

    // Main page
    main: {
        title: 'Conversation IA',
        setupForm: {
            title: 'Configurez votre conversation',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Modèle',
            selectModel: 'Sélectionnez un modèle',
            tts: {
                title: 'Synthèse vocale',
                enable: 'Activer la synthèse vocale',
                provider: 'Fournisseur TTS',
                selectProvider: 'Sélectionner le fournisseur TTS',
                voice: 'Voix',
                selectVoice: 'Sélectionner la voix',
                model: 'Modèle TTS',
                selectModel: 'Sélectionner le modèle TTS',
            },
            startConversation: 'Démarrer la conversation',
            conversationPrompt: 'Commencez la conversation.',
        },
        conversation: {
            thinking: 'réflexion...',
            stop: 'Arrêter',
            restart: 'Redémarrer la conversation',
        },
        pricing: {
            estimatedCost: 'Coût estimé',
            perMillionTokens: 'par million de jetons',
            input: 'Entrée',
            output: 'Sortie',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Connectez-vous à Two AIs',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Mot de passe',
            signIn: 'Se connecter',
            signInWithGoogle: 'Se connecter avec Google',
            noAccount: 'Pas de compte ?',
            signUp: 'S\'inscrire',
            forgotPassword: 'Mot de passe oublié ?',
        },
        signup: {
            title: 'Créer un compte',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Mot de passe (au moins 6 caractères)',
            signUp: 'S\'inscrire',
            signUpWithGoogle: 'S\'inscrire avec Google',
            hasAccount: 'Vous avez déjà un compte ?',
            signIn: 'Se connecter',
        },
        errors: {
            invalidCredentials: 'Email ou mot de passe invalide',
            userNotFound: 'Utilisateur non trouvé',
            weakPassword: 'Le mot de passe doit contenir au moins 6 caractères',
            emailInUse: 'Email déjà utilisé',
            generic: 'Une erreur s\'est produite. Veuillez réessayer.',
        },
    },

    // Common
    common: {
        loading: 'Chargement...',
        error: 'Erreur',
        save: 'Enregistrer',
        cancel: 'Annuler',
        delete: 'Supprimer',
        confirm: 'Confirmer',
        or: 'ou',
    },
}; 