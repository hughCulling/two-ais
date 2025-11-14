// Add missing Ollama keys to all translation files
const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, '..', 'src', 'lib', 'translations');

const OLLAMA_KEYS = `    modelCategory_Ollama: "Local models",
    page_OllamaSetupTitle: "Use Ollama (Free Alternative)",
    page_OllamaSetupDescription: "Ollama lets you run AI models locally on your computer with no API costs or rate limits. {learnMoreLink}",
    page_OllamaLearnMore: "Learn more about Ollama",
    page_OllamaSetupInstructions: "Setup Instructions",
    page_OllamaStep1: "1. Download and install Ollama from ollama.com/download",
    page_OllamaStep2: "2. Pull a model (e.g., 'ollama pull llama2')",
    page_OllamaStep3: "3. Set CORS: OLLAMA_ORIGINS=https://two-ais.com ollama serve",
    page_OllamaStep4: "4. Sign in and select your Ollama model!",
`;

const files = fs.readdirSync(TRANSLATIONS_DIR);

files.forEach(file => {
    if (file === 'index.ts' || file === 'en.ts' || !file.endsWith('.ts')) {
        return;
    }

    const filePath = path.join(TRANSLATIONS_DIR, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Check if already has the keys
    if (content.includes('modelCategory_Ollama')) {
        console.log(`Skipping ${file} - already has Ollama keys`);
        return;
    }

    // Find the line with modelCategory_OtherModels and add after it
    const lines = content.split('\n');
    let insertIndex = -1;

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('modelCategory_OtherModels')) {
            insertIndex = i + 1;
            break;
        }
    }

    if (insertIndex === -1) {
        console.log(`Warning: Could not find insertion point in ${file}`);
        return;
    }

    // Insert the new keys
    lines.splice(insertIndex, 0, OLLAMA_KEYS);
    content = lines.join('\n');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Added Ollama keys to ${file}`);
});

console.log('Done!');
