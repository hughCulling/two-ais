// src/lib/translations/uk.ts
export const uk = {
    // Header
    header: {
        appName: "Two AIs", // Keep brand name
        settings: "Налаштування",
        signIn: "Увійти",
        signOut: "Вийти",
    },

    // Language names (for display in language selector)
    languages: {
        ar: "Арабська",
        bn: "Бенгальська",
        bg: "Болгарська",
        zh: "Китайська",
        hr: "Хорватська",
        cs: "Чеська",
        da: "Данська",
        nl: "Нідерландська",
        en: "Англійська",
        et: "Естонська",
        fi: "Фінська",
        fr: "Французька",
        de: "Німецька",
        el: "Грецька",
        iw: "Іврит",
        hi: "Гінді",
        hu: "Угорська",
        id: "Індонезійська",
        it: "Італійська",
        ja: "Японська",
        ko: "Корейська",
        lv: "Латвійська",
        lt: "Литовська",
        no: "Норвезька",
        pl: "Польська",
        pt: "Португальська",
        ro: "Румунська",
        ru: "Російська",
        sr: "Сербська",
        sk: "Словацька",
        sl: "Словенська",
        es: "Іспанська",
        sw: "Суахілі",
        sv: "Шведська",
        th: "Тайська",
        tr: "Турецька",
        uk: "Українська",
        vi: "Вʼєтнамська",
    },

    // Settings page
    settings: {
        title: "Налаштування",
        sections: {
            appearance: "Вигляд",
            apiKeys: "Ключі API",
            language: "Мова",
        },
        appearance: {
            theme: "Тема",
            light: "Світла",
            dark: "Темна",
            system: "Системна",
        },
        language: {
            title: "Мова",
            description: "Виберіть бажану мову для інтерфейсу",
            conversationLanguage: "Мова розмови",
            conversationLanguageDescription: "Мова, що використовується для розмов зі штучним інтелектом, відповідатиме мові вашого інтерфейсу",
        },
        apiKeys: {
            title: "Ключі API",
            description: "Керуйте своїми ключами API для різних постачальників ШІ",
            saved: "Збережено",
            notSet: "Не встановлено",
            setKey: "Встановити ключ",
            updateKey: "Оновити ключ",
            removeKey: "Видалити ключ",
            getKeyInstructions: "Отримайте свій ключ API",
            openai_api_key: "Ключ API OpenAI",
            anthropic_api_key: "Ключ API Anthropic",
            google_api_key: "Ключ API Google",
            groq_api_key: "Ключ API Groq",
            cohere_api_key: "Ключ API Cohere",
            together_ai_api_key: "Ключ API Together AI",
            enter_your_api_key: "Введіть свій ключ API",
            save_api_keys: "Зберегти ключі API",
            api_keys_saved: "Ключі API збережено",
            select_language: "Виберіть мову",
            language_changes_globally: "Зміни мови застосовуватимуться глобально в інтерфейсі.",
            language_support_note: "Примітка: не всі моделі підтримують усі мови. Мови, які не підтримуються моделлю, за замовчуванням використовуватимуть англійську.",
            provider_language_support_label: "Підтримка мов провайдером ШІ:",
            model_language_support: {
                "gpt-4": "GPT-4: загалом підтримує більшість мов.",
                "gpt-4-turbo": "GPT-4 Turbo: загалом підтримує більшість мов.",
                "gpt-3.5-turbo": "GPT-3.5 Turbo: загалом підтримує більшість мов.",
                "claude-2": "Claude 2: іспанська, французька. Обмежена підтримка інших мов.",
                "claude-instant": "Claude Instant: іспанська, французька. Обмежена підтримка інших мов.",
                "claude-3-opus": "Claude 3 Opus: широка підтримка мов.",
                "claude-3-sonnet": "Claude 3 Sonnet: широка підтримка мов.",
                "claude-3-haiku": "Claude 3 Haiku: широка підтримка мов.",
                "gemini-pro": "Gemini Pro: арабська, бенгальська, болгарська, китайська (спрощена та традиційна), хорватська, чеська, данська, нідерландська, англійська, естонська, фінська, французька, німецька, грецька, іврит, гінді, угорська, індонезійська, італійська, японська, корейська, латвійська, литовська, норвезька, польська, португальська, румунська, російська, сербська, словацька, словенська, іспанська, суахілі, шведська, тайська, турецька, українська, вʼєтнамська.",
                "groq-llama2-70b": "LLaMA2-70b (через Groq): переважно англійська.",
                "groq-mixtral-8x7b": "Mixtral-8x7b (через Groq): англійська, французька, німецька, іспанська, італійська.",
                "cohere-command": "Command (через Cohere): англійська, французька, іспанська, німецька, португальська, італійська, японська, корейська, арабська, китайська (спрощена).",
                "cohere-command-r-plus": "Command R+ (через Cohere): англійська, французька, іспанська, німецька, португальська, італійська, японська, корейська, арабська, китайська (спрощена).",
                "together-ai": "Моделі Together AI: підтримка мов різна. Дивіться їхню документацію."
            }
        }
    },

    // Main page
    main: {
        title: "Розмова зі ШІ", // Corresponds to 'AI Conversation'
        setupForm: {
            title: "Налаштуйте свою розмову", // Corresponds to 'Set up your conversation'
            agentA: "Агент А", // Corresponds to 'Agent A'
            agentB: "Агент Б", // Corresponds to 'Agent B'
            model: "Модель", // Corresponds to 'Model'
            selectModel: "Виберіть модель", // Corresponds to 'Select a model'
            tts: {
                title: "Текст-в-мовлення", // Corresponds to 'Text-to-Speech'
                enable: "Увімкнути Текст-в-мовлення", // Corresponds to 'Enable Text-to-Speech'
                provider: "Постачальник TTS", // Corresponds to 'TTS Provider'
                selectProvider: "Виберіть постачальника TTS", // Corresponds to 'Select TTS provider'
                voice: "Голос", // Corresponds to 'Voice'
                selectVoice: "Виберіть голос", // Corresponds to 'Select voice'
                model: "Модель TTS", // Corresponds to 'TTS Model'
                selectModel: "Виберіть модель TTS", // Corresponds to 'Select TTS model'
            },
            startConversation: "Почати розмову", // Corresponds to 'Start Conversation'
            conversationPrompt: "Почніть розмову.", // Corresponds to 'Start the conversation.'
        },
        conversation: {
            thinking: "думає...", // Corresponds to 'thinking...'
            stop: "Зупинити", // Corresponds to 'Stop'
            restart: "Перезапустити розмову", // Corresponds to 'Restart Conversation'
        },
        pricing: {
            estimatedCost: "Орієнтовна вартість", // Corresponds to 'Estimated cost'
            perMillionTokens: "за мільйон токенів", // Corresponds to 'per million tokens'
            input: "Вхід", // Corresponds to 'Input'
            output: "Вихід", // Corresponds to 'Output'
        }
        // The following keys from the old uk.ts 'main' object are intentionally removed 
        // to align with en.ts structure:
        // new_chat, new_session, no_sessions, search_sessions, confirm_delete_session, 
        // session_deleted, session_setup (object), session (object), 
        // "general.continue", "general.finish", "general.next", "general.previous", 
        // "general.send", "general.delete", "general.reset", "general.view_all", 
        // "general.copied_to_clipboard"
    },
    
    // Auth pages
    auth: {
        login: {
            title: "Увійти до Two AIs", // Corresponds to 'Sign in to Two AIs'
            emailPlaceholder: "Електронна пошта", // Corresponds to 'Email'
            passwordPlaceholder: "Пароль", // Corresponds to 'Password'
            signIn: "Увійти", // Corresponds to 'Sign In'
            signInWithGoogle: "Увійти через Google", // Corresponds to 'Sign in with Google'
            noAccount: "Немає облікового запису?", // Corresponds to "Don't have an account?"
            signUp: "Зареєструватися", // Corresponds to 'Sign up'
            forgotPassword: "Забули пароль?", // Corresponds to 'Forgot password?'
        },
        signup: {
            title: "Створити обліковий запис", // Corresponds to 'Create an account'
            emailPlaceholder: "Електронна пошта", // Corresponds to 'Email'
            passwordPlaceholder: "Пароль (принаймні 6 символів)", // Corresponds to 'Password (at least 6 characters)'
            signUp: "Зареєструватися", // Corresponds to 'Sign Up'
            signUpWithGoogle: "Зареєструватися через Google", // Corresponds to 'Sign up with Google'
            hasAccount: "Вже є обліковий запис?", // Corresponds to 'Already have an account?'
            signIn: "Увійти", // Corresponds to 'Sign in'
        },
        errors: {
            invalidCredentials: "Неправильна адреса електронної пошти або пароль", // Corresponds to 'Invalid email or password'
            userNotFound: "Користувача не знайдено", // Corresponds to 'User not found'
            weakPassword: "Пароль має містити принаймні 6 символів", // Corresponds to 'Password should be at least 6 characters'
            emailInUse: "Ця адреса електронної пошти вже використовується", // Corresponds to 'Email already in use'
            generic: "Сталася помилка. Будь ласка, спробуйте ще раз.", // Corresponds to 'An error occurred. Please try again.'
        }
        // The following keys from the old uk.ts 'auth' object are intentionally removed 
        // or moved into the nested 'login' and 'signup' objects to align with en.ts structure:
        // sign_in_with_google, sign_in_with_github, sign_in_with_email, email_address, 
        // password, forgot_password, send_reset_link, magic_link_sent, check_your_email, 
        // sign_in (top level), sign_up (top level), create_account, 
        // by_signing_in_you_agree_to_our, terms_of_service, and, privacy_policy
    },

    // Landing Page
    landing: {
        hero_title: "Два ШІ. Одна розмова.",
        hero_subtitle: "Порівнюйте та взаємодійте з двома моделями ШІ одночасно.",
        get_started: "Почати",
        features_title: "Особливості",
        feature_one_title: "Порівняння пліч-о-пліч",
        feature_one_description: "Введіть свою підказку один раз і отримуйте відповіді від двох різних моделей ШІ одночасно.",
        feature_two_title: "Підтримка кількох моделей",
        feature_two_description: "Отримайте доступ до широкого спектру провідних моделей від OpenAI, Anthropic, Google, Groq, Cohere та Together AI.",
        feature_three_title: "Багатомовна підтримка",
        feature_three_description: "Спілкуйтеся з ШІ вашою улюбленою мовою. Обирайте з 39 мов.",
        feature_four_title: "Спеціальні системні підказки",
        feature_four_description: "Налаштовуйте поведінку ШІ за допомогою спеціальних системних підказок для кожної розмови.",
        feature_five_title: "Завантаження документів",
        feature_five_description: "Завантажуйте документи, щоб надати контекст ШІ для більш точних відповідей.",
        feature_six_title: "Діліться розмовами",
        feature_six_description: "Легко діліться своїми сесіями ШІ з іншими за допомогою унікального посилання.",
        how_it_works_title: "Як це працює",
        step_one_title: "Виберіть свої моделі",
        step_one_description: "Виберіть дві моделі ШІ, які ви хочете порівняти.",
        step_two_title: "Налаштуйте свою підказку",
        step_two_description: "Введіть свою підказку, додайте файли або налаштуйте системну підказку.",
        step_three_title: "Отримуйте відповіді",
        step_three_description: "Отримуйте відповіді від обох ШІ одночасно.",
        step_four_title: "Порівнюйте та взаємодійте",
        step_four_description: "Аналізуйте відповіді, щоб зрозуміти сильні та слабкі сторони кожного ШІ.",
        pricing_title: "Ціни",
        pricing_free_tier: "Безкоштовно",
        pricing_free_description: "Почніть з базових функцій.",
        pricing_pro_tier: "Професійний (незабаром)",
        pricing_pro_description: "Розблокуйте розширені функції та підтримку.",
        faq_title: "Часті запитання",
        faq_one_question: "Які моделі ШІ я можу використовувати?",
        faq_one_answer: "Two AIs підтримує моделі від OpenAI (GPT-4, GPT-3.5-Turbo), Anthropic (Claude 2, Claude Instant, Claude 3 Opus, Sonnet, Haiku), Google (Gemini Pro), Groq (LLaMA2-70b, Mixtral-8x7b), Cohere (Command, Command R+), та Together AI.",
        faq_two_question: "Чи потрібні мені власні ключі API?",
        faq_two_answer: "Так, вам потрібно буде надати власні ключі API для провайдерів ШІ, яких ви хочете використовувати. Two AIs не надає доступу до API.",
        faq_three_question: "Чи мої розмови безпечні?",
        faq_three_answer: "Ми серйозно ставимося до безпеки ваших даних. Розмови зберігаються безпечно. Ваші ключі API зберігаються локально у вашому браузері та не надсилаються на наші сервери.",
        faq_four_question: "Чи можу я використовувати це безкоштовно?",
        faq_four_answer: "Так, Two AIs пропонує безкоштовний рівень з основними функціями. Ми плануємо запровадити Професійний рівень з розширеними функціями в майбутньому.",
        footer_copy: "© {year} Two AIs. Всі права захищено."
    },

    // Common strings that don't fit in other categories or are widely used
    common: {
        loading: "Завантаження...",
        error: "Помилка", // General error
        save: "Зберегти",
        cancel: "Скасувати",
        delete: "Видалити",
        confirm: "Підтвердити",
        or: "або",
        copied_to_clipboard: "Скопійовано в буфер обміну",
        "Two AIs": "Two AIs", // Brand name
         // Errors
        "error.generic": "Сталася помилка. Будь ласка, спробуйте ще раз.",
        "error.api_key_not_set": "Ключ API не встановлено. Будь ласка, встановіть його в налаштуваннях.",
        "error.model_not_selected": "Будь ласка, виберіть модель, щоб розпочати чат.",
        "error.failed_to_start_session": "Не вдалося розпочати сесію.",
        "error.session_not_found": "Сесію не знайдено.",
        "error.page_not_found": "Сторінку не знайдено."
    }
}; 