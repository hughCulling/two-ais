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
        en: 'अंग्रेजी',
        et: 'एस्टोनियाई',
        fi: 'फिनिश',
        fr: 'फ्रेंच',
        de: 'जर्मन',
        el: 'यूनानी',
        iw: 'हिब्रू',
        hi: 'हिंदी',
        hu: 'हंगरी',
        id: 'इंडोनेशियाई',
        it: 'इतालवी',
        ja: 'जापानी',
        ko: 'कोरियाई',
        lv: 'लातवियाई',
        lt: 'लिथुआनियाई',
        no: 'नार्वेजियन',
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
    },

    // Settings page
    settings: {
        title: 'सेटिंग्स',
        sections: {
            appearance: 'दिखावट',
            apiKeys: 'एपीआई कुंजी',
            language: 'भाषा',
        },
        appearance: {
            theme: 'थीम',
            light: 'हल्का',
            dark: 'गहरा',
            system: 'सिस्टम',
        },
        language: {
            title: 'भाषा',
            description: 'इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें',
            conversationLanguage: 'वार्तालाप भाषा',
            conversationLanguageDescription: 'एआई वार्तालापों के लिए उपयोग की जाने वाली भाषा आपकी इंटरफ़ेस भाषा से मेल खाएगी',
        },
        apiKeys: {
            title: 'एपीआई कुंजी',
            description: 'विभिन्न एआई प्रदाताओं के लिए अपनी एपीआई कुंजियों का प्रबंधन करें',
            saved: 'सहेजा गया',
            notSet: 'सेट नहीं है',
            setKey: 'कुंजी सेट करें',
            updateKey: 'कुंजी अपडेट करें',
            removeKey: 'कुंजी निकालें',
            getKeyInstructions: 'अपनी एपीआई कुंजी प्राप्त करें',
        },
    },

    // Main page
    main: {
        title: 'एआई वार्तालाप',
        setupForm: {
            title: 'अपनी बातचीत सेट करें',
            agentA: 'एजेंट ए',
            agentB: 'एजेंट बी',
            model: 'मॉडल',
            selectModel: 'एक मॉडल चुनें',
            tts: {
                title: 'पाठ से भाषण',
                enable: 'पाठ से भाषण सक्षम करें',
                provider: 'टीटीएस प्रदाता',
                selectProvider: 'टीटीएस प्रदाता चुनें',
                voice: 'आवाज',
                selectVoice: 'आवाज चुनें',
                model: 'टीटीएस मॉडल',
                selectModel: 'टीटीएस मॉडल चुनें',
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
        },
        signup: {
            title: 'एक खाता बनाएं',
            emailPlaceholder: 'ईमेल',
            passwordPlaceholder: 'पासवर्ड (कम से कम 6 अक्षर)',
            signUp: 'साइन अप करें',
            signUpWithGoogle: 'Google के साथ साइन अप करें',
            hasAccount: 'पहले से ही एक खाता है?',
            signIn: 'साइन इन करें',
        },
        errors: {
            invalidCredentials: 'अमान्य ईमेल या पासवर्ड',
            userNotFound: 'उपयोगकर्ता नहीं मिला',
            weakPassword: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
            emailInUse: 'ईमेल पहले से ही उपयोग में है',
            generic: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
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
        or: 'या',
    },
}; 