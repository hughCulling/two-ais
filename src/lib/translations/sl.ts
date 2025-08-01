// sl.ts
const sl = {
    "header": {
        "appName": "Two AIs",
        "settings": "Nastavitve",
        "signIn": "Prijava",
        "signOut": "Odjava",
        "previousChats": "Prejšnji klepeti"
    },
    "languages": {
        "ar": "arabščina",
        "bn": "Bengalščina",
        "bg": "Bolgarščina",
        "zh": "Kitajščina",
        "hr": "hrvaščina",
        "cs": "Češka",
        "da": "Danščina",
        "nl": "Nizozemščina",
        "en": "Angleščina",
        "et": "Estonščina",
        "fi": "Finski",
        "fr": "Francoščina",
        "de": "Nemščina",
        "el": "Grščina",
        "iw": "Hebrejščina",
        "hi": "Ne",
        "hu": "madžarščina",
        "id": "Indonezijščina",
        "it": "Italijanščina",
        "ja": "Japonščina",
        "ko": "Korejščina",
        "lv": "Latvijščina",
        "lt": "Litovščina",
        "no": "norveščina",
        "pl": "poljščina",
        "pt": "Portugalščina",
        "ro": "Romunščina",
        "ru": "Ruščina",
        "sr": "Srbščina",
        "sk": "Slovaščina",
        "sl": "slovenščina",
        "es": "Španščina",
        "sw": "svahili",
        "sv": "švedščina",
        "th": "Tajska",
        "tr": "turščina",
        "uk": "Ukrajinščina",
        "vi": "Vietnamščina",
        "mt": "Malteščina",
        "bs": "Bosanski",
        "ca": "Katalonski",
        "gu": "gudžaratščina",
        "hy": "Armenski",
        "is": "Islandščina",
        "ka": "Gruzijska",
        "kk": "Kazaščina",
        "kn": "Kannada",
        "mk": "Makedonščina",
        "ml": "Malajalamščina",
        "mr": "Maratščina",
        "ms": "Malajščina",
        "my": "Burmanski",
        "pa": "pandžabščina",
        "so": "Somalščina",
        "sq": "Albanec",
        "ta": "Tamilščina",
        "te": "Telugu",
        "tl": "Tagalog",
        "ur": "Urdujščina",
        "am": "Amharščina",
        "mn": "mongolščina"
    },
    "settings": {
        "title": "Nastavitve",
        "sections": {
            "appearance": "Videz",
            "apiKeys": "API Ključi",
            "language": "Jezik"
        },
        "appearance": {
            "theme": "Tema",
            "light": "Svetloba",
            "dark": "Temno",
            "system": "Sistem",
            "description": "Prilagodite videz in občutek aplikacije."
        },
        "language": {
            "title": "Jezik",
            "description": "Izberite želeni jezik za vmesnik",
            "conversationLanguage": "Jezik pogovora",
            "conversationLanguageDescription": "Jezik, ki se uporablja za AI pogovori se bodo ujemali z jezikom vašega vmesnika",
            "supportedLanguages": "Podprti jeziki",
            "languageSupportInformation": "Informacije o jezikovni podpori",
            "aiAgentsLanguageDescription": "Pogovor med AI Agenti bodo potekali v vašem izbranem jeziku."
        },
        "apiKeys": {
            "title": "API Ključi",
            "description": "Upravljajte svoje API ključi za različne AI ponudniki",
            "saved": "Shranjeno",
            "notSet": "Ni nastavljeno",
            "setKey": "Nastavi ključ",
            "updateKey": "Posodobi ključ",
            "removeKey": "Odstrani ključ",
            "getKeyInstructions": "Pridobite si API ključ",
            "noNewKeys": "Nič novega API vnesene tipke za shranjevanje.",
            "unexpectedResponse": "Prejel sem nepričakovan odgovor strežnika.",
            "failedToSaveKey": "Shranjevanje ključa {serviceName} ni uspelo.",
            "someKeysNotSaved": "Nekateri API Ključev ni bilo mogoče shraniti. Prosimo, preverite spodnje podrobnosti.",
            "keyStatus": "ključno stanje ...",
            "apiKeySecurelySaved": "API Ključ varno shranjen",
            "confirmRemoveTitle": "Potrdi odstranitev",
            "confirmRemoveDescription": "Ali ste prepričani, da želite odstraniti API ključ za {serviceName}? Tega dejanja ni mogoče razveljaviti.",
            "failedToRemoveKey": "Ključa {serviceName} ni bilo mogoče odstraniti.",
            "successfullyRemovedKey": "Ključ {serviceName} je bil uspešno odstranjen.",
            "keyNotSet": "Status ključa: Ni nastavljeno",
            "keySet": "Stanje ključa: Nastavljeno",
            "saveButton": "Shrani API Ključ(i)",
            "enteringNewKeyOverwrites": "Z vnosom novega ključa boste prepisali shranjenega.",
            "keyStoredSecurely": "Vaš ključ bo varno shranjen z uporabo Google Skrivni upravitelj.",
            "saveUpdateKeys": "Shrani/posodobi ključe",
            "saving": "Shranjevanje ..."
        },
        "loading": "Nalaganje nastavitev ..."
    },
    "main": {
        "title": "AI Pogovor",
        "setupForm": {
            "title": "Nastavite svoj pogovor",
            "agentA": "Agent A",
            "agentB": "Agent B",
            "model": "Model",
            "selectModel": "Izberite model",
            "tts": {
                "title": "Text-to-Speech",
                "enable": "Omogoči Text-to-Speech",
                "provider": "TTS Ponudnik",
                "selectProvider": "Izberite TTS ponudnik",
                "voice": "Glas",
                "selectVoice": "Izberite glas",
                "model": "TTS Model",
                "selectModel": "Izberite TTS model"
            },
            "startConversation": "Začni pogovor",
            "conversationPrompt": "Začni pogovor."
        },
        "conversation": {
            "thinking": "razmišljanje ...",
            "stop": "Ustavi se",
            "restart": "Ponovni začetek pogovora"
        },
        "pricing": {
            "estimatedCost": "Ocenjeni stroški",
            "perMillionTokens": "na milijon žetonov",
            "input": "Vnos",
            "output": "Izhod"
        },
        "aiConversation": "AI Pogovor"
    },
    "auth": {
        "login": {
            "title": "Prijavite se v Two AIs",
            "emailPlaceholder": "E-pošta",
            "passwordPlaceholder": "Geslo",
            "signIn": "Prijava",
            "signInWithGoogle": "Prijava z Google",
            "noAccount": "Nimate računa?",
            "signUp": "Prijavi se",
            "forgotPassword": "Ste pozabili geslo?",
            "orContinueWith": "Ali pa nadaljujte z",
            "signingIn": "Prijava ..."
        },
        "signup": {
            "title": "Ustvari račun",
            "emailPlaceholder": "E-pošta",
            "passwordPlaceholder": "Geslo (vsaj 6 znakov)",
            "signUp": "Prijavi se",
            "signUpWithGoogle": "Prijavite se z Google",
            "hasAccount": "Že imate račun?",
            "signIn": "Prijava",
            "emailLabel": "Email naslov",
            "confirmPasswordPlaceholder": "Potrdite geslo",
            "signingUp": "Prijava ..."
        },
        "errors": {
            "invalidCredentials": "Neveljaven e-poštni naslov ali geslo",
            "userNotFound": "Uporabnika ni bilo mogoče najti",
            "weakPassword": "Geslo mora imeti vsaj 6 znakov",
            "emailInUse": "Email že v uporabi",
            "generic": "Prišlo je do napake. Poskusite znova.",
            "initialization": "Napaka pri inicializaciji. Poskusite znova pozneje.",
            "invalidEmail": "Vnesite veljaven e-poštni naslov.",
            "tooManyRequests": "Dostop je začasno onemogočen zaradi preveč neuspelih poskusov prijave. Ponastavite geslo ali poskusite znova pozneje.",
            "signInFailedPrefix": "Prijava ni uspela: ",
            "unknownSignInError": "Med prijavo je prišlo do neznane napake.",
            "profileSaveFailedPrefix": "Prijavljen, vendar shranjevanje podatkov profila ni uspelo: ",
            "profileCheckSaveFailedPrefix": "Prijavljen, vendar preverjanje/shranjevanje podatkov profila ni uspelo: ",
            "accountExistsWithDifferentCredential": "Račun s tem e-poštnim naslovom že obstaja, vendar uporablja drug način prijave.",
            "googleSignInFailedPrefix": "Google Prijava ni uspela: ",
            "unknownGoogleSignInError": "Med Google Prijava.",
            "passwordsDoNotMatch": "Gesli se ne ujemata.",
            "accountCreatedProfileSaveFailedPrefix": "Račun ustvarjen, vendar shranjevanje podatkov profila ni uspelo: ",
            "unknownProfileSaveError": "Pri shranjevanju profila je prišlo do neznane napake.",
            "emailAlreadyRegistered": "Ta e-poštni naslov je že registriran.",
            "passwordTooShortSignUp": "Geslo mora biti dolgo vsaj 6 znakov.",
            "signUpFailedPrefix": "Prijava ni uspela: ",
            "unknownSignUpError": "Med prijavo je prišlo do neznane napake."
        }
    },
    "common": {
        "loading": "Nalaganje ...",
        "error": "Napaka",
        "save": "Shrani",
        "cancel": "Prekliči",
        "delete": "Izbriši",
        "confirm": "Potrdi",
        "or": "ali"
    },
    "apiKeyMissing": "API Manjka ključ",
    "apiKeyMissingSubtext": "The API Ključ za tega ponudnika manjka ali je neveljaven. Dodajte ga v nastavitvah.",
    "apiKeyNotNeeded": "API Ključ ni potreben",
    "apiKeyNotNeededSubtext": "Ta ponudnik ne zahteva API ključ za brezplačno raven ali določene modele.",
    "apiKeyFound": "API Komplet ključev",
    "apiKeyFoundSubtext": "En API Ključ je konfiguriran za tega ponudnika.",
    "modelCategory_FlagshipChat": "Vodilni modeli klepeta",
    "modelCategory_Reasoning": "Modeli sklepanja",
    "modelCategory_CostOptimized": "Stroškovno optimizirani modeli",
    "modelCategory_OlderGPT": "Starejši modeli GPT",
    "modelCategory_Gemini2_5": "Gemini 2.5 modeli",
    "modelCategory_Gemini2_0": "Gemini 2.0 modeli",
    "modelCategory_Gemini1_5": "Gemini 1.5 modeli",
    "modelCategory_Claude4": "Claude 4 modeli",
    "modelCategory_Claude3_7": "Claude 3.7 modeli",
    "modelCategory_Claude3_5": "Claude 3.5 modeli",
    "modelCategory_Claude3": "Claude 3 modeli",
    "modelCategory_Grok4": "Grok 4 modeli",
    "modelCategory_Grok3": "Grok 3 modeli",
    "modelCategory_Grok3Mini": "Grok 3 Mini modeli",
    "modelCategory_Llama4": "Llama 4 modeli",
    "modelCategory_Llama3_3": "Llama 3,3 modelov",
    "modelCategory_Llama3_2": "Llama 3.2 modelov",
    "modelCategory_Llama3_1": "Llama 3.1 modeli",
    "modelCategory_Llama3": "Llama 3 modeli",
    "modelCategory_LlamaVision": "Llama Modeli vida",
    "modelCategory_MetaLlama": "Meta Llama Modeli",
    "modelCategory_Gemma3n": "Gemma 3n model",
    "modelCategory_Gemma2": "Gemma 2 modela",
    "modelCategory_Gemma": "Gemma modeli",
    "modelCategory_GoogleGemma": "Google Gemma Modeli",
    "modelCategory_DeepSeekR1": "DeepSeek Modeli R1",
    "modelCategory_DeepSeekV3": "DeepSeek Modeli V3",
    "modelCategory_DeepSeekR1Distill": "DeepSeek Modeli R1 Distill",
    "modelCategory_DeepSeekModels": "DeepSeek Modeli",
    "modelCategory_MistralAIModels": "Mistral AI Modeli",
    "modelCategory_Qwen3": "Qwen3 modeli",
    "modelCategory_QwQwQ": "Qwen Modeli QwQ",
    "modelCategory_Qwen2_5": "Qwen2,5 modelov",
    "modelCategory_Qwen2_5Vision": "Qwen2.5 Modeli vida",
    "modelCategory_Qwen2_5Coder": "Qwen2.5 Modeli kodirnikov",
    "modelCategory_Qwen2": "Qwen2 modela",
    "modelCategory_Qwen2Vision": "Qwen2 modela vida",
    "modelCategory_QwenModels": "Qwen Modeli",
    "modelCategory_OtherModels": "Drugi modeli",
    "page_ErrorLoadingUserData": "Nalaganje uporabniških podatkov ni uspelo: {errorMessage}. Poskusite osvežiti.",
    "page_ErrorUserNotFound": "Uporabnika ni bilo mogoče najti. Prosimo, prijavite se znova.",
    "page_ErrorUserApiKeyConfig": "Uporabnik API Konfiguracije ključa ni bilo mogoče naložiti. Osvežite ali preverite nastavitve.",
    "page_ErrorStartingSessionAPI": "API Napaka: {status} {statusText}",
    "page_ErrorStartingSessionGeneric": "Napaka pri zagonu seje: {errorMessage}",
    "page_ErrorSessionIdMissing": "API Odgovor je bil uspešen, vendar ni vključeval ID-ja pogovora.",
    "page_LoadingUserData": "Nalaganje uporabniških podatkov ...",
    "page_ErrorAlertTitle": "Napaka",
    "page_WelcomeTitle": "Dobrodošli v Two AIs",
    "page_WelcomeSubtitle": "To spletno mesto vam omogoča poslušanje pogovorov med dvema Large Language Models (LLMs).",
    "page_ApiKeysRequiredTitle": "API Potrebni ključi",
    "page_ApiKeysRequiredDescription": "Za vodenje pogovorov boste morali navesti svoje API ključi za AI modeli, ki jih želite uporabiti (npr. OpenAI, Google, Anthropic) po prijavi. Podrobna navodila za vsakega ponudnika najdete v nastavitvah / API Stran s ključi po prijavi.",
    "page_SignInPrompt": "Če želite začeti svojo sejo, se lahko prijavite ali ustvarite račun s pomočjo povezave v glavi.",
    "page_VideoTitle": "Two AIs Predstavitev pogovora",
    "page_AvailableLLMsTitle": "Trenutno na voljo LLMs",
    "page_TooltipGoogleThinkingBudget": "To Google Model uporablja »razmišljalni proračun«. Izhod »razmišljanja« se zaračuna, vendar ni viden v klepetu.",
    "page_TooltipAnthropicExtendedThinking": "To Anthropic Model uporablja »razširjeno razmišljanje«. Izhod »razmišljanja« se zaračuna, vendar ni viden v klepetu.",
    "page_TooltipXaiThinking": "To xAI Model uporablja »razmišljanje«. Ta izhod se zaračuna, vendar ni viden v klepetu.",
    "page_TooltipQwenReasoning": "To Qwen Model uporablja »sklepanje/razmišljanje«. Ta izhod se zaračuna, vendar ni viden v klepetu.",
    "page_TooltipDeepSeekReasoning": "To DeepSeek Model uporablja »sklepanje/razmišljanje«. Izhod se zaračuna, vendar ni viden v klepetu.",
    "page_TooltipGenericReasoning": "Ta model uporablja žetone sklepanja, ki niso vidni v klepetu, vendar se zaračunavajo kot izhodni žetoni.",
    "page_TooltipRequiresVerification": "Zahteva preverjanje OpenAI organizacija. Preverite lahko tukaj.",
    "page_TooltipSupportsLanguage": "Podpira {languageName}",
    "page_TooltipMayNotSupportLanguage": "Ta model morda ne podpira v celoti jezika {languageName} za pogovor.",
    "page_BadgePreview": "Predogled",
    "page_BadgeExperimental": "Eksperimentalno",
    "page_BadgeBeta": "Beta",
    "page_AvailableTTSTitle": "Trenutno na voljo Text-to-Speech (TTS)",
    "page_NoTTSOptions": "Ne TTS možnosti, ki so trenutno na voljo.",
    "page_TruncatableNoteFormat": "({noteText})",
    "page_PricesLastVerifiedOn": "Cene so bile nazadnje potrjene {date}",
    "page_PricingPerTokens": "na {amount} Žetoni",
    "page_ModelCategoryModels": "{model} modeli",
    "ttsVoice_Ugne": "V ognju",
    "sessionSetupForm": {
        "title": "Obrazec za nastavitev seje",
        "description": "Tukaj lahko izberete LLM in neobvezno TTS nastavitve za vsakega agenta.",
        "agentAModel": "Model agenta A",
        "agentBModel": "Model agenta B",
        "selectLLMForAgentA": "Izberite LLM za agenta A",
        "selectLLMForAgentB": "Izberite LLM za agenta B",
        "enableTTS": "Omogoči Text-to-Speech (TTS)",
        "agentATTS": "Agent A TTS",
        "agentBTTS": "Agent B TTS",
        "provider": "Ponudnik",
        "initialSystemPrompt": "Začetni sistemski poziv",
        "initialPromptDescription": "Ta poziv bo poslan kot prvo sporočilo za začetek pogovora. Če polje pustite prazno, poziva ne bo.",
        "startConversation": "Začni pogovor",
        "starting": "Začetek ...",
        "startTheConversation": "Začni pogovor.",
        "languageSupportNote": "Kazalniki jezikovne podpore prikazujejo združljivost modela z {languageName}Modeli brez podpore so onemogočeni.",
        "reasoningNote": "Označuje, da model uporablja žetone za »razmišljanje« ali »sklepanje«. Ta izhod se zaračuna, vendar ni viden v klepetu.",
        "openaiOrgVerificationNote": "Označuje OpenAI Model zahteva preverjeno organizacijo. Lahko",
        "voice": "Glas",
        "selectVoice": "Izberite glas",
        "noVoicesFor": "Ni glasov za {languageName}",
        "ttsProviderModel": "{providerName} Model",
        "selectTtsProviderModel": "Izberite {providerName} Model",
        "selectProvider": "Izberite ponudnika",
        "per": "na",
        "enableImageGen": "Omogoči ustvarjanje slik",
        "imageModel": "Model slike",
        "quality": "Kakovost",
        "size": "Velikost",
        "promptLLM": "Prompt LLM",
        "imagePromptSystemMessage": "Sistemsko sporočilo s slikovnim pozivom",
        "defaultImagePromptSystemMessage": "Na podlagi tega obrata ustvarite poziv, ki ga boste dali modelu za generiranje slik: {turn}",
        "imagePromptSystemMessageHelp": "To sporočilo bo poslano kot sistemski poziv LLM-ju, ki ustvari poziv za sliko. Uporabite <code>{'{turn}'}</code> kot nadomestno besedilo za sporočilo agenta.",
        "selectImageModel": "Izberite model slike",
        "selectPromptLLM": "Izberite LLM za slikovni poziv"
    },
    "history": {
        "backToMain": "Nazaj na glavno stran",
        "conversationHistory": "Zgodovina pogovorov",
        "chatWith": "Klepetajte z {agentA} & {agentB}",
        "viewConversation": "Ogled pogovora",
        "backToPreviousChats": "Nazaj na prejšnje klepete",
        "resumeConversation": "Nadaljuj pogovor",
        "resuming": "Nadaljevanje ...",
        "sessionDetails": "Podrobnosti seje",
        "language": "Jezik:",
        "transcript": "Prepis",
        "loadingHistory": "Nalaganje zgodovine ...",
        "conversationDescription": "Začelo se je {date} - Jezik: {language}",
        "loadingConversation": "Nalaganje pogovora ...",
        "chatStartedOn": "Klepet se je začel {date}",
        "agentAModel": "Model agenta A",
        "agentBModel": "Model agenta B",
        "ttsSettings": "TTS Nastavitve",
        "agentATTS": "Agent A TTS",
        "agentBTTS": "Agent B TTS",
        "provider": "Ponudnik",
        "model": "Model",
        "voice": "Glas"
    },
    "common_verifyHere": "preveri tukaj",
    "page_AvailableImageModelsTitle": "Trenutno razpoložljivi modeli slik",
    "imageModel_Quality": "Kakovost",
    "imageModel_Size": "Velikost",
    "imageModel_PriceUSD": "Cena (USD)",
    "page_TooltipKnowledgeCutoff": "Znanje modela je na ta datum prekinjeno.",
    "modelCategory_MistralAIPremierModels": "Premier modeli",
    "modelCategory_MistralAIOpenModels": "Odprti modeli"
};
export default sl;
