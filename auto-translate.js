require('dotenv').config();
const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');
const {Translate} = require('@google-cloud/translate').v2;

const TRANSLATIONS_DIR = path.join(__dirname, 'src', 'lib', 'translations');
const EN_FILE = path.join(TRANSLATIONS_DIR, 'en.ts');
const SKIP_FILES = ['index.ts', 'en.ts'];

// List your protected terms here
const LANGUAGE_NAMES_EN = [
    "English", "French", "German", "Spanish", "Italian", "Portuguese", "Dutch", "Russian", "Chinese", "Japanese", "Korean", "Arabic", "Hindi", "Bengali", "Urdu", "Turkish", "Vietnamese", "Polish", "Romanian", "Hungarian", "Czech", "Greek", "Swedish", "Finnish", "Danish", "Norwegian", "Slovak", "Bulgarian", "Serbian", "Croatian", "Slovenian", "Estonian", "Latvian", "Lithuanian", "Ukrainian", "Hebrew", "Thai", "Malay", "Indonesian", "Filipino", "Tagalog", "Swahili", "Amharic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bosnian", "Catalan", "Georgian", "Gujarati", "Icelandic", "Irish", "Kazakh", "Khmer", "Kyrgyz", "Lao", "Macedonian", "Malayalam", "Maltese", "Mongolian", "Nepali", "Pashto", "Persian", "Punjabi", "Sinhala", "Somali", "Sundanese", "Tajik", "Tamil", "Telugu", "Uzbek", "Welsh", "Yiddish", "Zulu", "Albanian", "Montenegrin", "Galician", "Luxembourgish", "Tatar", "Chechen", "Ossetian", "Chuvash", "Bashkir", "Sakha", "Buryat", "Kalmyk", "Komi", "Mari", "Udmurt", "Mordvin", "Abkhaz", "Adyghe", "Kabardian", "Karachay-Balkar", "Nogai", "Ingush", "Lezgian", "Avar", "Dargwa", "Lak", "Tabasaran", "Rutul", "Tsakhur", "Agul", "Kumyk", "Chechen", "Tuvan", "Altai", "Khakas", "Shor", "Chulym", "Tofa", "Selkup", "Nenets", "Nganasan", "Enets", "Nivkh", "Evenki", "Even", "Nanai", "Udege", "Orok", "Oroch", "Ulch", "Negidal", "Ainu"
];
const PROTECTED_TERMS = [
    // App name
    "Two AIs",

    // Provider names
    "OpenAI",
    "Google",
    "Anthropic",
    "xAI",
    "TogetherAI",
    "Meta",
    "DeepSeek",
    "Qwen",
    "Google Cloud TTS",
    "Eleven Labs",
    "Google Gemini TTS",
    "Google Gemma",
    "Mistral AI",
    "Mistral",
    "Meta Llama",
    "Gemma",
    "Llama",

    // "Ugne",
    // "Hindi",
    // "Email",
    // "Bengali",
    // "Thai",
    // "Kannada",
    // "Tamil",
    // "Telugu",
    // "Tagalog",
    // "Urdu",
    // "Kazakh",
    // "Malayalam",
    // "Punjabi",
    // "Somali",
    // "Marathi",
    // "Swahili",
    // "Gujarati",
    // "Maltese",
    // "Bulgarian",
    // "Czech",
    // "Icelandic",
    // "Slovak",
    // "Amharic",


    // Model names (from AVAILABLE_LLMS)
    "ChatGPT-4o",
    "GPT-4o",
    "GPT-4o mini",
    "GPT-4.1",
    "GPT-4.1 mini",
    "GPT-4.1 nano",
    "GPT-4 Turbo",
    "GPT-4",
    "GPT-3.5 Turbo",
    "o4-mini",
    "o3",
    "o3-mini",
    "o1",
    "Gemini 2.5 Pro",
    "Gemini 2.5 Flash",
    "Gemini 2.0 Flash",
    "Gemini 2.0 Flash-Lite",
    "Gemini 1.5 Pro",
    "Gemini 1.5 Flash",
    "Gemini 1.5 Flash-8B",
    "Gemini 2.5 Flash Lite Preview",
    "Claude Opus 4",
    "Claude Sonnet 4",
    "Claude Sonnet 3.7",
    "Claude Haiku 3.5",
    "Claude Sonnet 3.5",
    "Claude Opus 3",
    "Claude Haiku 3",
    "Grok 3",
    "Grok 3 Fast",
    "Grok 3 Mini",
    "Grok 3 Mini Fast",
    "Grok 4",
    "Llama 4 Scout Instruct (17Bx16E)",
    "Llama 4 Maverick Instruct (17Bx128E)",
    "Meta Llama 3.3 70B Instruct Turbo",
    "Meta Llama 3.3 70B Instruct Turbo Free",
    "Gemma-2 Instruct (27B)",
    "Gemma 3N E4B Instruct",
    "DeepSeek R1",
    "DeepSeek V3-0324",
    "DeepSeek R1 Distill Llama 70B",
    "DeepSeek R1 Distill Qwen 14B",
    "DeepSeek R1 Distill Qwen 1.5B",
    "DeepSeek R1 Distill Llama 70B Free",
    "Qwen3 235B A22B FP8 Throughput",
    "Qwen QwQ-32B",
    "Qwen2.5-VL (72B) Instruct",
    "Qwen2-VL (72B) Instruct",
    "Qwen 2.5 Coder 32B Instruct",
    "Qwen2.5 72B Instruct Turbo",
    "Qwen2.5 7B Instruct Turbo",
    "Qwen 2 Instruct (72B)",

    // TTS Models Names
    "GPT-4o mini TTS",
    "TTS-1",
    "TTS-1 HD",
    "Standard Voices",
    "WaveNet Voices",
    "Neural2 Voices",
    "Casual Voices (Neural2)",
    "Ployglot (Preview) Voices",
    "Studio Voices",
    "News Voices (Studio)",
    "Chirp HD Voices (Preview)",
    "Chirp3 HD Voices (GA)",
    "Multilingual V2",
    "Flash V2.5",
    "Turbo V2.5",
    "Gemini 2.5 Flash Preview TTS",
    "Gemini 2.5 Pro Preview TTS",


    // Other terms
    "Large Language Models",
    "LLMs",
    "API",
    "AI",
    "Gemini 2.5",
    "Gemini 2.0",
    "Gemini 1.5",
    "Claude 4",
    "Claude 3.7",
    "Claude 3.5",
    "Claude 3",
    "Llama 4",
    "Llama 3.3",
    "Gemma 3n",
    'Gemma 2',
    "DeepSeek R1",
    "DeepSeek V3",
    "DeepSeek R1 Distill",
    "Qwen3",
    "Qwen QWQ",
    "Qwen2.5",
    "Qwen2.5 Vision",
    "Qwen2.5 Coder",
    "Qwen2.5 Coder",
    "Qwen2",
    "Qwen2 Vision",
    "Text-to-Speech",
    "TTS",
    "{date}",
    "{amount}",
    "{model}",
    "{agentA}",
    "{agentB}",
    "{languageName}",
    "{providerName}",
    "{date}",
    "{language}",
    "(USD)",
    "{turn}",
    "{price}",
    "<code>",
    "</code>",
    "Meta Llama",
    "Mistral Medium 3",
    "Magistral Medium",
    "Mistral Large",
    "Ministral 8B 24.10",
    "Ministral 3B 24.10",
    "Mistral Small 3.2",
    "Magistral Small",
    //...LANGUAGE_NAMES_EN
];

