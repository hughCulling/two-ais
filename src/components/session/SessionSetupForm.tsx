// src/components/session/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc, DocumentData } from 'firebase/firestore'; // Import DocumentData
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase/clientApp';
// Import the centralized LLM data and helpers
import { AVAILABLE_LLMS, LLMInfo, groupLLMsByProvider } from '@/lib/models'; // Adjust path if needed

// Define the config passed upwards (uses backend IDs now)
interface SessionConfig {
    agentA_llm: string; // e.g., 'gpt-4o'
    agentB_llm: string; // e.g., 'gemini-1.5-pro-latest'
}

interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void;
    isLoading: boolean; // Loading state for the API call to start the session
}

// Get grouped options from the centralized data
const groupedOptions = groupLLMsByProvider();

// --- Define the keys used in Firestore user doc's apiSecretVersions map ---
// These match the 'id' used in ApiKeyManager's initialApiKeys
const FIRESTORE_KEY_IDS = ['openai', 'google_ai']; // Add others like 'anthropic' if needed

export default function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth();
    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
    // Key status will now use 'openai', 'google_ai' as keys
    const [savedKeyStatus, setSavedKeyStatus] = useState<Record<string, boolean>>({});
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);

    // Fetch saved key status from Firestore
    useEffect(() => {
        const fetchKeyStatus = async () => {
            if (user) {
                setIsLoadingStatus(true);
                setStatusError(null);
                try {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    const status: Record<string, boolean> = {};

                    if (userDocSnap.exists()) {
                        // Explicitly type data from Firestore snapshot
                        const data: DocumentData = userDocSnap.data();
                        // --- FIX: Replace 'any' with 'string' for the value type ---
                        // Assuming apiSecretVersions stores string values (the version names)
                        const versions: Record<string, string> = data?.apiSecretVersions || {};
                        // --- End Fix ---

                        // Check status using the Firestore keys ('openai', 'google_ai')
                        FIRESTORE_KEY_IDS.forEach(keyId => {
                            const versionValue = versions[keyId];
                            // Check if the value exists and is a non-empty string
                            status[keyId] = !!(versionValue && typeof versionValue === 'string' && versionValue.length > 0);
                        });
                    } else {
                         // If user doc doesn't exist, no keys are saved
                        FIRESTORE_KEY_IDS.forEach(keyId => { status[keyId] = false; });
                    }
                    setSavedKeyStatus(status);
                } catch (error) {
                    console.error("Error fetching key status:", error);
                    setStatusError("Could not load API key status.");
                    // Reset status on error
                    const resetStatus: Record<string, boolean> = {};
                    FIRESTORE_KEY_IDS.forEach(keyId => { resetStatus[keyId] = false; });
                    setSavedKeyStatus(resetStatus);
                } finally {
                    setIsLoadingStatus(false);
                }
            } else if (!authLoading) {
                // If no user and auth is not loading, reset status
                const resetStatus: Record<string, boolean> = {};
                FIRESTORE_KEY_IDS.forEach(keyId => { resetStatus[keyId] = false; });
                setSavedKeyStatus(resetStatus);
                setIsLoadingStatus(false);
            }
        };
        fetchKeyStatus();
    }, [user, authLoading]);

    // Handle start button click
    const handleStartClick = () => {
        // Find the selected LLM objects using their IDs
        const agentAOption = AVAILABLE_LLMS.find((llm: LLMInfo) => llm.id === agentA_llm);
        const agentBOption = AVAILABLE_LLMS.find((llm: LLMInfo) => llm.id === agentB_llm);

        // Ensure both models are selected
        if (!agentAOption || !agentBOption) {
                // Use a more user-friendly notification if possible (e.g., toast)
                alert("Please select a model for both Agent A and Agent B.");
                return;
        }

        // Determine the required Firestore key ID based on the provider
        const agentARequiredKey = agentAOption.provider === 'OpenAI' ? 'openai' : (agentAOption.provider === 'Google' ? 'google_ai' : null);
        const agentBRequiredKey = agentBOption.provider === 'OpenAI' ? 'openai' : (agentBOption.provider === 'Google' ? 'google_ai' : null);

        // Basic check if the provider mapping worked (should generally not fail if models are configured correctly)
        if (!agentARequiredKey || !agentBRequiredKey) {
             console.error("Internal error: Could not determine required key type for selected models.", { agentAOption, agentBOption });
             alert("An internal error occurred. Could not verify API keys for the selected models.");
             return;
        }

        // Check if the required keys are marked as saved in the fetched status
        const isAgentAKeyMissing = !savedKeyStatus[agentARequiredKey];
        const isAgentBKeyMissing = !savedKeyStatus[agentBRequiredKey];

        // If any required key is missing, show an alert
        if (isAgentAKeyMissing || isAgentBKeyMissing) {
            let missingKeysMsg = "Missing required API key version name in Settings for: ";
            const missingProviders = new Set<string>();
            if (isAgentAKeyMissing) missingProviders.add(agentAOption.provider);
            if (isAgentBKeyMissing) missingProviders.add(agentBOption.provider);
            missingKeysMsg += Array.from(missingProviders).join(' and '); // Use 'and' for better readability
            alert(missingKeysMsg + ".");
            return;
        }

        // If all checks pass, call the parent component's handler
        onStartSession({ agentA_llm, agentB_llm });
    };

    // Determine if the start button should be disabled
    const isStartDisabled = isLoading || isLoadingStatus || !agentA_llm || !agentB_llm || !user;

    // Helper function to check if a specific LLM option should be disabled based on key status
    const isOptionDisabled = (llm: LLMInfo): boolean => {
        // Determine the required Firestore key ID based on the provider
        const requiredKey = llm.provider === 'OpenAI' ? 'openai' : (llm.provider === 'Google' ? 'google_ai' : null);
        // Disable if provider isn't recognized or if the key status is loading or the key is not saved
        if (!requiredKey) return true;
        return isLoadingStatus || !savedKeyStatus[requiredKey];
    };

    // --- Render the form ---
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Start a New Conversation</CardTitle>
                <CardDescription>Select the Large Language Model and pricing for each agent.</CardDescription>
                {/* Display error message if fetching status failed */}
                {statusError && (
                    <p className="text-sm text-destructive pt-2">{statusError}</p>
                )}
                {/* Display loading indicator while fetching key status */}
                {isLoadingStatus && !authLoading && !statusError && (
                    <p className="text-sm text-muted-foreground pt-2">Loading API key status...</p>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* --- Agent A Selection --- */}
                <div className="space-y-2">
                    <Label htmlFor="agentA-llm">Agent A Model</Label>
                    <Select
                        value={agentA_llm}
                        onValueChange={setAgentA_llm}
                        // Disable select while loading API call, key status, or if user is not logged in
                        disabled={isLoading || isLoadingStatus || !user}
                    >
                        <SelectTrigger id="agentA-llm">
                            <SelectValue placeholder="Select LLM for Agent A" />
                        </SelectTrigger>
                        <SelectContent>
                            {/* Map through grouped LLM options */}
                            {Object.entries(groupedOptions).map(([provider, llms]: [string, LLMInfo[]]) => (
                                <SelectGroup key={provider}>
                                    <SelectLabel>{provider}</SelectLabel>
                                    {/* Map through LLMs within each provider group */}
                                    {llms.map((llm: LLMInfo) => {
                                        const isDisabled = isOptionDisabled(llm);
                                        return (
                                            <SelectItem
                                                key={llm.id}
                                                value={llm.id}
                                                disabled={isDisabled}
                                                // Added padding for better spacing
                                                className="flex justify-between items-center pr-2 py-2"
                                            >
                                                {/* Flex container for layout */}
                                                <div className="flex justify-between items-center w-full text-sm">
                                                    {/* Left side: Name and status/disabled text */}
                                                    <div className="flex flex-col items-start mr-2 overflow-hidden">
                                                        <span className="truncate" title={llm.name}> {/* Added truncate and title */}
                                                            {llm.name}
                                                            {/* Show preview tag if applicable */}
                                                            {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                        </span>
                                                        {/* Show message if option is disabled */}
                                                        {isDisabled && !isLoadingStatus && ( // Only show if not loading
                                                            <span className="text-xs text-muted-foreground">(API Key Missing)</span>
                                                        )}
                                                    </div>
                                                    {/* Right side: Pricing info (only if not disabled) */}
                                                    {!isDisabled && (
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
                                                            ${llm.pricing.input.toFixed(2)} / ${llm.pricing.output.toFixed(2)} MTok
                                                            {/* Optional pricing note */}
                                                            {/* {llm.pricing.note && <span className="italic ml-1">({llm.pricing.note})</span>} */}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* --- Agent B Selection (Mirrors Agent A structure) --- */}
                <div className="space-y-2">
                    <Label htmlFor="agentB-llm">Agent B Model</Label>
                    <Select
                        value={agentB_llm}
                        onValueChange={setAgentB_llm}
                        disabled={isLoading || isLoadingStatus || !user}
                    >
                        <SelectTrigger id="agentB-llm">
                            <SelectValue placeholder="Select LLM for Agent B" />
                        </SelectTrigger>
                        <SelectContent>
                             {/* Map through grouped LLM options */}
                            {Object.entries(groupedOptions).map(([provider, llms]: [string, LLMInfo[]]) => (
                                <SelectGroup key={provider}>
                                    <SelectLabel>{provider}</SelectLabel>
                                     {/* Map through LLMs within each provider group */}
                                    {llms.map((llm: LLMInfo) => {
                                        const isDisabled = isOptionDisabled(llm);
                                        return (
                                            <SelectItem
                                                key={llm.id}
                                                value={llm.id}
                                                disabled={isDisabled}
                                                // Added padding for better spacing
                                                className="flex justify-between items-center pr-2 py-2"
                                            >
                                                 {/* Flex container for layout */}
                                                <div className="flex justify-between items-center w-full text-sm">
                                                     {/* Left side: Name and status/disabled text */}
                                                    <div className="flex flex-col items-start mr-2 overflow-hidden">
                                                        <span className="truncate" title={llm.name}> {/* Added truncate and title */}
                                                            {llm.name}
                                                             {/* Show preview tag if applicable */}
                                                            {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                        </span>
                                                         {/* Show message if option is disabled */}
                                                         {isDisabled && !isLoadingStatus && ( // Only show if not loading
                                                            <span className="text-xs text-muted-foreground">(API Key Missing)</span>
                                                        )}
                                                    </div>
                                                    {/* Right side: Pricing info (only if not disabled) */}
                                                    {!isDisabled && (
                                                         <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
                                                            ${llm.pricing.input.toFixed(2)} / ${llm.pricing.output.toFixed(2)} MTok
                                                            {/* Optional pricing note */}
                                                            {/* {llm.pricing.note && <span className="italic ml-1">({llm.pricing.note})</span>} */}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Start Button */}
                <Button
                    onClick={handleStartClick}
                    disabled={isStartDisabled}
                    className="w-full"
                >
                    {/* Show different text based on loading state */}
                    {isLoading ? 'Starting...' : 'Start Conversation'}
                </Button>

                {/* Show sign-in prompt if user is not logged in and auth is finished loading */}
                {!user && !authLoading && (
                    <p className="text-center text-sm text-destructive">
                        Please sign in to start a conversation.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

