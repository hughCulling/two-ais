// src/app/page.tsx
// Main page: Shows welcome/login prompt, SessionSetupForm, or ChatInterface.

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import SessionSetupForm from '@/components/session/SessionSetupForm';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { db } from '@/lib/firebase/clientApp';
import { doc, getDoc, FirestoreError } from 'firebase/firestore';
// --- Import required icons ---
import { AlertCircle, BrainCircuit, KeyRound } from "lucide-react";
// --- Import required UI components ---
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// --- Import LLM data and grouping function ---
import { groupLLMsByProvider } from '@/lib/models'; // LLMInfo type is implicitly used by groupLLMsByProvider return type

// --- Define TTS Types (Locally) ---
// Removed the unused TTS_PROVIDER_IDS constant
// Define the type directly with the possible string literals
type TTSProviderId = 'none' | 'browser' | 'openai' | 'google' | 'elevenlabs';
interface AgentTTSSettings { provider: TTSProviderId; voice: string | null; }

// --- Updated SessionConfig Interface ---
// Defines the configuration for a conversation session
interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettings;
    agentB_tts: AgentTTSSettings;
}

// Interface for the expected structure of the API response from /api/conversation/start
interface StartApiResponse {
    message: string;
    conversationId: string;
    config?: SessionConfig; // Optional: Echo back the config saved
}

// Define structure for user data containing secret versions from Firestore
interface UserData {
    apiSecretVersions?: { [key: string]: string };
    // Add other user fields if needed
}

// Basic logger placeholder (replace with a proper logging solution if needed)
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

// Get grouped LLM data outside the component for static rendering
// This prevents re-calculating on every render
const groupedLLMs = groupLLMsByProvider();

