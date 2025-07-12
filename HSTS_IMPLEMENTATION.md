# HSTS Implementation Guide

## Overview

This project implements HTTP Strict Transport Security (HSTS) using a **staged rollout approach** to ensure security while minimizing risks during development and deployment.

## What is HSTS?

HSTS is a security header that tells browsers to only connect to your website using HTTPS, never HTTP. This prevents downgrade attacks and man-in-the-middle attacks.

## Staged Rollout Implementation

### Stage 1: Development (localhost)
- **Environment**: `NODE_ENV !== 'production'`
- **HSTS Header**: None
- **Reason**: Allows HTTP for local development on `localhost:3000`
- **Console Log**: `"HSTS: Development mode - No HSTS header (allows HTTP for local development)"`

### Stage 2: Vercel Preview/Staging
- **Environment**: `NODE_ENV === 'production' && VERCEL_ENV === 'preview'`
- **HSTS Header**: `max-age=3600; includeSubDomains`
- **Duration**: 1 hour
- **Features**: 
  - `includeSubDomains` - Protects all subdomains
  - No `preload` - Can be easily reverted
- **Console Log**: `"HSTS: Preview/Staging mode - Short max-age with includeSubDomains (no preload)"`

### Stage 3: Vercel Production (Very Conservative)
- **Environment**: `NODE_ENV === 'production' && VERCEL_ENV === 'production'`
- **HSTS Header**: `max-age=3600; includeSubDomains`
- **Duration**: 1 hour (3,600 seconds)
- **Features**:
  - `includeSubDomains` - Protects all subdomains
  - No `preload` - Safe for multiple daily deployments
  - Very short max-age - Can be adjusted within hours if needed
- **Console Log**: `"HSTS: Production mode - Very conservative HSTS (safe for multiple daily deployments)"`
- **Rationale**: Perfect for rapid development with multiple daily deployments - provides security while maintaining maximum flexibility

### Fallback: Other Production Environments
- **Environment**: `NODE_ENV === 'production'` (but not Vercel)
- **HSTS Header**: `max-age=604800; includeSubDomains`
- **Duration**: 1 week
- **Features**: Moderate security without preload commitment
- **Console Log**: `"HSTS: Production mode (non-Vercel) - Moderate HSTS without preload"`

## Environment Variables

The implementation uses these environment variables:
- `NODE_ENV`: Set by Next.js (development/production)
- `VERCEL_ENV`: Set by Vercel (preview/production)

## Deployment Checklist

### Before Enabling HSTS in Production:

1. **Ensure HTTPS is working**:
   - All resources load over HTTPS
   - No mixed content warnings
   - All API calls use HTTPS

2. **Test in Preview Environment**:
   - Deploy to Vercel preview
   - Verify HSTS header is present with 1-hour max-age
   - Test all functionality works correctly

3. **Monitor for Issues**:
   - Check browser console for errors
   - Verify all external resources load
   - Test authentication flows

### When Ready for Production:

1. **Deploy to Production**:
   - Vercel will automatically set `VERCEL_ENV=production`
   - HSTS will activate with 1-hour max-age and includeSubDomains (no preload)

2. **Monitor Post-Deployment**:
   - Check that HSTS header is present
   - Monitor for any broken functionality
   - Verify all subdomains work correctly
   - Test that all features work as expected

3. **For Future Enhancement** (when development stabilizes):
   - Consider increasing max-age to 1 day (86400 seconds)
   - Then to 1 week (604800 seconds)
   - Finally to 1 year with preload (only when 100% confident)

## Important Warnings

### ⚠️ Preload Directive
- Once you deploy with `preload`, your domain can be added to browser HSTS preload lists
- This makes it **permanently HTTPS-only** in browsers
- **Cannot be easily reverted** - browsers will cache this for years
- Only enable when you're 100% confident your site will always support HTTPS

### ⚠️ includeSubDomains Directive
- Protects ALL subdomains of your domain
- Ensure all subdomains support HTTPS before enabling
- Examples: `api.yourdomain.com`, `www.yourdomain.com`, `blog.yourdomain.com`

### ⚠️ max-age Considerations
- 1 year (31,536,000 seconds) is the recommended minimum for production
- Once set, browsers will enforce HTTPS for the full duration
- Cannot be reduced without waiting for the max-age to expire

## Testing HSTS

### Check HSTS Header:
```bash
# Check if HSTS header is present
curl -I https://yourdomain.com

# Look for: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Browser Testing:
1. Open Chrome DevTools → Network tab
2. Look for any HTTP requests (they should be blocked)
3. Check for mixed content warnings in console

### Lighthouse Audit:
- Run Lighthouse security audit
- Should pass "Use a strong HSTS policy" check

## Troubleshooting

### Issue: Site broken after HSTS deployment
**Solution**: 
1. Check for HTTP resources in your code
2. Ensure all external resources use HTTPS
3. If using `preload`, you may need to wait for max-age to expire

### Issue: HSTS not working in development
**Expected**: HSTS is intentionally disabled in development to allow HTTP

### Issue: Mixed content warnings
**Solution**: 
1. Update all resource URLs to use HTTPS
2. Check for hardcoded HTTP URLs in your code
3. Update external service configurations

## Security Benefits

With HSTS enabled, your site gains:
- ✅ Protection against SSL stripping attacks
- ✅ Prevention of downgrade attacks
- ✅ Automatic HTTPS enforcement in browsers
- ✅ Improved security posture for users

## Next Steps

1. **Current State**: HSTS is configured but inactive in development
2. **Next Step**: Deploy to Vercel preview to test Stage 2
3. **Production Deployment**: Your next production deploy will activate conservative HSTS (1-week max-age, no preload)
4. **Future Enhancement**: When you're confident and want maximum security, consider upgrading to 1-year max-age with preload

## Current Production Status

Since you're actively deploying to `www.two-ais.com` multiple times per day, your next production deployment will automatically activate:
- ✅ HSTS with 1-hour max-age
- ✅ includeSubDomains protection
- ❌ No preload (safe for multiple daily deployments)

This provides immediate security benefits while maintaining maximum flexibility for your rapid development cycle.

Remember: HSTS is a powerful security feature, but it's also a commitment. The conservative approach ensures you can deploy safely while still getting security benefits. 