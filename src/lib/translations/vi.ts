// src/lib/translations/vi.ts
export const vi = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: 'Cài đặt',
        signIn: 'Đăng nhập',
        signOut: 'Đăng xuất',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'Tiếng Ả Rập',
        bn: 'Tiếng Bengali',
        bg: 'Tiếng Bulgaria',
        zh: 'Tiếng Trung',
        hr: 'Tiếng Croatia',
        cs: 'Tiếng Séc',
        da: 'Tiếng Đan Mạch',
        nl: 'Tiếng Hà Lan',
        en: 'Tiếng Anh',
        et: 'Tiếng Estonia',
        fi: 'Tiếng Phần Lan',
        fr: 'Tiếng Pháp',
        de: 'Tiếng Đức',
        el: 'Tiếng Hy Lạp',
        iw: 'Tiếng Do Thái',
        hi: 'Tiếng Hindi',
        hu: 'Tiếng Hungary',
        id: 'Tiếng Indonesia',
        it: 'Tiếng Ý',
        ja: 'Tiếng Nhật',
        ko: 'Tiếng Hàn',
        lv: 'Tiếng Latvia',
        lt: 'Tiếng Litva',
        no: 'Tiếng Na Uy',
        pl: 'Tiếng Ba Lan',
        pt: 'Tiếng Bồ Đào Nha',
        ro: 'Tiếng Romania',
        ru: 'Tiếng Nga',
        sr: 'Tiếng Serbia',
        sk: 'Tiếng Slovak',
        sl: 'Tiếng Slovenia',
        es: 'Tiếng Tây Ban Nha',
        sw: 'Tiếng Swahili',
        sv: 'Tiếng Thụy Điển',
        th: 'Tiếng Thái',
        tr: 'Tiếng Thổ Nhĩ Kỳ',
        uk: 'Tiếng Ukraina',
        vi: 'Tiếng Việt',
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
        },
        signup: {
            title: 'Tạo tài khoản',
            emailPlaceholder: 'Email',
            passwordPlaceholder: 'Mật khẩu (ít nhất 6 ký tự)',
            signUp: 'Đăng ký',
            signUpWithGoogle: 'Đăng ký bằng Google',
            hasAccount: 'Đã có tài khoản?',
            signIn: 'Đăng nhập',
        },
        errors: {
            invalidCredentials: 'Email hoặc mật khẩu không hợp lệ',
            userNotFound: 'Không tìm thấy người dùng',
            weakPassword: 'Mật khẩu phải có ít nhất 6 ký tự',
            emailInUse: 'Email đã được sử dụng',
            generic: 'Đã xảy ra lỗi. Vui lòng thử lại.',
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
    },
}; 