// Build a regex to match any protected term (word boundaries if needed)
const protectedRegex = new RegExp(PROTECTED_TERMS.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');

const translate = new Translate({
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_KEY_FILENAME,
});

function extractObjectLiteral(content) {
    content = content.replace(/\/\/.*$/gm, '');
    const eqIdx = content.indexOf('=');
    if (eqIdx === -1) throw new Error('No "=" found in file');
    const exportIdx = content.indexOf('export default');
    if (exportIdx === -1) throw new Error('No "export default" found in file');
    let objString = content.slice(eqIdx + 1, exportIdx).trim();
    if (objString.endsWith(';')) objString = objString.slice(0, -1);
    return objString;
}

function loadTranslationObject(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const objString = extractObjectLiteral(content);
    return JSON5.parse(objString);
}

function writeTranslationObject(filePath, obj, varName) {
    const content =
        `// ${path.basename(filePath)}\n` +
        `const ${varName} = ${JSON.stringify(obj, null, 4)};\n` +
        `export default ${varName};\n`;
    fs.writeFileSync(filePath, content, 'utf8');
}

// Split a string into segments: protected and unprotected
function splitByProtectedTerms(str) {
    if (!protectedRegex.source || !str) return [{text: str, protected: false}];
    let result = [];
    let lastIndex = 0;
    str.replace(protectedRegex, (match, offset) => {
        if (offset > lastIndex) {
            // Preserve the exact substring before the match
            result.push({text: str.slice(lastIndex, offset), protected: false});
        }
        result.push({text: match, protected: true});
        lastIndex = offset + match.length;
        return match;
    });
    if (lastIndex < str.length) {
        result.push({text: str.slice(lastIndex), protected: false});
    }
    // For each segment, preserve leading/trailing spaces
    return result.map(seg => {
        if (seg.protected) return seg;
        // Split off leading/trailing spaces, so they are not lost in translation
        const match = seg.text.match(/^(\s*)(.*?)(\s*)$/s);
        if (!match) return seg;
        const [, leading, core, trailing] = match;
        let arr = [];
        if (leading) arr.push({text: leading, protected: false, isSpace: true});
        if (core) arr.push({text: core, protected: false});
        if (trailing) arr.push({text: trailing, protected: false, isSpace: true});
        return arr;
    }).flat();
}

// Recursively collect all keys that need translation, with protected term handling
function collectUntranslatedKeys(en, target, prefix = []) {
    let toTranslate = [];
    for (const key in en) {
        if (typeof en[key] === 'object' && en[key] !== null && !Array.isArray(en[key])) {
            toTranslate = toTranslate.concat(
                collectUntranslatedKeys(en[key], target[key] || {}, prefix.concat(key))
            );
        } else if (
            typeof en[key] === 'string' &&
            (!target[key] || target[key] === en[key])
        ) {
            // If the whole string is protected, skip
            if (PROTECTED_TERMS.includes(en[key])) continue;
            // Otherwise, split and only translate unprotected segments
            const segments = splitByProtectedTerms(en[key]);
            if (segments.some(seg => !seg.protected && seg.text.trim())) {
                toTranslate.push({ path: prefix.concat(key), segments, original: en[key] });
            }
        }
    }
    return toTranslate;
}

function setValueAtPath(obj, path, value) {
    let curr = obj;
    for (let i = 0; i < path.length - 1; i++) {
        if (!curr[path[i]]) curr[path[i]] = {};
        curr = curr[path[i]];
    }
    curr[path[path.length - 1]] = value;
}

function getLangCodeFromFile(file) {
    return file.replace('.ts', '');
}

async function main() {
    const en = loadTranslationObject(EN_FILE);

    const files = fs.readdirSync(TRANSLATIONS_DIR).filter(
        file => !SKIP_FILES.includes(file) && file.endsWith('.ts')
    );

    // const files = ['fr.ts'];

    for (const file of files) {
        const filePath = path.join(TRANSLATIONS_DIR, file);
        let target;
        try {
            target = loadTranslationObject(filePath);
        } catch (e) {
            console.error(`Failed to load ${file}:`, e);
            continue;
        }

        const langCode = getLangCodeFromFile(file);
        const toTranslate = collectUntranslatedKeys(en, target);

        if (toTranslate.length === 0) {
            console.log(`No translations needed for ${file}`);
            continue;
        }

        console.log(`Translating ${toTranslate.length} keys for ${file} (${langCode})...`);

        for (const item of toTranslate) {
            // Only translate unprotected, non-space segments
            const textsToTranslate = item.segments
                .filter(seg => !seg.protected && !seg.isSpace && seg.text.trim())
                .map(seg => seg.text);

            let translations = [];
            if (textsToTranslate.length > 0) {
                try {
                    [translations] = await translate.translate(textsToTranslate, langCode);
                } catch (err) {
                    console.error(`Translation error for ${file}:`, err);
                    continue;
                }
                if (!Array.isArray(translations)) translations = [translations];
            }

            // Reassemble
            let tIdx = 0;
            const translated = item.segments.map(seg => {
                if (seg.protected) return seg.text;
                if (seg.isSpace) return seg.text;
                return seg.text.trim() ? translations[tIdx++] : seg.text;
            }).join('');

            setValueAtPath(target, item.path, translated);
        }

        // Write back the updated file
        const varName = path.basename(file, '.ts');
        writeTranslationObject(filePath, target, varName);
        console.log(`Updated: ${file}`);
    }
}

main();