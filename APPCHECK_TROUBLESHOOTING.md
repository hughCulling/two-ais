# Firebase App Check Troubleshooting Guide

## Current Issue
You're experiencing Firebase App Check 403 errors with throttling messages like:
```
AppCheck: 403 error. Attempts allowed again after 01d:00m:00s (appCheck/initial-throttle).
AppCheck: Requests throttled due to previous 403 error. Attempts allowed again after 23h:59m:59s (appCheck/throttled).
```

## Root Causes
1. **Missing or incorrect reCAPTCHA Enterprise site key**
2. **App Check not properly configured in Firebase Console**
3. **Missing debug token for development environment**
4. **Domain not registered in App Check settings**

## Solutions

### 1. Environment Variables Setup

Add these to your `.env.local` file:

```bash
# Required for App Check
NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY=your_recaptcha_enterprise_site_key_here

# Optional: Debug token for development (set to 'true' or a specific token)
NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN=true
```

### 2. Firebase Console Configuration

#### Step 1: Enable App Check
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`two-ais`)
3. Go to **App Check** in the left sidebar
4. Click **Get started**

#### Step 2: Configure reCAPTCHA Enterprise
1. In App Check settings, click **Apps**
2. Find your web app and click **Configure**
3. Select **reCAPTCHA Enterprise** as the provider
4. Click **Save**

#### Step 3: Get reCAPTCHA Enterprise Site Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (`two-ais`)
3. Go to **Security** > **reCAPTCHA Enterprise**
4. Click **Create Key**
5. Choose **Web** platform
6. Add your domains:
   - `localhost` (for development)
   - `your-production-domain.com`
7. Copy the **Site Key** and add it to `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY`

### 3. Development Environment Setup

For local development, you need to set up debug tokens:

#### Option A: Use Debug Token (Recommended)
1. In Firebase Console > App Check > Apps
2. Find your web app and click **Configure**
3. Scroll down to **Debug tokens**
4. Click **Add debug token**
5. Enter a token (e.g., `debug-token-123`)
6. Add this token to your `.env.local`:
   ```bash
   NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN=debug-token-123
   ```

#### Option B: Use `true` for Development
```bash
NEXT_PUBLIC_APPCHECK_DEBUG_TOKEN=true
```

### 4. Domain Registration

Make sure your domains are registered in App Check:

1. In Firebase Console > App Check > Apps
2. Click on your web app
3. Under **Authorized domains**, add:
   - `localhost` (for development)
   - `your-production-domain.com`
   - `your-vercel-domain.vercel.app` (if using Vercel)

### 5. Clear Browser Cache and Restart

After making changes:
1. Clear your browser cache
2. Restart your development server:
   ```bash
   npm run dev
   ```

### 6. Verify Configuration

Check your browser console for these messages:
- ✅ `"App Check debug token set for development."`
- ✅ `"Firebase App Check (reCAPTCHA Enterprise) initialized."`

If you see warnings about missing keys, double-check your environment variables.

## Common Issues and Solutions

### Issue: "App Check not initialized"
**Solution**: Ensure `NEXT_PUBLIC_RECAPTCHA_ENTERPRISE_SITE_KEY` is set in your `.env.local`

### Issue: "403 errors continue after setup"
**Solution**: 
1. Wait for the 24-hour throttling period to expire
2. Or use debug tokens to bypass throttling in development

### Issue: "reCAPTCHA Enterprise not enabled"
**Solution**: Enable reCAPTCHA Enterprise in Google Cloud Console:
1. Go to Google Cloud Console > APIs & Services > Library
2. Search for "reCAPTCHA Enterprise API"
3. Click **Enable**

### Issue: "Domain not authorized"
**Solution**: Add your domain to the authorized domains list in Firebase Console > App Check

## Production Deployment

For production, make sure to:
1. Remove debug tokens from production environment variables
2. Add your production domain to authorized domains
3. Ensure reCAPTCHA Enterprise is properly configured
4. Test App Check functionality in production

## Testing App Check

You can test if App Check is working by:
1. Opening browser dev tools
2. Going to Network tab
3. Making a request to your Firebase services
4. Looking for App Check tokens in the request headers

## Additional Resources

- [Firebase App Check Documentation](https://firebase.google.com/docs/app-check)
- [reCAPTCHA Enterprise Documentation](https://cloud.google.com/recaptcha-enterprise/docs)
- [App Check Debug Tokens](https://firebase.google.com/docs/app-check/web/debug-provider) 