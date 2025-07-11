// src/lib/translations/ja.ts
const ja = {
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
        mt: 'マルタ語',
        bs: 'ボスニア語',
        ca: 'カタロニア語',
        gu: 'グジャラート語',
        hy: 'アルメニア語',
        is: 'アイスランド語',
        ka: 'グルジア語',
        kk: 'カザフ語',
        kn: 'カンナダ語',
        mk: 'マケドニア語',
        ml: 'マラヤーラム語',
        mr: 'マラーティー語',
        ms: 'マレー語',
        my: 'ビルマ語',
        pa: 'パンジャブ語',
        so: 'ソマリ語',
        sq: 'アルバニア語',
        ta: 'タミル語',
        te: 'テルグ語',
        tl: 'タガログ語',
        ur: 'ウルドゥー語',
        am: 'アムハラ語',
        mn: 'モンゴル語',
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
            description: "アプリケーションの見た目と雰囲気をカスタマイズします。"
        },
        language: {
            title: '言語',
            description: 'インターフェースの言語を選択してください',
            conversationLanguage: '会話言語',
            conversationLanguageDescription: 'AI会話で使用される言語はインターフェースの言語と一致します',
            signingIn: "ログインしています..."
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
            orContinueWith: "または続ける",
            signingIn: "ログインしています..."
        },
        signup: {
            title: 'アカウント作成',
            emailPlaceholder: 'メールアドレス',
            passwordPlaceholder: 'パスワード（6文字以上）',
            signUp: '登録',
            signUpWithGoogle: 'Googleで登録',
            hasAccount: 'すでにアカウントをお持ちの方',
            signIn: 'ログイン',
            emailLabel: "メールアドレス",
            confirmPasswordPlaceholder: "パスワードを確認",
            signingUp: "登録しています..."
        },
        errors: {
            invalidCredentials: 'メールアドレスまたはパスワードが無効です',
            userNotFound: 'ユーザーが見つかりません',
            weakPassword: 'パスワードは6文字以上である必要があります',
            emailInUse: 'このメールアドレスは既に使用されています',
            generic: 'エラーが発生しました。もう一度お試しください。',
            initialization: "初期化エラーです。後でもう一度お試しください。",
            invalidEmail: "有効なメールアドレスを入力してください。",
            tooManyRequests: "ログイン試行回数が多すぎるため、一時的にアクセスが無効になっています。パスワードをリセットするか、後でもう一度お試しください。",
            signInFailedPrefix: "ログインに失敗しました: ",
            unknownSignInError: "ログイン中に不明なエラーが発生しました。",
            profileSaveFailedPrefix: "ログインしましたが、プロファイルデータの保存に失敗しました: ",
            profileCheckSaveFailedPrefix: "ログインしましたが、プロファイルデータの確認/保存に失敗しました: ",
            accountExistsWithDifferentCredential: "このメールアドレスのアカウントは、別のログイン方法ですでに存在します。",
            googleSignInFailedPrefix: "Googleログインに失敗しました: ",
            unknownGoogleSignInError: "Googleログイン中に不明なエラーが発生しました。",
            passwordsDoNotMatch: "パスワードが一致しません。",
            accountCreatedProfileSaveFailedPrefix: "アカウントは作成されましたが、プロファイルデータの保存に失敗しました: ",
            unknownProfileSaveError: "プロファイルの保存中に不明なエラーが発生しました。",
            emailAlreadyRegistered: "このメールアドレスはすでに登録されています。",
            passwordTooShortSignUp: "パスワードは6文字以上である必要があります。",
            signUpFailedPrefix: "サインアップに失敗しました: ",
            unknownSignUpError: "サインアップ中に不明なエラーが発生しました。"
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
        MoreInformation: "詳細情報",
        Example: "例：",
        ShowMore: "もっと見る",
        ShowLess: "少なく表示",
        AwaitingApproval: "承認待ち...",
        OpenInNewTab: "新しいタブで開く",
        AdvancedSettings: "詳細設定",
        Name: "名前",
        Created: "作成日",
        Updated: "更新日",
        Launched: "開始日",
        Docs: "ドキュメント",
        Blog: "ブログ",
        Pricing: "価格",
        Terms: "利用規約",
        Privacy: "プライバシー",
        Changelog: "変更履歴",
        Copy: "コピー",
        Copied: "コピーしました",
        TryAgain: "再試行"
    },
    page_TruncatableNoteFormat: "({noteText})",

    // In Settings > API Keys > Provider specific sections
    apiKeyMissing: "APIキーがありません",
    apiKeyMissingSubtext: "このプロバイダーのAPIキーが見つからないか、無効です。設定で追加してください。",
    apiKeyNotNeeded: "APIキーは不要です",
    apiKeyNotNeededSubtext: "このプロバイダーは、無料枠または特定のモデルに対してAPIキーを必要としません。",
    apiKeyFound: "APIキーが設定されています",
    apiKeyFoundSubtext: "このプロバイダーにはAPIキーが設定されています。",

    // Model Categories (src/app/page.tsx)
    modelCategory_FlagshipChat: "フラッグシップチャットモデル",
    modelCategory_Reasoning: "推論モデル",
    modelCategory_CostOptimized: "コスト最適化モデル",
    modelCategory_OlderGPT: "旧GPTモデル",
    modelCategory_Gemini2_5: "Gemini 2.5シリーズ",
    modelCategory_Gemini2_0: "Gemini 2.0シリーズ",
    modelCategory_Gemini1_5: "Gemini 1.5シリーズ",
    modelCategory_Claude3_7: "Claude 3.7シリーズ",
    modelCategory_Claude3_5: "Claude 3.5シリーズ",
    modelCategory_Claude3: "Claude 3シリーズ",
    modelCategory_Grok3: "Grok 3シリーズ",
    modelCategory_Grok3Mini: "Grok 3 Miniシリーズ",
    modelCategory_Llama4: "Llama 4シリーズ",
    modelCategory_Llama3_3: "Llama 3.3シリーズ",
    modelCategory_Llama3_2: "Llama 3.2シリーズ",
    modelCategory_Llama3_1: "Llama 3.1シリーズ",
    modelCategory_Llama3: "Llama 3シリーズ",
    modelCategory_LlamaVision: "Llama Visionモデル",
    modelCategory_MetaLlama: "Meta Llamaモデル",
    modelCategory_Gemma2: "Gemma 2シリーズ",
    modelCategory_Gemma: "Gemmaシリーズ",
    modelCategory_GoogleGemma: "Google Gemmaモデル",
    modelCategory_DeepSeekR1: "DeepSeek R1シリーズ",
    modelCategory_DeepSeekV3: "DeepSeek V3シリーズ",
    modelCategory_DeepSeekR1Distill: "DeepSeek R1 Distillシリーズ",
    modelCategory_DeepSeekModels: "DeepSeekモデル",
    modelCategory_MistralAIModels: "Mistral AIモデル",
    modelCategory_Qwen3: "Qwen3シリーズ",
    modelCategory_QwQwQ: "Qwen QwQシリーズ",
    modelCategory_Qwen2_5: "Qwen2.5シリーズ",
    modelCategory_Qwen2_5Vision: "Qwen2.5 Visionシリーズ",
    modelCategory_Qwen2_5Coder: "Qwen2.5 Coderシリーズ",
    modelCategory_Qwen2: "Qwen2シリーズ",
    modelCategory_Qwen2Vision: "Qwen2 Visionシリーズ",
    modelCategory_QwenModels: "Qwenモデル",
    modelCategory_OtherModels: "その他のモデル",

    // Page specific (src/app/page.tsx)
    page_ErrorLoadingUserData: "ユーザーデータの読み込みに失敗しました: {errorMessage}。更新してみてください。",
    page_ErrorUserNotFound: "ユーザーが見つかりません。再度ログインしてください。",
    page_ErrorUserApiKeyConfig: "ユーザーAPIキー設定を読み込めませんでした。更新するか、設定を確認してください。",
    page_ErrorStartingSessionAPI: "APIエラー: {status} {statusText}",
    page_ErrorStartingSessionGeneric: "セッション開始エラー: {errorMessage}",
    page_ErrorSessionIdMissing: "API応答は成功しましたが、conversationIdが含まれていませんでした。",
    page_LoadingUserData: "ユーザーデータを読み込んでいます...",
    page_ErrorAlertTitle: "エラー",
    page_WelcomeTitle: "Two AIsへようこそ",
    page_WelcomeSubtitle: "このウェブサイトでは、2つのLLM間の会話を聞くことができます。",
    page_ApiKeysRequiredTitle: "APIキーが必要です",
    page_ApiKeysRequiredDescription: "会話を実行するには、ログイン後、使用したいAIモデル（OpenAI、Google、Anthropicなど）の独自のAPIキーを提供する必要があります。各プロバイダーの詳細な手順は、ログイン後に設定/APIキーページで確認できます。",
    page_SignInPrompt: "独自のセッションを開始するには、ヘッダーのリンクを使用してログインまたはアカウントを作成できます。",
    page_VideoTitle: "Two AIs会話デモ",
    page_AvailableLLMsTitle: "現在利用可能なLLM",
    page_TooltipGoogleThinkingBudget: "このGoogleモデルは「思考バジェット」を使用します。「思考」出力は課金されますが、チャットには表示されません。",
    page_TooltipAnthropicExtendedThinking: "このAnthropicモデルは「拡張思考」を使用します。「思考」出力は課金されますが、チャットには表示されません。",
    page_TooltipXaiThinking: "このxAIモデルは「思考」を使用します。この出力は課金されますが、チャットには表示されません。",
    page_TooltipQwenReasoning: "このQwenモデルは「推論/思考」を使用します。この出力は課金されますが、チャットには表示されません。",
    page_TooltipDeepSeekReasoning: "このDeepSeekモデルは「推論/思考」を使用します。出力は課金されますが、チャットには表示されません。",
    page_TooltipGenericReasoning: "このモデルは、チャットには表示されないが、出力トークンとして課金される推論トークンを使用します。",
    page_TooltipRequiresVerification: "検証済みのOpenAI組織が必要です。こちらで検証できます。",
    page_TooltipSupportsLanguage: "{languageName}をサポートしています",
    page_TooltipMayNotSupportLanguage: "{languageName}をサポートしていない可能性があります",
    page_BadgePreview: "プレビュー",
    page_BadgeExperimental: "実験的",
    page_BadgeBeta: "ベータ版",
    page_AvailableTTSTitle: "現在利用可能なTTS",
    page_NoTTSOptions: "現在利用可能なTTSオプションはありません。",

    // API Key Management specific (ApiKeyManager.tsx)
    apiKeyManager_EnterNewKey: "新しい{serviceName} APIキーを入力してください",
    apiKeyManager_TestKey: "キーをテスト",
    apiKeyManager_TestingKey: "キーをテストしています...",
    apiKeyManager_KeyIsValid: "キーは有効です。",
    apiKeyManager_KeyIsInvalid: "キーが無効です。",
    apiKeyManager_FailedToTestKey: "キーのテストに失敗しました。",
    apiKeyManager_ErrorTestingKey: "キーのテスト中にエラーが発生しました: {error}",
    apiKeyManager_KeyProvider: "プロバイダー",
    apiKeyManager_KeyName: "キー名",
    apiKeyManager_Status: "ステータス",
    apiKeyManager_Action: "アクション",

    // Model capabilities
    modelCapability_Vision: "視覚",
    modelCapability_JSON: "JSONモード",
    modelCapability_Tools: "ツール使用",
    modelCapability_ImageGen: "画像生成",
    modelCapability_Multilingual: "多言語対応",
    modelCapability_WebSearch: "ウェブ検索",
    modelCapability_LargeContext: "大規模コンテキスト",
    modelCapability_LongContext: "長文コンテキスト",
    modelCapability_FastResponse: "高速応答",
    modelCapability_CostEffective: "費用対効果が高い",
    modelCapability_AdvancedReasoning: "高度な推論",
    modelCapability_Coding: "コーディング",
    modelCapability_Foundation: "基盤モデル",
    modelCapability_Experimental: "実験的",
    modelCapability_Beta: "ベータ版",
    modelCapability_Preview: "プレビュー",
    modelCapability_RequiresVerification: "検証が必要",
    modelCapability_RequiresAccount: "アカウントが必要",

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
export default ja; 