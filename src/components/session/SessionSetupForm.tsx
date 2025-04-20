// src/components/session/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
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
                        const data = userDocSnap.data();
                        const versions: Record<string, any> = data?.apiSecretVersions || {};
                        // --- FIX: Check status using the Firestore keys ('openai', 'google_ai') ---
                        FIRESTORE_KEY_IDS.forEach(keyId => {
                            const versionValue = versions[keyId];
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
                    setSavedKeyStatus({});
                } finally {
                    setIsLoadingStatus(false);
                }
            } else if (!authLoading) {
                setSavedKeyStatus({});
                setIsLoadingStatus(false);
            }
        };
        fetchKeyStatus();
    }, [user, authLoading]);

    // Handle start button click
    const handleStartClick = () => {
        const agentAOption = AVAILABLE_LLMS.find((llm: LLMInfo) => llm.id === agentA_llm);
        const agentBOption = AVAILABLE_LLMS.find((llm: LLMInfo) => llm.id === agentB_llm);

        if (!agentAOption || !agentBOption) {
                alert("Please select a model for both Agent A and Agent B.");
                return;
        }

        // --- FIX: Check key status using the correct key ('openai' or 'google_ai') ---
        const agentARequiredKey = agentAOption.provider === 'OpenAI' ? 'openai' : (agentAOption.provider === 'Google' ? 'google_ai' : null);
        const agentBRequiredKey = agentBOption.provider === 'OpenAI' ? 'openai' : (agentBOption.provider === 'Google' ? 'google_ai' : null);

        // Ensure we derived valid keys (should always work if provider is OpenAI or Google)
        if (!agentARequiredKey || !agentBRequiredKey) {
             alert("Internal error: Could not determine required key type for selected models.");
             return;
        }

        const isAgentAKeyMissing = !savedKeyStatus[agentARequiredKey];
        const isAgentBKeyMissing = !savedKeyStatus[agentBRequiredKey];

        if (isAgentAKeyMissing || isAgentBKeyMissing) {
            let missingKeysMsg = "Missing required API key version name in Settings for: ";
            const missingProviders = new Set<string>();
            if (isAgentAKeyMissing) missingProviders.add(agentAOption.provider);
            if (isAgentBKeyMissing) missingProviders.add(agentBOption.provider);
            missingKeysMsg += Array.from(missingProviders).join(', ');
            alert(missingKeysMsg + ".");
            return;
        }

        onStartSession({ agentA_llm, agentB_llm });
    };

    const isStartDisabled = isLoading || isLoadingStatus || !agentA_llm || !agentB_llm || !user;

    // Helper function to check if a specific LLM option should be disabled
    const isOptionDisabled = (llm: LLMInfo): boolean => {
         // --- FIX: Check status using the correct key ('openai' or 'google_ai') ---
        const requiredKey = llm.provider === 'OpenAI' ? 'openai' : (llm.provider === 'Google' ? 'google_ai' : null);
        if (!requiredKey) return true; // Disable if provider isn't recognized for key check
        return isLoadingStatus || !savedKeyStatus[requiredKey];
    };

    // --- Render the form ---
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Start a New Conversation</CardTitle>
                <CardDescription>Select the Large Language Model and pricing for each agent.</CardDescription>
                {statusError && (
                    <p className="text-sm text-destructive">{statusError}</p>
                )}
                {isLoadingStatus && !authLoading && (
                    <p className="text-sm text-muted-foreground">Loading API key status...</p>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* --- Agent A Selection --- */}
                <div className="space-y-2">
                    <Label htmlFor="agentA-llm">Agent A Model</Label>
                    <Select
                        value={agentA_llm}
                        onValueChange={setAgentA_llm}
                        disabled={isLoading || isLoadingStatus || !user}
                    >
                        <SelectTrigger id="agentA-llm">
                            <SelectValue placeholder="Select LLM for Agent A" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(groupedOptions).map(([provider, llms]: [string, LLMInfo[]]) => (
                                <SelectGroup key={provider}>
                                    <SelectLabel>{provider}</SelectLabel>
                                    {llms.map((llm: LLMInfo) => {
                                        const isDisabled = isOptionDisabled(llm);
                                        return (
                                            <SelectItem
                                                key={llm.id}
                                                value={llm.id}
                                                disabled={isDisabled}
                                                className="flex justify-between items-center pr-2"
                                            >
                                                <div className="flex justify-between items-center w-full text-sm">
                                                    <div className="flex flex-col items-start mr-2">
                                                        <span>
                                                            {llm.name}
                                                            {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                        </span>
                                                        {isDisabled && (
                                                            <span className="text-xs text-muted-foreground">(API Key Missing)</span>
                                                        )}
                                                    </div>
                                                    {!isDisabled && (
                                                        <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
                                                            ${llm.pricing.input.toFixed(2)} / ${llm.pricing.output.toFixed(2)} MTok
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
                            {Object.entries(groupedOptions).map(([provider, llms]: [string, LLMInfo[]]) => (
                                <SelectGroup key={provider}>
                                    <SelectLabel>{provider}</SelectLabel>
                                    {llms.map((llm: LLMInfo) => {
                                        const isDisabled = isOptionDisabled(llm);
                                        return (
                                            <SelectItem
                                                key={llm.id}
                                                value={llm.id}
                                                disabled={isDisabled}
                                                className="flex justify-between items-center pr-2"
                                            >
                                                <div className="flex justify-between items-center w-full text-sm">
                                                    <div className="flex flex-col items-start mr-2">
                                                        <span>
                                                            {llm.name}
                                                            {llm.status === 'preview' && <span className="ml-1 text-xs text-orange-500">(Preview)</span>}
                                                        </span>
                                                         {isDisabled && (
                                                            <span className="text-xs text-muted-foreground">(API Key Missing)</span>
                                                        )}
                                                    </div>
                                                    {!isDisabled && (
                                                         <span className="text-xs text-muted-foreground whitespace-nowrap pl-2 flex-shrink-0">
                                                            ${llm.pricing.input.toFixed(2)} / ${llm.pricing.output.toFixed(2)} MTok
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
                    {isLoading ? 'Starting...' : 'Start Conversation'}
                </Button>

                {!user && !authLoading && (
                    <p className="text-center text-sm text-destructive">
                        Please sign in to start a conversation.
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
