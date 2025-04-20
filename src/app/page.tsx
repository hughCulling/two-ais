// src/app/page.tsx
// Main page: Shows welcome/login prompt, SessionSetupForm, or ChatInterface.

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SessionSetupForm from '@/components/session/SessionSetupForm';
import { ChatInterface } from '@/components/chat/ChatInterface'; // Ensure using latest version
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

// Interface for the expected structure of the API response
interface StartApiResponse {
    message: string;
    conversationId: string; // Expect the API to return the ID
    config: SessionConfig;
}


// Define structure for user data containing secret versions
interface UserData {
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
    const { user, loading: authLoading } = useAuth();
    const [isStartingSession, setIsStartingSession] = useState(false);
    // sessionConfig stores the LLM IDs for the active session
    const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
    // --- FIX: Add state to store the active conversation ID ---
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    // --- End FIX ---
    const [userApiSecrets, setUserApiSecrets] = useState<{ [key: string]: string } | null>(null);
    const [secretsLoading, setSecretsLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);

    // Effect to fetch user data (including apiSecretVersions) when user logs in
    useEffect(() => {
        if (!user) {
            // Reset state when user logs out
            setUserApiSecrets(null);
            setSessionConfig(null);
            setActiveConversationId(null); // --- FIX: Reset active ID on logout ---
            setSecretsLoading(false);
            setPageError(null);
            return;
        }

        // Fetch user data only if needed
        if (user && !userApiSecrets) {
            setSecretsLoading(true);
            setPageError(null);
            const userDocRef = doc(db, "users", user.uid);

            getDoc(userDocRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserData;
                        setUserApiSecrets(data.apiSecretVersions || {}); // Default to empty object
                        logger.info("User API secret versions loaded.");
                    } else {
                        logger.warn(`User document not found for user ${user.uid}`);
                        setUserApiSecrets({}); // No doc means no secrets
                    }
                })
                .catch((err: FirestoreError) => {
                    logger.error("Error fetching user document:", err);
                    setPageError(`Failed to load user data: ${err.message}`);
                    setUserApiSecrets(null);
                })
                .finally(() => {
                    setSecretsLoading(false);
                });
        } else if (user && userApiSecrets) {
             // Already loaded
             setSecretsLoading(false);
        }

    }, [user, userApiSecrets]); // Re-run if user changes or secrets state changes (though shouldn't change externally)

    // Callback for the SessionSetupForm
    const handleStartSession = async (config: SessionConfig) => {
        // Guard clauses
        if (!user) {
            setPageError("User not found. Please sign in again.");
            return;
        }
        if (!userApiSecrets) {
            setPageError("User API key configuration not loaded. Please wait or check settings.");
            return;
        }

        logger.info("Attempting to start session with config:", config);
        setIsStartingSession(true);
        setPageError(null);
        setSessionConfig(null); // Clear previous session config
        setActiveConversationId(null); // Clear previous active ID

        try {
            const idToken = await user.getIdToken();
            logger.info("Obtained ID Token.");

            // Call the backend API route
            const response = await fetch('/api/conversation/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                // Send the config containing backend model IDs
                body: JSON.stringify(config),
            });

            // Handle API errors
            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    // Try to parse more specific error from response body
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (parseError) {
                    logger.error("Could not parse error response JSON:", parseError);
                }
                throw new Error(errorMsg); // Throw error to be caught below
            }

            // --- FIX: Capture conversationId from successful API response ---
            const result: StartApiResponse = await response.json();
            logger.info("API Response:", result);

            if (!result.conversationId) {
                 throw new Error("API response did not include a conversationId.");
            }

            logger.info(`Session setup successful. Conversation ID: ${result.conversationId}`);
            // Store the config and the new conversation ID
            setSessionConfig(config);
            setActiveConversationId(result.conversationId);
            // --- End FIX ---

        } catch (error) {
            logger.error("Failed to start session:", error);
            setPageError(`Error starting session: ${error instanceof Error ? error.message : String(error)}`);
            // Ensure session state is cleared on error
            setSessionConfig(null);
            setActiveConversationId(null);
        } finally {
            setIsStartingSession(false); // Reset loading state
        }
    };

    // Callback for ChatInterface when user stops the chat
    const handleConversationStopped = () => {
        logger.info("Conversation stopped callback received.");
        // Reset session state to show setup form again
        setSessionConfig(null);
        // --- FIX: Reset active ID when stopping ---
        setActiveConversationId(null);
        // --- End FIX ---
    };

    // --- Render Logic ---

    // Show loading indicator during auth check or initial secrets fetch
    if (authLoading || (user && secretsLoading)) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-muted-foreground animate-pulse">Loading...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
            {/* Display Page-Level Errors */}
            {pageError && (
                 <Alert variant="destructive" className="mb-4 max-w-3xl w-full flex-shrink-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{pageError}</AlertDescription>
                </Alert>
            )}

            <div className="w-full max-w-3xl space-y-6 flex flex-col flex-grow justify-center">
                {/* Authenticated User View */}
                {user ? (
                    // Show setup form if no active session config OR no active conversation ID
                    !sessionConfig || !activeConversationId ? (
                         <div className="flex justify-center">
                            <SessionSetupForm
                                onStartSession={handleStartSession}
                                isLoading={isStartingSession}
                            />
                         </div>
                    ) : (
                        // Render ChatInterface ONLY if we have config, ID, and secrets
                        userApiSecrets ? (
                            <ChatInterface
                                userId={user.uid}
                                agentA_llm={sessionConfig.agentA_llm}
                                agentB_llm={sessionConfig.agentB_llm}
                                apiSecretVersions={userApiSecrets}
                                // --- FIX: Pass the activeConversationId as a prop ---
                                conversationId={activeConversationId}
                                // --- End FIX ---
                                onConversationStopped={handleConversationStopped}
                            />
                        ) : (
                             // This case should ideally not happen if secretsLoading is handled
                             <p className="text-destructive text-center">Error: API Key configuration missing.</p>
                        )
                    )
                ) : (
                    // Unauthenticated User View
                    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-4 text-center">
                         <h1 className="text-2xl font-bold">Welcome to Two AIs</h1>
                         <p className="text-muted-foreground">Listen to conversations between distinct AI agents.</p>
                         <p className="text-muted-foreground">Please use the link in the header to sign in or create an account.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
