// src/app/login/page.tsx
// Page for user sign-in

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import SignInForm from '@/components/auth/SignInForm';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // Redirect if user is already logged in
    useEffect(() => {
        if (!loading && user) {
            console.log("LoginPage: User already logged in, redirecting...");
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

    // If no user and not loading, show login form
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-md space-y-6">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-6">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center">
                        Sign In
                    </h1>
                    <SignInForm />
                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t dark:border-gray-700"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
                        </div>
                    </div>
                    <GoogleSignInButton />
                    <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?{' '}
                        <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
