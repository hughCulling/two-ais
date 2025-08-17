## Pre-requisites

On Mac: Command Line Developer Tools,
NVM,
Google Account,
Firebase project,
Register a Firebase web app,
IDE (Windsurf, Cursor, VSCode, etc.)

## Getting Started

First, clone the repository into your local environment:

```bash
git clone https://github.com/hughCulling/two-ais.git
```

Then, cd into the directory;

```bash
cd two-ais
```

Then, run npm install in the root folder and in the functions folder:

```bash
npm install
cd functions
npm install
cd ..
```

Then, create your .env.local file with the following fields and populate them with your own values: 

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
# Get all the above from Firebase/Project Settings.
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=
FIREBASE_SERVICE_ACCOUNT_KEY=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN=
GOOGLE_PROJECT_ID=
GOOGLE_KEY_FILENAME=
GOOGLE_APPLICATION_CREDENTIALS=
```

Finally, run the local server to test at localhost:3000:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
