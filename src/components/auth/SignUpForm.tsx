// src/components/auth/SignUpForm.tsx
// Refined error handling in catch blocks using type guards

'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app'; // Import FirebaseError
import { auth, db } from '@/lib/firebase/clientApp';
import { useTranslation } from '@/hooks/useTranslation';
// import { useRouter } from 'next/navigation';

export default function SignUpForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { t, loading: translationLoading } = useTranslation();
    if (translationLoading || !t) return null;
    // const router = useRouter();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (password !== confirmPassword) {
            setError(t.auth.errors.passwordsDoNotMatch);
            return;
        }
        setLoading(true);

        if (!auth || !db) {
            console.error("Firebase auth or db not initialized.");
            setError(t.auth.errors.initialization);
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
                const message = (firestoreError instanceof Error) ? firestoreError.message : t.auth.errors.unknownProfileSaveError;
                setError(`${t.auth.errors.accountCreatedProfileSaveFailedPrefix}${message}`);
            }

            // router.push('/dashboard');

        } catch (authError: unknown) { // Catch Auth creation error
            console.error("Sign up error (Auth):", authError);
             // Check if it's a FirebaseError to access error.code safely
            if (authError instanceof FirebaseError) {
                if (authError.code === 'auth/email-already-in-use') {
                    setError(t.auth.errors.emailAlreadyRegistered);
                } else if (authError.code === 'auth/weak-password') {
                    setError(t.auth.errors.passwordTooShortSignUp);
                } else if (authError.code === 'auth/invalid-email') {
                    setError(t.auth.errors.invalidEmail);
                } else {
                    setError(`${t.auth.errors.signUpFailedPrefix}${authError.message}`);
                }
            } else if (authError instanceof Error) {
                 setError(`${t.auth.errors.signUpFailedPrefix}${authError.message}`);
            } else {
                setError(t.auth.errors.unknownSignUpError);
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Render the form (JSX remains the same) ---
    return (
        <form onSubmit={handleSignUp} className="space-y-4" role="form" aria-labelledby="signup-form-title">
            <div id="signup-form-title" className="sr-only">Sign Up Form</div>
            {error && (
                <p className="text-sm text-red-600 dark:text-red-400" role="alert" aria-live="assertive">
                    {error}
                </p>
            )}
            <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    {t.auth.signup.emailPlaceholder}
                </label>
                <input 
                    type="email" 
                    id="email-signup" 
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    autoComplete="email" 
                    className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-500/80 dark:placeholder-gray-400 text-center liquid-glass-input" 
                    aria-describedby="email-signup-description"
                    aria-invalid={error && error.includes('email') ? true : false}
                />
                <div id="email-signup-description" className="sr-only">
                    Enter your email address to create a new account
                </div>
            </div>
            <div>
                <label htmlFor="password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    {t.auth.signup.passwordPlaceholder}
                </label>
                <input 
                    type="password" 
                    id="password-signup" 
                    name="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6} 
                    autoComplete="new-password" 
                    className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-500/80 dark:placeholder-gray-400 text-center liquid-glass-input" 
                    aria-describedby="password-signup-description"
                    aria-invalid={error && error.includes('password') ? true : false}
                />
                <div id="password-signup-description" className="sr-only">
                    Enter a password for your new account (minimum 6 characters)
                </div>
            </div>
            <div>
                <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                    {t.auth.signup.confirmPasswordPlaceholder}
                </label>
                <input 
                    type="password" 
                    id="confirm-password-signup" 
                    name="confirmPassword" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                    minLength={6} 
                    autoComplete="new-password" 
                    className="mt-1 block w-full px-3 py-2 rounded-md shadow-sm placeholder-gray-500/80 dark:placeholder-gray-400 text-center liquid-glass-input" 
                    aria-describedby="confirm-password-signup-description"
                    aria-invalid={error && error.includes('password') ? true : false}
                />
                <div id="confirm-password-signup-description" className="sr-only">
                    Confirm your password by entering it again
                </div>
            </div>
            <button 
                type="submit" 
                disabled={loading} 
                className="w-full flex justify-center py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white liquid-glass-button liquid-glass-themed bg-blue-600/60 hover:bg-blue-600/70 disabled:opacity-50 dark:bg-blue-500/30 dark:hover:bg-blue-500/40"
                aria-label={loading ? "Creating account..." : "Create new account"}
                aria-describedby="signup-button-description"
                aria-busy={loading}
            >
                {loading ? t.auth.signup.signingUp : t.auth.signup.signUp}
            </button>
            <div id="signup-button-description" className="sr-only">
                Click to create a new account with your email and password
            </div>
        </form>
    );
}
