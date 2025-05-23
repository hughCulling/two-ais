// src/lib/translations/ja.ts
export const ja = {
    // Header
    header: {
        appName: 'Two AIs', // Keep brand name
        settings: '設定',
        signIn: 'ログイン',
        signOut: 'ログアウト',
    },

    // Language names (for display in language selector)
    languages: {
        ar: 'アラビア語',
        bn: 'ベンガル語',
        bg: 'ブルガリア語',
        zh: '中国語',
        hr: 'クロアチア語',
        cs: 'チェコ語',
        da: 'デンマーク語',
        nl: 'オランダ語',
        en: '英語',
        et: 'エストニア語',
        fi: 'フィンランド語',
        fr: 'フランス語',
        de: 'ドイツ語',
        el: 'ギリシャ語',
        iw: 'ヘブライ語',
        hi: 'ヒンディー語',
        hu: 'ハンガリー語',
        id: 'インドネシア語',
        it: 'イタリア語',
        ja: '日本語',
        ko: '韓国語',
        lv: 'ラトビア語',
        lt: 'リトアニア語',
        no: 'ノルウェー語',
        pl: 'ポーランド語',
        pt: 'ポルトガル語',
        ro: 'ルーマニア語',
        ru: 'ロシア語',
        sr: 'セルビア語',
        sk: 'スロバキア語',
        sl: 'スロベニア語',
        es: 'スペイン語',
        sw: 'スワヒリ語',
        sv: 'スウェーデン語',
        th: 'タイ語',
        tr: 'トルコ語',
        uk: 'ウクライナ語',
        vi: 'ベトナム語',
    },

    // Settings page
    settings: {
        title: '設定',
        sections: {
            appearance: '外観',
            apiKeys: 'APIキー',
            language: '言語',
        },
        appearance: {
            theme: 'テーマ',
            light: 'ライト',
            dark: 'ダーク',
            system: 'システム',
        },
        language: {
            title: '言語',
            description: 'インターフェースの言語を選択してください',
            conversationLanguage: '会話言語',
            conversationLanguageDescription: 'AI会話で使用される言語はインターフェースの言語と一致します',
        },
        apiKeys: {
            title: 'APIキー',
            description: '各AIプロバイダーのAPIキーを管理',
            saved: '保存済み',
            notSet: '未設定',
            setKey: 'キーを設定',
            updateKey: 'キーを更新',
            removeKey: 'キーを削除',
            getKeyInstructions: 'APIキーを取得',
        },
    },

    // Main page
    main: {
        title: 'AI会話',
        setupForm: {
            title: '会話を設定',
            agentA: 'エージェントA',
            agentB: 'エージェントB',
            model: 'モデル',
            selectModel: 'モデルを選択',
            tts: {
                title: 'テキスト読み上げ',
                enable: 'テキスト読み上げを有効化',
                provider: 'TTSプロバイダー',
                selectProvider: 'TTSプロバイダーを選択',
                voice: '音声',
                selectVoice: '音声を選択',
                model: 'TTSモデル',
                selectModel: 'TTSモデルを選択',
            },
            startConversation: '会話を開始',
            conversationPrompt: '会話を始めてください。',
        },
        conversation: {
            thinking: '考え中...',
            stop: '停止',
            restart: '会話を再開',
        },
        pricing: {
            estimatedCost: '推定コスト',
            perMillionTokens: '100万トークンあたり',
            input: '入力',
            output: '出力',
        },
    },

    // Auth pages
    auth: {
        login: {
            title: 'Two AIsにログイン',
            emailPlaceholder: 'メールアドレス',
            passwordPlaceholder: 'パスワード',
            signIn: 'ログイン',
            signInWithGoogle: 'Googleでログイン',
            noAccount: 'アカウントをお持ちでない方',
            signUp: '新規登録',
            forgotPassword: 'パスワードをお忘れですか？',
        },
        signup: {
            title: 'アカウント作成',
            emailPlaceholder: 'メールアドレス',
            passwordPlaceholder: 'パスワード（6文字以上）',
            signUp: '登録',
            signUpWithGoogle: 'Googleで登録',
            hasAccount: 'すでにアカウントをお持ちの方',
            signIn: 'ログイン',
        },
        errors: {
            invalidCredentials: 'メールアドレスまたはパスワードが無効です',
            userNotFound: 'ユーザーが見つかりません',
            weakPassword: 'パスワードは6文字以上である必要があります',
            emailInUse: 'このメールアドレスは既に使用されています',
            generic: 'エラーが発生しました。もう一度お試しください。',
        },
    },

    // Common
    common: {
        loading: '読み込み中...',
        error: 'エラー',
        save: '保存',
        cancel: 'キャンセル',
        delete: '削除',
        confirm: '確認',
        or: 'または',
    },
}; 