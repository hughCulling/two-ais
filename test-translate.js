const {Translate} = require('@google-cloud/translate').v2;

const translate = new Translate({
    projectId: process.env.GOOGLE_PROJECT_ID,
    keyFilename: process.env.GOOGLE_KEY_FILENAME,
});

async function test() {
    const [translation] = await translate.translate('Hello world', 'fr');
    console.log('French:', translation);
}

// console.log(process.env.GOOGLE_PROJECT_ID, process.env.GOOGLE_KEY_FILENAME);

test();