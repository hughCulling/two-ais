// src/lib/translations/hi.ts
export const hi = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'सेटिंग्स',
        signIn: 'साइन इन करें',
        signOut: 'साइन आउट करें',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'अरबी',
        bn: 'बंगाली',
        bg: 'बल्गेरियाई',
        zh: 'चीनी',
        hr: 'क्रोएशियाई',
        cs: 'चेक',
        da: 'डेनिश',
        nl: 'डच',
        en: 'अंग्रे़ी',
        et: 'एस्टोनियाई',
        fi: 'फिनिश',
        fr: 'फ्रेंच',
        de: 'जर्मन',
        el: 'यूनानी',
        iw: 'हिब्रू',
        hi: 'हिन्दी',
        hu: 'हंगेरियन',
        id: 'इंडोनेशियाई',
        it: 'इतालवी',
        ja: 'जापानी',
        ko: 'कोरियाई',
        lv: 'लातवियाई',
        lt: 'लिथुआनियाई',
        no: 'नॉर्वेजियन',
        pl: 'पोलिश',
        pt: 'पुर्तगाली',
        ro: 'रोमानियाई',
        ru: 'रूसी',
        sr: 'सर्बियाई',
        sk: 'स्लोवाक',
        sl: 'स्लोवेनियाई',
        es: 'स्पेनिश',
        sw: 'स्वाहिली',
        sv: 'स्वीडिश',
        th: 'थाई',
        tr: 'तुर्की',
        uk: 'यूक्रेनी',
        vi: 'वियतनामी',
        mt: 'मालटिस्',
        bs: 'बोस्नियाई',
        ca: 'कैटलन',
        gu: 'गुजराती',
        hy: 'अर्मेनियाई',
        is: 'आइसलैंडिक',
        ka: 'जॉर्जियाई',
        kk: 'कज़ाख',
        kn: 'कन्नड़',
        mk: 'मेसीडोनियन',
        ml: 'मलयालम',
        mr: 'मराठी',
        ms: 'मलय',
        my: 'बर्मी',
        pa: 'पंजाबी',
        so: 'सोमाली',
        sq: 'अल्बानियाई',
        ta: 'तमिल',
        te: 'तेलुगु',
        tl: 'तागालोग',
        ur: 'उर्दू',
        am: 'अम्हारिक',
        mn: 'मंगोलियाई',
    },

    // Settings page
    settings: {
        title: 'सेटिंग्स',
        sections: {
            appearance: 'दिखावट',
            apiKeys: 'API कुंजी',
            language: 'भाषा',
        },
        appearance: {
            theme: 'थीम',
            light: 'हल्का',
            dark: 'गहरा',
            system: 'सिस्टम',
            description: "एप्लिकेशन की दिखावट और अनुभव को अनुकूलित करें।"
        },
        language: {
            title: 'भाषा',
            description: 'इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें',
            conversationLanguage: 'वार्तालाप भाषा',
            conversationLanguageDescription: 'AI वार्तालापों के लिए उपयोग की जाने वाली भाषा आपकी इंटरफ़ेस भाषा से मेल खाएगी',
        },
        apiKeys: {
            title: 'API कुंजी',
            description: 'विभिन्न AI प्रदाताओं के लिए अपनी API कुंजियों का प्रबंधन करें',
            saved: 'सहेजा गया',
            notSet: 'सेट नहीं है',
            setKey: 'कुंजी सेट करें',
            updateKey: 'कुंजी अपडेट करें',
            removeKey: 'कुंजी निकालें',
            getKeyInstructions: 'अपनी API कुंजी प्राप्त करें',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "सहेजने के लिए कोई नई API कुंजी दर्ज नहीं की गई है।",
            unexpectedResponse: "सर्वर से एक अप्रत्याशित प्रतिक्रिया मिली।",
            failedToSaveKey: "{serviceName} कुंजी सहेजने में विफल।",
            someKeysNotSaved: "कुछ API कुंजियाँ सहेजी नहीं जा सकीं। कृपया नीचे विवरण देखें।",
            keyStatus: "कुंजी स्थिति...",
            apiKeySecurelySaved: "API कुंजी सुरक्षित रूप से सहेजी गई",
            confirmRemoveTitle: "हटाने की पुष्टि करें",
            confirmRemoveDescription: "क्या आप वाकई {serviceName} के लिए API कुंजी हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।",
            failedToRemoveKey: "{serviceName} कुंजी हटाने में विफल।",
            successfullyRemovedKey: "{serviceName} कुंजी सफलतापूर्वक हटा दी गई।",
            keyNotSet: "कुंजी स्थिति: सेट नहीं है",
            keySet: "कुंजी स्थिति: सेट है",
            saveButton: "API कुंजी सहेजें"
        },
    },

    // Main page
    main: {
        title: 'AI वार्तालाप',
        setupForm: {
            title: 'अपनी बातचीत सेट करें',
            agentA: 'एजेंट A',
            agentB: 'एजेंट B',
            model: 'मॉडल',
            selectModel: 'एक मॉडल चुनें',
            tts: {
                title: 'पाठ से भाषण',
                enable: 'पाठ से भाषण सक्षम करें',
                provider: 'TTS प्रदाता',
                selectProvider: 'TTS प्रदाता चुनें',
                voice: 'आवाज',
                selectVoice: 'आवाज चुनें',
                model: 'TTS मॉडल',
                selectModel: 'TTS मॉडल चुनें',
            },
            startConversation: 'बातचीत शुरू करें',
            conversationPrompt: 'बातचीत शुरू करें।',
        },
        conversation: {
            thinking: 'सोच रहा है...',
            stop: 'रोकें',
            restart: 'बातचीत पुनः आरंभ करें',
        },
        pricing: {
            estimatedCost: 'अनुमानित लागत',
            perMillionTokens: 'प्रति मिलियन टोकन',
            input: 'इनपुट',
            output: 'आउटपुट',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Two AIs में साइन इन करें', // Keep brand name
            emailPlaceholder: 'ईमेल',
            passwordPlaceholder: 'पासवर्ड',
            signIn: 'साइन इन करें',
            signInWithGoogle: 'Google के साथ साइन इन करें',
            noAccount: "खाता नहीं है?",
            signUp: 'साइन अप करें',
            forgotPassword: 'पासवर्ड भूल गए?',
            orContinueWith: "या इसके साथ जारी रखें",
            signingIn: "साइन इन हो रहा है..."
        },
        signup: {
            title: 'एक खाता बनाएं',
            emailPlaceholder: 'ईमेल',
            passwordPlaceholder: 'पासवर्ड (कम से कम 6 अक्षर)',
            signUp: 'साइन अप करें',
            signUpWithGoogle: 'Google के साथ साइन अप करें',
            hasAccount: 'पहले से ही एक खाता है?',
            signIn: 'साइन इन करें',
            emailLabel: "ईमेल पता",
            confirmPasswordPlaceholder: "पासवर्ड की पुष्टि कीजिये",
            signingUp: "साइन अप हो रहा है..."
        },
        errors: {
            invalidCredentials: 'अमान्य ईमेल या पासवर्ड',
            userNotFound: 'उपयोगकर्ता नहीं मिला',
            weakPassword: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
            emailInUse: 'ईमेल पहले से ही उपयोग में है',
            generic: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
            initialization: "आरंभीकरण त्रुटि। कृपया बाद में पुनः प्रयास करें।",
            invalidEmail: "कृपया एक मान्य ईमेल पता दर्ज करें।",
            tooManyRequests: "बहुत अधिक असफल लॉगिन प्रयासों के कारण एक्सेस अस्थायी रूप से अक्षम कर दिया गया है। कृपया अपना पासवर्ड रीसेट करें या बाद में पुनः प्रयास करें।",
            signInFailedPrefix: "साइन इन विफल: ",
            unknownSignInError: "साइन इन करते समय एक अज्ञात त्रुटि हुई।",
            profileSaveFailedPrefix: "साइन इन किया गया, लेकिन प्रोफ़ाइल डेटा सहेजने में विफल: ",
            profileCheckSaveFailedPrefix: "साइन इन किया गया, लेकिन प्रोफ़ाइल डेटा जांचने/सहेजने में विफल: ",
            accountExistsWithDifferentCredential: "इस ईमेल पते वाला एक खाता पहले से मौजूद है जो एक अलग लॉगिन विधि का उपयोग कर रहा है।",
            googleSignInFailedPrefix: "Google साइन इन विफल: ",
            unknownGoogleSignInError: "Google साइन इन करते समय एक अज्ञात त्रुटि हुई।",
            passwordsDoNotMatch: "पासवर्ड मेल नहीं खाते।",
            accountCreatedProfileSaveFailedPrefix: "खाता बनाया गया था, लेकिन प्रोफ़ाइल डेटा सहेजने में विफल: ",
            unknownProfileSaveError: "प्रोफ़ाइल सहेजते समय एक अज्ञात त्रुटि हुई।",
            emailAlreadyRegistered: "यह ईमेल पता पहले से पंजीकृत है।",
            passwordTooShortSignUp: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए।",
            signUpFailedPrefix: "साइन अप विफल: ",
            unknownSignUpError: "साइन अप करते समय एक अज्ञात त्रुटि हुई।"
        },
    },

    // Common
    common: {
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        save: 'सहेजें',
        cancel: 'रद्द करें',
        delete: 'हटाएं',
        confirm: 'पुष्टि करें',
        or: 'या'
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API कुंजी गायब है",
    apiKeyMissingSubtext: "इस प्रदाता के लिए API कुंजी गायब या अमान्य है। कृपया इसे सेटिंग्स में जोड़ें।",
    apiKeyNotNeeded: "API कुंजी की आवश्यकता नहीं है",
    apiKeyNotNeededSubtext: "इस प्रदाता को अपने मुफ्त टियर या कुछ मॉडलों के लिए API कुंजी की आवश्यकता नहीं है।",
    apiKeyFound: "API कुंजी सेट है",
    apiKeyFoundSubtext: "इस प्रदाता के लिए एक API कुंजी कॉन्फ़िगर की गई है।",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "प्रमुख चैट मॉडल",
    modelCategory_Reasoning: "तर्क मॉडल",
    modelCategory_CostOptimized: "लागत-अनुकूलित मॉडल",
    modelCategory_OlderGPT: "पुराने GPT मॉडल",
    modelCategory_Gemini2_5: "Gemini 2.5 श्रृंखला",
    modelCategory_Gemini2_0: "Gemini 2.0 श्रृंखला",
    modelCategory_Gemini1_5: "Gemini 1.5 श्रृंखला",
    modelCategory_Claude3_7: "Claude 3.7 श्रृंखला",
    modelCategory_Claude3_5: "Claude 3.5 श्रृंखला",
    modelCategory_Claude3: "Claude 3 श्रृंखला",
    modelCategory_Grok3: "Grok 3 श्रृंखला",
    modelCategory_Grok3Mini: "Grok 3 Mini श्रृंखला",
    modelCategory_Llama4: "Llama 4 श्रृंखला",
    modelCategory_Llama3_3: "Llama 3.3 श्रृंखला",
    modelCategory_Llama3_2: "Llama 3.2 श्रृंखला",
    modelCategory_Llama3_1: "Llama 3.1 श्रृंखला",
    modelCategory_Llama3: "Llama 3 श्रृंखला",
    modelCategory_LlamaVision: "Llama Vision मॉडल",
    modelCategory_MetaLlama: "Meta Llama मॉडल",
    modelCategory_Gemma2: "Gemma 2 श्रृंखला",
    modelCategory_Gemma: "Gemma श्रृंखला",
    modelCategory_GoogleGemma: "Google Gemma मॉडल",
    modelCategory_DeepSeekR1: "DeepSeek R1 श्रृंखला",
    modelCategory_DeepSeekV3: "DeepSeek V3 श्रृंखला",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill श्रृंखला",
    modelCategory_DeepSeekModels: "DeepSeek मॉडल",
    modelCategory_MistralAIModels: "Mistral AI मॉडल",
    modelCategory_Qwen3: "Qwen3 श्रृंखला",
    modelCategory_QwQwQ: "Qwen QwQ श्रृंखला",
    modelCategory_Qwen2_5: "Qwen2.5 श्रृंखला",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision श्रृंखला",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder श्रृंखला",
    modelCategory_Qwen2: "Qwen2 श्रृंखला",
    modelCategory_Qwen2Vision: "Qwen2 Vision श्रृंखला",
    modelCategory_QwenModels: "Qwen मॉडल",
    modelCategory_OtherModels: "अन्य मॉडल",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "उपयोगकर्ता डेटा लोड करने में विफल: {errorMessage}। कृपया रीफ्रेश करने का प्रयास करें।",
    page_ErrorUserNotFound: "उपयोगकर्ता नहीं मिला। कृपया पुनः साइन इन करें।",
    page_ErrorUserApiKeyConfig: "उपयोगकर्ता API कुंजी कॉन्फ़िगरेशन लोड नहीं किया जा सका। कृपया रीफ्रेश करें या सेटिंग्स जांचें।",
    page_ErrorStartingSessionAPI: "API त्रुटि: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "सत्र प्रारंभ करने में त्रुटि: {errorMessage}",
    page_ErrorSessionIdMissing: "API प्रतिक्रिया सफल रही लेकिन इसमें conversationId शामिल नहीं था।",
    page_LoadingUserData: "उपयोगकर्ता डेटा लोड हो रहा है...",
    page_ErrorAlertTitle: "त्रुटि",
    page_WelcomeTitle: "Two AIs में आपका स्वागत है",
    page_WelcomeSubtitle: "यह वेबसाइट आपको दो LLM के बीच बातचीत सुनने देती है।",
    page_ApiKeysRequiredTitle: "API कुंजी आवश्यक हैं",
    page_ApiKeysRequiredDescription: "बातचीत चलाने के लिए, आपको साइन इन करने के बाद उन AI मॉडल के लिए अपनी API कुंजी प्रदान करनी होगी जिनका आप उपयोग करना चाहते हैं (उदाहरण के लिए, OpenAI, Google, Anthropic)। प्रत्येक प्रदाता के लिए विस्तृत निर्देश साइन इन करने के बाद सेटिंग्स / API कुंजी पृष्ठ पर देखे जा सकते हैं।",
    page_SignInPrompt: "अपना स्वयं का सत्र प्रारंभ करने के लिए, आप हेडर में दिए गए लिंक का उपयोग करके साइन इन या खाता बना सकते हैं।",
    page_VideoTitle: "Two AIs वार्तालाप डेमो",
    page_AvailableLLMsTitle: "वर्तमान में उपलब्ध LLM",
    page_TooltipGoogleThinkingBudget: "यह Google मॉडल एक 'सोच बजट' का उपयोग करता है। 'सोच' आउटपुट बिल किया जाता है लेकिन चैट में दिखाई नहीं देता है।",
    page_TooltipAnthropicExtendedThinking: "यह Anthropic मॉडल 'विस्तारित सोच' का उपयोग करता है। 'सोच' आउटपुट बिल किया जाता है लेकिन चैट में दिखाई नहीं देता है।",
    page_TooltipXaiThinking: "यह xAI मॉडल 'सोच' का उपयोग करता है। यह आउटपुट बिल किया जाता है लेकिन चैट में दिखाई नहीं देता है।",
    page_TooltipQwenReasoning: "यह Qwen मॉडल 'तर्क/सोच' का उपयोग करता है। यह आउटपुट बिल किया जाता है लेकिन चैट में दिखाई नहीं देता है।",
    page_TooltipDeepSeekReasoning: "यह DeepSeek मॉडल 'तर्क/सोच' का उपयोग करता है। आउटपुट बिल किया जाता है लेकिन चैट में दिखाई नहीं देता है।",
    page_TooltipGenericReasoning: "यह मॉडल तर्क टोकन का उपयोग करता है जो चैट में दिखाई नहीं देते हैं लेकिन आउटपुट टोकन के रूप में बिल किए जाते हैं।",
    page_TooltipRequiresVerification: "सत्यापित OpenAI संगठन की आवश्यकता है। आप यहां सत्यापित कर सकते हैं।",
    page_TooltipSupportsLanguage: "{languageName} का समर्थन करता है",
    page_TooltipMayNotSupportLanguage: "यह मॉडल बातचीत के लिए {languageName} का पूरी तरह से समर्थन नहीं कर सकता है।",
    page_BadgePreview: "पूर्वावलोकन",
    page_BadgeExperimental: "प्रयोगात्मक",
    page_BadgeBeta: "बीटा",
    page_AvailableTTSTitle: "वर्तमान में उपलब्ध TTS",
    page_NoTTSOptions: "वर्तमान में कोई TTS विकल्प उपलब्ध नहीं है।",
    page_TruncatableNoteFormat: "ध्यान दें: {noteText}",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "नई {serviceName} API कुंजी दर्ज करें",
    apiKeyManager_TestKey: "कुंजी का परीक्षण करें",
    apiKeyManager_TestingKey: "कुंजी का परीक्षण किया जा रहा है...",
    apiKeyManager_KeyIsValid: "कुंजी मान्य है।",
    apiKeyManager_KeyIsInvalid: "कुंजी अमान्य है।",
    apiKeyManager_FailedToTestKey: "कुंजी का परीक्षण करने में विफल।",
    apiKeyManager_ErrorTestingKey: "कुंजी का परीक्षण करते समय त्रुटि: {error}",
    apiKeyManager_KeyProvider: "प्रदाता",
    apiKeyManager_KeyName: "कुंजी का नाम",
    apiKeyManager_Status: "स्थिति",
    apiKeyManager_Action: "कार्रवाई",

    // Model capabilities
    modelCapability_Vision: "दृष्टि",
    modelCapability_JSON: "JSON मोड",
    modelCapability_Tools: "उपकरण का उपयोग",
    modelCapability_ImageGen: "छवि निर्माण",
    modelCapability_Multilingual: "बहुभाषी",
    modelCapability_WebSearch: "वेब खोज",
    modelCapability_LargeContext: "बड़ा संदर्भ",
    modelCapability_LongContext: "लंबा संदर्भ",
    modelCapability_FastResponse: "तेज़ प्रतिक्रिया",
    modelCapability_CostEffective: "लागत प्रभावी",
    modelCapability_AdvancedReasoning: "उन्नत तर्क",
    modelCapability_Coding: "कोडिंग",
    modelCapability_Foundation: "आधार मॉडल",
    modelCapability_Experimental: "प्रायोगिक",
    modelCapability_Beta: "बीटा",
    modelCapability_Preview: "पूर्वावलोकन",
    modelCapability_RequiresVerification: "सत्यापन की आवश्यकता है",
    modelCapability_RequiresAccount: "खाते की आवश्यकता है",

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