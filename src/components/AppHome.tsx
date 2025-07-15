"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import SessionSetupForm from "@/components/session/SessionSetupForm";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { db, ensureAppCheckInitialized } from "@/lib/firebase/clientApp";
import { doc, getDoc } from "firebase/firestore";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from '@/hooks/useTranslation';
import ResumeHandler from "./ResumeHandler";

// --- Types from page.tsx ---
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
interface UserData {
    apiSecretVersions?: { [key: string]: string };
}
interface StartApiResponse {
    message: string;
    conversationId: string;
    config?: SessionConfig;
}
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

export default function AppHome() {
  const { user } = useAuth();
  const { t, loading } = useTranslation();
  // Move all useState/useEffect hooks here
  const [isStartingSession, setIsStartingSession] = useState(false);
  const [sessionConfig, setSessionConfig] = useState<SessionConfig | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [userApiSecrets, setUserApiSecrets] = useState<{ [key: string]: string } | null>(null);
  const [secretsLoading, setSecretsLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [hasManuallyStopped, setHasManuallyStopped] = useState(false);

  // Extract t!.page_ErrorLoadingUserData to a variable for useEffect dependency
  const pageErrorLoadingUserData = t?.page_ErrorLoadingUserData;

  useEffect(() => {
    if (!user) {
        setUserApiSecrets(null);
        setSessionConfig(null);
        setActiveConversationId(null);
        setSecretsLoading(false);
        setPageError(null);
        setHasManuallyStopped(false);
        return;
    }
    if (user && userApiSecrets === null) {
        setSecretsLoading(true);
        setPageError(null);
        const fetchUserData = async () => {
            await ensureAppCheckInitialized();
            const userDocRef = doc(db, "users", user.uid);
            logger.info("Fetching user data for API secrets...");
            try {
                const docSnap = await getDoc(userDocRef);
                if (docSnap.exists()) {
                    const data = docSnap.data() as UserData;
                    setUserApiSecrets(data.apiSecretVersions || {});
                    logger.info("User API secret versions loaded.");
                } else {
                    logger.warn(`User document not found for user ${user.uid}. Assuming no API keys saved yet.`);
                    setUserApiSecrets({});
                }
            } catch (err: unknown) {
                logger.error("Error fetching user document:", err);
                const errorMessage =
                  err && typeof err === "object" && "message" in err
                    ? String((err as { message: unknown }).message)
                    : String(err);
                setPageError(t!.page_ErrorLoadingUserData.replace("{errorMessage}", errorMessage));
                setUserApiSecrets(null);
            } finally {
                setSecretsLoading(false);
            }
        };
        fetchUserData();
    } else if (user && userApiSecrets !== null) {
         if (secretsLoading) {
            setSecretsLoading(false);
         }
    }
}, [user, userApiSecrets, secretsLoading, pageErrorLoadingUserData, t]);

const handleStartSession = async (config: SessionConfig) => {
    if (!user) {
        setPageError(t!.page_ErrorUserNotFound); return;
    }
    if (userApiSecrets === null) {
        setPageError(t!.page_ErrorUserApiKeyConfig); return;
    }
    logger.info("Attempting to start session via API with full config:", config);
    setIsStartingSession(true);
    setPageError(null);
    setSessionConfig(null);
    setActiveConversationId(null);
    setHasManuallyStopped(false);
    try {
        const idToken = await user.getIdToken();
        logger.info("Obtained ID Token for API call.");
        const configWithLanguage = {
            ...config,
            language: config.language,
            initialSystemPrompt: config.initialSystemPrompt,
        };
        const response = await fetch('/api/conversation/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` },
            body: JSON.stringify(configWithLanguage),
        });
        if (!response.ok) {
            let errorMsg = t!.page_ErrorStartingSessionAPI.replace("{status}", response.status.toString()).replace("{statusText}", response.statusText);
            try { const errorData = await response.json(); errorMsg = errorData.error || errorMsg; }
            catch (parseError) { logger.warn("Could not parse error response JSON:", parseError); errorMsg = t!.page_ErrorStartingSessionAPI.replace("{status}", response.status.toString()).replace("{statusText}", response.statusText); }
            throw new Error(errorMsg);
        }
        const result: StartApiResponse = await response.json();
        logger.info("API Response received:", result);
        if (!result.conversationId) { throw new Error(t!.page_ErrorSessionIdMissing); }
        logger.info(`Session setup successful via API. Conversation ID: ${result.conversationId}`);
        setSessionConfig(configWithLanguage);
        setActiveConversationId(result.conversationId);
    } catch (error) {
        logger.error("Failed to start session:", error);
        setPageError(
            t!.page_ErrorStartingSessionGeneric.replace(
                "{errorMessage}",
                (error instanceof Error ? error.message : String(error)) +
                " Please try again. If the problem persists, refresh the page."
            )
        );
        setSessionConfig(null);
        setActiveConversationId(null);
    } finally {
        setIsStartingSession(false);
    }
};

const handleConversationStopped = () => {
    logger.info("Conversation stopped callback triggered on page.");
    setSessionConfig(null);
    setActiveConversationId(null);
    setPageError(null);
    setHasManuallyStopped(true);
    if (typeof window !== 'undefined') {
        const url = new URL(window.location.href);
        url.searchParams.delete('resume');
        window.history.replaceState({}, '', url.pathname + url.search);
    }
};

  if (loading || !t) return null;

  // All state and logic from the authenticated branch of page.tsx
  if (secretsLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <p className="text-muted-foreground animate-pulse">{t!.page_LoadingUserData}</p>
      </main>
    );
  }

  return (
    <>
      <Suspense fallback={null}>
        <ResumeHandler
          user={user}
          activeConversationId={activeConversationId}
          sessionConfig={sessionConfig}
          setSessionConfig={setSessionConfig}
          setActiveConversationId={setActiveConversationId}
          hasManuallyStopped={hasManuallyStopped}
          setHasManuallyStopped={setHasManuallyStopped}
        />
      </Suspense>
      <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
        {pageError && (
          <Alert variant="destructive" className="mb-6 max-w-3xl w-full flex-shrink-0">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t!.page_ErrorAlertTitle}</AlertTitle>
            <AlertDescription>{pageError}</AlertDescription>
          </Alert>
        )}
        <div className="w-full max-w-3xl flex flex-col items-center space-y-8 flex-grow pt-8 md:pt-12">
          {!sessionConfig || !activeConversationId ? (
            <SessionSetupForm onStartSession={handleStartSession} isLoading={isStartingSession} />
          ) : (
            <ChatInterface conversationId={activeConversationId} onConversationStopped={handleConversationStopped} />
          )}
        </div>
      </main>
    </>
  );
} 