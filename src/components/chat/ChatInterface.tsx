// src/components/chat/ChatInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { db, functions as clientFunctions } from '@/lib/firebase/clientApp'; // Import client Functions instance
// import { httpsCallable } from 'firebase/functions';
import {
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    updateDoc,
    FirestoreError,
    getDoc
} from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// Removed unused PlayCircle, PauseCircle
import { AlertCircle, ChevronDown, ChevronUp, Volume2, Pause, Play } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { getDatabase, ref as rtdbRef, onValue, off } from 'firebase/database';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';
import { useTranslation } from '@/hooks/useTranslation';
import { getVoiceById } from '@/lib/tts_models';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import removeMarkdown from 'remove-markdown';

// --- Interfaces ---
interface Message {
    id: string;
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    timestamp: Timestamp | null;
    audioUrl?: string; // Optional audioUrl
    ttsWasSplit?: boolean; // Optional: true if audio was split due to TTS input limits
    isStreaming?: boolean;
    imageUrl?: string | null;
    imageGenError?: string | null;
}

interface ConversationData {
    userId: string;
    agentA_llm: string;
    agentB_llm: string;
    turn: "agentA" | "agentB";
    status: "running" | "stopped" | "error";
    createdAt: Timestamp;
    lastActivity: Timestamp;
    apiSecretVersions: { [key: string]: string };
    ttsSettings?: {
        enabled: boolean;
        agentA: { provider: string; voice: string | null };
        agentB: { provider: string; voice: string | null };
    };
    waitingForTTSEndSignal?: boolean;
    errorContext?: string;
    lastPlayedAgentMessageId?: string; // <-- Add this line
}

interface ChatInterfaceProps {
    conversationId: string;
    onConversationStopped: () => void;
}

// RTDB Streaming Message Interface
interface StreamingMessage {
    id: string;
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    status: 'streaming' | 'complete' | 'error';
    timestamp: number;
    audioUrl?: string;
    ttsWasSplit?: boolean;
    isStreaming?: boolean;
    error?: string;
}

// Basic logger placeholder
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

// --- Define the callable function ---
// let requestNextTurnFunction: ReturnType<typeof httpsCallable> | null = null;
try {
    if (clientFunctions) {
        // requestNextTurnFunction = httpsCallable(clientFunctions, 'requestNextTurn');
    } else {
        logger.error("Firebase Functions client instance not available for requestNextTurn.");
    }
} catch (err) {
     logger.error("Error initializing requestNextTurn callable function:", err);
}


// const requestNextTurn = async (convId: string) => {
//     try {
//         const requestNextTurnFunction = httpsCallable(clientFunctions, 'requestNextTurn');
//         await requestNextTurnFunction({ conversationId: convId });
//     } catch (error) {
//         logger.error('Error calling requestNextTurn:', error);
//     }
// };

