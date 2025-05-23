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
            description: "Personalize a aparência e a sensação do aplicativo."
        },
        language: {
            title: 'Idioma',
            description: 'Escolha seu idioma preferido para a interface',
            conversationLanguage: 'Idioma da conversa',
            conversationLanguageDescription: 'O idioma usado para conversas de IA corresponderá ao idioma da sua interface',
            getKeyInstructions: 'Obtenha sua chave de API',
        },
        apiKeys: {
            title: 'Chaves API',
            description: 'Gerencie suas chaves API para diferentes provedores de IA',
            saved: 'Salva',
            notSet: 'Não definida',
            setKey: 'Definir chave',
            updateKey: 'Atualizar chave',
            removeKey: 'Remover chave',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Nenhuma nova chave de API inserida para salvar.",
            unexpectedResponse: "Recebida uma resposta inesperada do servidor.",
            failedToSaveKey: "Falha ao salvar a chave {serviceName}.",
            someKeysNotSaved: "Algumas chaves de API não puderam ser salvas. Verifique os detalhes abaixo.",
            keyStatus: "status da chave...",
            apiKeySecurelySaved: "Chave de API salva com segurança",
            confirmRemoveTitle: "Confirmar remoção",
            confirmRemoveDescription: "Tem certeza de que deseja remover a chave de API para {serviceName}? Esta ação não pode ser desfeita.",
            failedToRemoveKey: "Falha ao remover a chave {serviceName}.",
            successfullyRemovedKey: "Chave {serviceName} removida com sucesso.",
            keyNotSet: "Status da chave: não definida",
            keySet: "Status da chave: definida",
            saveButton: "Salvar chave(s) de API"
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
            signingIn: "Entrando..."
        },
        signup: {
            title: 'Criar uma conta',
            emailPlaceholder: 'E-mail',
            passwordPlaceholder: 'Senha (pelo menos 6 caracteres)',
            signUp: 'Cadastrar',
            signUpWithGoogle: 'Cadastrar com Google',
            hasAccount: 'Já tem uma conta?',
            signIn: 'Entrar',
            emailLabel: "Endereço de e-mail",
            confirmPasswordPlaceholder: "Confirmar senha",
            signingUp: "Cadastrando..."
        },
        errors: {
            invalidCredentials: 'E-mail ou senha inválidos',
            userNotFound: 'Usuário não encontrado',
            weakPassword: 'A senha deve ter pelo menos 6 caracteres',
            emailInUse: 'E-mail já está em uso',
            generic: 'Ocorreu um erro. Por favor, tente novamente.',
            initialization: "Erro de inicialização. Por favor, tente mais tarde.",
            invalidEmail: "Por favor, insira um endereço de e-mail válido.",
            tooManyRequests: "Acesso temporariamente desativado devido a muitas tentativas de login malsucedidas. Redefina sua senha ou tente novamente mais tarde.",
            signInFailedPrefix: "Falha ao entrar: ",
            unknownSignInError: "Ocorreu um erro desconhecido ao entrar.",
            profileSaveFailedPrefix: "Conectado, mas falha ao salvar os dados do perfil: ",
            profileCheckSaveFailedPrefix: "Conectado, mas falha ao verificar/salvar os dados do perfil: ",
            accountExistsWithDifferentCredential: "Já existe uma conta com este endereço de e-mail usando um método de login diferente.",
            googleSignInFailedPrefix: "Falha ao entrar com o Google: ",
            unknownGoogleSignInError: "Ocorreu um erro desconhecido ao entrar com o Google.",
            passwordsDoNotMatch: "As senhas não coincidem.",
            accountCreatedProfileSaveFailedPrefix: "Conta criada, mas falha ao salvar os dados do perfil: ",
            unknownProfileSaveError: "Ocorreu um erro desconhecido ao salvar o perfil.",
            emailAlreadyRegistered: "Este endereço de e-mail já está registrado.",
            passwordTooShortSignUp: "A senha deve ter pelo menos 6 caracteres.",
            signUpFailedPrefix: "Falha ao cadastrar: ",
            unknownSignUpError: "Ocorreu um erro desconhecido ao cadastrar."
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
        MoreInformation: "Mais informações",
        Example: "Exemplo:",
        ShowMore: "Mostrar mais",
        ShowLess: "Mostrar menos",
        AwaitingApproval: "Aguardando aprovação...",
        OpenInNewTab: "Abrir em nova guia",
        AdvancedSettings: "Configurações avançadas",
        Name: "Nome",
        Created: "Criado",
        Updated: "Atualizado",
        Launched: "Lançado",
        Docs: "Documentação",
        Blog: "Blog",
        Pricing: "Preços",
        Terms: "Termos",
        Privacy: "Privacidade",
        Changelog: "Registro de alterações",
        Copy: "Copiar",
        Copied: "Copiado",
        TryAgain: "Tentar novamente"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Chave de API ausente",
    apiKeyMissingSubtext: "A chave de API para este provedor está ausente ou é inválida. Adicione-a nas configurações.",
    apiKeyNotNeeded: "Chave de API não necessária",
    apiKeyNotNeededSubtext: "Este provedor não requer uma chave de API para seu nível gratuito ou determinados modelos.",
    apiKeyFound: "Chave de API definida",
    apiKeyFoundSubtext: "Uma chave de API está configurada para este provedor.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Modelos de chat principais",
    modelCategory_Reasoning: "Modelos de raciocínio",
    modelCategory_CostOptimized: "Modelos otimizados para custos",
    modelCategory_OlderGPT: "Modelos GPT mais antigos",
    modelCategory_Gemini2_5: "Série Gemini 2.5",
    modelCategory_Gemini2_0: "Série Gemini 2.0",
    modelCategory_Gemini1_5: "Série Gemini 1.5",
    modelCategory_Claude3_7: "Série Claude 3.7",
    modelCategory_Claude3_5: "Série Claude 3.5",
    modelCategory_Claude3: "Série Claude 3",
    modelCategory_Grok3: "Série Grok 3",
    modelCategory_Grok3Mini: "Série Grok 3 Mini",
    modelCategory_Llama4: "Série Llama 4",
    modelCategory_Llama3_3: "Série Llama 3.3",
    modelCategory_Llama3_2: "Série Llama 3.2",
    modelCategory_Llama3_1: "Série Llama 3.1",
    modelCategory_Llama3: "Série Llama 3",
    modelCategory_LlamaVision: "Modelos Llama Vision",
    modelCategory_MetaLlama: "Modelos Meta Llama",
    modelCategory_Gemma2: "Série Gemma 2",
    modelCategory_Gemma: "Série Gemma",
    modelCategory_GoogleGemma: "Modelos Google Gemma",
    modelCategory_DeepSeekR1: "Série DeepSeek R1",
    modelCategory_DeepSeekV3: "Série DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Série DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Modelos DeepSeek",
    modelCategory_MistralAIModels: "Modelos Mistral AI",
    modelCategory_Qwen3: "Série Qwen3",
    modelCategory_QwQwQ: "Série Qwen QwQ",
    modelCategory_Qwen2_5: "Série Qwen2.5",
    modelCategory_Qwen2_5Vision: "Série Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Série Qwen2.5 Coder",
    modelCategory_Qwen2: "Série Qwen2",
    modelCategory_Qwen2Vision: "Série Qwen2 Vision",
    modelCategory_QwenModels: "Modelos Qwen",
    modelCategory_OtherModels: "Outros modelos",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Falha ao carregar dados do usuário: {errorMessage}. Tente atualizar.",
    page_ErrorUserNotFound: "Usuário não encontrado. Entre novamente.",
    page_ErrorUserApiKeyConfig: "A configuração da chave de API do usuário não pôde ser carregada. Atualize ou verifique as configurações.",
    page_ErrorStartingSessionAPI: "Erro de API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Erro ao iniciar a sessão: {errorMessage}",
    page_ErrorSessionIdMissing: "Resposta da API bem-sucedida, mas não incluiu um ID de conversa.",
    page_LoadingUserData: "Carregando dados do usuário...",
    page_ErrorAlertTitle: "Erro",
    page_WelcomeTitle: "Bem-vindo ao Two AIs",
    page_WelcomeSubtitle: "Este site permite que você ouça conversas entre dois LLMs.",
    page_ApiKeysRequiredTitle: "Chaves de API necessárias",
    page_ApiKeysRequiredDescription: "Para executar conversas, você precisará fornecer suas próprias chaves de API para os modelos de IA que deseja usar (por exemplo, OpenAI, Google, Anthropic) após fazer login. Instruções detalhadas para cada provedor podem ser encontradas na página Configurações / Chaves de API após fazer login.",
    page_SignInPrompt: "Para iniciar sua própria sessão, você pode entrar ou criar uma conta usando o link no cabeçalho.",
    page_VideoTitle: "Demonstração de conversa do Two AIs",
    page_AvailableLLMsTitle: "LLMs atualmente disponíveis",
    page_TooltipGoogleThinkingBudget: "Este modelo do Google usa um 'orçamento de pensamento'. A saída de 'pensamento' é cobrada, mas não é visível no chat.",
    page_TooltipAnthropicExtendedThinking: "Este modelo da Anthropic usa 'pensamento estendido'. A saída de 'pensamento' é cobrada, mas não é visível no chat.",
    page_TooltipXaiThinking: "Este modelo xAI usa 'pensamento'. Esta saída é cobrada, mas não é visível no chat.",
    page_TooltipQwenReasoning: "Este modelo Qwen usa 'raciocínio/pensamento'. Esta saída é cobrada, mas não é visível no chat.",
    page_TooltipDeepSeekReasoning: "Este modelo DeepSeek usa 'raciocínio/pensamento'. A saída é cobrada, mas não é visível no chat.",
    page_TooltipGenericReasoning: "Este modelo usa tokens de raciocínio que não são visíveis no chat, mas são cobrados como tokens de saída.",
    page_TooltipRequiresVerification: "Requer organização OpenAI verificada. Você pode verificar aqui.",
    page_TooltipSupportsLanguage: "Suporta {languageName}",
    page_TooltipMayNotSupportLanguage: "Pode não suportar {languageName}",
    page_BadgePreview: "Prévia",
    page_BadgeExperimental: "Experimental",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "TTS atualmente disponível",
    page_NoTTSOptions: "Nenhuma opção de TTS disponível no momento.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Inserir nova chave de API {serviceName}",
    apiKeyManager_TestKey: "Testar chave",
    apiKeyManager_TestingKey: "Testando chave...",
    apiKeyManager_KeyIsValid: "A chave é válida.",
    apiKeyManager_KeyIsInvalid: "A chave é inválida.",
    apiKeyManager_FailedToTestKey: "Falha ao testar a chave.",
    apiKeyManager_ErrorTestingKey: "Erro ao testar a chave: {error}",
    apiKeyManager_KeyProvider: "Provedor",
    apiKeyManager_KeyName: "Nome da chave",
    apiKeyManager_Status: "Status",
    apiKeyManager_Action: "Ação",

    // Model capabilities
    modelCapability_Vision: "Visão",
    modelCapability_JSON: "Modo JSON",
    modelCapability_Tools: "Uso de ferramentas",
    modelCapability_ImageGen: "Geração de imagem",
    modelCapability_Multilingual: "Multilíngue",
    modelCapability_WebSearch: "Pesquisa na Web",
    modelCapability_LargeContext: "Contexto grande",
    modelCapability_LongContext: "Contexto longo",
    modelCapability_FastResponse: "Resposta rápida",
    modelCapability_CostEffective: "Custo-benefício",
    modelCapability_AdvancedReasoning: "Raciocínio avançado",
    modelCapability_Coding: "Codificação",
    modelCapability_Foundation: "Modelo de fundação",
    modelCapability_Experimental: "Experimental",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Prévia",
    modelCapability_RequiresVerification: "Requer verificação",
    modelCapability_RequiresAccount: "Requer conta",

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
    ttsVoice_Ugne: "Ugne", // Keep name (Lithuanian)

    // --------------- END OF FILE ---------------
}; 