export default function Page() {
    // Authentication context hook
    const { user, loading: authLoading } = useAuth();

    // State for managing session start process
    const [isStartingSession, setIsStartingSession] = useState(false);
    // State for the current active session configuration
    const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
    // State for the ID of the active conversation
    const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
    // State to store the user's saved API secret references (fetched from Firestore)
    const [userApiSecrets, setUserApiSecrets] = useState<{ [key: string]: string } | null>(null);
    // State to track loading of user secrets
    const [secretsLoading, setSecretsLoading] = useState(true);
    // State for displaying page-level errors
    const [pageError, setPageError] = useState<string | null>(null);

    // Effect to fetch user data (API secret references) when user logs in or out
    useEffect(() => {
        // If no user is logged in, reset state and stop loading
        if (!user) {
            setUserApiSecrets(null);
            setSessionConfig(null);
            setActiveConversationId(null);
            setSecretsLoading(false);
            setPageError(null);
            return;
        }

        // If user is logged in and secrets haven't been fetched yet
        if (user && userApiSecrets === null) {
            setSecretsLoading(true);
            setPageError(null);
            const userDocRef = doc(db, "users", user.uid);
            logger.info("Fetching user data for API secrets...");

            getDoc(userDocRef)
                .then((docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserData;
                        // Store the fetched secret versions or an empty object if none exist
                        setUserApiSecrets(data.apiSecretVersions || {});
                        logger.info("User API secret versions loaded.");
                    } else {
                        // User document doesn't exist (new user or data missing)
                        logger.warn(`User document not found for user ${user.uid}. Assuming no API keys saved yet.`);
                        setUserApiSecrets({}); // Set to empty object, user needs to add keys
                    }
                })
                .catch((err: FirestoreError) => {
                    // Handle Firestore errors
                    logger.error("Error fetching user document:", err);
                    setPageError(`Failed to load user data: ${err.message}. Please try refreshing.`);
                    setUserApiSecrets(null); // Indicate failure to load
                })
                .finally(() => {
                    // Stop loading indicator regardless of success or failure
                    setSecretsLoading(false);
                });
        } else if (user && userApiSecrets !== null) {
            // If user exists and secrets are already loaded, ensure loading state is false
             if (secretsLoading) {
                setSecretsLoading(false);
             }
        }
        // Dependencies for the effect: user object and the secrets state itself
    }, [user, userApiSecrets, secretsLoading]);


    // Callback function passed to SessionSetupForm to initiate a new conversation
    const handleStartSession = async (config: SessionConfig) => {
        // Ensure user is authenticated
        if (!user) {
            setPageError("User not found. Please sign in again.");
            return;
        }
        // Ensure user API key configuration is loaded (even if empty)
        if (userApiSecrets === null) {
            setPageError("User API key configuration could not be loaded. Please refresh or check settings.");
            return;
        }

        logger.info("Attempting to start session via API with full config:", config);
        setIsStartingSession(true); // Show loading state
        setPageError(null); // Clear previous errors
        setSessionConfig(null); // Reset current session config
        setActiveConversationId(null); // Reset active conversation

        try {
            // Get the Firebase ID token for authentication with the API route
            const idToken = await user.getIdToken();
            logger.info("Obtained ID Token for API call.");

            // Call the backend API route to start the conversation
            const response = await fetch('/api/conversation/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}` // Pass token in Authorization header
                },
                body: JSON.stringify(config), // Send the session configuration
            });

            // Handle API errors
            if (!response.ok) {
                let errorMsg = `API Error: ${response.status} ${response.statusText}`;
                try {
                    // Try to parse a more specific error message from the response body
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg;
                } catch (parseError) {
                    // If parsing fails, stick with the status text
                    logger.warn("Could not parse error response JSON:", parseError);
                    errorMsg = `API Error: ${response.status} ${response.statusText}`;
                }
                throw new Error(errorMsg);
            }

            // Parse the successful API response
            const result: StartApiResponse = await response.json();
            logger.info("API Response received:", result);

            // Validate the response
            if (!result.conversationId) {
                throw new Error("API response successful but did not include a conversationId.");
            }

            // Set the state to activate the ChatInterface
            logger.info(`Session setup successful via API. Conversation ID: ${result.conversationId}`);
            setSessionConfig(config);
            setActiveConversationId(result.conversationId);

        } catch (error) {
            // Handle errors during the API call or response processing
            logger.error("Failed to start session:", error);
            setPageError(`Error starting session: ${error instanceof Error ? error.message : String(error)}`);
            setSessionConfig(null); // Ensure session state is reset on error
            setActiveConversationId(null);
        } finally {
            // Stop the loading indicator
            setIsStartingSession(false);
        }
    };

    // Callback function passed to ChatInterface, triggered when a conversation ends
    const handleConversationStopped = () => {
        logger.info("Conversation stopped callback triggered on page.");
        // Reset session state to show the setup form again
        setSessionConfig(null);
        setActiveConversationId(null);
        setPageError(null); // Clear any errors
    };

    // --- Render Logic ---

    // Show loading indicator while authentication or secrets are loading
    if (authLoading || secretsLoading) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-muted-foreground animate-pulse">Loading user data...</p>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
            {/* Display page-level errors */}
            {pageError && (
                 <Alert variant="destructive" className="mb-6 max-w-3xl w-full flex-shrink-0">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{pageError}</AlertDescription>
                </Alert>
            )}

            {/* Main content area */}
            <div className="w-full max-w-3xl flex flex-col items-center space-y-8 flex-grow pt-8 md:pt-12">
                {user ? (
                    // --- Authenticated User View ---
                    // If no active session, show the setup form
                    !sessionConfig || !activeConversationId ? (
                         <SessionSetupForm
                             onStartSession={handleStartSession}
                             isLoading={isStartingSession}
                             // Pass userApiSecrets if needed by the form for validation/display
                             // userApiSecrets={userApiSecrets}
                         />
                    ) : (
                        // If session is active, show the chat interface
                        <ChatInterface
                            conversationId={activeConversationId}
                            onConversationStopped={handleConversationStopped}
                        />
                    )
                ) : (
                    // --- Unauthenticated User View (Landing Page) ---
                    <>
                        {/* Welcome Section */}
                        <div className="p-6 bg-card text-card-foreground rounded-lg shadow-md space-y-4 text-center w-full">
                             <h1 className="text-2xl font-bold">Welcome to Two AIs</h1>
                             <p className="text-muted-foreground">Listen to conversations between distinct AI agents.</p>

                             {/* API KEY REQUIREMENT NOTICE */}
                             <Alert variant="default" className="text-left border-theme-primary/50">
                                <KeyRound className="h-4 w-4 text-theme-primary" />
                                <AlertTitle className="font-semibold">API Keys Required</AlertTitle>
                                <AlertDescription>
                                    To run conversations, you&apos;ll need to provide your own API keys for the AI models you wish to use (e.g., OpenAI, Google AI, Anthropic) after signing in.
                                </AlertDescription>
                             </Alert>

                             <p className="text-muted-foreground pt-2">Please use the link in the header to sign in or create an account to start.</p>
                        </div>

                        {/* Available LLMs Section */}
                        <Card className="w-full">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-center text-xl">
                                    <BrainCircuit className="mr-2 h-5 w-5" />
                                    Currently Available LLMs
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Use groupedLLMs which is already defined */}
                                {Object.entries(groupedLLMs).map(([provider, llms]) => (
                                    <div key={provider}>
                                        <h3 className="text-lg font-semibold mb-2 border-b pb-1">{provider}</h3>
                                        <ul className="space-y-1 list-disc list-inside text-sm">
                                            {llms.map((llm) => (
                                                <li key={llm.id} className="ml-4">
                                                    {llm.name}
                                                    {/* Display badges for model status */}
                                                    {llm.status === 'preview' && <Badge variant="outline" className="ml-2 text-orange-600 border-orange-600">Preview</Badge>}
                                                    {llm.status === 'experimental' && <Badge variant="outline" className="ml-2 text-yellow-600 border-yellow-600">Experimental</Badge>}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </main>
    );
}
