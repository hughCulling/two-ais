// src/context/AuthContext.tsx
// Fixed version with null check for auth before using onAuthStateChanged

'use client'; // This context is for client components

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase/clientApp'; // Adjust path if needed

// Define the type for the context value
interface AuthContextType {
    user: User | null; // The Firebase User object or null if not logged in
    loading: boolean; // Loading state to handle initial auth check
}

// Create the context with default values matching the type
const defaultContextValue: AuthContextType = {
    user: null,
    loading: true,
};
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Define the props type for the provider component
interface AuthProviderProps {
    children: ReactNode;
}

// Create the provider component that wraps the application
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Start in loading state

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        // --- Add check for auth ---
        if (auth) {
            // Only subscribe if auth is initialized
            unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                setUser(currentUser); // Update user state
                setLoading(false); // Set loading to false once checked
            });
        } else {
            // If auth is null (initialization failed), set loading to false
            console.error("AuthContext: Firebase auth not initialized.");
            setUser(null);
            setLoading(false);
        }
        // --- End check ---

        // Cleanup: Unsubscribe only if the subscription was actually set up
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []); // Empty dependency array ensures this runs only once on mount

    // Provide the user state and loading status to children components
    const value = { user, loading };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for easy access to the auth context
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
