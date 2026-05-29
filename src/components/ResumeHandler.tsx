import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/hooks/useTranslation';
import type { User } from 'firebase/auth';
import type {
    ImageMediaProvider,
    ImageSearchOrientation,
    ImageSearchSize,
    ImageSearchType,
    PixabayMediaType,
    VideoSearchDuration,
    VideoSearchType,
} from '@/lib/image-media';

interface AgentTTSSettingsConfig {
    provider: string;
    voice: string | null;
    selectedTtsModelId?: string;
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
    ollamaEndpoint?: string;
    localaiEndpoint?: string;
    lookaheadLimit?: number;
    imageGenSettings?: {
        enabled: boolean;
        provider: ImageMediaProvider;
        invokeaiEndpoint?: string;
        invokeaiModel?: string;
        invokeaiLoraKey?: string;
        invokeaiLoraWeight?: number;
        negativePrompt?: string;
        steps?: number;
        guidanceScale?: number;
        width?: number;
        height?: number;
        seed?: number;
        scheduler?: string;
        clipSkip?: number;
        cfgRescaleMultiplier?: number;
        promptLlm: string;
        promptSystemMessage: string;
        promptLookaheadLimit?: number;
        mediaGranularity?: 'paragraph' | 'sentence';
        panoramaMode?: boolean;
        pixabayMediaType?: PixabayMediaType;
        searchOrientation?: ImageSearchOrientation;
        searchSize?: ImageSearchSize;
        searchImageType?: ImageSearchType;
        videoSearchType?: VideoSearchType;
        videoSearchDuration?: VideoSearchDuration;
    };
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
                            imageGenSettings: data.imageGenSettings,
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
            <section className="flex min-h-screen items-center justify-center p-4" role="main" aria-labelledby="resume-loading-title">
                <div role="status" aria-live="polite" aria-busy="true">
                    <h1 id="resume-loading-title" className="sr-only">Resuming Conversation</h1>
                    <p className="text-muted-foreground animate-pulse">{t.page_LoadingUserData}</p>
                </div>
            </section>
        );
    }
    if (resumeError) {
        return (
            <section className="flex min-h-screen items-center justify-center p-4" role="main" aria-labelledby="resume-error-title">
                <div role="alert" aria-live="assertive">
                    <h1 id="resume-error-title" className="sr-only">Resume Error</h1>
                    <p className="text-destructive-foreground">{resumeError}</p>
                </div>
            </section>
        );
    }
    return null;
} 
