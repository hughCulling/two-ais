// src/app/settings/layout.tsx
// Layout for all settings pages, includes the sidebar

import SettingsSidebar from '@/components/settings/SettingsSidebar'; // Adjust path if needed

export default function SettingsLayout({
    children, // Will be the specific settings page component
}: {
    children: React.ReactNode;
}) {
    return (
    // Main container for settings page, using flexbox for sidebar + content
    // Added top padding consistent with previous single-page version
    <div className="container mx-auto flex max-w-5xl flex-col p-4 pt-16 md:flex-row md:p-8 md:pt-24">
        {/* Sidebar Navigation */}
        <SettingsSidebar />

        {/* Main Content Area for the specific settings page */}
        {/* Added width full to ensure it takes remaining space */}
        <main className="flex-1 md:pl-6 w-full">
            {/* Render the child page component here */}
        {children}
        </main>
    </div>
    );
}
