// src/components/session/SessionSetupForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
// --- LINT FIX: Removed unused DocumentData import ---
import { doc, getDoc } from 'firebase/firestore';
// --- END LINT FIX ---
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

// Define available LLM options with grouping info and required key
const llmOptions = [
    { provider: 'OpenAI', value: 'openai_gpt4o', label: 'GPT-4o', requiredKey: 'openai' },
    { provider: 'OpenAI', value: 'openai_gpt35', label: 'GPT-3.5 Turbo', requiredKey: 'openai' },
    { provider: 'Google AI', value: 'google_gemini15pro', label: 'Gemini 1.5 Pro', requiredKey: 'google_ai' },
    { provider: 'Google AI', value: 'google_gemini10pro', label: 'Gemini 1.0 Pro', requiredKey: 'google_ai' },
];

// Group options by provider
const groupedOptions = llmOptions.reduce((acc, option) => {
    (acc[option.provider] = acc[option.provider] || []).push(option);
    return acc;
}, {} as Record<string, typeof llmOptions>);


interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
}

interface SessionSetupFormProps {
    onStartSession: (config: SessionConfig) => void;
    isLoading: boolean;
}

export default function SessionSetupForm({ onStartSession, isLoading }: SessionSetupFormProps) {
    const { user, loading: authLoading } = useAuth();
    const [agentA_llm, setAgentA_llm] = useState<string>('');
    const [agentB_llm, setAgentB_llm] = useState<string>('');
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
                    const requiredKeys = new Set(llmOptions.map(o => o.requiredKey));

                    if (userDocSnap.exists()) {
                        const data = userDocSnap.data(); // data() returns DocumentData implicitly
                        const versions = data.apiSecretVersions || {};
                        requiredKeys.forEach(keyId => {
                            status[keyId] = !!(versions[keyId] && typeof versions[keyId] === 'string' && versions[keyId].length > 0);
                        });
                    } else {
                        requiredKeys.forEach(keyId => { status[keyId] = false; });
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

    const handleStartClick = () => {
        const agentAOption = llmOptions.find(o => o.value === agentA_llm);
        const agentBOption = llmOptions.find(o => o.value === agentB_llm);

        if (!agentAOption || !agentBOption) {
                alert("Invalid selection.");
                return;
        }

        const isAgentAKeyMissing = !savedKeyStatus[agentAOption.requiredKey];
        const isAgentBKeyMissing = !savedKeyStatus[agentBOption.requiredKey];

        if (isAgentAKeyMissing || isAgentBKeyMissing) {
            let missingKeysMsg = "Missing required API key(s) in Settings for: ";
            if (isAgentAKeyMissing) missingKeysMsg += `${agentAOption.provider} `;
            if (isAgentBKeyMissing) missingKeysMsg += `${agentBOption.provider}`;
            alert(missingKeysMsg.trim() + ".");
            return;
        }

        if (agentA_llm && agentB_llm) {
            onStartSession({ agentA_llm, agentB_llm });
        } else {
            alert("Please select an LLM for both Agent A and Agent B.");
        }
    };

    const isStartDisabled = isLoading || isLoadingStatus || !agentA_llm || !agentB_llm || !user;

    const isOptionDisabled = (requiredKey: string): boolean => {
        return isLoadingStatus || !savedKeyStatus[requiredKey];
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Start a New Conversation</CardTitle>
                <CardDescription>Select the Large Language Model for each agent.</CardDescription>
                {statusError && (
                        <p className="text-sm text-destructive">{statusError}</p>
                )}
                {isLoadingStatus && !authLoading && (
                        <p className="text-sm text-muted-foreground">Loading API key status...</p>
                )}
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Agent A Selection */}
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
                            {Object.entries(groupedOptions).map(([provider, options]) => (
                                <SelectGroup key={provider}>
                                    <SelectLabel>{provider}</SelectLabel>
                                    {options.map(option => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            disabled={isOptionDisabled(option.requiredKey)}
                                        >
                                            {option.label}
                                            {isOptionDisabled(option.requiredKey) && (
                                                <span className="ml-2 text-xs text-muted-foreground">(API Key Missing)</span>
                                            )}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Agent B Selection */}
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
                                {Object.entries(groupedOptions).map(([provider, options]) => (
                                <SelectGroup key={provider}>
                                    <SelectLabel>{provider}</SelectLabel>
                                    {options.map(option => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                            disabled={isOptionDisabled(option.requiredKey)}
                                        >
                                            {option.label}
                                            {isOptionDisabled(option.requiredKey) && (
                                                    <span className="ml-2 text-xs text-muted-foreground">(API Key Missing)</span>
                                            )}
                                        </SelectItem>
                                    ))}
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
