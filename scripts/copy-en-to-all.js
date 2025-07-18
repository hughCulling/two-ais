// This script copies en.ts to all other translation files in src/lib/translations
// except en.ts, index.ts, and fr.ts.bak

const fs = require('fs');
const path = require('path');

const translationsDir = path.join(__dirname, '../src/lib/translations');
const enFile = path.join(translationsDir, 'en.ts');
const excludeFiles = new Set(['en.ts', 'index.ts', 'fr.ts.bak']);

const enContent = fs.readFileSync(enFile, 'utf8');

fs.readdirSync(translationsDir).forEach(file => {
  if (file.endsWith('.ts') && !excludeFiles.has(file)) {
    const targetPath = path.join(translationsDir, file);
    fs.writeFileSync(targetPath, enContent, 'utf8');
    console.log(`Copied en.ts to ${file}`);
  }
});

console.log('All translation files have been overwritten with en.ts.'); 