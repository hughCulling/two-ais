// src/lib/translations/ko.ts
export const ko = {
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
        },
        language: {
            title: '언어',
            description: '인터페이스에 사용할 기본 언어를 선택하세요',
            conversationLanguage: '대화 언어',
            conversationLanguageDescription: 'AI 대화에 사용되는 언어는 인터페이스 언어와 일치합니다',
        },
        apiKeys: {
            title: 'API 키',
            description: '다양한 AI 공급자의 API 키를 관리하세요',
            saved: '저장됨',
            notSet: '설정되지 않음',
            setKey: '키 설정',
            updateKey: '키 업데이트',
            removeKey: '키 제거',
            getKeyInstructions: 'API 키 받기',
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
        },
        signup: {
            title: '계정 만들기',
            emailPlaceholder: '이메일',
            passwordPlaceholder: '비밀번호 (6자 이상)',
            signUp: '가입하기',
            signUpWithGoogle: 'Google 계정으로 가입하기',
            hasAccount: '이미 계정이 있으신가요?',
            signIn: '로그인',
        },
        errors: {
            invalidCredentials: '잘못된 이메일 또는 비밀번호입니다',
            userNotFound: '사용자를 찾을 수 없습니다',
            weakPassword: '비밀번호는 6자 이상이어야 합니다',
            emailInUse: '이미 사용 중인 이메일입니다',
            generic: '오류가 발생했습니다. 다시 시도해 주세요.',
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
    },
}; 