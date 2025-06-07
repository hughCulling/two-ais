// src/components/auth/SignInForm.tsx
// Refined error handling in catch blocks using type guards

'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError
import { auth } from '@/lib/firebase/clientApp';
import { useLanguage } from '@/context/LanguageContext'; // Added
import { getTranslation, TranslationKeys, LanguageCode as AppLanguageCode } from '@/lib/translations'; // Added
// import { useRouter } from 'next/navigation';

export default function SignInForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { language } = useLanguage(); // Added
    const t = getTranslation(language.code as AppLanguageCode) as TranslationKeys; // Added
    // const router = useRouter();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!auth) {
            console.error("Firebase auth not initialized.");
            setError(t.auth.errors.initialization);
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Signed in successfully!');
            // router.push('/dashboard');

        } catch (error: unknown) { // Catch error as unknown
            console.error("Sign in error:", error);
            // Check if it's a FirebaseError to access error.code safely
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    setError(t.auth.errors.invalidCredentials);
                } else if (error.code === 'auth/invalid-email') {
                     setError(t.auth.errors.invalidEmail);
                } else if (error.code === 'auth/too-many-requests') {
                     setError(t.auth.errors.tooManyRequests);
                } else {
                    // Handle other Firebase errors
                    setError(`${t.auth.errors.signInFailedPrefix}${error.message}`);
                }
            } else if (error instanceof Error) {
                 // Handle generic JavaScript errors
                 setError(`${t.auth.errors.signInFailedPrefix}${error.message}`);
            } else {
                // Handle non-Error exceptions
                setError(t.auth.errors.unknownSignInError);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSignIn} className="space-y-4">
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div>
                <label htmlFor="email-signin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.login.emailPlaceholder}</label>
                <input type="email" id="email-signin" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
            </div>
            <div>
                <label htmlFor="password-signin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t.auth.login.passwordPlaceholder}</label>
                <input type="password" id="password-signin" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" />
            </div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800">
                {loading ? t.auth.login.signingIn : t.auth.login.signIn}
            </button>
        </form>
    );
}
