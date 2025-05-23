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
            theme: '主题',
            light: '浅色',
            dark: '深色',
            system: '系统',
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
            getKeyInstructions: '获取API密钥',
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
        },
        signup: {
            title: '创建账户',
            emailPlaceholder: '电子邮件',
            passwordPlaceholder: '密码（至少6个字符）',
            signUp: '注册',
            signUpWithGoogle: '使用Google注册',
            hasAccount: '已有账户？',
            signIn: '登录',
        },
        errors: {
            invalidCredentials: '无效的电子邮件或密码',
            userNotFound: '未找到用户',
            weakPassword: '密码必须至少包含6个字符',
            emailInUse: '电子邮件已被使用',
            generic: '发生错误，请重试。',
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
    },
}; 