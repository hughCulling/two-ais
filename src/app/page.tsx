// src/app/page.tsx
// Main page: Shows welcome/login prompt, SessionSetupForm, or ChatInterface.

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SessionSetupForm from '@/components/session/SessionSetupForm';
// --- Import the ChatInterface component ---
import { ChatInterface } from '@/components/chat/ChatInterface';
// --- Import Firestore functions ---
import { db } from '@/lib/firebase/clientApp';
// --- LINT FIX: Removed unused DocumentData import ---
import { doc, getDoc, FirestoreError } from 'firebase/firestore';
// --- END LINT FIX ---
import { AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Define SessionConfig type (move to shared types file later?)
interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
}

// Define structure for user data containing secret versions
interface UserData {
    apiSecretVersions?: { [key: string]: string };
    // Add other user fields if needed
}

// Basic logger placeholder (replace with actual logging if needed)
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};


export default function Page() {
    const { user, loading: authLoading } = useAuth(); // Get user and auth loading state
    const [isStartingSession, setIsStartingSession] = useState(false); // Loading state for API call
    const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null); // Holds config AFTER successful start
    const [userApiSecrets, setUserApiSecrets] = useState<{ [key: string]: string } | null>(null); // State for API secret versions
    const [secretsLoading, setSecretsLoading] = useState(true); // Loading state for fetching secrets
    const [pageError, setPageError] = useState<string | null>(null); // Error state for this page

    // --- Effect to fetch user data (including apiSecretVersions) when user logs in ---
    useEffect(() => {
        // Reset state when user logs out
        if (!user) {
            setUserApiSecrets(null);
            setSessionConfig(null); // Also reset session if user logs out
            setSecretsLoading(false);
            setPageError(null);
            return;
        }

        // Fetch user data if we have a user and haven't fetched secrets yet
        if (user && !userApiSecrets) {
            setSecretsLoading(true);
            setPageError(null);
            const userDocRef = doc(db, "users", user.uid);

            getDoc(userDocRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        // --- LINT FIX: Use specific type instead of DocumentData ---
                        const data = docSnap.data() as UserData; // Cast to expected type
                        // --- END LINT FIX ---
                        if (data.apiSecretVersions) {
                            setUserApiSecrets(data.apiSecretVersions);
                            logger.info("User API secret versions loaded.");
                        } else {
                            logger.warn("User document exists but missing apiSecretVersions map.");
                            setUserApiSecrets({});
                        }
                    } else {
                        logger.warn(`User document not found for user ${user.uid}`);
                        setUserApiSecrets({}); // No doc means no secrets
                    }
                })
                .catch((err: FirestoreError) => { // Type the error
                    logger.error("Error fetching user document:", err);
                    setPageError(`Failed to load user data: ${err.message}`);
                    setUserApiSecrets(null); // Ensure it's null on error
                })
                .finally(() => {
                    setSecretsLoading(false);
                });
        } else if (user && userApiSecrets) {
             setSecretsLoading(false);
        }

    }, [user, userApiSecrets]); // Re-run if user changes

    // Callback for the SessionSetupForm
    const handleStartSession = async (config: SessionConfig) => {
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
        setPageError(null); // Clear previous errors
        setSessionConfig(null); // Clear previous session config before attempting new one

        try {
            const idToken = await user.getIdToken();
            logger.info("Obtained ID Token.");

            const response = await fetch('/api/conversation/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`
                },
                body: JSON.stringify(config),
            });

            if (!response.ok) {
                let errorMsg = `HTTP error! status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (parseError) {
                    logger.error("Could not parse error response JSON:", parseError);
                }
                throw new Error(errorMsg);
            }

            const result = await response.json();
            logger.info("API Response:", result);
            logger.info("Session setup successful on backend.");

            setSessionConfig(config); // This will trigger rendering the ChatInterface

        } catch (error) {
            logger.error("Failed to start session:", error);
            setPageError(`Error starting session: ${error instanceof Error ? error.message : String(error)}`);
            setSessionConfig(null); // Ensure session config is null on error
        } finally {
            setIsStartingSession(false);
        }
    };

    // Callback for ChatInterface when user stops the chat
    const handleConversationStopped = () => {
        logger.info("Conversation stopped by user action.");
        setSessionConfig(null); // Reset session config to show setup form again
    };

    // --- Render Logic ---

    if (authLoading || (user && secretsLoading)) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-muted-foreground animate-pulse">Loading...</p>
            </main>
        );
    }

    return (
         // Centering container
        <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12">
            {/* Display Page-Level Errors */}
            {pageError && (
                 <Alert variant="destructive" className="mb-4 max-w-3xl w-full flex-shrink-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{pageError}</AlertDescription>
                </Alert>
            )}

             {/* Container for width constraints and vertical growth/centering */}
            <div className="w-full max-w-3xl space-y-6 flex flex-col flex-grow justify-center">

                {/* Authenticated User View */}
                {user ? (
                    !sessionConfig ? (
                         <div className="flex justify-center">
                            <SessionSetupForm
                                onStartSession={handleStartSession}
                                isLoading={isStartingSession} // Pass API call loading state
                            />
                         </div>
                    ) : (
                        // Render ChatInterface directly
                        userApiSecrets ? (
                            <ChatInterface
                                userId={user.uid}
                                agentA_llm={sessionConfig.agentA_llm}
                                agentB_llm={sessionConfig.agentB_llm}
                                apiSecretVersions={userApiSecrets}
                                onConversationStopped={handleConversationStopped}
                            />
                        ) : (
                             <p className="text-destructive text-center">Error: API Key configuration missing.</p>
                        )
                    )
                ) : (
                    // Unauthenticated User View
                    <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-4 text-center">
                         <h1 className="text-2xl font-bold">
                            Welcome to Two AIs
                         </h1>
                         <p className="text-muted-foreground">
                           Listen to conversations between distinct AI agents.
                         </p>
                         <p className="text-muted-foreground">
                            Please use the link in the header to sign in or create an account.
                         </p>
                    </div>
                )}
            </div>
        </main>
    );
}
