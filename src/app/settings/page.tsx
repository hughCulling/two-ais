// src/app/settings/page.tsx
// This page now just redirects to the default settings section (Appearance)

import { redirect } from 'next/navigation';

export default function SettingsRootPage() {
    // Redirect to the default settings section (Appearance)
    redirect('/settings/appearance');

    // This part usually won't render as the redirect happens server-side.
    // return null;
}
