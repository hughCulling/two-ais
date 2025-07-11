import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import type { User } from 'firebase/auth';

interface AgentTTSSettingsConfig {
    provider: string;
    voice: string | null;
    ttsApiModelId?: string;
}
interface SessionConfig {
    agentA_llm: string;
    agentB_llm: string;
    ttsEnabled: boolean;
    agentA_tts: AgentTTSSettingsConfig;
    agentB_tts: AgentTTSSettingsConfig;
    language?: string;
    initialSystemPrompt: string;
}

export default function ResumeHandler({
    user,
    activeConversationId,
    sessionConfig,
    setSessionConfig,
    setActiveConversationId,
    hasManuallyStopped,
    setHasManuallyStopped
}: {
    user: User | null;
    activeConversationId: string | null;
    sessionConfig: SessionConfig | null;
    setSessionConfig: (config: SessionConfig | null) => void;
    setActiveConversationId: (id: string | null) => void;
    hasManuallyStopped: boolean;
    setHasManuallyStopped: (v: boolean) => void;
}) {
    const searchParams = useSearchParams();
    const resumeConversationId = searchParams.get('resume');
    const [resumeLoading, setResumeLoading] = useState(false);
    const [resumeError, setResumeError] = useState<string | null>(null);
    const { t, loading } = useTranslation();
    const [pollingForRunning, setPollingForRunning] = useState(false);

    useEffect(() => {
        if (!user || !resumeConversationId || activeConversationId || sessionConfig || hasManuallyStopped) return;
        setResumeLoading(true);
        setResumeError(null);
        const fetchResume = async () => {
            try {
                const idToken = await user?.getIdToken();
                const resumeResponse = await fetch(`/api/conversation/${resumeConversationId}/resume`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${idToken}` },
                });
                if (!resumeResponse.ok) {
                    const errorData = await resumeResponse.json().catch(() => ({}));
                    throw new Error(errorData.error || 'Failed to resume conversation.');
                }
                setPollingForRunning(true);
            } catch (err) {
                setResumeError(err instanceof Error ? err.message : String(err));
            } finally {
                setResumeLoading(false);
            }
        };
        fetchResume();
    }, [user, resumeConversationId, activeConversationId, sessionConfig, hasManuallyStopped, setSessionConfig, setActiveConversationId, setHasManuallyStopped]);

    useEffect(() => {
        if (!pollingForRunning || !user || !resumeConversationId || activeConversationId || sessionConfig || hasManuallyStopped) return;
        let cancelled = false;
        const pollDetails = async () => {
            const idToken = await user.getIdToken();
            const maxAttempts = 20;
            let attempt = 0;
            while (attempt < maxAttempts && !cancelled) {
                const response = await fetch(`/api/conversation/${resumeConversationId}/details`, {
                    headers: { 'Authorization': `Bearer ${idToken}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'running') {
                        setSessionConfig({
                            agentA_llm: data.agentA_llm,
                            agentB_llm: data.agentB_llm,
                            ttsEnabled: data.ttsSettings?.enabled || false,
                            agentA_tts: data.ttsSettings?.agentA || { provider: 'none', voice: null },
                            agentB_tts: data.ttsSettings?.agentB || { provider: 'none', voice: null },
                            language: data.language,
                            initialSystemPrompt: data.initialSystemPrompt || '',
                        });
                        setActiveConversationId(resumeConversationId);
                        setPollingForRunning(false);
                        return;
                    }
                }
                attempt++;
                await new Promise(res => setTimeout(res, 500));
            }
            if (!cancelled) {
                setResumeError('Conversation did not become active in time. Please try again.');
                setPollingForRunning(false);
            }
        };
        pollDetails();
        return () => { cancelled = true; };
    }, [pollingForRunning, user, resumeConversationId, activeConversationId, sessionConfig, hasManuallyStopped, setSessionConfig, setActiveConversationId]);

    if (loading || !t) return null;
    if (resumeLoading || pollingForRunning) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-muted-foreground animate-pulse">{t.page_LoadingUserData}</p>
            </main>
        );
    }
    if (resumeError) {
        return (
            <main className="flex min-h-screen items-center justify-center p-4">
                <p className="text-destructive-foreground">{resumeError}</p>
            </main>
        );
    }
    return null;
} 