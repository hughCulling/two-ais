// src/app/page.tsx
// Main page: Shows welcome/login prompt, SessionSetupForm, or ChatInterface.

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SessionSetupForm from '@/components/session/SessionSetupForm';
// Ensure you are importing the corrected ChatInterface
import { ChatInterface } from '@/components/chat/ChatInterface';
import { db } from '@/lib/firebase/clientApp';
import { doc, getDoc, FirestoreError } from 'firebase/firestore';
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Interface for the configuration selected in the form
interface SessionConfig {
    agentA_llm: string; // Backend ID (e.g., 'gpt-4o')
    agentB_llm: string; // Backend ID (e.g., 'gemini-1.5-pro-latest')
}

// Interface for the expected structure of the API response from /api/conversation/start
interface StartApiResponse {
    message: string;
    conversationId: string; // Expect the API to return the ID
    config: SessionConfig; // The config used (optional, for confirmation)
}


// Define structure for user data containing secret versions from Firestore
interface UserData {
    // Make apiSecretVersions optional as the document might not have it
    apiSecretVersions?: { [key: string]: string };
}

// Basic logger placeholder
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};


export default function Page() {
    const { user, loading: authLoading } = useAuth(); // Get user and auth loading status
    const [isStartingSession, setIsStartingSession] = useState(false); // Loading state for API call
    // Stores the LLM IDs for the active session (e.g., { agentA_llm: 'gpt-4o', ... })
    const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
    // Stores the ID of the currently active Firestore conversation document
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    // Stores the fetched API secret versions for the logged-in user (e.g., { openai: 'v1', google_ai: 'v2' })
    // Note: This is fetched but no longer passed directly to ChatInterface
    const [userApiSecrets, setUserApiSecrets] = useState<{ [key: string]: string } | null>(null);
    const [secretsLoading, setSecretsLoading] = useState(true); // Loading state for fetching secrets
    const [pageError, setPageError] = useState<string | null>(null); // For displaying errors on this page

    // Effect to fetch user data (specifically apiSecretVersions) when user logs in or changes
    useEffect(() => {
        // If user logs out, reset relevant state
        if (!user) {
            setUserApiSecrets(null);
            setSessionConfig(null);
            setActiveConversationId(null);
            setSecretsLoading(false); // No secrets to load
            setPageError(null);
            return;
        }

        // If user is logged in, but secrets haven't been loaded yet (userApiSecrets is null), fetch them
        // This condition prevents re-fetching if secrets are already loaded ({}) or failed (null but caught)
        if (user && userApiSecrets === null) {
            setSecretsLoading(true);
            setPageError(null); // Clear previous errors
            const userDocRef = doc(db, "users", user.uid); // Reference to the user's document in Firestore

            logger.info("Fetching user data for API secrets..."); // Log fetch attempt
            getDoc(userDocRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserData;
                        // Store the fetched versions, default to empty object if field is missing
                        setUserApiSecrets(data.apiSecretVersions || {});
                        logger.info("User API secret versions loaded.");
                    } else {
                        // User document doesn't exist (might be first login)
                        logger.warn(`User document not found for user ${user.uid}. Assuming no API keys saved yet.`);
                        setUserApiSecrets({}); // Treat as no secrets saved
                    }
                })
                .catch((err: FirestoreError) => {
                    // Handle errors during Firestore fetch
                    logger.error("Error fetching user document:", err);
                    setPageError(`Failed to load user data: ${err.message}. Please try refreshing.`);
                    setUserApiSecrets(null); // Set back to null on error to allow retry if user changes
                })
                .finally(() => {
                    setSecretsLoading(false); // Mark loading as complete
                });
        } else if (user && userApiSecrets !== null) {
             // Secrets already loaded (or defaulted to {}), ensure loading state is false
             // This handles the case where the effect runs again after secrets are set
             if (secretsLoading) { // Only set if it's currently true
                setSecretsLoading(false);
             }
        }

    // --- FIX: Added 'userApiSecrets' to dependency array ---
    // The effect reads userApiSecrets in the condition `if (user && userApiSecrets === null)`.
    // Including it ensures the effect runs correctly if userApiSecrets changes externally
    // (though unlikely here) and satisfies the exhaustive-deps rule.
    // The condition prevents infinite loops as the fetch only happens when secrets are null.
    }, [user, userApiSecrets, secretsLoading]); // Added userApiSecrets and secretsLoading


    // Callback passed to SessionSetupForm, triggered when the user clicks "Start Conversation"
    const handleStartSession = async (config: SessionConfig) => {
        // Guard clauses: Ensure user is logged in and secrets are loaded (or defaulted)
        if (!user) {
            setPageError("User not found. Please sign in again.");
            return;
        }
        // Note: We proceed even if userApiSecrets is {} (no keys saved),
        // as the backend function should handle the check.
        if (userApiSecrets === null) { // Check for null (indicates loading error)
            setPageError("User API key configuration could not be loaded. Please refresh or check settings.");
            return;
        }

        logger.info("Attempting to start session via API with config:", config);
        setIsStartingSession(true); // Set loading state for the button
        setPageError(null); // Clear previous errors
        setSessionConfig(null); // Clear previous session details
        setActiveConversationId(null);

        try {
            // Get the Firebase ID token for authentication
            const idToken = await user.getIdToken();
            logger.info("Obtained ID Token for API call.");

            // Call the backend API route to initiate the conversation
            const response = await fetch('/api/conversation/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}` // Pass token in header
                },
                body: JSON.stringify(config), // Send selected LLM IDs
            });

            // Handle non-successful HTTP responses
            if (!response.ok) {
                let errorMsg = `API Error: ${response.status} ${response.statusText}`;
                try {
                    // Attempt to parse a more specific error message from the API response body
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg; // Use API error message if available
                } catch (parseError) {
                    logger.warn("Could not parse error response JSON:", parseError);
                    // Use the status text if JSON parsing fails
                    errorMsg = `API Error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMsg); // Throw error to be caught by the catch block
            }

            // Parse the successful JSON response
            const result: StartApiResponse = await response.json();
            logger.info("API Response received:", result);

            // Validate that the necessary conversationId is present in the response
            if (!result.conversationId) {
                 throw new Error("API response successful but did not include a conversationId.");
            }

            logger.info(`Session setup successful via API. Conversation ID: ${result.conversationId}`);
            // Store the configuration and the new conversation ID to trigger rendering ChatInterface
            setSessionConfig(config);
            setActiveConversationId(result.conversationId);

        } catch (error) {
            // Catch errors from fetch, token retrieval, or thrown errors
            logger.error("Failed to start session:", error);
            setPageError(`Error starting session: ${error instanceof Error ? error.message : String(error)}`);
            // Ensure session state is cleared on error to return to setup form
            setSessionConfig(null);
            setActiveConversationId(null);
        } finally {
            setIsStartingSession(false); // Reset loading state regardless of outcome
        }
    };

    // Callback passed to ChatInterface, triggered when the user stops the chat or clicks "Go Back"
    const handleConversationStopped = () => {
        logger.info("Conversation stopped callback triggered on page.");
        // Reset session state to show the setup form again
        setSessionConfig(null);
        setActiveConversationId(null);
        setPageError(null); // Clear any previous errors when returning to setup
    };

    // --- Render Logic ---

    // Show a simple loading indicator during initial auth check or secrets fetch
    // Use the secretsLoading state which becomes false even if user doc doesn't exist
    if (authLoading || secretsLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                {/* Basic loading text, consider a spinner component */}
                <p className="text-muted-foreground animate-pulse">Loading user data...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
            {/* Display Page-Level Errors prominently */}
            {pageError && (
                 <Alert variant="destructive" className="mb-4 max-w-3xl w-full flex-shrink-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{pageError}</AlertDescription>
                </Alert>
            )}

            {/* Main content area */}
            <div className="w-full max-w-3xl space-y-6 flex flex-col flex-grow justify-center">
                {/* Conditional rendering based on authentication state */}
                {user ? (
                    // --- Authenticated User View ---
                    // Show setup form if no active session config OR no active conversation ID
                    !sessionConfig || !activeConversationId ? (
                         <div className="flex justify-center">
                            <SessionSetupForm
                                onStartSession={handleStartSession}
                                isLoading={isStartingSession} // Pass loading state to disable form button
                            />
                         </div>
                    ) : (
                        // --- Active Session View ---
                        // Render ChatInterface ONLY if we have an active conversation ID
                        // We assume userApiSecrets has been loaded or defaulted by this point
                        <ChatInterface
                            // Pass only the required props
                            conversationId={activeConversationId}
                            onConversationStopped={handleConversationStopped}
                        />
                        // Note: Removed the check for userApiSecrets here, as ChatInterface no longer needs it.
                        // The API call in handleStartSession implicitly checks if keys are usable.
                    )
                ) : (
                    // --- Unauthenticated User View ---
                    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-4 text-center">
                         <h1 className="text-2xl font-bold">Welcome to Two AIs</h1>
                         <p className="text-muted-foreground">Listen to conversations between distinct AI agents.</p>
                         <p className="text-muted-foreground">Please use the link in the header to sign in or create an account.</p>
                         {/* Consider adding a prominent LoginButton component here */}
                    </div>
                )}
            </div>
        </main>
    );
}
