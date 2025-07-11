// src/lib/translations/ko.ts
const ko = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: '설정',
        signIn: '로그인',
        signOut: '로그아웃',
    },

    // Language names (for display in language selector)
    languages: {
        ar: '아랍어',
        bn: '벵골어',
        bg: '불가리아어',
        zh: '중국어',
        hr: '크로아티아어',
        cs: '체코어',
        da: '덴마크어',
        nl: '네덜란드어',
        en: '영어',
        et: '에스토니아어',
        fi: '핀란드어',
        fr: '프랑스어',
        de: '독일어',
        el: '그리스어',
        iw: '히브리어',
        hi: '힌디어',
        hu: '헝가리어',
        id: '인도네시아어',
        it: '이탈리아어',
        ja: '일본어',
        ko: '한국어',
        lv: '라트비아어',
        lt: '리투아니아어',
        no: '노르웨이어',
        pl: '폴란드어',
        pt: '포르투갈어',
        ro: '루마니아어',
        ru: '러시아어',
        sr: '세르비아어',
        sk: '슬로바키아어',
        sl: '슬로베니아어',
        es: '스페인어',
        sw: '스와힐리어',
        sv: '스웨덴어',
        th: '태국어',
        tr: '터키어',
        uk: '우크라이나어',
        vi: '베트남어',
        mt: '몰타어',
        bs: '보스니아어',
        ca: '카탈로니아어',
        gu: '구자라트어',
        hy: '아르메니아어',
        is: '아이슬란드어',
        ka: '조지아어',
        kk: '카자흐어',
        kn: '칸나다어',
        mk: '마케도니아어',
        ml: '말라얄람어',
        mr: '마라티어',
        ms: '말레이어',
        my: '버마어',
        pa: '펀자브어',
        so: '소말리어',
        sq: '알바니아어',
        ta: '타밀어',
        te: '텔루구어',
        tl: '타갈로그어',
        ur: '우르두어',
        am: '암하라어',
        mn: '몽골어',
    },

    // Settings page
    settings: {
        title: '설정',
        sections: {
            appearance: '모양',
            apiKeys: 'API 키',
            language: '언어',
        },
        appearance: {
            theme: '테마',
            light: '라이트',
            dark: '다크',
            system: '시스템',
            description: "애플리케이션의 모양과 느낌을 사용자 정의합니다."
        },
        language: {
            title: '언어',
            description: '인터페이스에 사용할 기본 언어를 선택하세요',
            conversationLanguage: '대화 언어',
            conversationLanguageDescription: 'AI 대화에 사용되는 언어는 인터페이스 언어와 일치합니다',
            signingIn: "로그인 중..."
        },
        apiKeys: {
            title: 'TRANSLATE: API Keys',
            description: 'TRANSLATE: Manage your API keys for different AI providers',
            saved: 'TRANSLATE: Saved',
            notSet: 'TRANSLATE: Not set',
            setKey: 'TRANSLATE: Set key',
            updateKey: 'TRANSLATE: Update key',
            removeKey: 'TRANSLATE: Remove key',
            getKeyInstructions: 'TRANSLATE: Get your API key',
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
        title: 'AI 대화',
        setupForm: {
            title: '대화 설정',
            agentA: '에이전트 A',
            agentB: '에이전트 B',
            model: '모델',
            selectModel: '모델 선택',
            tts: {
                title: '텍스트 음성 변환',
                enable: '텍스트 음성 변환 활성화',
                provider: 'TTS 공급자',
                selectProvider: 'TTS 공급자 선택',
                voice: '음성',
                selectVoice: '음성 선택',
                model: 'TTS 모델',
                selectModel: 'TTS 모델 선택',
            },
            startConversation: '대화 시작',
            conversationPrompt: '대화를 시작하세요.',
        },
        conversation: {
            thinking: '생각 중...',
            stop: '중지',
            restart: '대화 다시 시작',
        },
        pricing: {
            estimatedCost: '예상 비용',
            perMillionTokens: '백만 토큰당',
            input: '입력',
            output: '출력',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Two AIs에 로그인', // Keep brand name
            emailPlaceholder: '이메일',
            passwordPlaceholder: '비밀번호',
            signIn: '로그인',
            signInWithGoogle: 'Google 계정으로 로그인',
            noAccount: "계정이 없으신가요?",
            signUp: '가입하기',
            forgotPassword: '비밀번호를 잊으셨나요?',
            orContinueWith: "또는 다음으로 계속",
            signingIn: "로그인 중..."
        },
        signup: {
            title: '계정 만들기',
            emailPlaceholder: '이메일',
            passwordPlaceholder: '비밀번호 (6자 이상)',
            signUp: '가입하기',
            signUpWithGoogle: 'Google 계정으로 가입하기',
            hasAccount: '이미 계정이 있으신가요?',
            signIn: '로그인',
            emailLabel: "이메일 주소",
            confirmPasswordPlaceholder: "비밀번호 확인",
            signingUp: "가입 중..."
        },
        errors: {
            invalidCredentials: '잘못된 이메일 또는 비밀번호입니다',
            userNotFound: '사용자를 찾을 수 없습니다',
            weakPassword: '비밀번호는 6자 이상이어야 합니다',
            emailInUse: '이미 사용 중인 이메일입니다',
            generic: '오류가 발생했습니다. 다시 시도해 주세요.',
            initialization: "초기화 오류입니다. 나중에 다시 시도하십시오.",
            invalidEmail: "유효한 이메일 주소를 입력하십시오.",
            tooManyRequests: "로그인 시도 실패 횟수가 너무 많아 액세스가 일시적으로 비활성화되었습니다. 비밀번호를 재설정하거나 나중에 다시 시도하십시오.",
            signInFailedPrefix: "로그인 실패: ",
            unknownSignInError: "로그인 중 알 수 없는 오류가 발생했습니다.",
            profileSaveFailedPrefix: "로그인했지만 프로필 데이터 저장에 실패했습니다: ",
            profileCheckSaveFailedPrefix: "로그인했지만 프로필 데이터 확인/저장에 실패했습니다: ",
            accountExistsWithDifferentCredential: "이 이메일을 사용하는 계정이 다른 로그인 방법으로 이미 존재합니다.",
            googleSignInFailedPrefix: "Google 로그인 실패: ",
            unknownGoogleSignInError: "Google 로그인 중 알 수 없는 오류가 발생했습니다.",
            passwordsDoNotMatch: "비밀번호가 일치하지 않습니다.",
            accountCreatedProfileSaveFailedPrefix: "계정이 생성되었지만 프로필 데이터 저장에 실패했습니다: ",
            unknownProfileSaveError: "프로필 저장 중 알 수 없는 오류가 발생했습니다.",
            emailAlreadyRegistered: "이 이메일 주소는 이미 등록되었습니다.",
            passwordTooShortSignUp: "비밀번호는 6자 이상이어야 합니다.",
            signUpFailedPrefix: "가입 실패: ",
            unknownSignUpError: "가입 중 알 수 없는 오류가 발생했습니다."
        },
    },

    // Common
    common: {
        loading: '로드 중...',
        error: '오류',
        save: '저장',
        cancel: '취소',
        delete: '삭제',
        confirm: '확인',
        or: '또는',
        MoreInformation: "더 많은 정보",
        Example: "예시:",
        ShowMore: "더 보기",
        ShowLess: "간략히 보기",
        AwaitingApproval: "승인 대기 중...",
        OpenInNewTab: "새 탭에서 열기",
        AdvancedSettings: "고급 설정",
        Name: "이름",
        Created: "생성됨",
        Updated: "업데이트됨",
        Launched: "출시됨",
        Docs: "문서",
        Blog: "블로그",
        Pricing: "가격",
        Terms: "약관",
        Privacy: "개인정보 보호",
        Changelog: "변경 로그",
        Copy: "복사",
        Copied: "복사됨",
        TryAgain: "다시 시도"
    },
    page_TruncatableNoteFormat: "({noteText})",

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "API 키 누락",
    apiKeyMissingSubtext: "이 공급자의 API 키가 없거나 유효하지 않습니다. 설정에서 추가하십시오.",
    apiKeyNotNeeded: "API 키 필요 없음",
    apiKeyNotNeededSubtext: "이 공급자는 무료 등급 또는 특정 모델에 API 키가 필요하지 않습니다.",
    apiKeyFound: "API 키 설정됨",
    apiKeyFoundSubtext: "이 공급자에 대한 API 키가 구성되었습니다.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "플래그십 채팅 모델",
    modelCategory_Reasoning: "추론 모델",
    modelCategory_CostOptimized: "비용 최적화 모델",
    modelCategory_OlderGPT: "이전 GPT 모델",
    modelCategory_Gemini2_5: "Gemini 2.5 시리즈",
    modelCategory_Gemini2_0: "Gemini 2.0 시리즈",
    modelCategory_Gemini1_5: "Gemini 1.5 시리즈",
    modelCategory_Claude3_7: "Claude 3.7 시리즈",
    modelCategory_Claude3_5: "Claude 3.5 시리즈",
    modelCategory_Claude3: "Claude 3 시리즈",
    modelCategory_Grok3: "Grok 3 시리즈",
    modelCategory_Grok3Mini: "Grok 3 Mini 시리즈",
    modelCategory_Llama4: "Llama 4 시리즈",
    modelCategory_Llama3_3: "Llama 3.3 시리즈",
    modelCategory_Llama3_2: "Llama 3.2 시리즈",
    modelCategory_Llama3_1: "Llama 3.1 시리즈",
    modelCategory_Llama3: "Llama 3 시리즈",
    modelCategory_LlamaVision: "Llama Vision 모델",
    modelCategory_MetaLlama: "Meta Llama 모델",
    modelCategory_Gemma2: "Gemma 2 시리즈",
    modelCategory_Gemma: "Gemma 시리즈",
    modelCategory_GoogleGemma: "Google Gemma 모델",
    modelCategory_DeepSeekR1: "DeepSeek R1 시리즈",
    modelCategory_DeepSeekV3: "DeepSeek V3 시리즈",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distill 시리즈",
    modelCategory_DeepSeekModels: "DeepSeek 모델",
    modelCategory_MistralAIModels: "Mistral AI 모델",
    modelCategory_Qwen3: "Qwen3 시리즈",
    modelCategory_QwQwQ: "Qwen QwQ 시리즈",
    modelCategory_Qwen2_5: "Qwen2.5 시리즈",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Vision 시리즈",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coder 시리즈",
    modelCategory_Qwen2: "Qwen2 시리즈",
    modelCategory_Qwen2Vision: "Qwen2 Vision 시리즈",
    modelCategory_QwenModels: "Qwen 모델",
    modelCategory_OtherModels: "기타 모델",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "사용자 데이터 로드 실패: {errorMessage}. 새로고침해 보십시오.",
    page_ErrorUserNotFound: "사용자를 찾을 수 없습니다. 다시 로그인하십시오.",
    page_ErrorUserApiKeyConfig: "사용자 API 키 구성을 로드할 수 없습니다. 새로고침하거나 설정을 확인하십시오.",
    page_ErrorStartingSessionAPI: "API 오류: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "세션 시작 오류: {errorMessage}",
    page_ErrorSessionIdMissing: "API 응답은 성공했지만 conversationId가 포함되지 않았습니다.",
    page_LoadingUserData: "사용자 데이터 로드 중...",
    page_ErrorAlertTitle: "오류",
    page_WelcomeTitle: "Two AIs에 오신 것을 환영합니다",
    page_WelcomeSubtitle: "이 웹사이트에서는 두 LLM 간의 대화를 들을 수 있습니다.",
    page_ApiKeysRequiredTitle: "API 키 필요",
    page_ApiKeysRequiredDescription: "대화를 실행하려면 로그인 후 사용하려는 AI 모델(예: OpenAI, Google, Anthropic)에 대한 자체 API 키를 제공해야 합니다. 각 공급자에 대한 자세한 지침은 로그인 후 설정/API 키 페이지에서 찾을 수 있습니다.",
    page_SignInPrompt: "자신의 세션을 시작하려면 헤더의 링크를 사용하여 로그인하거나 계정을 만들 수 있습니다.",
    page_VideoTitle: "Two AIs 대화 데모",
    page_AvailableLLMsTitle: "현재 사용 가능한 LLM",
    page_TooltipGoogleThinkingBudget: "이 Google 모델은 '사고 예산'을 사용합니다. '사고' 출력은 청구되지만 채팅에는 표시되지 않습니다.",
    page_TooltipAnthropicExtendedThinking: "이 Anthropic 모델은 '확장 사고'를 사용합니다. '사고' 출력은 청구되지만 채팅에는 표시되지 않습니다.",
    page_TooltipXaiThinking: "이 xAI 모델은 '사고'를 사용합니다. 이 출력은 청구되지만 채팅에는 표시되지 않습니다.",
    page_TooltipQwenReasoning: "이 Qwen 모델은 '추론/사고'를 사용합니다. 이 출력은 청구되지만 채팅에는 표시되지 않습니다.",
    page_TooltipDeepSeekReasoning: "이 DeepSeek 모델은 '추론/사고'를 사용합니다. 출력은 청구되지만 채팅에는 표시되지 않습니다.",
    page_TooltipGenericReasoning: "이 모델은 채팅에는 표시되지 않지만 출력 토큰으로 청구되는 추론 토큰을 사용합니다.",
    page_TooltipRequiresVerification: "확인된 OpenAI 조직이 필요합니다. 여기에서 확인할 수 있습니다.",
    page_TooltipSupportsLanguage: "{languageName}을 지원합니다",
    page_TooltipMayNotSupportLanguage: "{languageName}을 지원하지 않을 수 있습니다",
    page_BadgePreview: "미리보기",
    page_BadgeExperimental: "실험적",
    page_BadgeBeta: "베타",
    page_AvailableTTSTitle: "현재 사용 가능한 TTS",
    page_NoTTSOptions: "현재 사용 가능한 TTS 옵션이 없습니다.",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "새 {serviceName} API 키 입력",
    apiKeyManager_TestKey: "키 테스트",
    apiKeyManager_TestingKey: "키 테스트 중...",
    apiKeyManager_KeyIsValid: "키가 유효합니다.",
    apiKeyManager_KeyIsInvalid: "키가 유효하지 않습니다.",
    apiKeyManager_FailedToTestKey: "키 테스트 실패.",
    apiKeyManager_ErrorTestingKey: "키 테스트 중 오류: {error}",
    apiKeyManager_KeyProvider: "공급자",
    apiKeyManager_KeyName: "키 이름",
    apiKeyManager_Status: "상태",
    apiKeyManager_Action: "작업",

    // Model capabilities
    modelCapability_Vision: "비전",
    modelCapability_JSON: "JSON 모드",
    modelCapability_Tools: "도구 사용",
    modelCapability_ImageGen: "이미지 생성",
    modelCapability_Multilingual: "다국어",
    modelCapability_WebSearch: "웹 검색",
    modelCapability_LargeContext: "대규모 컨텍스트",
    modelCapability_LongContext: "장문 컨텍스트",
    modelCapability_FastResponse: "빠른 응답",
    modelCapability_CostEffective: "비용 효율적",
    modelCapability_AdvancedReasoning: "고급 추론",
    modelCapability_Coding: "코딩",
    modelCapability_Foundation: "기반 모델",
    modelCapability_Experimental: "실험적",
    modelCapability_Beta: "베타",
    modelCapability_Preview: "미리보기",
    modelCapability_RequiresVerification: "확인 필요",
    modelCapability_RequiresAccount: "계정 필요",

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
export default ko; 