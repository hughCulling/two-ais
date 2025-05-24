// src/lib/translations/zh.ts
export const zh = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: '设置',
        signIn: '登录',
        signOut: '退出',
    },

    // Language names (for display in language selector)
    languages: {
        ar: '阿拉伯语',
        bn: '孟加拉语',
        bg: '保加利亚语',
        zh: '中文',
        hr: '克罗地亚语',
        cs: '捷克语',
        da: '丹麦语',
        nl: '荷兰语',
        en: '英语',
        et: '爱沙尼亚语',
        fi: '芬兰语',
        fr: '法语',
        de: '德语',
        el: '希腊语',
        iw: '希伯来语',
        hi: '印地语',
        hu: '匈牙利语',
        id: '印尼语',
        it: '意大利语',
        ja: '日语',
        ko: '韩语',
        lv: '拉脱维亚语',
        lt: '立陶宛语',
        no: '挪威语',
        pl: '波兰语',
        pt: '葡萄牙语',
        ro: '罗马尼亚语',
        ru: '俄语',
        sr: '塞尔维亚语',
        sk: '斯洛伐克语',
        sl: '斯洛文尼亚语',
        es: '西班牙语',
        sw: '斯瓦希里语',
        sv: '瑞典语',
        th: '泰语',
        tr: '土耳其语',
        uk: '乌克兰语',
        vi: '越南语',
    },

    // Settings page
    settings: {
        title: '设置',
        sections: {
            appearance: '外观',
            apiKeys: 'API密钥',
            language: '语言',
        },
        appearance: {
            theme: '外观',
            light: '浅色',
            dark: '深色',
            system: '系统',
            description: "Customize the look and feel of the application."
        },
        language: {
            title: '语言',
            description: '选择您的界面首选语言',
            conversationLanguage: '对话语言',
            conversationLanguageDescription: 'AI对话使用的语言将与您的界面语言相匹配',
        },
        apiKeys: {
            title: 'API密钥',
            description: '管理不同AI提供商的API密钥',
            saved: '已保存',
            notSet: '未设置',
            setKey: '设置密钥',
            updateKey: '更新密钥',
            removeKey: '删除密钥',
            getKeyInstructions: '获取您的 API 密钥',
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
        title: 'AI对话',
        setupForm: {
            title: '设置您的对话',
            agentA: '代理A',
            agentB: '代理B',
            model: '模型',
            selectModel: '选择模型',
            tts: {
                title: '文字转语音',
                enable: '启用文字转语音',
                provider: 'TTS提供商',
                selectProvider: '选择TTS提供商',
                voice: '语音',
                selectVoice: '选择语音',
                model: 'TTS模型',
                selectModel: '选择TTS模型',
            },
            startConversation: '开始对话',
            conversationPrompt: '开始对话。',
        },
        conversation: {
            thinking: '思考中...',
            stop: '停止',
            restart: '重新开始对话',
        },
        pricing: {
            estimatedCost: '预估成本',
            perMillionTokens: '每百万令牌',
            input: '输入',
            output: '输出',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: '登录到Two AIs',
            emailPlaceholder: '电子邮件',
            passwordPlaceholder: '密码',
            signIn: '登录',
            signInWithGoogle: '使用Google登录',
            noAccount: '没有账户？',
            signUp: '注册',
            forgotPassword: '忘记密码？',
            orContinueWith: "或继续使用",
            signingIn: "登录中..."
        },
        signup: {
            title: '创建账户',
            emailPlaceholder: '电子邮件',
            passwordPlaceholder: '密码（至少6个字符）',
            signUp: '注册',
            signUpWithGoogle: '使用Google注册',
            hasAccount: '已有账户？',
            signIn: '登录',
            emailLabel: "电子邮件地址",
            confirmPasswordPlaceholder: "确认密码",
            signingUp: "注册中..."
        },
        errors: {
            invalidCredentials: '无效的电子邮件或密码',
            userNotFound: '未找到用户',
            weakPassword: '密码必须至少包含6个字符',
            emailInUse: '电子邮件已被使用',
            generic: '发生错误，请重试。',
            initialization: "初始化错误。请稍后重试。",
            invalidEmail: "请输入有效的电子邮件地址。",
            tooManyRequests: "由于登录尝试失败次数过多，访问已暂时禁用。请重置密码或稍后重试。",
            signInFailedPrefix: "登录失败：",
            unknownSignInError: "登录时发生未知错误。",
            profileSaveFailedPrefix: "已登录，但未能保存个人资料数据：",
            profileCheckSaveFailedPrefix: "已登录，但未能检查/保存个人资料数据：",
            accountExistsWithDifferentCredential: "具有此电子邮件地址的帐户已存在，但使用不同的登录方法。",
            googleSignInFailedPrefix: "Google 登录失败：",
            unknownGoogleSignInError: "Google 登录时发生未知错误。",
            passwordsDoNotMatch: "密码不匹配。",
            accountCreatedProfileSaveFailedPrefix: "帐户已创建，但未能保存个人资料数据：",
            unknownProfileSaveError: "保存个人资料时发生未知错误。",
            emailAlreadyRegistered: "此电子邮件地址已被注册。",
            passwordTooShortSignUp: "密码必须至少包含 6 个字符。",
            signUpFailedPrefix: "注册失败：",
            unknownSignUpError: "注册时发生未知错误。"
        },
    },

    // Common
    common: {
        loading: '加载中...',
        error: '错误',
        save: '保存',
        cancel: '取消',
        delete: '删除',
        confirm: '确认',
        or: '或',
        MoreInformation: "更多信息",
        Example: "示例：",
        ShowMore: "显示更多",
        ShowLess: "显示更少",
        AwaitingApproval: "等待批准...",
        OpenInNewTab: "在新标签页中打开",
        AdvancedSettings: "高级设置",
        Name: "名称",
        Created: "已创建",
        Updated: "已更新",
        Launched: "已启动",
        Docs: "文档",
        Blog: "博客",
        Pricing: "价格",
        Terms: "条款",
        Privacy: "隐私",
        Changelog: "更新日志",
        Copy: "复制",
        Copied: "已复制",
        TryAgain: "再试一次"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "缺少 API 密钥",
    apiKeyMissingSubtext: "此提供商的 API 密钥丢失或无效。请在设置中添加。",
    apiKeyNotNeeded: "不需要 API 密钥",
    apiKeyNotNeededSubtext: "此提供商的免费套餐或某些模型不需要 API 密钥。",
    apiKeyFound: "API 密钥已设置",
    apiKeyFoundSubtext: "已为此提供商配置 API 密钥。",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "旗舰聊天模型",
    modelCategory_Reasoning: "推理模型",
    modelCategory_CostOptimized: "成本优化模型",
    modelCategory_OlderGPT: "旧版 GPT 模型",
    modelCategory_Gemini2_5: "Gemini 2.5 系列",
    modelCategory_Gemini2_0: "Gemini 2.0 系列",
    modelCategory_Gemini1_5: "Gemini 1.5 系列",
    modelCategory_Claude3_7: "Claude 3.7 系列",
    modelCategory_Claude3_5: "Claude 3.5 系列",
    modelCategory_Claude3: "Claude 3 系列",
    modelCategory_Grok3: "Grok 3 系列",
    modelCategory_Grok3Mini: "Grok 3 Mini 系列",
    modelCategory_Llama4: "Llama 4 系列",
    modelCategory_Llama3_3: "Llama 3.3 系列",
    modelCategory_Llama3_2: "Llama 3.2 系列",
    modelCategory_Llama3_1: "Llama 3.1 系列",
    modelCategory_Llama3: "Llama 3 系列",
    modelCategory_LlamaVision: "Llama Vision 模型",
    modelCategory_MetaLlama: "Meta Llama 模型",
    modelCategory_Gemma2: "Gemma 2 系列",
    modelCategory_Gemma: "Gemma 系列",
    modelCategory_GoogleGemma: "Google Gemma 模型",
    modelCategory_DeepSeekR1: "DeepSeek R1 系列",
    modelCategory_DeepSeekV3: "DeepSeek V3 系列",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill 系列",
    modelCategory_DeepSeekModels: "DeepSeek 模型",
    modelCategory_MistralAIModels: "Mistral AI 模型",
    modelCategory_Qwen3: "Qwen3 系列",
    modelCategory_QwQwQ: "Qwen QwQ 系列",
    modelCategory_Qwen2_5: "Qwen2.5 系列",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision 系列",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder 系列",
    modelCategory_Qwen2: "Qwen2 系列",
    modelCategory_Qwen2Vision: "Qwen2 Vision 系列",
    modelCategory_QwenModels: "Qwen 模型",
    modelCategory_OtherModels: "其他模型",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "未能加载用户数据：{errorMessage}。请尝试刷新。",
    page_ErrorUserNotFound: "未找到用户。请重新登录。",
    page_ErrorUserApiKeyConfig: "无法加载用户 API 密钥配置。请刷新或检查设置。",
    page_ErrorStartingSessionAPI: "API 错误：{status} {statusText}",
    page_ErrorStartingSessionGeneric: "启动会话时出错：{errorMessage}",
    page_ErrorSessionIdMissing: "API 响应成功，但未包含 conversationId。",
    page_LoadingUserData: "正在加载用户数据...",
    page_ErrorAlertTitle: "错误",
    page_WelcomeTitle: "欢迎来到 Two AIs",
    page_WelcomeSubtitle: "本网站可让您收听两个 LLM 之间的对话。",
    page_ApiKeysRequiredTitle: "需要 API 密钥",
    page_ApiKeysRequiredDescription: "要运行对话，您需要在登录后为您希望使用的 AI 模型（例如 OpenAI、Google、Anthropic）提供您自己的 API 密钥。登录后，可以在\"设置\"/\"API 密钥\"页面上找到每个提供商的详细说明。",
    page_SignInPrompt: "要开始您自己的会话，您可以使用标题中的链接登录或创建帐户。",
    page_VideoTitle: "Two AIs 对话演示",
    page_AvailableLLMsTitle: "当前可用的 LLM",
    page_TooltipGoogleThinkingBudget: "此 Google 模型使用\\\"思考预算\\\"。\\\"思考\\\"输出会计费，但在聊天中不可见。",
    page_TooltipAnthropicExtendedThinking: "此 Anthropic 模型使用\\\"扩展思考\\\"。\\\"思考\\\"输出会计费，但在聊天中不可见。",
    page_TooltipXaiThinking: "此 xAI 模型使用\\\"思考\\\"。此输出会计费，但在聊天中不可见。",
    page_TooltipQwenReasoning: "此 Qwen 模型使用\\\"推理/思考\\\"。此输出会计费，但在聊天中不可见。",
    page_TooltipDeepSeekReasoning: "此 DeepSeek 模型使用\\\"推理/思考\\\"。输出会计费，但在聊天中不可见。",
    page_TooltipGenericReasoning: "此模型使用推理令牌，这些令牌在聊天中不可见，但会作为输出令牌计费。",
    page_TooltipRequiresVerification: "需要经过验证的 OpenAI 组织。您可以在此处验证。",
    page_TooltipSupportsLanguage: "支持 {languageName}",
    page_TooltipMayNotSupportLanguage: "可能不支持 {languageName}",
    page_BadgePreview: "预览",
    page_BadgeExperimental: "实验性",
    page_BadgeBeta: "测试版",
    page_AvailableTTSTitle: "当前可用的 TTS",
    page_NoTTSOptions: "当前没有可用的 TTS 选项。",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "输入新的 {serviceName} API 密钥",
    apiKeyManager_TestKey: "测试密钥",
    apiKeyManager_TestingKey: "正在测试密钥...",
    apiKeyManager_KeyIsValid: "密钥有效。",
    apiKeyManager_KeyIsInvalid: "密钥无效。",
    apiKeyManager_FailedToTestKey: "未能测试密钥。",
    apiKeyManager_ErrorTestingKey: "测试密钥时出错：{error}",
    apiKeyManager_KeyProvider: "提供商",
    apiKeyManager_KeyName: "密钥名称",
    apiKeyManager_Status: "状态",
    apiKeyManager_Action: "操作",

    // Model capabilities
    modelCapability_Vision: "视觉",
    modelCapability_JSON: "JSON 模式",
    modelCapability_Tools: "工具使用",
    modelCapability_ImageGen: "图像生成",
    modelCapability_Multilingual: "多语言",
    modelCapability_WebSearch: "网络搜索",
    modelCapability_LargeContext: "大上下文",
    modelCapability_LongContext: "长上下文",
    modelCapability_FastResponse: "快速响应",
    modelCapability_CostEffective: "经济高效",
    modelCapability_AdvancedReasoning: "高级推理",
    modelCapability_Coding: "编码",
    modelCapability_Foundation: "基础模型",
    modelCapability_Experimental: "实验性",
    modelCapability_Beta: "测试版",
    modelCapability_Preview: "预览",
    modelCapability_RequiresVerification: "需要验证",
    modelCapability_RequiresAccount: "需要帐户",

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