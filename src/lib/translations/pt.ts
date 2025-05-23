// src/lib/translations/pt.ts
export const pt = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Configurações',
        signIn: 'Entrar',
        signOut: 'Sair',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Árabe',
        bn: 'Bengali',
        bg: 'Búlgaro',
        zh: 'Chinês',
        hr: 'Croata',
        cs: 'Tcheco',
        da: 'Dinamarquês',
        nl: 'Holandês',
        en: 'Inglês',
        et: 'Estoniano',
        fi: 'Finlandês',
        fr: 'Francês',
        de: 'Alemão',
        el: 'Grego',
        iw: 'Hebraico',
        hi: 'Hindi',
        hu: 'Húngaro',
        id: 'Indonésio',
        it: 'Italiano',
        ja: 'Japonês',
        ko: 'Coreano',
        lv: 'Letão',
        lt: 'Lituano',
        no: 'Norueguês',
        pl: 'Polonês',
        pt: 'Português',
        ro: 'Romeno',
        ru: 'Russo',
        sr: 'Sérvio',
        sk: 'Eslovaco',
        sl: 'Esloveno',
        es: 'Espanhol',
        sw: 'Suaíli',
        sv: 'Sueco',
        th: 'Tailandês',
        tr: 'Turco',
        uk: 'Ucraniano',
        vi: 'Vietnamita',
    },

    // Settings page
    settings: {
        title: 'Configurações',
        sections: {
            appearance: 'Aparência',
            apiKeys: 'Chaves API',
            language: 'Idioma',
        },
        appearance: {
            theme: 'Tema',
            light: 'Claro',
            dark: 'Escuro',
            system: 'Sistema',
        },
        language: {
            title: 'Idioma',
            description: 'Escolha seu idioma preferido para a interface',
            conversationLanguage: 'Idioma da conversa',
            conversationLanguageDescription: 'O idioma usado para conversas de IA corresponderá ao idioma da sua interface',
        },
        apiKeys: {
            title: 'Chaves API',
            description: 'Gerencie suas chaves API para diferentes provedores de IA',
            saved: 'Salva',
            notSet: 'Não definida',
            setKey: 'Definir chave',
            updateKey: 'Atualizar chave',
            removeKey: 'Remover chave',
            getKeyInstructions: 'Obter sua chave API',
        },
    },

    // Main page
    main: {
        title: 'Conversa de IA',
        setupForm: {
            title: 'Configure sua conversa',
            agentA: 'Agente A',
            agentB: 'Agente B',
            model: 'Modelo',
            selectModel: 'Selecione um modelo',
            tts: {
                title: 'Texto para voz',
                enable: 'Ativar texto para voz',
                provider: 'Provedor TTS',
                selectProvider: 'Selecionar provedor TTS',
                voice: 'Voz',
                selectVoice: 'Selecionar voz',
                model: 'Modelo TTS',
                selectModel: 'Selecionar modelo TTS',
            },
            startConversation: 'Iniciar conversa',
            conversationPrompt: 'Inicie a conversa.',
        },
        conversation: {
            thinking: 'pensando...',
            stop: 'Parar',
            restart: 'Reiniciar conversa',
        },
        pricing: {
            estimatedCost: 'Custo estimado',
            perMillionTokens: 'por milhão de tokens',
            input: 'Entrada',
            output: 'Saída',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Entrar no Two AIs',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Senha',
            signIn: 'Entrar',
            signInWithGoogle: 'Entrar com Google',
            noAccount: 'Não tem uma conta?',
            signUp: 'Cadastre-se',
            forgotPassword: 'Esqueceu a senha?',
        },
        signup: {
            title: 'Criar uma conta',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Senha (pelo menos 6 caracteres)',
            signUp: 'Cadastrar',
            signUpWithGoogle: 'Cadastrar com Google',
            hasAccount: 'Já tem uma conta?',
            signIn: 'Entrar',
        },
        errors: {
            invalidCredentials: 'E-mail ou senha inválidos',
            userNotFound: 'Usuário não encontrado',
            weakPassword: 'A senha deve ter pelo menos 6 caracteres',
            emailInUse: 'E-mail já está em uso',
            generic: 'Ocorreu um erro. Por favor, tente novamente.',
        },
    },

    // Common
    common: {
        loading: 'Carregando...',
        error: 'Erro',
        save: 'Salvar',
        cancel: 'Cancelar',
        delete: 'Excluir',
        confirm: 'Confirmar',
        or: 'ou',
    },
}; 