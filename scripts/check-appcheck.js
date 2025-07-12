#!/usr/bin/env node

/**
 * App Check Configuration Checker
 * Run this script to verify your App Check setup
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking App Check Configuration...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local file not found');
    console.log('   Create a .env.local file in your project root');
    process.exit(1);
}

// Read and parse .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
    }
});

console.log('📋 Environment Variables Check:');

// Check required variables
const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY',
    'FIREBASE_SERVICE_ACCOUNT_KEY'
];

let allRequiredPresent = true;
requiredVars.forEach(varName => {
    const value = envVars[varName];
    if (value && value !== '') {
        console.log(`   ✅ ${varName}: ${value.substring(0, 10)}...`);
    } else {
        console.log(`   ❌ ${varName}: Missing or empty`);
        allRequiredPresent = false;
    }
});

// Check optional debug token
const debugToken = envVars['NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN'];
if (debugToken && debugToken !== '') {
    console.log(`   ✅ NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN: ${debugToken}`);
} else {
    console.log(`   ⚠️  NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN: Not set (recommended for development)`);
}

console.log('\n🔧 Next Steps:');

if (!allRequiredPresent) {
    console.log('1. Fill in all missing environment variables in .env.local');
    console.log('2. Get your reCAPTCHA Enterprise site key from Google Cloud Console');
    console.log('3. Set up App Check in Firebase Console');
} else {
    console.log('✅ All required variables are present!');
    console.log('1. Make sure App Check is enabled in Firebase Console');
    console.log('2. Verify your domain is authorized in App Check settings');
    console.log('3. Check that reCAPTCHA Enterprise API is enabled in Google Cloud Console');
}

console.log('\n📚 For detailed setup instructions, see APPCHECK_TROUBLESHOOTING.md'); 