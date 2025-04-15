// src/app/settings/api-keys/page.tsx
// Page specifically for managing API keys (Auth handled by layout)

'use client'; // ApiKeyManager uses client hooks

import ApiKeyManager from '@/components/settings/ApiKeyManager'; // Adjust path if needed

export default function ApiKeysPage() {
    // No useAuth, useEffect, loading, or redirect logic needed here.
    // The SettingsLayout ensures the user is authenticated before rendering this page.
    return (
        // Container for this page's content - uses card style consistent with Appearance page
        <div className="space-y-6 rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
             <div className="space-y-1.5">
                 {/* Page title */}
                 <h1 className="text-2xl font-semibold leading-none tracking-tight">
                    API Keys
                 </h1>
                 <p className="text-sm text-muted-foreground">
                    Manage your external service API keys here. Securely stored.
                 </p>
             </div>

             {/* Render the ApiKeyManager component */}
             {/* IMPORTANT: Remember to remove internal H2 and padding/max-width from ApiKeyManager.tsx */}
            <ApiKeyManager />
        </div>
    );
}
