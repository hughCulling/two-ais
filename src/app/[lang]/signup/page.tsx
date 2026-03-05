// src/app/signup/page.tsx
// Page for user registration

'use client';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SignUpForm from '@/components/auth/SignUpForm';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

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
    const { t, loading: translationLoading } = useTranslation();
    const { language } = useLanguage();

    useEffect(() => {
        if (!loading && user) {
            router.push('/'); // Or wherever you want to redirect
        }
    }, [user, loading, router]);

    if (loading || translationLoading || !t) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-gray-500 dark:text-gray-400">{t ? t.common.loading : 'Loading...'}</p>
            </main>
        );
    }

    if (user) return null;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md space-y-6">
                <div className="p-6 rounded-xl shadow-md space-y-6 liquid-glass-themed bg-card/60">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                        {t.auth.signup.title}
                    </h1>
                    <SignUpForm />
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t dark:border-gray-700"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="px-2 text-gray-500 dark:text-gray-400 liquid-glass-themed bg-white/40 dark:bg-card/60 rounded-md">
                                {t.auth.signup.orContinueWith}
                            </span>
                        </div>
                    </div>
                    <GoogleSignInButton />
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        {t.auth.signup.hasAccount}{' '}
                        <Link href={`/${language.code}/login`} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            {t.auth.signup.signIn}
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
