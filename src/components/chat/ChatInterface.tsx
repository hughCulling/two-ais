// src/components/chat/ChatInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { db, functions as clientFunctions } from '@/lib/firebase/clientApp'; // Import client Functions instance
import { httpsCallable, FunctionsError } from 'firebase/functions'; // Import httpsCallable
import {
    collection,
    doc,
    onSnapshot,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    updateDoc,
    FirestoreError
} from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
// Removed unused PlayCircle, PauseCircle
import { AlertCircle, ChevronDown, ChevronUp, Volume2 } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { getDatabase, ref as rtdbRef, onValue, off } from 'firebase/database';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';
import { useTranslation } from '@/hooks/useTranslation';
import ReactDOM from 'react-dom';

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
let requestNextTurnFunction: ReturnType<typeof httpsCallable> | null = null;
try {
    if (clientFunctions) {
        requestNextTurnFunction = httpsCallable(clientFunctions, 'requestNextTurn');
    } else {
        logger.error("Firebase Functions client instance not available for requestNextTurn.");
    }
} catch (err) {
     logger.error("Error initializing requestNextTurn callable function:", err);
}


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

    // --- Audio Playback State ---
    const audioPlayerRef = useRef<HTMLAudioElement>(null);
    const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
    const [playedMessageIds, setPlayedMessageIds] = useState<Set<string>>(new Set());
    const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Use optimized scroll hook
    const scrollToBottom = useOptimizedScroll({ behavior: 'instant', block: 'nearest' });

    const { t } = useTranslation();

    // --- Handler: User Interaction Detection ---
    const handleUserInteraction = useCallback(() => {
        if (!hasUserInteracted) {
            logger.info("User interaction detected - enabling audio playback");
            setHasUserInteracted(true);
        }
    }, [hasUserInteracted]);

    // --- Refactored: Audio End Handler (no param, uses state) ---
    const handleAudioEnd = useCallback(() => {
        if (!currentlyPlayingMsgId) return;
        logger.info(`Audio ended or failed for message ${currentlyPlayingMsgId}.`);
        setIsAudioPlaying(false);
        setPlayedMessageIds(prev => {
            const newSet = new Set(prev).add(currentlyPlayingMsgId);
            logger.info(`[AUDIO END/ERROR] Marking message as played: ${currentlyPlayingMsgId}. playedMessageIds now:`, Array.from(newSet));
            return newSet;
        });
        setCurrentlyPlayingMsgId(null);

        // --- NEW: Update Firestore with last played agent message ID ---
        const playedMsg = messages.find(m => m.id === currentlyPlayingMsgId);
        if (playedMsg && (playedMsg.role === 'agentA' || playedMsg.role === 'agentB')) {
            try {
                const conversationRef = doc(db, "conversations", conversationId);
                updateDoc(conversationRef, {
                    lastPlayedAgentMessageId: currentlyPlayingMsgId,
                    lastActivity: serverTimestamp(),
                });
            } catch (err) {
                logger.error("Failed to update lastPlayedAgentMessageId in Firestore:", err);
            }
        }

        // --- Always call requestNextTurn Cloud Function ---
        if (!requestNextTurnFunction) {
            logger.error("requestNextTurn function is not initialized. Cannot signal backend.");
            setError("Error: Cannot communicate with backend to continue conversation.");
            return;
        }
        if (!conversationId) {
            logger.error("Cannot call requestNextTurn without conversationId.");
            return;
        }
        logger.info(`Calling requestNextTurn for conversation ${conversationId}...`);
        requestNextTurnFunction({ conversationId })
            .then(result => {
                logger.info("requestNextTurn successful:", result.data);
            })
            .catch(error => {
                logger.error("Error calling requestNextTurn function:", error);
                let errorMsg = "Failed to signal backend to continue.";
                if (error instanceof FunctionsError) {
                    errorMsg = `Error signalling backend: ${error.message} (Code: ${error.code})`;
                } else if (error instanceof Error) {
                    errorMsg = `Error signalling backend: ${error.message}`;
                }
                setError(errorMsg);
            });
    }, [currentlyPlayingMsgId, conversationId, messages]);


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
                // --- Removed initialPlayedIds logic: do not mark any messages as played on initial snapshot ---
                if (isFirstSnapshot) {
                    setPlayedMessageIds(new Set());
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


    // --- Effect 2: Listen for Conversation Status Changes ---
    useEffect(() => {
        logger.debug(`ChatInterface: Status listener effect running. conversationId prop: ${conversationId}`);
        if (!conversationId) {
             logger.warn("ChatInterface: Status listener effect skipped - no conversationId prop.");
            return;
        }

        logger.info(`ChatInterface: Setting up status listener for conversation: ${conversationId}`);
        const conversationDocRef = doc(db, "conversations", conversationId);

        const unsubscribeStatus = onSnapshot(conversationDocRef,
            (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as ConversationData;
                    logger.debug(`ChatInterface: Status snapshot received for ${conversationId}. Status: ${data.status}, Waiting: ${data.waitingForTTSEndSignal}`);
                    const newStatus = data.status;
                    const newWaitingState = data.waitingForTTSEndSignal ?? false;

                    setConversationStatus(newStatus);
                    setIsWaitingForSignal(newWaitingState); // Update local waiting state from Firestore

                    if (newStatus === "error") {
                        const fullErrorContext = data.errorContext || "An unknown error occurred in the conversation.";
                        const errorPrefix = "Conversation Error: ";
                        const technicalSeparator = ". Error: ";
                        let userFriendlyError = fullErrorContext;
                        let techDetails: string | null = null;
                        if (fullErrorContext.startsWith(errorPrefix)) userFriendlyError = fullErrorContext.substring(errorPrefix.length);
                        const techIndex = userFriendlyError.indexOf(technicalSeparator);
                        if (techIndex !== -1) {
                            techDetails = userFriendlyError.substring(techIndex + technicalSeparator.length);
                            userFriendlyError = userFriendlyError.substring(0, techIndex + 1);
                        } else techDetails = null;
                        setError(errorPrefix + userFriendlyError);
                        setTechnicalErrorDetails(techDetails);
                        setShowErrorDetails(false);
                        setIsStopped(true);
                        logger.warn(`Conversation ${conversationId} entered error state: ${userFriendlyError}`);
                    } else if (newStatus === "stopped") {
                        setIsStopped(true);
                        if (error && conversationStatus !== 'error') {
                             setError(null); setTechnicalErrorDetails(null);
                        }
                        logger.info(`Conversation ${conversationId} status changed to 'stopped'.`);
                        if (audioPlayerRef.current) audioPlayerRef.current.pause();
                        setIsAudioPlaying(false);
                        setCurrentlyPlayingMsgId(null);
                    } else if (newStatus === "running") {
                         if (error || isStopped) {
                             setError(null); setTechnicalErrorDetails(null); setIsStopped(false);
                         }
                         logger.info(`Conversation ${conversationId} status changed to 'running'.`);
                    }
                    if (data) {
                        // setConversationData(data); // Removed as per edit hint
                        // Check for TTS-related errors in errorContext
                        if (data.errorContext &&
                            (data.errorContext.toLowerCase().includes('tts') ||
                             data.errorContext.toLowerCase().includes('quota'))) {
                            setTtsError(data.errorContext);
                        } else {
                            setTtsError(null);
                        }
                    }
                } else {
                    logger.warn(`Conversation document ${conversationId} does not exist in status listener.`);
                    setError("Conversation data not found. It might have been deleted.");
                    setTechnicalErrorDetails(null);
                    setIsStopped(true);
                }
            },
            (err: FirestoreError) => {
                logger.error(`Error listening to conversation status for ${conversationId}:`, err);
                setError(`Failed to get conversation status: ${err.message}`);
                setTechnicalErrorDetails(null);
                setIsStopped(true);
            }
        );
        return () => {
            logger.info(`ChatInterface: Cleaning up status listener for conversation: ${conversationId}`);
            unsubscribeStatus();
        };
    }, [conversationId, error, isStopped, conversationStatus]); // Keep dependencies


    // --- Effect 3: Auto-scroll ---
    useEffect(() => {
        if (conversationStatus === "running" && !isStopped) {
            scrollToBottom(messagesEndRef.current);
        }
    }, [messages, conversationStatus, isStopped, scrollToBottom]); // Keep dependencies


    // --- Dedicated Audio Event Listeners Effect ---
    useEffect(() => {
        const audioElem = audioPlayerRef.current;
        if (!audioElem) return;
        const onEnded = () => handleAudioEnd();
        const onError = () => handleAudioEnd();
        audioElem.addEventListener('ended', onEnded);
        audioElem.addEventListener('error', onError);
        return () => {
            audioElem.removeEventListener('ended', onEnded);
            audioElem.removeEventListener('error', onError);
        };
    }, [handleAudioEnd]);


    // --- Effect 5: User Interaction Detection ---
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
        if (!mergedMessages.length) return mergedMessages;
        // Find the index of the first message with unplayed audio
        let cutoffIdx = mergedMessages.length - 1;
        for (let i = 0; i < mergedMessages.length; i++) {
            const msg = mergedMessages[i];
            if (msg.audioUrl && !playedMessageIds.has(msg.id)) {
                // Only show up to and including this message
                cutoffIdx = i;
                break;
            }
        }
        // If all audio messages have been played, show all
        // If there is an unplayed audio message, do not show any messages after it (including streaming)
        return mergedMessages.slice(0, cutoffIdx + 1);
    }, [mergedMessages, playedMessageIds]);

    // --- Image Modal State ---
    const [fullScreenImageMsgId, setFullScreenImageMsgId] = useState<string | null>(null);
    const [imageLoadStatus, setImageLoadStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});

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

    // --- Consolidated Audio Playback Effect ---
    useEffect(() => {
        if (!hasUserInteracted || isAudioPlaying) return;
        // Find the first visible message with unplayed audio
        const nextAudioMsg = visibleMessages.find(
            (msg) => {
                if (!msg.audioUrl || playedMessageIds.has(msg.id)) return false;
                // If imageUrl is present, only play audio after image is loaded or errored
                if (msg.imageUrl && imageLoadStatus[msg.id] !== 'loaded' && imageLoadStatus[msg.id] !== 'error') return false;
                return true;
            }
        );
        if (nextAudioMsg && audioPlayerRef.current) {
            audioPlayerRef.current.src = nextAudioMsg.audioUrl!;
            audioPlayerRef.current.play()
                .then(() => {
                    setCurrentlyPlayingMsgId(nextAudioMsg.id);
                    setIsAudioPlaying(true);
                })
                .catch((err) => {
                    if (err && err.name === "AbortError") {
                        setIsAudioPlaying(false);
                        setCurrentlyPlayingMsgId(null);
                        handleAudioEnd();
                    } else {
                        logger.error(`Error auto-playing audio for message ${nextAudioMsg.id}:`, err);
                        setIsAudioPlaying(false);
                        setCurrentlyPlayingMsgId(null);
                        handleAudioEnd();
                    }
                });
        }
    }, [visibleMessages, playedMessageIds, hasUserInteracted, isAudioPlaying, handleAudioEnd, imageLoadStatus]);


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
                {isAudioPlaying && currentlyPlayingMsgId && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground" role="status" aria-live="polite">
                         <Volume2 className="h-4 w-4 animate-pulse text-primary" aria-hidden="true"/>
                         <span>Playing Audio...</span>
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
                                                    <img
                                                        src={msg.imageUrl}
                                                        alt="Generated image for this turn"
                                                        className="rounded-md max-w-full max-h-[40vh] cursor-pointer border border-muted-foreground/20 shadow"
                                                        style={{ objectFit: 'contain' }}
                                                        onClick={() => setFullScreenImageMsgId(msg.id)}
                                                        onLoad={() => setImageLoadStatus(s => ({ ...s, [msg.id]: 'loaded' }))}
                                                        onError={() => setImageLoadStatus(s => ({ ...s, [msg.id]: 'error' }))}
                                                        tabIndex={0}
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
                                                            <img
                                                                src={msg.imageUrl}
                                                                alt="Generated image for this turn (full screen)"
                                                                className="w-auto h-auto max-w-[98vw] max-h-[98vh] rounded shadow-lg border border-white"
                                                                style={{ objectFit: 'contain' }}
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
                                     <p className="text-xs font-bold mb-1">{msg.role === 'agentA' ? 'Agent A' : 'Agent B'}</p>
                                ) : null }
                                {msg.content}
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

            {/* Hidden Audio Player */}
            <audio
                ref={audioPlayerRef}
                style={{ display: 'none' }}
                aria-hidden="true"
            />
        </div>
    );
}