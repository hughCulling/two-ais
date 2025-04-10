// src/components/auth/SignInForm.tsx
// Fixed version with null check for auth and loading state

'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/clientApp'; // Adjust path if needed
// import { useRouter } from 'next/navigation'; // Uncomment for redirection

export default function SignInForm() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Added loading state
    // const router = useRouter(); // Uncomment for redirection

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => { // Typed event
        e.preventDefault();
        setError(null); // Clear previous errors
        setLoading(true); // Set loading state

        // --- Add check for auth ---
        if (!auth) {
            console.error("Firebase auth not initialized.");
            setError("Initialization error. Please try again later.");
            setLoading(false);
            return; // Exit if auth is null
        }
        // --- End check ---

        try {
            // Now safe to pass non-null 'auth'
            await signInWithEmailAndPassword(auth, email, password);
            // Sign-in successful, AuthProvider will handle state update
            console.log('Signed in successfully!');
            // Optional: Redirect user
            // router.push('/dashboard');

        } catch (err: any) {
            console.error("Sign in error:", err);
            // Set user-friendly error messages
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password. Please try again.');
            } else if (err.code === 'auth/invalid-email') {
                 setError('Please enter a valid email address.');
            } else if (err.code === 'auth/too-many-requests') {
                 setError('Access temporarily disabled due to too many failed login attempts. Please reset your password or try again later.');
            }
             else {
                // Use generic message from Firebase or a custom one
                // setError(err.message); // Firebase's message
                setError('Failed to sign in. Please try again later.'); // Custom generic message
            }
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Render the form
    return (
        <form onSubmit={handleSignIn} className="space-y-4">
            {/* Display Error Message */}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {/* Email Input */}
            <div>
                <label
                    htmlFor="email-signin" // Changed id for uniqueness
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email-signin" // Changed id
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
            </div>

            {/* Password Input */}
            <div>
                <label
                    htmlFor="password-signin" // Changed id for uniqueness
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password-signin" // Changed id
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading} // Disable button when loading
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-800"
            >
                {loading ? 'Signing In...' : 'Sign In'} {/* Update button text */}
            </button>
        </form>
    );
}
