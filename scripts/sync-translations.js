// sync-translations.js
const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');

const TRANSLATIONS_DIR = path.join(__dirname, '..', 'src', 'lib', 'translations');
const EN_FILE = path.join(TRANSLATIONS_DIR, 'en.ts');
const SKIP_FILES = ['index.ts', 'en.ts'];

// Add your protected terms here (case-sensitive, exact match)
const PROTECTED_TERMS = [
    'Two AIs',
    // Add model names, company names, etc. here
];

// Helper: Extract object literal from TypeScript file
function extractObjectLiteral(content) {
    // Remove comments
    content = content.replace(/\/\/.*$/gm, '');
    // Find the first '=' after 'const'
    const eqIdx = content.indexOf('=');
    if (eqIdx === -1) throw new Error('No "=" found in file');
    // Find the last ';' before 'export default'
    const exportIdx = content.indexOf('export default');
    if (exportIdx === -1) throw new Error('No "export default" found in file');
    let objString = content.slice(eqIdx + 1, exportIdx).trim();
    // Remove trailing semicolon if present
    if (objString.endsWith(';')) objString = objString.slice(0, -1);
    return objString;
}

// Load translation object from file
function loadTranslationObject(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const objString = extractObjectLiteral(content);
    return JSON5.parse(objString);
}

// Recursively add missing keys from source to target
function syncKeys(source, target) {
    for (const key in source) {
        if (!(key in target)) {
            // If value is a protected term, keep as is
            if (typeof source[key] === 'string' && PROTECTED_TERMS.includes(source[key])) {
                target[key] = source[key];
            } else {
                target[key] = source[key];
            }
        } else if (
            typeof source[key] === 'object' &&
            source[key] !== null &&
            !Array.isArray(source[key])
        ) {
            target[key] = syncKeys(source[key], target[key] || {});
        }
    }
    return target;
}

// Write the updated translation object back to file
function writeTranslationObject(filePath, obj, varName) {
    // Use 4 spaces for indentation, trailing commas, and no quotes for keys if possible
    const content =
        `// ${path.basename(filePath)}\n` +
        `const ${varName} = ${JSON.stringify(obj, null, 4)};\n` +
        `export default ${varName};\n`;
    fs.writeFileSync(filePath, content, 'utf8');
}

function main() {
    const en = loadTranslationObject(EN_FILE);

    fs.readdirSync(TRANSLATIONS_DIR).forEach(file => {
        if (SKIP_FILES.includes(file) || !file.endsWith('.ts')) return;

        const filePath = path.join(TRANSLATIONS_DIR, file);
        let target;
        try {
            target = loadTranslationObject(filePath);
        } catch (e) {
            console.error(`Failed to load ${file}:`, e);
            return;
        }

        const updated = syncKeys(en, target);

        // Use the variable name from the file (e.g., fr for fr.ts)
        const varName = path.basename(file, '.ts');
        writeTranslationObject(filePath, updated, varName);
        console.log(`Synced: ${file}`);
    });
}

main();