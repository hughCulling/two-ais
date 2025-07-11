// src/lib/translations/tl.ts
const tl = {
    // Header
    header: {
        appName: 'Two AIs',
        settings: 'Mga Setting',
        signIn: 'Mag-sign In',
        signOut: 'Mag-sign Out',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabic',
        bn: 'Bengali',
        bg: 'Bulgarian',
        zh: 'Tsino',
        hr: 'Croatian',
        cs: 'Czech',
        da: 'Danish',
        nl: 'Dutch',
        en: 'Ingles',
        et: 'Estonian',
        fi: 'Finnish',
        fr: 'Pranses',
        de: 'Aleman',
        el: 'Griyego',
        iw: 'Hebreo',
        hi: 'Hindi',
        hu: 'Hungarian',
        id: 'Indonesian',
        it: 'Italyano',
        ja: 'Hapon',
        ko: 'Koreano',
        lv: 'Latvian',
        lt: 'Lithuanian',
        no: 'Norwegian',
        pl: 'Polish',
        pt: 'Portuges',
        ro: 'Romanian',
        ru: 'Ruso',
        sr: 'Serbian',
        sk: 'Slovak',
        sl: 'Slovenian',
        es: 'Espanyol',
        sw: 'Swahili',
        sv: 'Swedish',
        th: 'Thai',
        tr: 'Turko',
        uk: 'Ukrainian',
        vi: 'Biyetnames',
        mt: 'Maltese',
        bs: 'Bosnian',
        ca: 'Catalan',
        gu: 'Gujarati',
        hy: 'Armenian',
        is: 'Icelandic',
        ka: 'Georgian',
        kk: 'Kazakh',
        kn: 'Kannada',
        mk: 'Macedonian',
        ml: 'Malayalam',
        mr: 'Marathi',
        ms: 'Malay',
        my: 'Burmese',
        pa: 'Punjabi',
        so: 'Somali',
        sq: 'Albanian',
        ta: 'Tamil',
        te: 'Telugu',
        tl: 'Tagalog',
        ur: 'Urdu',
        am: 'Amharic',
        mn: 'Mongolian',
    },

    // Settings page
    settings: {
        title: 'Mga Setting',
        sections: {
            appearance: 'Hitsura',
            apiKeys: 'Mga API Key',
            language: 'Wika',
        },
        appearance: {
            theme: 'Tema',
            light: 'Maliwanag',
            dark: 'Madilim',
            system: 'Sistema',
            description: "I-customize ang itsura ng application."
        },
        language: {
            title: 'Wika',
            description: 'Pumili ng iyong gustong wika para sa interface',
            conversationLanguage: 'Wika ng Usapan',
            conversationLanguageDescription: 'Ang wikang gagamitin sa usapan ng AI ay tutugma sa iyong interface na wika',
        },
        apiKeys: {
            title: 'Mga API Key',
            description: 'Pamahalaan ang iyong mga API key para sa iba\'t ibang AI provider',
            saved: 'Nai-save',
            notSet: 'Hindi naka-set',
            setKey: 'I-set ang key',
            updateKey: 'I-update ang key',
            removeKey: 'Tanggalin ang key',
            getKeyInstructions: 'Kunin ang iyong API key',
            noNewKeys: "Walang bagong API key na inilagay para i-save.",
            unexpectedResponse: "Nakatanggap ng hindi inaasahang tugon mula sa server.",
            failedToSaveKey: "Hindi na-save ang {serviceName} key.",
            someKeysNotSaved: "May ilang API key na hindi na-save. Pakisuri ang mga detalye sa ibaba.",
            keyStatus: "status ng key...",
            apiKeySecurelySaved: "API Key na-save nang ligtas",
            confirmRemoveTitle: "Kumpirmahin ang Pag-alis",
            confirmRemoveDescription: "Sigurado ka bang gusto mong alisin ang API key para sa {serviceName}? Hindi na ito mababawi.",
            failedToRemoveKey: "Hindi natanggal ang {serviceName} key.",
            successfullyRemovedKey: "Matagumpay na natanggal ang {serviceName} key.",
            keyNotSet: "Status ng Key: Hindi naka-set",
            keySet: "Status ng Key: Naka-set",
            saveButton: "I-save ang API Key(s)"
        },
    },

    // Main page
    main: {
        title: 'Usapan ng AI',
        setupForm: {
            title: 'I-set up ang iyong usapan',
            agentA: 'Agent A',
            agentB: 'Agent B',
            model: 'Modelo',
            selectModel: 'Pumili ng modelo',
            tts: {
                title: 'Text-to-Speech',
                enable: 'I-enable ang Text-to-Speech',
                provider: 'TTS Provider',
                selectProvider: 'Pumili ng TTS provider',
                voice: 'Boses',
                selectVoice: 'Pumili ng boses',
                model: 'TTS Modelo',
                selectModel: 'Pumili ng TTS modelo',
            },
            startConversation: 'Simulan ang Usapan',
            conversationPrompt: 'Simulan ang usapan.',
        },
        conversation: {
            thinking: 'nag-iisip...',
            stop: 'Itigil',
            restart: 'Simulan Muli ang Usapan',
        },
        pricing: {
            estimatedCost: 'Tinatayang gastos',
            perMillionTokens: 'bawat milyong token',
            input: 'Input',
            output: 'Output',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Mag-sign in sa Two AIs',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Password',
            signIn: 'Mag-sign In',
            signInWithGoogle: 'Mag-sign in gamit ang Google',
            noAccount: "Wala pang account?",
            signUp: 'Mag-sign Up',
            forgotPassword: 'Nakalimutan ang password?',
            orContinueWith: "O magpatuloy gamit ang",
            signingIn: "Nag-sign in..."
        },
        signup: {
            title: 'Gumawa ng account',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Password (hindi bababa sa 6 na karakter)',
            signUp: 'Mag-sign Up',
            signUpWithGoogle: 'Mag-sign up gamit ang Google',
            hasAccount: 'May account na?',
            signIn: 'Mag-sign In',
            emailLabel: "Email address",
            confirmPasswordPlaceholder: "Kumpirmahin ang Password",
            signingUp: "Nag-sign up..."
        },
        errors: {
            invalidCredentials: 'Maling email o password',
            userNotFound: 'Hindi natagpuan ang user',
            weakPassword: 'Ang password ay dapat hindi bababa sa 6 na karakter',
            emailInUse: 'Ang email ay ginagamit na',
            generic: 'May naganap na error. Pakisubukang muli.',
            initialization: "Error sa pagsisimula. Pakisubukang muli mamaya.",
            invalidEmail: "Pakilagay ang wastong email address.",
            tooManyRequests: "Pansamantalang hindi ma-access dahil sa sobrang daming maling pag-login. Pakireset ang iyong password o subukang muli mamaya.",
            signInFailedPrefix: "Nabigong mag-sign in: ",
            unknownSignInError: "Hindi kilalang error ang naganap habang nag-sign in.",
            profileSaveFailedPrefix: "Naka-sign in, ngunit nabigong i-save ang profile data: ",
            profileCheckSaveFailedPrefix: "Naka-sign in, ngunit nabigong i-check/i-save ang profile data: ",
            accountExistsWithDifferentCredential: "May account na gamit ang email na ito sa ibang paraan ng pag-sign in.",
            googleSignInFailedPrefix: "Nabigong mag-sign in gamit ang Google: ",
            unknownGoogleSignInError: "Hindi kilalang error ang naganap habang nag-sign in gamit ang Google.",
            passwordsDoNotMatch: "Hindi tugma ang mga password.",
            accountCreatedProfileSaveFailedPrefix: "Nagawa ang account, ngunit nabigong i-save ang profile data: ",
            unknownProfileSaveError: "Hindi kilalang error ang naganap sa pag-save ng profile.",
            emailAlreadyRegistered: "Ang email address na ito ay nakarehistro na.",
            passwordTooShortSignUp: "Ang password ay dapat hindi bababa sa 6 na karakter.",
            signUpFailedPrefix: "Nabigong mag-sign up: ",
            unknownSignUpError: "Hindi kilalang error ang naganap habang nag-sign up."
        },
    },

    // Common
    common: {
        loading: 'Naglo-load...',
        error: 'Error',
        save: 'I-save',
        cancel: 'Kanselahin',
        delete: 'Tanggalin',
        confirm: 'Kumpirmahin',
        or: 'o',
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Walang API Key",
    apiKeyMissingSubtext: "Walang API key para sa provider na ito o hindi wasto. Pakilagay ito sa mga setting.",
    apiKeyNotNeeded: "Hindi Kailangan ng API Key",
    apiKeyNotNeededSubtext: "Hindi kailangan ng API key para sa libreng tier ng provider na ito o ilang mga modelo.",
    apiKeyFound: "Naka-set ang API Key",
    apiKeyFoundSubtext: "May naka-configure na API key para sa provider na ito.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Mga pangunahing chat model",
    modelCategory_Reasoning: "Mga reasoning model",
    modelCategory_CostOptimized: "Mga cost-optimized model",
    modelCategory_OlderGPT: "Mga lumang GPT model",
    modelCategory_Gemini2_5: "Gemini 2.5 Series",
    modelCategory_Gemini2_0: "Gemini 2.0 Series",
    modelCategory_Gemini1_5: "Gemini 1.5 Series",
    modelCategory_Claude3_7: "Claude 3.7 Series",
    modelCategory_Claude3_5: "Claude 3.5 Series",
    modelCategory_Claude3: "Claude 3 Series",
    modelCategory_Grok3: "Grok 3 Series",
    modelCategory_Grok3Mini: "Grok 3 Mini Series",
    modelCategory_Llama4: "Llama 4 Series",
    modelCategory_Llama3_3: "Llama 3.3 Series",
    modelCategory_Llama3_2: "Llama 3.2 Series",
    modelCategory_Llama3_1: "Llama 3.1 Series",
    modelCategory_Llama3: "Llama 3 Series",
    modelCategory_LlamaVision: "Llama Vision Models",
    modelCategory_MetaLlama: "Meta Llama Models",
    modelCategory_Gemma2: "Gemma 2 Series",
    modelCategory_Gemma: "Gemma Series",
    modelCategory_GoogleGemma: "Google Gemma Models",
    modelCategory_DeepSeekR1: "DeepSeek R1 Series",
    modelCategory_DeepSeekV3: "DeepSeek V3 Series",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill Series",
    modelCategory_DeepSeekModels: "DeepSeek Models",
    modelCategory_MistralAIModels: "Mistral AI Models",
    modelCategory_Qwen3: "Qwen3 Series",
    modelCategory_QwQwQ: "Qwen QwQ Series",
    modelCategory_Qwen2_5: "Qwen2.5 Series",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision Series",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder Series",
    modelCategory_Qwen2: "Qwen2 Series",
    modelCategory_Qwen2Vision: "Qwen2 Vision Series",
    modelCategory_QwenModels: "Qwen Models",
    modelCategory_OtherModels: "Iba pang mga modelo",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Nabigong i-load ang user data: {errorMessage}. Pakisubukang i-refresh.",
    page_ErrorUserNotFound: "Hindi natagpuan ang user. Pakisubukang mag-sign in muli.",
    page_ErrorUserApiKeyConfig: "Hindi ma-load ang configuration ng API key ng user. Pakisubukang i-refresh o tingnan ang mga setting.",
    page_ErrorStartingSessionAPI: "API Error: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Error sa pagsisimula ng session: {errorMessage}",
    page_ErrorSessionIdMissing: "Matagumpay ang API response ngunit walang conversationId.",
    page_LoadingUserData: "Naglo-load ng user data...",
    page_ErrorAlertTitle: "Error",
    page_WelcomeTitle: "Maligayang pagdating sa Two AIs",
    page_WelcomeSubtitle: "Pinapahintulutan ka ng website na ito na pakinggan ang usapan ng dalawang LLM.",
    page_ApiKeysRequiredTitle: "Kailangan ng API Key",
    page_ApiKeysRequiredDescription: "Para makapagpatakbo ng usapan, kailangan mong magbigay ng sarili mong API key para sa mga AI model na gusto mong gamitin (hal. OpenAI, Google, Anthropic) pagkatapos mag-sign in. Makikita ang detalyadong instruksyon para sa bawat provider sa Settings / API Keys page pagkatapos mag-sign in.",
    page_SignInPrompt: "Para simulan ang sarili mong session, maaari kang mag-sign in o gumawa ng account gamit ang link sa header.",
    page_VideoTitle: "Demo ng Usapan ng Two AIs",
    page_AvailableLLMsTitle: "Mga Available na LLM",
    page_TooltipGoogleThinkingBudget: "Ang Google model na ito ay gumagamit ng 'thinking budget'. Ang 'thinking' output ay binibilang ngunit hindi makikita sa chat.",
    page_TooltipAnthropicExtendedThinking: "Ang Anthropic model na ito ay gumagamit ng 'extended thinking'. Ang 'thinking' output ay binibilang ngunit hindi makikita sa chat.",
    page_TooltipXaiThinking: "Ang xAI model na ito ay gumagamit ng 'thinking'. Ang output na ito ay binibilang ngunit hindi makikita sa chat.",
    page_TooltipQwenReasoning: "Ang Qwen model na ito ay gumagamit ng 'reasoning/thinking'. Ang output na ito ay binibilang ngunit hindi makikita sa chat.",
    page_TooltipDeepSeekReasoning: "Ang DeepSeek model na ito ay gumagamit ng 'reasoning/thinking'. Ang output ay binibilang ngunit hindi makikita sa chat.",
    page_TooltipGenericReasoning: "Ang modelong ito ay gumagamit ng reasoning tokens na hindi makikita sa chat ngunit binibilang bilang output tokens.",
    page_TooltipRequiresVerification: "Kailangan ng verified na OpenAI organization. Maaari kang mag-verify dito.",
    page_TooltipSupportsLanguage: "Sinusuportahan ang {languageName}",
    page_TooltipMayNotSupportLanguage: "Maaaring hindi ganap na suportado ng modelong ito ang {languageName} para sa usapan.",
    page_BadgePreview: "Preview",
    page_BadgeExperimental: "Eksperimental",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "Mga Available na TTS",
    page_NoTTSOptions: "Walang available na TTS options sa ngayon.",
    page_TruncatableNoteFormat: "Tandaan: {noteText}",

    // Text To Speech specific voice names (if needed globally)
    ttsVoice_Ugne: "Ugne", // Lithuanian voice name, added for consistency

    // --------------- END OF FILE --------------- 
};
export default tl; 