export function ChatInterface({
    conversationId,
    onConversationStopped
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [technicalErrorDetails, setTechnicalErrorDetails] = useState<string | null>(null);
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const [conversationStatus, setConversationStatus] = useState<ConversationData['status'] | null>(null);
    const [isWaitingForSignal, setIsWaitingForSignal] = useState<boolean>(false);
    const [streamingMessage, setStreamingMessage] = useState<StreamingMessage | null>(null);
    const [ttsError, setTtsError] = useState<string | null>(null);
    const [conversationData, setConversationData] = useState<ConversationData | null>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isAudioPaused, setIsAudioPaused] = useState(false);
    const [, setIsBrowserTTSActive] = useState(false);
    const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);
    const [playedMessageIds, setPlayedMessageIds] = useState<Set<string>>(new Set());
    const [imageLoadStatus, setImageLoadStatus] = useState<{[key: string]: 'loading' | 'loaded' | 'error'}>({});

    const audioPlayerRef = useRef<HTMLAudioElement>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentlyPlayingMsgIdRef = useRef<string | null>(null);
    currentlyPlayingMsgIdRef.current = currentlyPlayingMsgId;

    const { t } = useTranslation();
    const scrollToBottom = useOptimizedScroll({ behavior: 'instant', block: 'nearest' });

    // --- Audio Control Handlers ---
    const handleAudioEnd = useCallback(() => {
        const playedMsgId = currentlyPlayingMsgIdRef.current;
        if (!playedMsgId) return;

        if (utteranceRef.current) {
            utteranceRef.current.onend = null; // Clean up listener
            utteranceRef.current = null;
        }

        // Reset audio-related states
        setIsAudioPlaying(false);
        setIsAudioPaused(false);
        setCurrentlyPlayingMsgId(null);
        setPlayedMessageIds(prev => new Set(prev).add(playedMsgId));

        // Notify backend that the message has been played
        const playedMsg = messages.find(m => m.id === playedMsgId);
        if (playedMsg && (playedMsg.role === 'agentA' || playedMsg.role === 'agentB')) {
            try {
                const conversationRef = doc(db, "conversations", conversationId);
                updateDoc(conversationRef, {
                    lastPlayedAgentMessageId: playedMsgId,
                    lastActivity: serverTimestamp(),
                });
                logger.info(`Updated lastPlayedAgentMessageId to ${playedMsgId}`);
            } catch (err) {
                logger.error("Failed to update lastPlayedAgentMessageId in Firestore:", err);
            }
        }
    }, [conversationId, messages]);

    const handlePauseAudio = useCallback(() => {
        if (isAudioPlaying) {
            if (utteranceRef.current) {
                window.speechSynthesis.pause();
                setIsAudioPaused(true);
            } else if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                setIsAudioPaused(true);
            }
        }
    }, [isAudioPlaying]);

    const handleResumeAudio = useCallback(() => {
        if (!isAudioPaused) return;

        if (utteranceRef.current) {
            window.speechSynthesis.resume();
        } else if (audioPlayerRef.current) {
            audioPlayerRef.current.play().catch(err => {
                logger.error("Audio resume failed:", err);
                handleAudioEnd();
            });
        }
        setIsAudioPlaying(true);
        setIsAudioPaused(false);
        }, [isAudioPaused, handleAudioEnd]);

    // --- Effect 1: Listen for Messages ---
    useEffect(() => {
        logger.debug(`ChatInterface: Message listener effect running. conversationId prop: ${conversationId}`);
        if (!conversationId) {
            logger.warn("ChatInterface: Message listener effect skipped - no conversationId prop.");
            return;
        }

        logger.info(`ChatInterface: Setting up message listener for conversation: ${conversationId}`);
        const messagesQuery = query(
            collection(db, "conversations", conversationId, "messages"),
            orderBy("timestamp", "asc")
        );

        let isFirstSnapshot = true;
        let lastPlayedAgentMessageId: string | undefined = undefined;
        // Fetch lastPlayedAgentMessageId from conversation doc
        const conversationDocRef = doc(db, "conversations", conversationId);
        getDoc(conversationDocRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as ConversationData;
                lastPlayedAgentMessageId = data.lastPlayedAgentMessageId;
            }
        });

        const unsubscribe = onSnapshot(messagesQuery,
            (querySnapshot) => {
                logger.debug(`ChatInterface: Message snapshot received ${querySnapshot.docs.length} docs for ${conversationId}.`);
                const fetchedMessages: Message[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.role && data.content && data.timestamp) {
                        fetchedMessages.push({
                            id: doc.id,
                            role: data.role,
                            content: data.content,
                            timestamp: data.timestamp,
                            audioUrl: data.audioUrl,
                            ttsWasSplit: data.ttsWasSplit,
                            isStreaming: data.isStreaming,
                            imageUrl: data.imageUrl,
                            imageGenError: data.imageGenError
                        } as Message);
                    } else {
                        logger.warn(`Skipping message doc ${doc.id} due to missing fields.`);
                    }
                });
                setMessages(fetchedMessages);
                if (isFirstSnapshot) {
                    // Initialize playedMessageIds based on lastPlayedAgentMessageId
                    if (lastPlayedAgentMessageId) {
                        const playedIds = new Set<string>();
                        for (const msg of fetchedMessages) {
                            if ((msg.role === 'agentA' || msg.role === 'agentB') && msg.audioUrl) {
                                playedIds.add(msg.id);
                                if (msg.id === lastPlayedAgentMessageId) break;
                            }
                        }
                        setPlayedMessageIds(playedIds);
                    } else {
                        setPlayedMessageIds(new Set());
                    }
                    isFirstSnapshot = false;
                }
            },
            (err: FirestoreError) => {
                 logger.error(`Error listening to messages for conversation ${conversationId}:`, err);
                 setError(`Failed to load messages: ${err.message}`);
                 setTechnicalErrorDetails(null);
            }
        );

        // --- Cleanup function fix ---
        // Store the current ref value in a variable within the effect scope
        const currentAudioPlayer = audioPlayerRef.current;
        return () => {
            logger.info(`ChatInterface: Cleaning up message listener for conversation: ${conversationId}`);
            unsubscribe();
            // Use the variable captured in the effect's scope for cleanup
            if (currentAudioPlayer) {
                currentAudioPlayer.pause();
                // No need to setIsAudioPlaying here, as component is unmounting
            }
        };
    }, [conversationId]); // Only depends on conversationId

    // --- Effect 2: Listen for Conversation Data Changes ---
    useEffect(() => {
        logger.debug(`ChatInterface: Conversation data listener effect running. conversationId prop: ${conversationId}`);
        if (!conversationId) {
             logger.warn("ChatInterface: Conversation data listener effect skipped - no conversationId prop.");
            return;
        }

        logger.info(`ChatInterface: Setting up conversation data listener for conversation: ${conversationId}`);
        const conversationDocRef = doc(db, "conversations", conversationId);

                const unsubscribe = onSnapshot(conversationDocRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as ConversationData;
                    setConversationData(data);
                    setConversationStatus(data.status);
                    setIsWaitingForSignal(data.waitingForTTSEndSignal ?? false);

                    if (data.status === 'stopped' || data.status === 'error') {
                        setIsStopped(true);
                        if (data.status === 'error') {
                            setError("Conversation ended with an error.");
                            setTechnicalErrorDetails(data.errorContext || 'No details provided.');
                        } else {
                            onConversationStopped();
                        }
                    }
                } else {
                    logger.error(`Conversation document ${conversationId} not found.`);
                    setError("Conversation not found.");
                    setTechnicalErrorDetails(`ID: ${conversationId}`);
                }
            },
            (err: FirestoreError) => {
                logger.error(`Error listening to conversation ${conversationId}:`, err);
                setError(`Failed to load conversation status: ${err.message}`);
                setTechnicalErrorDetails(null);
            }
        );

                return () => {
            logger.info(`ChatInterface: Cleaning up status listener for conversation: ${conversationId}`);
            unsubscribe();
        };
    }, [conversationId, error, isStopped, conversationStatus, onConversationStopped]); // Added onConversationStopped

    // --- Effect 3: Auto-scroll ---
        useEffect(() => {
        if (conversationStatus === "running" && !isStopped) {
            scrollToBottom(messagesEndRef.current);
        }
    }, [messages, conversationStatus, isStopped, scrollToBottom]); // Keep dependencies

    // --- Handler: User Interaction Detection ---
    const handleUserInteraction = useCallback(() => {
        if (!hasUserInteracted) {
            logger.info("User interaction detected - enabling audio playback");
            setHasUserInteracted(true);
        }
    }, [hasUserInteracted]);

    // --- Effect 4: User Interaction Detection ---
    useEffect(() => {
                const handleInteraction = () => handleUserInteraction();
        
        // Listen for various user interaction events
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('keydown', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });
        
        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('keydown', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, [handleUserInteraction]);

    // --- Handler 4: Stop Conversation Button ---
    const handleStopConversation = useCallback(async () => {
        logger.debug(`handleStopConversation called. Conversation ID prop: ${conversationId}`);
        if (!conversationId || isStopping || isStopped) {
            logger.warn(`Stop conversation skipped. ID: ${conversationId}, Stopping: ${isStopping}, Stopped: ${isStopped}`);
            return;
        }
        setIsStopping(true);
        logger.info(`Attempting to stop conversation via button: ${conversationId}`);
        if (audioPlayerRef.current) {
             audioPlayerRef.current.pause();
             setIsAudioPlaying(false);
             setIsAudioPaused(false);
             setCurrentlyPlayingMsgId(null);
        }
        try {
            const conversationRef = doc(db, "conversations", conversationId);
            await updateDoc(conversationRef, {
                status: "stopped",
                waitingForTTSEndSignal: false,
                lastActivity: serverTimestamp()
            });
            logger.info(`Client-side updateDoc call successful for conversation ${conversationId} status to 'stopped'.`);
            if (onConversationStopped) {
                onConversationStopped();
            }
        } catch (err) {
            logger.error(`Error stopping conversation ${conversationId} via client-side update:`, err);
            setError(`Failed to stop conversation: ${err instanceof Error ? err.message : String(err)}`);
            setTechnicalErrorDetails(null);
        } finally {
            setIsStopping(false);
        }
    }, [conversationId, isStopping, isStopped, onConversationStopped]); // Keep dependencies

    // --- RTDB Streaming Message Listener ---
    useEffect(() => {
        if (!conversationId) return;
        const rtdb = getDatabase();
        const messagesPath = `/streamingMessages/${conversationId}`;
        const messagesRef = rtdbRef(rtdb, messagesPath);
        let unsubscribed = false;
        const handleValue = (snapshot: { val: () => Record<string, Omit<StreamingMessage, 'id'>> | null }) => {
            if (unsubscribed) return;
            const data = snapshot.val();
            console.log("RTDB streaming message update:", data);
            if (!data) {
                setStreamingMessage(null);
                return;
            }
            const messagesArr: StreamingMessage[] = Object.entries(data).map(([id, val]) => ({ id, ...(val as Omit<StreamingMessage, 'id'>) }));
            if (messagesArr.length === 0) {
                setStreamingMessage(null);
                return;
            }
            messagesArr.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            const latest = messagesArr.reverse().find(m => m.status === 'streaming' || m.status === 'complete') || null;
            setStreamingMessage(latest);
        };
        onValue(messagesRef, handleValue);
        return () => {
            unsubscribed = true;
            off(messagesRef, 'value', handleValue);
        };
    }, [conversationId]);

    // --- Merge streaming message with Firestore messages for display ---
    const mergedMessages = React.useMemo(() => {
        if (!streamingMessage) return messages;
        // If Firestore already has this messageId, don't show streaming message
        if (messages.some(m => m.id === streamingMessage.id)) return messages;
        // Only append streaming message if it is the next message to be revealed
        // Find the index of the last played message
        let lastPlayedIdx = -1;
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            if (msg.audioUrl) {
                if (!playedMessageIds.has(msg.id)) {
                    break;
                }
            }
            lastPlayedIdx = i;
        }
        // Only show streaming message if it is the next message after the last played
        if (lastPlayedIdx === messages.length - 1) {
            return [
                ...messages,
                {
                    id: streamingMessage.id,
                    role: streamingMessage.role,
                    content: streamingMessage.content,
                    timestamp: null,
                    audioUrl: undefined,
                    ttsWasSplit: false,
                    isStreaming: streamingMessage.status === 'streaming',
                }
            ];
        }
        return messages;
    }, [messages, streamingMessage, playedMessageIds]);

    // --- Only show up to the latest message whose audio has been played (or has no audio) ---
    const visibleMessages = React.useMemo(() => {
        if (!mergedMessages.length) return [];

        let cutoffIdx = mergedMessages.length;

        const firstUnplayedAudioIndex = mergedMessages.findIndex(msg =>
            (msg.audioUrl || (conversationData?.ttsSettings?.[msg.role as 'agentA' | 'agentB']?.provider === 'browser' && (msg.role === 'agentA' || msg.role === 'agentB'))) &&
            !playedMessageIds.has(msg.id)
        );

        if (isAudioPlaying && currentlyPlayingMsgId) {
            // If audio is playing, show up to and including the currently playing message.
            const currentlyPlayingIndex = mergedMessages.findIndex(msg => msg.id === currentlyPlayingMsgId);
            cutoffIdx = currentlyPlayingIndex !== -1 ? currentlyPlayingIndex + 1 : mergedMessages.length;
        } else if (firstUnplayedAudioIndex !== -1) {
            // If not playing, show up to and including the first unplayed audio message, so it can be picked up for playback.
            cutoffIdx = firstUnplayedAudioIndex + 1;
        } 
        // If all audio is played or no audio messages exist, cutoffIdx remains mergedMessages.length, showing all.

        return mergedMessages.slice(0, cutoffIdx);
    }, [mergedMessages, playedMessageIds, isAudioPlaying, currentlyPlayingMsgId, conversationData]);

    // --- Image Modal State ---
    const [fullScreenImageMsgId, setFullScreenImageMsgId] = useState<string | null>(null);

    // --- Auto-update fullscreen image modal when new image arrives ---
    useEffect(() => {
        if (!fullScreenImageMsgId) return;
        // Find all visible messages with images
        const imageMessages = visibleMessages.filter(
            m => (m.role === 'agentA' || m.role === 'agentB') && m.imageUrl && !m.imageGenError
        );
        if (imageMessages.length === 0) return;
        // If the current modal image is not the last image message, update it
        const lastImageMsg = imageMessages[imageMessages.length - 1];
        if (lastImageMsg.id !== fullScreenImageMsgId) {
            setFullScreenImageMsgId(lastImageMsg.id);
        }
    }, [visibleMessages, fullScreenImageMsgId]);

    // --- Effect 5: Audio Playback ---
    useEffect(() => {
        if (!hasUserInteracted || isAudioPlaying || isAudioPaused || !conversationData?.ttsSettings?.enabled) return;

        const nextMsg = visibleMessages.find(msg => {
            if (playedMessageIds.has(msg.id)) return false;
            if (msg.role !== 'agentA' && msg.role !== 'agentB') return false;
            if (msg.imageUrl && imageLoadStatus[msg.id] !== 'loaded' && imageLoadStatus[msg.id] !== 'error') return false;
            return true;
        });

        if (!nextMsg) return;

        const agentRole = nextMsg.role as 'agentA' | 'agentB';
        const ttsConfig = conversationData.ttsSettings?.[agentRole];

        if (ttsConfig?.provider === 'browser') {
                                    const voiceInfo = getVoiceById(ttsConfig.provider, ttsConfig.voice || '');
            const voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === voiceInfo?.providerVoiceId);
            if (!voice) {
                logger.warn(`Browser voice not found for ID: ${ttsConfig.voice}`);
                handleAudioEnd(); // Skip playback if voice is missing
                return;
            }

            const cleanedContent = removeMarkdown(nextMsg.content);
            const utterance = new SpeechSynthesisUtterance(cleanedContent);
            utterance.voice = voice;
            utterance.onstart = () => {
                // This is the source of truth for playback starting
                setCurrentlyPlayingMsgId(nextMsg.id);
                setIsAudioPlaying(true);
                setIsBrowserTTSActive(true);
            };
            utterance.onend = () => {
                setIsBrowserTTSActive(false);
                handleAudioEnd();
            };
            utterance.onerror = (event) => {
                logger.error('Speech synthesis error:', event.error);
                setTtsError(`Speech synthesis failed: ${event.error}`);
                setIsBrowserTTSActive(false);
                handleAudioEnd();
            };

            utteranceRef.current = utterance;
            // We are only requesting speech, not guaranteeing it starts immediately.
            // isAudioPlaying will be set in onstart.
            speechSynthesis.speak(utterance);

        } else if (nextMsg.audioUrl && audioPlayerRef.current) {
            audioPlayerRef.current.src = nextMsg.audioUrl;
            audioPlayerRef.current.play()
                .then(() => {
                    setCurrentlyPlayingMsgId(nextMsg.id);
                    setIsAudioPlaying(true);
                })
                .catch(err => {
                    logger.error("Audio playback failed:", err);
                    handleAudioEnd(); // Ensure state is cleaned up on error
                });
        }

    }, [visibleMessages, playedMessageIds, hasUserInteracted, isAudioPaused, isAudioPlaying, conversationData, handleAudioEnd, imageLoadStatus]); // Added isAudioPlaying

    // --- Render Logic ---

    if (error) {
        return (
             <Alert variant="destructive" className="w-full max-w-2xl mx-auto my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm break-words whitespace-pre-wrap">{error}</AlertDescription>
              <div className="mt-4 flex flex-col items-start space-y-3">
                  {technicalErrorDetails && (
                      <div className="w-full">
                          <Button 
                              variant="secondary" 
                              size="sm" 
                              onClick={() => setShowErrorDetails(!showErrorDetails)} 
                              className="text-xs h-6 px-2"
                              aria-label={showErrorDetails ? "Hide technical error details" : "Show technical error details"}
                              aria-describedby="error-details-description"
                          >
                              {showErrorDetails ? 'Hide Details' : 'Show Details'}
                              {showErrorDetails ? <ChevronUp className="ml-1 h-3 w-3" aria-hidden="true"/> : <ChevronDown className="ml-1 h-3 w-3" aria-hidden="true"/>}
                          </Button>
                          <div id="error-details-description" className="sr-only">
                              Click to {showErrorDetails ? "hide" : "show"} detailed technical information about the error that occurred.
                          </div>
                          {showErrorDetails && <pre className="mt-1 text-xs whitespace-pre-wrap break-words overflow-auto max-h-32 rounded-md border bg-muted p-2 font-mono w-full min-w-0">{technicalErrorDetails}</pre>}
                      </div>
                  )}
                  {isStopped && onConversationStopped && (
                       <div>
                           <Button 
                               variant="outline" 
                               size="sm" 
                               onClick={onConversationStopped}
                               aria-label="Return to conversation setup"
                               aria-describedby="go-back-description"
                           >
                               Go Back
                           </Button>
                           <div id="go-back-description" className="sr-only">
                               Click to return to the conversation setup page where you can start a new conversation.
                           </div>
                       </div>
                  )}
              </div>
            </Alert>
        );
    }
    if (!conversationId) return <div className="p-4 text-center text-muted-foreground">Initializing session...</div>;
    if (!conversationStatus && !error) return <div className="p-4 text-center text-muted-foreground">Loading conversation status...</div>;


    return (
        <div className="flex flex-col h-[70vh] w-full max-w-3xl mx-auto p-4 bg-background rounded-lg shadow-md border overflow-hidden">
            {/* Header Section */}
            <div className="flex-shrink-0 flex justify-between items-center pb-2 mb-2 border-b">
                <h2 className="text-lg font-semibold">{t?.main?.aiConversation}</h2>
                {(isAudioPlaying || isAudioPaused) && currentlyPlayingMsgId && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground" role="status" aria-live="polite">
                        <Volume2 className={`h-4 w-4 ${isAudioPlaying ? 'animate-pulse text-primary' : 'text-muted-foreground'}`} aria-hidden="true"/>
                        <span>{isAudioPaused ? 'Audio Paused' : 'Playing Audio...'}</span>
                    </div>
                )}
                <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleStopConversation} 
                    disabled={isStopping || isStopped}
                    aria-label={isStopped ? "Conversation already stopped" : (isStopping ? "Stopping conversation..." : "Stop the current conversation")}
                    aria-describedby="stop-conversation-description"
                >
                    {isStopped ? "Stopped" : (isStopping ? "Stopping..." : "Stop Conversation")}
                </Button>
                <div id="stop-conversation-description" className="sr-only">
                    Click to stop the current AI conversation. This will prevent further messages from being generated.
                </div>
            </div>

            {/* TTS Error Banner */}
            {ttsError && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mx-4 mt-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>TTS Issue:</strong> {ttsError}
                            </p>
                            <p className="text-xs text-yellow-800 dark:text-yellow-200 mt-1">
                                Text-to-speech is temporarily unavailable. The conversation will continue without audio.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* User Interaction Prompt for Audio */}
            {!hasUserInteracted && conversationStatus === "running" && (
                (() => {
                    const hasUnplayedAudio = messages.some(msg => msg.audioUrl && !playedMessageIds.has(msg.id));
                    return hasUnplayedAudio || isWaitingForSignal;
                })() && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>Audio Ready:</strong> Click anywhere or press any key to enable audio playback
                            </p>
                            <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                                Browser requires user interaction before playing audio automatically.
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Scrollable Message Area */}
            <ScrollArea className="flex-grow min-h-0 mb-4 pr-4 -mr-4" style={{ contain: 'layout style paint' }}>
               <div className="space-y-4">
                    {visibleMessages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.role === 'agentA' ? 'justify-start' :
                                msg.role === 'agentB' ? 'justify-end' :
                                'justify-center text-xs text-muted-foreground italic py-1'
                            }`}
                            style={{ contain: 'layout' }}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm relative ${
                                    msg.role === 'agentA' ? 'bg-muted text-foreground' :
                                    msg.role === 'agentB' ? 'bg-primary text-primary-foreground' :
                                    'bg-transparent px-0 py-0 shadow-none'
                                }`}
                            >
                                {/* IMAGE DISPLAY (above content) */}
                                {(msg.role === 'agentA' || msg.role === 'agentB') && (
                                    <>
                                        {msg.imageUrl && !msg.imageGenError && (
                                            <>
                                                <div className="mb-2 flex flex-col items-center">
                                                    <Image
                                                        src={msg.imageUrl}
                                                        alt="Generated image for this turn"
                                                        className="rounded-md max-w-full max-h-[40vh] cursor-pointer border border-muted-foreground/20 shadow"
                                                        style={{ objectFit: 'contain' }}
                                                        onClick={() => setFullScreenImageMsgId(msg.id)}
                                                        onLoad={() => setImageLoadStatus(s => ({ ...s, [msg.id]: 'loaded' }))}
                                                        onError={(e) => {
                                                            console.error('Image load error:', e);
                                                            setImageLoadStatus(s => ({ ...s, [msg.id]: 'error' }));
                                                        }}
                                                        tabIndex={0}
                                                        width={800}
                                                        height={600}
                                                        unoptimized={msg.imageUrl?.includes('storage.googleapis.com') || msg.imageUrl?.includes('googleapis.com/storage')}
                                                        aria-label="Show image in full screen"
                                                    />
                                                    {imageLoadStatus[msg.id] === 'loading' && (
                                                        <div className="text-xs text-muted-foreground mt-1">Loading image...</div>
                                                    )}
                                                    {imageLoadStatus[msg.id] === 'error' && (
                                                        <div className="text-xs text-destructive mt-1">Image failed to load.</div>
                                                    )}
                                                    {imageLoadStatus[msg.id] !== 'loaded' && !imageLoadStatus[msg.id] && (
                                                        <div className="text-xs text-muted-foreground mt-1">Loading image...</div>
                                                    )}
                                                </div>
                                                {/* Full Screen Modal */}
                                                {fullScreenImageMsgId === msg.id &&
                                                    ReactDOM.createPortal(
                                                        <div
                                                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                                                            onClick={() => setFullScreenImageMsgId(null)}
                                                            tabIndex={0}
                                                            aria-modal="true"
                                                            role="dialog"
                                                        >
                                                            <Image
                                                                src={msg.imageUrl}
                                                                alt="Generated image for this turn (full screen)"
                                                                className="w-auto h-auto max-w-[98vw] max-h-[98vh] rounded shadow-lg border border-white"
                                                                style={{ objectFit: 'contain' }}
                                                                width={1920}
                                                                height={1080}
                                                                unoptimized={msg.imageUrl?.includes('storage.googleapis.com') || msg.imageUrl?.includes('googleapis.com/storage')}
                                                                onError={(e) => {
                                                                    console.error('Fullscreen image load error:', e);
                                                                    setFullScreenImageMsgId(null);
                                                                    setImageLoadStatus(s => ({ ...s, [msg.id]: 'error' }));
                                                                }}
                                                            />
                                                            <button
                                                                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-black rounded-full px-3 py-1 text-sm font-semibold shadow"
                                                                onClick={e => { e.stopPropagation(); setFullScreenImageMsgId(null); }}
                                                                aria-label="Close full screen image"
                                                            >
                                                                Close
                                                            </button>
                                                        </div>,
                                                        document.body
                                                    )
                                                }
                                            </>
                                        )}
                                        {msg.imageGenError && (
                                            <div className="mb-2 text-xs text-destructive">Image could not be generated: {msg.imageGenError}</div>
                                        )}
                                    </>
                                )}
                                {msg.role === 'agentA' || msg.role === 'agentB' ? (
    <>
      <p className="text-xs font-bold mb-1">{msg.role === 'agentA' ? 'Agent A' : 'Agent B'}</p>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
    </>
  ) : (
    msg.content
  )}
                                {msg.isStreaming && (
                                  <span className="ml-1 animate-pulse text-primary" aria-hidden="true">▍</span>
                                )}
                                {/* Removed manual audio play button logic */}
                                {/* Audio played indicator */}
                                {msg.audioUrl && playedMessageIds.has(msg.id) && (
                                    <div className="mt-2 flex items-center gap-2" role="status" aria-live="polite">
                                        <span className="text-xs text-muted-foreground flex items-center">
                                            <Volume2 className="h-3 w-3 mr-1" aria-hidden="true" />
                                            Audio played
                                        </span>
                                    </div>
                                )}
                                {/* Split audio notification */}
                                {msg.ttsWasSplit && (
                                  <div className="mt-1 text-[11px] text-orange-800 dark:text-orange-200 font-medium flex items-center gap-1">
                                    <AlertCircle className="inline h-3 w-3 mr-1" aria-hidden="true" />
                                    Audio was split due to TTS input limit. Some long messages may be truncated or split into multiple parts.
                                  </div>
                                )}
                                {isAudioPlaying && currentlyPlayingMsgId === msg.id && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3" aria-hidden="true">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {conversationStatus === "running" && mergedMessages.length === 0 && !isStopped && (
                        <div className="text-center text-muted-foreground text-sm p-4" role="status" aria-live="polite">Waiting for first message...</div>
                    )}
                    {isStopped && conversationStatus === "stopped" && !error && (
                        <div className="text-center text-muted-foreground text-sm p-4" role="status" aria-live="polite">Conversation stopped.</div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Audio Controls in Footer */}
            {(isAudioPlaying || isAudioPaused) && currentlyPlayingMsgId && (
                <div className="flex-shrink-0 pt-2 border-t mt-4">
                    <div className="flex items-center justify-center">
                        {isAudioPlaying ? (
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={handlePauseAudio}
                                className="h-12 w-12 rounded-full"
                                aria-label="Pause audio"
                            >
                                <Pause className="h-6 w-6" />
                            </Button>
                        ) : isAudioPaused ? (
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={handleResumeAudio}
                                className="h-12 w-12 rounded-full"
                                aria-label="Resume audio"
                            >
                                <Play className="h-6 w-6" />
                            </Button>
                        ) : null}
                    </div>
                </div>
            )}

            {/* Hidden Audio Player */}
            <audio
                ref={audioPlayerRef}
                style={{ display: 'none' }}
                aria-hidden="true"
                onEnded={() => {
                    // This now only handles audio file endings. Speech synthesis endings are handled by utterance.onend
                    handleAudioEnd();
                }}
            />
        </div>
    );
}