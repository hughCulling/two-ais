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
import { AlertCircle, ChevronDown, ChevronUp, PlayCircle, PauseCircle, Volume2 } from "lucide-react"; // Added audio icons
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// --- Interfaces ---
interface Message {
    id: string;
    role: 'agentA' | 'agentB' | 'user' | 'system';
    content: string;
    timestamp: Timestamp | null;
    audioUrl?: string; // Added optional audioUrl
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
    ttsSettings?: { // Added TTS settings structure (read-only here)
        enabled: boolean;
        agentA: { provider: string; voice: string | null };
        agentB: { provider: string; voice: string | null };
    };
    waitingForTTSEndSignal?: boolean; // Added flag check
    errorContext?: string;
}

interface ChatInterfaceProps {
    conversationId: string;
    onConversationStopped: () => void;
}

// Basic logger placeholder
const logger = {
    info: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug,
};

// --- Define the callable function ---
// Memoize the function reference outside the component if possible,
// or ensure it's stable using useCallback if defined inside.
let requestNextTurnFunction: ReturnType<typeof httpsCallable> | null = null;
try {
    // Ensure clientFunctions is initialized before using it
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
    const [isWaitingForSignal, setIsWaitingForSignal] = useState<boolean>(false); // Track backend waiting state

    // --- Audio Playback State ---
    const audioPlayerRef = useRef<HTMLAudioElement>(null); // Ref for the audio element
    const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);
    const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
    // Track which messages have finished playing to prevent duplicate signals
    const [playedMessageIds, setPlayedMessageIds] = useState<Set<string>>(new Set());

    const messagesEndRef = useRef<HTMLDivElement>(null);

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

        const unsubscribe = onSnapshot(messagesQuery,
            (querySnapshot) => {
                logger.debug(`ChatInterface: Message snapshot received ${querySnapshot.docs.length} docs for ${conversationId}.`);
                const fetchedMessages: Message[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    // --- Include audioUrl when creating Message object ---
                    if (data.role && data.content && data.timestamp) {
                        fetchedMessages.push({
                            id: doc.id,
                            role: data.role,
                            content: data.content,
                            timestamp: data.timestamp,
                            audioUrl: data.audioUrl // Add audioUrl here
                        } as Message);
                    } else {
                        logger.warn(`Skipping message doc ${doc.id} due to missing fields.`);
                    }
                });
                setMessages(fetchedMessages);
            },
            (err: FirestoreError) => {
                 logger.error(`Error listening to messages for conversation ${conversationId}:`, err);
                 setError(`Failed to load messages: ${err.message}`);
                 setTechnicalErrorDetails(null);
            }
        );
        return () => {
            logger.info(`ChatInterface: Cleaning up message listener for conversation: ${conversationId}`);
            unsubscribe();
            // Stop audio if component unmounts
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                setIsAudioPlaying(false);
            }
        };
    }, [conversationId]);


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
                    const newWaitingState = data.waitingForTTSEndSignal ?? false; // Default to false if undefined

                    setConversationStatus(newStatus);
                    setIsWaitingForSignal(newWaitingState); // Update local waiting state

                    if (newStatus === "error") {
                        // ... (keep existing error handling logic) ...
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
                        // Stop audio if conversation stops
                        if (audioPlayerRef.current) audioPlayerRef.current.pause();
                        setIsAudioPlaying(false);
                        setCurrentlyPlayingMsgId(null);
                    } else if (newStatus === "running") {
                         if (error || isStopped) {
                             setError(null); setTechnicalErrorDetails(null); setIsStopped(false);
                         }
                         logger.info(`Conversation ${conversationId} status changed to 'running'.`);
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
    // Added 'isStopped' and 'conversationStatus' to dependencies as they are read inside
    }, [conversationId, error, isStopped, conversationStatus]);


    // --- Effect 3: Auto-scroll ---
    useEffect(() => {
        if (conversationStatus === "running" && !isStopped) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages, conversationStatus, isStopped]);


    // --- Effect 4: Handle Automatic Audio Playback ---
    useEffect(() => {
        // Find the latest message with an audioUrl that hasn't been played yet
        const latestUnplayedAudioMessage = messages
            .slice() // Create a copy to avoid mutating original
            .reverse() // Check from latest to oldest
            .find(msg => msg.audioUrl && !playedMessageIds.has(msg.id));

        // Play only if:
        // - Found an unplayed message with audio
        // - No other audio is currently playing OR the found message is different from the one playing
        // - The conversation is running and waiting for the signal (meaning backend generated TTS)
        if (
            latestUnplayedAudioMessage &&
            (!isAudioPlaying || currentlyPlayingMsgId !== latestUnplayedAudioMessage.id) &&
            conversationStatus === "running" &&
            isWaitingForSignal // Check if backend is waiting for signal
        ) {
            const audioSrc = latestUnplayedAudioMessage.audioUrl;
            const messageIdToPlay = latestUnplayedAudioMessage.id;

            logger.info(`Attempting to play audio for message ${messageIdToPlay}: ${audioSrc}`);

            if (audioPlayerRef.current && audioSrc) {
                // Stop any currently playing audio first
                if (isAudioPlaying) {
                    audioPlayerRef.current.pause();
                    logger.debug("Paused previous audio.");
                }

                // Set the new source and play
                audioPlayerRef.current.src = audioSrc;
                audioPlayerRef.current.play()
                    .then(() => {
                        logger.info(`Audio playback started for message ${messageIdToPlay}.`);
                        setCurrentlyPlayingMsgId(messageIdToPlay);
                        setIsAudioPlaying(true);
                    })
                    .catch(err => {
                        logger.error(`Error playing audio for message ${messageIdToPlay}:`, err);
                        setIsAudioPlaying(false);
                        setCurrentlyPlayingMsgId(null);
                        // If playback fails, immediately signal backend to proceed? Or show error?
                        // For now, let's signal to avoid getting stuck. Consider adding UI feedback.
                        handleAudioEnd(messageIdToPlay);
                    });
            }
        }
    // Dependencies: messages array, playback state, conversation status, waiting status
    }, [messages, isAudioPlaying, currentlyPlayingMsgId, conversationStatus, isWaitingForSignal, playedMessageIds]);


    // --- Handler 4: Stop Conversation Button ---
    const handleStopConversation = useCallback(async () => {
        logger.debug(`handleStopConversation called. Conversation ID prop: ${conversationId}`);
        if (!conversationId || isStopping || isStopped) {
            logger.warn(`Stop conversation skipped. ID: ${conversationId}, Stopping: ${isStopping}, Stopped: ${isStopped}`);
            return;
        }
        setIsStopping(true);
        logger.info(`Attempting to stop conversation via button: ${conversationId}`);
        // Stop audio if playing
        if (audioPlayerRef.current) {
             audioPlayerRef.current.pause();
             setIsAudioPlaying(false);
             setCurrentlyPlayingMsgId(null);
        }
        try {
            const conversationRef = doc(db, "conversations", conversationId);
            await updateDoc(conversationRef, {
                status: "stopped",
                waitingForTTSEndSignal: false, // Ensure flag is cleared on manual stop
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
    }, [conversationId, isStopping, isStopped, onConversationStopped]);


    // --- Handler 5: Audio Playback Finished or Error ---
    const handleAudioEnd = useCallback(async (messageId: string) => {
        logger.info(`Audio ended or failed for message ${messageId}.`);
        setIsAudioPlaying(false);
        setCurrentlyPlayingMsgId(null);

        // Mark this message as played only if it successfully finished
        // Note: We might call this on error too, so check if needed.
        // For simplicity, mark as played to prevent retries/duplicate signals.
        setPlayedMessageIds(prev => new Set(prev).add(messageId));

        // --- Call requestNextTurn Cloud Function ---
        if (!requestNextTurnFunction) {
             logger.error("requestNextTurn function is not initialized. Cannot signal backend.");
             setError("Error: Cannot communicate with backend to continue conversation.");
             return;
        }
         if (!conversationId) {
             logger.error("Cannot call requestNextTurn without conversationId.");
             return;
         }
         // Only call if the backend is actually waiting
         if (!isWaitingForSignal) {
             logger.warn(`handleAudioEnd called for ${messageId}, but backend wasn't waiting for signal. Skipping call.`);
             return;
         }


        logger.info(`Calling requestNextTurn for conversation ${conversationId}...`);
        try {
            const result = await requestNextTurnFunction({ conversationId });
            logger.info("requestNextTurn successful:", result.data);
            // No need to update local state here, the status listener will catch
            // the change when the backend updates 'waitingForTTSEndSignal' to false.
        } catch (error) {
            logger.error("Error calling requestNextTurn function:", error);
            let errorMsg = "Failed to signal backend to continue.";
            if (error instanceof FunctionsError) {
                errorMsg = `Error signalling backend: ${error.message} (Code: ${error.code})`;
            } else if (error instanceof Error) {
                 errorMsg = `Error signalling backend: ${error.message}`;
            }
            setError(errorMsg); // Show error to user
            // Consider how to recover - maybe add a manual "continue" button?
        }
    }, [conversationId, isWaitingForSignal]); // Dependencies for the callback


    // --- Render Logic ---

    // Error Display
    if (error) {
        return (
             <Alert variant="destructive" className="w-full max-w-2xl mx-auto my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm break-words whitespace-pre-wrap">{error}</AlertDescription>
              <div className="mt-4 flex flex-col items-start space-y-3">
                  {technicalErrorDetails && (
                      <div className="w-full">
                          <Button variant="secondary" size="sm" onClick={() => setShowErrorDetails(!showErrorDetails)} className="text-xs h-6 px-2">
                              {showErrorDetails ? 'Hide Details' : 'Show Details'}
                              {showErrorDetails ? <ChevronUp className="ml-1 h-3 w-3"/> : <ChevronDown className="ml-1 h-3 w-3"/>}
                          </Button>
                          {showErrorDetails && <pre className="mt-1 text-xs whitespace-pre-wrap break-words overflow-auto max-h-32 rounded-md border bg-muted p-2 font-mono w-full min-w-0">{technicalErrorDetails}</pre>}
                      </div>
                  )}
                  {isStopped && onConversationStopped && (
                       <div><Button variant="outline" size="sm" onClick={onConversationStopped}>Go Back</Button></div>
                  )}
              </div>
            </Alert>
        );
    }
    // Initializing State Display
    if (!conversationId) return <div className="p-4 text-center text-muted-foreground">Initializing session...</div>;
    if (!conversationStatus && !error) return <div className="p-4 text-center text-muted-foreground">Loading conversation status...</div>;


    // Main Chat Interface Render
    return (
        <div className="flex flex-col h-[70vh] w-full max-w-3xl mx-auto p-4 bg-background rounded-lg shadow-md border overflow-hidden">
            {/* Header Section */}
            <div className="flex-shrink-0 flex justify-between items-center pb-2 mb-2 border-b">
                <h2 className="text-lg font-semibold">AI Conversation</h2>
                {/* Display Audio Status/Controls if audio is playing */}
                {isAudioPlaying && currentlyPlayingMsgId && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                         <Volume2 className="h-4 w-4 animate-pulse text-primary"/>
                         <span>Playing Audio...</span>
                         {/* Optional: Add manual pause/play button */}
                         {/* <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => audioPlayerRef.current?.pause()}>
                             <PauseCircle className="h-4 w-4" />
                         </Button> */}
                    </div>
                )}
                <Button variant="destructive" size="sm" onClick={handleStopConversation} disabled={isStopping || isStopped}>
                    {isStopped ? "Stopped" : (isStopping ? "Stopping..." : "Stop Conversation")}
                </Button>
            </div>

             {/* Scrollable Message Area */}
             <ScrollArea className="flex-grow min-h-0 mb-4 pr-4 -mr-4">
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${
                                msg.role === 'agentA' ? 'justify-start' :
                                msg.role === 'agentB' ? 'justify-end' :
                                'justify-center text-xs text-muted-foreground italic py-1'
                            }`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-[75%] whitespace-pre-wrap shadow-sm relative ${ // Added relative positioning
                                    msg.role === 'agentA' ? 'bg-muted text-foreground' :
                                    msg.role === 'agentB' ? 'bg-primary text-primary-foreground' :
                                    'bg-transparent px-0 py-0 shadow-none'
                                }`}
                            >
                                {msg.role === 'agentA' || msg.role === 'agentB' ? (
                                     <p className="text-xs font-bold mb-1">{msg.role === 'agentA' ? 'Agent A' : 'Agent B'}</p>
                                ) : null }
                                {msg.content}
                                {/* Add a small indicator if audio is playing for this message */}
                                {isAudioPlaying && currentlyPlayingMsgId === msg.id && (
                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                     {conversationStatus === "running" && messages.length === 0 && !isStopped && (
                        <div className="text-center text-muted-foreground text-sm p-4">Waiting for first message...</div>
                     )}
                      {isStopped && conversationStatus === "stopped" && !error && (
                         <div className="text-center text-muted-foreground text-sm p-4">Conversation stopped.</div>
                      )}
                       {isWaitingForSignal && !isAudioPlaying && conversationStatus === "running" && (
                         <div className="text-center text-primary text-sm p-2 animate-pulse">Waiting for audio to finish...</div>
                      )}
                     <div ref={messagesEndRef} />
                </div>
            </ScrollArea>

            {/* Hidden Audio Player */}
            <audio
                ref={audioPlayerRef}
                onEnded={() => {
                    if (currentlyPlayingMsgId) {
                        handleAudioEnd(currentlyPlayingMsgId);
                    }
                }}
                onError={(e) => {
                     logger.error("Audio playback error:", e);
                     if (currentlyPlayingMsgId) {
                         // Treat error as end to prevent getting stuck
                         handleAudioEnd(currentlyPlayingMsgId);
                     }
                }}
                // controls // Optional: Show controls for debugging
                style={{ display: 'none' }} // Keep hidden
            />
        </div>
    );
}
