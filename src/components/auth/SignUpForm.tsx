// src/components/auth/SignUpForm.tsx
// Refined error handling in catch blocks using type guards

'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError
import { auth, db } from '@/lib/firebase/clientApp';
import { useLanguage } from '@/context/LanguageContext'; // Added
// import { useRouter } from 'next/navigation';

export default function SignUpForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { translation, loading: langLoading } = useLanguage();
    if (langLoading || !translation) return null;
    // const router = useRouter();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError(translation.auth.errors.passwordsDoNotMatch);
            return;
        }
        setLoading(true);

        if (!auth || !db) {
            console.error("Firebase auth or db not initialized.");
            setError(translation.auth.errors.initialization);
            setLoading(false);
            return;
        }

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Signed up successfully (Auth):', user.uid);

            // 2. Attempt to write to Firestore
            console.log('Attempting to write user data to Firestore for UID:', user.uid);
            const userDocRef = doc(db, "users", user.uid);
            try {
                await setDoc(userDocRef, {
                    email: user.email,
                    displayName: user.displayName || '',
                    photoURL: user.photoURL || '',
                    createdAt: serverTimestamp(),
                    // billingModel: 'user_keys', // Example default field
                });
                console.log("Firestore document created successfully.");
            } catch (firestoreError: unknown) { // Catch Firestore write error
                console.error("Error writing document to Firestore:", firestoreError);
                const message = (firestoreError instanceof Error) ? firestoreError.message : translation.auth.errors.unknownProfileSaveError;
                setError(`${translation.auth.errors.accountCreatedProfileSaveFailedPrefix}${message}`);
            }

            // router.push('/dashboard');

        } catch (authError: unknown) { // Catch Auth creation error
            console.error("Sign up error (Auth):", authError);
             // Check if it's a FirebaseError to access error.code safely
            if (authError instanceof FirebaseError) {
                if (authError.code === 'auth/email-already-in-use') {
                    setError(translation.auth.errors.emailAlreadyRegistered);
                } else if (authError.code === 'auth/weak-password') {
                    setError(translation.auth.errors.passwordTooShortSignUp);
                } else if (authError.code === 'auth/invalid-email') {
                    setError(translation.auth.errors.invalidEmail);
                } else {
                    setError(`${translation.auth.errors.signUpFailedPrefix}${authError.message}`);
                }
            } else if (authError instanceof Error) {
                 setError(`${translation.auth.errors.signUpFailedPrefix}${authError.message}`);
            } else {
                setError(translation.auth.errors.unknownSignUpError);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Render the form (JSX remains the same) ---
    return (
        <form onSubmit={handleSignUp} className="space-y-4">
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translation.auth.signup.emailLabel}</label>
                <input type="email" id="email-signup" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder={translation.auth.signup.emailPlaceholder} />
            </div>
            <div>
                <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translation.auth.signup.passwordPlaceholder}</label>
                <input type="password" id="password-signup" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder={translation.auth.signup.passwordPlaceholder.substring(0, translation.auth.signup.passwordPlaceholder.indexOf(' ('))} />
            </div>
            <div>
                <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{translation.auth.signup.confirmPasswordPlaceholder}</label>
                <input type="password" id="confirm-password-signup" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400" placeholder={translation.auth.signup.confirmPasswordPlaceholder} />
            </div>
            <div>
                <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-offset-gray-800">
                    {loading ? translation.auth.signup.signingUp : translation.auth.signup.signUp}
                </button>
            </div>
        </form>
    );
}
