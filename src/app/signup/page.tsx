// src/app/signup/page.tsx
// Page for user registration

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SignUpForm from '@/components/auth/SignUpForm';

export default function SignupPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect if user is already logged in
    useEffect(() => {
        if (!loading && user) {
            console.log("SignupPage: User already logged in, redirecting...");
            router.push('/'); // Redirect to home/dashboard
        }
    }, [user, loading, router]);

    // Show loading state
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-gray-500 dark:text-gray-400">Loading...</p>
            </main>
        );
    }

     // If user exists (and not loading), render null while redirect happens
    if (user) {
        return null;
    }

    // If no user and not loading, show signup form
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md space-y-6">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                        Create Account
                    </h1>
                    <SignUpForm />
                     <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
