// src/app/signup/page.tsx
// Page for user registration

'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';
import { useLanguage } from '@/context/LanguageContext';

export default function SignupPage() {
    return (
        <AuthProvider>
            <SignupPageContent />
        </AuthProvider>
    );
}

function SignupPageContent() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { translation, loading: langLoading } = useLanguage();

    useEffect(() => {
        if (!loading && user) {
            router.push('/'); // Or wherever you want to redirect
        }
    }, [user, loading, router]);

    if (loading || langLoading || !translation) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-gray-500 dark:text-gray-400">{translation ? translation.common.loading : 'Loading...'}</p>
            </main>
        );
    }

    if (user) return null;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md space-y-6">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                        {translation.auth.signup.title}
                    </h1>
                    <SignUpForm />
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {translation.auth.signup.hasAccount}{' '}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            {translation.auth.signup.signIn}
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
} 