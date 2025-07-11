// src/lib/translations/vi.ts
const vi = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Cài đặt',
        signIn: 'Đăng nhập',
        signOut: 'Đăng xuất',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Arabic',
        bn: 'Bengali',
        bg: 'Bulgarian',
        zh: 'Chinese',
        hr: 'Croatian',
        cs: 'Czech',
        da: 'Danish',
        nl: 'Dutch',
        en: 'English',
        et: 'Estonian',
        fi: 'Finnish',
        fr: 'French',
        de: 'German',
        el: 'Greek',
        iw: 'Hebrew',
        hi: 'Hindi',
        hu: 'Hungarian',
        id: 'Indonesian',
        it: 'Italian',
        ja: 'Japanese',
        ko: 'Korean',
        lv: 'Latvian',
        lt: 'Lithuanian',
        no: 'Norwegian',
        pl: 'Polish',
        pt: 'Portuguese',
        ro: 'Romanian',
        ru: 'Russian',
        sr: 'Serbian',
        sk: 'Slovak',
        sl: 'Slovenian',
        es: 'Spanish',
        sw: 'Swahili',
        sv: 'Swedish',
        th: 'Thai',
        tr: 'Turkish',
        uk: 'Ukrainian',
        vi: 'Vietnamese',
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
        title: 'Cài đặt',
        sections: {
            appearance: 'Giao diện',
            apiKeys: 'Khóa API',
            language: 'Ngôn ngữ',
        },
        appearance: {
            theme: 'Chủ đề',
            light: 'Sáng',
            dark: 'Tối',
            system: 'Hệ thống',
            description: "Tùy chỉnh giao diện và trải nghiệm của ứng dụng."
        },
        language: {
            title: 'Ngôn ngữ',
            description: 'Chọn ngôn ngữ ưa thích của bạn cho giao diện',
            conversationLanguage: 'Ngôn ngữ trò chuyện',
            conversationLanguageDescription: 'Ngôn ngữ được sử dụng cho các cuộc trò chuyện AI sẽ khớp với ngôn ngữ giao diện của bạn',
        },
        apiKeys: {
            title: 'Khóa API',
            description: 'Quản lý khóa API của bạn cho các nhà cung cấp AI khác nhau',
            saved: 'Đã lưu',
            notSet: 'Chưa đặt',
            setKey: 'Đặt khóa',
            updateKey: 'Cập nhật khóa',
            removeKey: 'Xóa khóa',
            getKeyInstructions: 'Lấy khóa API của bạn',
            // --- New keys for ApiKeyManager.tsx ---
            noNewKeys: "Không có khóa API mới nào được nhập để lưu.",
            unexpectedResponse: "Đã nhận được phản hồi không mong muốn từ máy chủ.",
            failedToSaveKey: "Không thể lưu khóa {serviceName}.",
            someKeysNotSaved: "Một số khóa API không thể lưu. Vui lòng kiểm tra chi tiết bên dưới.",
            keyStatus: "trạng thái khóa...",
            apiKeySecurelySaved: "Khóa API đã được lưu an toàn",
            confirmRemoveTitle: "Xác nhận xóa",
            confirmRemoveDescription: "Bạn có chắc chắn muốn xóa khóa API cho {serviceName} không? Hành động này không thể hoàn tác.",
            failedToRemoveKey: "Không thể xóa khóa {serviceName}.",
            successfullyRemovedKey: "Đã xóa thành công khóa {serviceName}.",
            keyNotSet: "Trạng thái khóa: Chưa đặt",
            keySet: "Trạng thái khóa: Đã đặt",
            saveButton: "Lưu (các) khóa API"
        },
    },

    // Main page
    main: {
        title: 'Trò chuyện AI',
        setupForm: {
            title: 'Thiết lập cuộc trò chuyện của bạn',
            agentA: 'Tác nhân A',
            agentB: 'Tác nhân B',
            model: 'Mô hình',
            selectModel: 'Chọn một mô hình',
            tts: {
                title: 'Chuyển văn bản thành giọng nói',
                enable: 'Bật chuyển văn bản thành giọng nói',
                provider: 'Nhà cung cấp TTS',
                selectProvider: 'Chọn nhà cung cấp TTS',
                voice: 'Giọng nói',
                selectVoice: 'Chọn giọng nói',
                model: 'Mô hình TTS',
                selectModel: 'Chọn mô hình TTS',
            },
            startConversation: 'Bắt đầu cuộc trò chuyện',
            conversationPrompt: 'Bắt đầu cuộc trò chuyện.',
        },
        conversation: {
            thinking: 'đang suy nghĩ...',
            stop: 'Dừng',
            restart: 'Khởi động lại cuộc trò chuyện',
        },
        pricing: {
            estimatedCost: 'Chi phí ước tính',
            perMillionTokens: 'trên mỗi triệu token',
            input: 'Đầu vào',
            output: 'Đầu ra',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Đăng nhập vào Two AIs', // Keep brand name
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Mật khẩu',
            signIn: 'Đăng nhập',
            signInWithGoogle: 'Đăng nhập bằng Google',
            noAccount: "Chưa có tài khoản?",
            signUp: 'Đăng ký',
            forgotPassword: 'Quên mật khẩu?',
            orContinueWith: "Hoặc tiếp tục với",
            signingIn: "Đang đăng nhập..."
        },
        signup: {
            title: 'Tạo tài khoản',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Mật khẩu (ít nhất 6 ký tự)',
            signUp: 'Đăng ký',
            signUpWithGoogle: 'Đăng ký bằng Google',
            hasAccount: 'Đã có tài khoản?',
            signIn: 'Đăng nhập',
            emailLabel: "Địa chỉ email",
            confirmPasswordPlaceholder: "Xác nhận mật khẩu",
            signingUp: "Đang đăng ký..."
        },
        errors: {
            invalidCredentials: 'Email hoặc mật khẩu không hợp lệ',
            userNotFound: 'Không tìm thấy người dùng',
            weakPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
            emailInUse: 'Email đã được sử dụng',
            generic: 'Đã xảy ra lỗi. Vui lòng thử lại.',
            initialization: "Lỗi khởi tạo. Vui lòng thử lại sau.",
            invalidEmail: "Vui lòng nhập địa chỉ email hợp lệ.",
            tooManyRequests: "Quyền truy cập đã tạm thời bị vô hiệu hóa do có quá nhiều lần đăng nhập không thành công. Vui lòng đặt lại mật khẩu của bạn hoặc thử lại sau.",
            signInFailedPrefix: "Đăng nhập thất bại: ",
            unknownSignInError: "Đã xảy ra lỗi không xác định khi đăng nhập.",
            profileSaveFailedPrefix: "Đã đăng nhập, nhưng không thể lưu dữ liệu hồ sơ: ",
            profileCheckSaveFailedPrefix: "Đã đăng nhập, nhưng không thể kiểm tra/lưu dữ liệu hồ sơ: ",
            accountExistsWithDifferentCredential: "Một tài khoản có địa chỉ email này đã tồn tại bằng một phương thức đăng nhập khác.",
            googleSignInFailedPrefix: "Đăng nhập bằng Google thất bại: ",
            unknownGoogleSignInError: "Đã xảy ra lỗi không xác định khi đăng nhập bằng Google.",
            passwordsDoNotMatch: "Mật khẩu không khớp.",
            accountCreatedProfileSaveFailedPrefix: "Tài khoản đã được tạo, nhưng không thể lưu dữ liệu hồ sơ: ",
            unknownProfileSaveError: "Đã xảy ra lỗi không xác định khi lưu hồ sơ.",
            emailAlreadyRegistered: "Địa chỉ email này đã được đăng ký.",
            passwordTooShortSignUp: "Mật khẩu phải có ít nhất 6 ký tự.",
            signUpFailedPrefix: "Đăng ký thất bại: ",
            unknownSignUpError: "Đã xảy ra lỗi không xác định khi đăng ký."
        },
    },

    // Common
    common: {
        loading: 'Đang tải...',
        error: 'Lỗi',
        save: 'Lưu',
        cancel: 'Hủy',
        delete: 'Xóa',
        confirm: 'Xác nhận',
        or: 'hoặc',
        MoreInformation: "Thêm thông tin",
        Example: "Ví dụ:",
        ShowMore: "Hiển thị thêm",
        ShowLess: "Hiển thị ít hơn",
        AwaitingApproval: "Đang chờ phê duyệt...",
        OpenInNewTab: "Mở trong tab mới",
        AdvancedSettings: "Cài đặt nâng cao",
        Name: "Tên",
        Created: "Đã tạo",
        Updated: "Đã cập nhật",
        Launched: "Đã khởi chạy",
        Docs: "Tài liệu",
        Blog: "Blog",
        Pricing: "Giá cả",
        Terms: "Điều khoản",
        Privacy: "Quyền riêng tư",
        Changelog: "Nhật ký thay đổi",
        Copy: "Sao chép",
        Copied: "Đã sao chép",
        TryAgain: "Thử lại"
    },

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "Thiếu khóa API",
    apiKeyMissingSubtext: "Khóa API cho nhà cung cấp này bị thiếu hoặc không hợp lệ. Vui lòng thêm khóa trong cài đặt.",
    apiKeyNotNeeded: "Không cần khóa API",
    apiKeyNotNeededSubtext: "Nhà cung cấp này không yêu cầu khóa API cho bậc miễn phí hoặc một số mô hình nhất định.",
    apiKeyFound: "Đã đặt khóa API",
    apiKeyFoundSubtext: "Một khóa API đã được định cấu hình cho nhà cung cấp này.",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "Các mô hình trò chuyện hàng đầu",
    modelCategory_Reasoning: "Các mô hình suy luận",
    modelCategory_CostOptimized: "Các mô hình được tối ưu hóa chi phí",
    modelCategory_OlderGPT: "Các mô hình GPT cũ hơn",
    modelCategory_Gemini2_5: "Sê-ri Gemini 2.5",
    modelCategory_Gemini2_0: "Sê-ri Gemini 2.0",
    modelCategory_Gemini1_5: "Sê-ri Gemini 1.5",
    modelCategory_Claude3_7: "Sê-ri Claude 3.7",
    modelCategory_Claude3_5: "Sê-ri Claude 3.5",
    modelCategory_Claude3: "Sê-ri Claude 3",
    modelCategory_Grok3: "Sê-ri Grok 3",
    modelCategory_Grok3Mini: "Sê-ri Grok 3 Mini",
    modelCategory_Llama4: "Sê-ri Llama 4",
    modelCategory_Llama3_3: "Sê-ri Llama 3.3",
    modelCategory_Llama3_2: "Sê-ri Llama 3.2",
    modelCategory_Llama3_1: "Sê-ri Llama 3.1",
    modelCategory_Llama3: "Sê-ri Llama 3",
    modelCategory_LlamaVision: "Các mô hình Llama Vision",
    modelCategory_MetaLlama: "Các mô hình Meta Llama",
    modelCategory_Gemma2: "Sê-ri Gemma 2",
    modelCategory_Gemma: "Sê-ri Gemma",
    modelCategory_GoogleGemma: "Các mô hình Google Gemma",
    modelCategory_DeepSeekR1: "Sê-ri DeepSeek R1",
    modelCategory_DeepSeekV3: "Sê-ri DeepSeek V3",
    modelCategory_DeepSeekR1Distill: "Sê-ri DeepSeek R1 Distill",
    modelCategory_DeepSeekModels: "Các mô hình DeepSeek",
    modelCategory_MistralAIModels: "Các mô hình Mistral AI",
    modelCategory_Qwen3: "Sê-ri Qwen3",
    modelCategory_QwQwQ: "Sê-ri Qwen QwQ",
    modelCategory_Qwen2_5: "Sê-ri Qwen2.5",
    modelCategory_Qwen2_5Vision: "Sê-ri Qwen2.5 Vision",
    modelCategory_Qwen2_5Coder: "Sê-ri Qwen2.5 Coder",
    modelCategory_Qwen2: "Sê-ri Qwen2",
    modelCategory_Qwen2Vision: "Sê-ri Qwen2 Vision",
    modelCategory_QwenModels: "Các mô hình Qwen",
    modelCategory_OtherModels: "Các mô hình khác",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "Không thể tải dữ liệu người dùng: {errorMessage}. Vui lòng thử làm mới.",
    page_ErrorUserNotFound: "Không tìm thấy người dùng. Vui lòng đăng nhập lại.",
    page_ErrorUserApiKeyConfig: "Không thể tải cấu hình khóa API người dùng. Vui lòng làm mới hoặc kiểm tra cài đặt.",
    page_ErrorStartingSessionAPI: "Lỗi API: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "Lỗi khi bắt đầu phiên: {errorMessage}",
    page_ErrorSessionIdMissing: "Phản hồi API thành công nhưng không bao gồm conversationId.",
    page_LoadingUserData: "Đang tải dữ liệu người dùng...",
    page_ErrorAlertTitle: "Lỗi",
    page_WelcomeTitle: "Chào mừng đến với Two AIs",
    page_WelcomeSubtitle: "Trang web này cho phép bạn nghe các cuộc trò chuyện giữa hai LLM.",
    page_ApiKeysRequiredTitle: "Yêu cầu khóa API",
    page_ApiKeysRequiredDescription: "Để chạy các cuộc trò chuyện, bạn cần cung cấp khóa API của riêng mình cho các mô hình AI mà bạn muốn sử dụng (ví dụ: OpenAI, Google, Anthropic) sau khi đăng nhập. Hướng dẫn chi tiết cho từng nhà cung cấp có thể được tìm thấy trên trang Cài đặt / Khóa API sau khi đăng nhập.",
    page_SignInPrompt: "Để bắt đầu phiên của riêng bạn, bạn có thể đăng nhập hoặc tạo tài khoản bằng liên kết trong tiêu đề.",
    page_VideoTitle: "Bản giới thiệu cuộc trò chuyện Two AIs",
    page_AvailableLLMsTitle: "Các LLM hiện có sẵn",
    page_TooltipGoogleThinkingBudget: "Mô hình Google này sử dụng \"ngân sách suy nghĩ\". Kết quả \"suy nghĩ\" được tính phí nhưng không hiển thị trong cuộc trò chuyện.",
    page_TooltipAnthropicExtendedThinking: "Mô hình Anthropic này sử dụng \"suy nghĩ mở rộng\". Kết quả \"suy nghĩ\" được tính phí nhưng không hiển thị trong cuộc trò chuyện.",
    page_TooltipXaiThinking: "Mô hình xAI này sử dụng \"suy nghĩ\". Kết quả này được tính phí nhưng không hiển thị trong cuộc trò chuyện.",
    page_TooltipQwenReasoning: "Mô hình Qwen này sử dụng \"suy luận/suy nghĩ\". Kết quả này được tính phí nhưng không hiển thị trong cuộc trò chuyện.",
    page_TooltipDeepSeekReasoning: "Mô hình DeepSeek này sử dụng \"suy luận/suy nghĩ\". Kết quả được tính phí nhưng không hiển thị trong cuộc trò chuyện.",
    page_TooltipGenericReasoning: "Mô hình này sử dụng các token suy luận không hiển thị trong cuộc trò chuyện nhưng được tính phí dưới dạng token đầu ra.",
    page_TooltipRequiresVerification: "Yêu cầu tổ chức OpenAI đã được xác minh. Bạn có thể xác minh tại đây.",
    page_TooltipSupportsLanguage: "Hỗ trợ {languageName}",
    page_TooltipMayNotSupportLanguage: "Có thể không hỗ trợ {languageName}",
    page_BadgePreview: "Xem trước",
    page_BadgeExperimental: "Thử nghiệm",
    page_BadgeBeta: "Beta",
    page_AvailableTTSTitle: "TTS hiện có sẵn",
    page_NoTTSOptions: "Hiện không có tùy chọn TTS nào.",
    page_TruncatableNoteFormat: "({noteText})",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "Nhập khóa API {serviceName} mới",
    apiKeyManager_TestKey: "Kiểm tra khóa",
    apiKeyManager_TestingKey: "Đang kiểm tra khóa...",
    apiKeyManager_KeyIsValid: "Khóa hợp lệ.",
    apiKeyManager_KeyIsInvalid: "Khóa không hợp lệ.",
    apiKeyManager_FailedToTestKey: "Không thể kiểm tra khóa.",
    apiKeyManager_ErrorTestingKey: "Lỗi khi kiểm tra khóa: {error}",
    apiKeyManager_KeyProvider: "Nhà cung cấp",
    apiKeyManager_KeyName: "Tên khóa",
    apiKeyManager_Status: "Trạng thái",
    apiKeyManager_Action: "Hành động",

    // Model capabilities
    modelCapability_Vision: "Tầm nhìn",
    modelCapability_JSON: "Chế độ JSON",
    modelCapability_Tools: "Sử dụng công cụ",
    modelCapability_ImageGen: "Tạo hình ảnh",
    modelCapability_Multilingual: "Đa ngôn ngữ",
    modelCapability_WebSearch: "Tìm kiếm trên web",
    modelCapability_LargeContext: "Ngữ cảnh lớn",
    modelCapability_LongContext: "Ngữ cảnh dài",
    modelCapability_FastResponse: "Phản hồi nhanh",
    modelCapability_CostEffective: "Hiệu quả về chi phí",
    modelCapability_AdvancedReasoning: "Suy luận nâng cao",
    modelCapability_Coding: "Mã hóa",
    modelCapability_Foundation: "Mô hình nền tảng",
    modelCapability_Experimental: "Thử nghiệm",
    modelCapability_Beta: "Beta",
    modelCapability_Preview: "Xem trước",
    modelCapability_RequiresVerification: "Yêu cầu xác minh",
    modelCapability_RequiresAccount: "Yêu cầu tài khoản",

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
export default vi; 