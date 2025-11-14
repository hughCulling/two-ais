// src/components/chat/ChatInterface.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { db, functions as clientFunctions } from '@/lib/firebase/clientApp'; // Import client Functions instance
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { useOllamaAgent } from '@/hooks/useOllamaAgent';
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
import { AlertCircle, ChevronDown, ChevronUp, Volume2, Pause, Play, ScrollText, Maximize2, Minimize2 } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { getDatabase, ref as rtdbRef, off, onChildAdded, onChildChanged, onChildRemoved } from 'firebase/database';
import { useOptimizedScroll } from '@/hooks/useOptimizedScroll';
import { getVoiceById, findFallbackBrowserVoice } from '@/lib/tts_models';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import removeMarkdown from 'remove-markdown';
import { removeEmojis } from '@/lib/utils';

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
    language?: string; // Add language property
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

// Utility function to detect if browser TTS is likely to fail on mobile
function isMobileBrowserTTSUnsupported(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
    }
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /iphone|ipad|ipod|android|mobile/i.test(userAgent);
    
    if (!isMobile) {
        return false; // Desktop browsers are fine
    }
    
    // Only Firefox on mobile works reliably
    const isFirefox = /firefox|fxios/i.test(userAgent);
    
    if (isFirefox) {
        return false; // Firefox works on mobile
    }
    
    // All other mobile browsers (Safari, Chrome, Edge, Opera, etc.) have TTS issues
    // Return true to show warning for any mobile browser that isn't Firefox
    return true;
}

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
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [technicalErrorDetails, setTechnicalErrorDetails] = useState<string | null>(null);
    const [showErrorDetails, setShowErrorDetails] = useState(false);
    const [isStopping, setIsStopping] = useState(false);
    const [isStopped, setIsStopped] = useState(false);
    const { t } = useTranslation();
    
    // Enable local Ollama agent handling
    useOllamaAgent(conversationId, user?.uid || null);
    const [conversationStatus, setConversationStatus] = useState<ConversationData['status'] | null>(null);
    const [isWaitingForSignal, setIsWaitingForSignal] = useState<boolean>(false);
    const [streamingMessage, setStreamingMessage] = useState<StreamingMessage | null>(null);
    const [ttsError, setTtsError] = useState<string | null>(null);
    const [conversationData, setConversationData] = useState<ConversationData | null>(null);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isAudioPaused, setIsAudioPaused] = useState(false);
    const [isBrowserTTSActive, setIsBrowserTTSActive] = useState(false);
    const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);
    const [playedMessageIds, setPlayedMessageIds] = useState<Set<string>>(new Set());
    const [imageLoadStatus, setImageLoadStatus] = useState<{[key: string]: 'loading' | 'loaded' | 'error'}>({});
    const [pendingTtsMessage, setPendingTtsMessage] = useState<Message | null>(null);
    const [isAudioReady, setIsAudioReady] = useState(false);
    const [showMobileTTSWarning, setShowMobileTTSWarning] = useState(false);
    const [isTTSAutoScrollEnabled, setIsTTSAutoScrollEnabled] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const audioPlayerRef = useRef<HTMLAudioElement>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentlyPlayingMsgIdRef = useRef<string | null>(null);
    const messageRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());
    const paragraphRefsMap = useRef<Map<string, HTMLDivElement>>(new Map());
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const currentParagraphIndexRef = useRef<number>(0);
    const ttsChunkQueueRef = useRef<string[]>([]);
    const currentChunkIndexRef = useRef<number>(0);
    const paragraphIndicesRef = useRef<number[]>([]);
    currentlyPlayingMsgIdRef.current = currentlyPlayingMsgId;

    const scrollToBottom = useOptimizedScroll({ behavior: 'instant', block: 'nearest' });

    // --- Helper: Split text into paragraphs for TTS ---
    const splitIntoParagraphs = useCallback((text: string): string[] => {
        // Split by ANY newlines (single or double) for fine-grained auto-scroll
        // This creates more frequent scroll points so text doesn't go out of view
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        return paragraphs;
    }, []);

    // --- Helper: Split text into TTS-safe chunks ---
    const splitIntoTTSChunks = useCallback((text: string, maxLength: number = 4000): string[] => {
        if (text.length <= maxLength) {
            return [text];
        }

        const chunks: string[] = [];
        // Split by sentences (periods, exclamation marks, question marks followed by space or end)
        const sentences = text.match(/[^.!?]+[.!?]+[\s]?|[^.!?]+$/g) || [text];
        
        let currentChunk = '';
        
        for (const sentence of sentences) {
            // If adding this sentence would exceed the limit
            if (currentChunk.length + sentence.length > maxLength) {
                // If current chunk has content, save it
                if (currentChunk.length > 0) {
                    chunks.push(currentChunk.trim());
                    currentChunk = '';
                }
                
                // If the sentence itself is too long, split it by words
                if (sentence.length > maxLength) {
                    const words = sentence.split(/\s+/);
                    for (const word of words) {
                        if (currentChunk.length + word.length + 1 > maxLength) {
                            if (currentChunk.length > 0) {
                                chunks.push(currentChunk.trim());
                                currentChunk = '';
                            }
                        }
                        currentChunk += (currentChunk.length > 0 ? ' ' : '') + word;
                    }
                } else {
                    currentChunk = sentence;
                }
            } else {
                currentChunk += sentence;
            }
        }
        
        // Add any remaining content
        if (currentChunk.trim().length > 0) {
            chunks.push(currentChunk.trim());
        }
        
        return chunks.length > 0 ? chunks : [text.substring(0, maxLength)];
    }, []);

    // --- Audio Control Handlers ---
    const handleAudioEnd = useCallback(() => {
        const playedMsgId = currentlyPlayingMsgIdRef.current;
        if (!playedMsgId) {
            logger.debug("[TTS] handleAudioEnd called but no message was playing");
            return;
        }

        logger.info(`[TTS] Handling audio end for message ${playedMsgId.substring(0, 8)}...`);

        // Clear chunk queue
        ttsChunkQueueRef.current = [];
        currentChunkIndexRef.current = 0;

        // Clean up any existing utterance
        if (utteranceRef.current) {
            try {
                utteranceRef.current.onend = null;
                utteranceRef.current.onerror = null;
                utteranceRef.current = null;
            } catch (err) {
                logger.error("Error cleaning up utterance:", err);
            }
        }

        // For browser TTS, ensure speech synthesis is properly cancelled
        if (window.speechSynthesis) {
            try {
                window.speechSynthesis.cancel();
            } catch (err) {
                logger.error("Error cancelling speech synthesis:", err);
            }
        }

        // Mark message as played FIRST, before resetting audio state
        // This ensures the next message becomes visible before we try to play it
        setPlayedMessageIds(prev => {
            const newSet = new Set(prev);
            newSet.add(playedMsgId);
            return newSet;
        });

        // Reset all audio-related states
        setIsAudioPlaying(false);
        setIsAudioPaused(false);
        setCurrentlyPlayingMsgId(null);
        setIsBrowserTTSActive(false);
        setTtsError(null);
        setPendingTtsMessage(null);

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
        if (!isAudioPlaying) return;
        
        if (utteranceRef.current) {
            try {
                window.speechSynthesis.pause();
                setIsAudioPaused(true);
                setIsAudioPlaying(false); // Ensure playing state is updated
            } catch (err) {
                logger.error("TTS pause failed:", err);
                handleAudioEnd();
            }
        } else if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            setIsAudioPaused(true);
            setIsAudioPlaying(false);
        }
    }, [isAudioPlaying, handleAudioEnd]);

    const handleResumeAudio = useCallback(() => {
        if (!isAudioPaused) return;

        if (utteranceRef.current) {
            try {
                window.speechSynthesis.resume();
                setIsAudioPaused(false); // Update state to reflect playback has resumed
                setIsAudioPlaying(true); // Ensure playing state is set
            } catch (err) {
                logger.error("TTS resume failed:", err);
                handleAudioEnd();
            }
        } else if (audioPlayerRef.current) {
            audioPlayerRef.current.play().then(() => {
                setIsAudioPaused(false); // Update state to reflect playback has resumed
                setIsAudioPlaying(true);
            }).catch(err => {
                logger.error("Audio resume failed:", err);
                handleAudioEnd();
            });
        }
    }, [isAudioPaused, handleAudioEnd]);

    const toggleTTSAutoScroll = useCallback(() => {
        setIsTTSAutoScrollEnabled(prev => {
            const newValue = !prev;
            logger.info(`[TTS Auto-Scroll] Toggled to: ${newValue}`);
            return newValue;
        });
    }, []);

    const toggleFullscreen = useCallback(() => {
        setIsFullscreen(prev => {
            const newValue = !prev;
            logger.info(`[Fullscreen] Toggled to: ${newValue}`);
            
            // Update body class to hide header
            if (newValue) {
                document.body.classList.add('chat-fullscreen');
            } else {
                document.body.classList.remove('chat-fullscreen');
            }
            
            return newValue;
        });
    }, []);

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

    // --- Effect 2.5: Check for mobile TTS compatibility ---
    useEffect(() => {
        if (!conversationData?.ttsSettings?.enabled) {
            setShowMobileTTSWarning(false);
            return;
        }
        
        // Check if browser TTS is being used
        const isUsingBrowserTTS = 
            conversationData.ttsSettings.agentA?.provider === 'browser' || 
            conversationData.ttsSettings.agentB?.provider === 'browser';
        
        if (isUsingBrowserTTS && isMobileBrowserTTSUnsupported()) {
            setShowMobileTTSWarning(true);
            logger.warn('Browser TTS may not work on this mobile browser. Safari and Firefox are recommended.');
        } else {
            setShowMobileTTSWarning(false);
        }
    }, [conversationData]);

    // --- Effect 3: Auto-scroll ---
    const prevMessagesLength = useRef(messages.length);
    useEffect(() => {
        // Only auto-scroll when:
        // 1. Conversation is running and not stopped
        // 2. A new message was added (not just updated)
        // 3. We're not currently playing audio
        if (conversationStatus === "running" && !isStopped) {
            const isNewMessage = messages.length > prevMessagesLength.current;
            const lastMessage = messages[messages.length - 1];
            const isLastMessageFromAgent = lastMessage && (lastMessage.role === 'agentA' || lastMessage.role === 'agentB');
            
            // Scroll if:
            // - It's a new message and we're not playing audio, OR
            // - The last message is from the user, OR
            // - The last agent message has finished playing
            if ((isNewMessage && !isAudioPlaying) || 
                !isLastMessageFromAgent || 
                (isLastMessageFromAgent && playedMessageIds.has(lastMessage.id))) {
                scrollToBottom(messagesEndRef.current);
            }
        }
        prevMessagesLength.current = messages.length;
    }, [messages, conversationStatus, isStopped, isAudioPlaying, playedMessageIds, scrollToBottom]);

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
        
        // Clean up HTML5 audio player
        if (audioPlayerRef.current) {
             audioPlayerRef.current.pause();
             setIsAudioPlaying(false);
             setIsAudioPaused(false);
             setCurrentlyPlayingMsgId(null);
        }
        
        // Clean up browser TTS completely
        if (window.speechSynthesis) {
            try {
                window.speechSynthesis.cancel();
                // Small delay to ensure cancellation is complete
                setTimeout(() => {
                    if (window.speechSynthesis) {
                        window.speechSynthesis.cancel();
                    }
                }, 50);
            } catch (err) {
                logger.error("Error cancelling speech synthesis:", err);
            }
        }
        
        // Clear TTS utterance reference
        utteranceRef.current = null;
        
        // Reset all TTS-related state
        setIsAudioPlaying(false);
        setIsAudioPaused(false);
        setCurrentlyPlayingMsgId(null);
        setIsBrowserTTSActive(false);
        setTtsError(null);
        setPendingTtsMessage(null);
        setHasUserInteracted(false);
        setIsAudioReady(false);
        
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
        
        // Use onChildAdded and onChildChanged instead of onValue to reduce bandwidth
        const handleChildAdded = (snapshot: { key: string | null; val: () => Omit<StreamingMessage, 'id'> | null }) => {
            if (unsubscribed) return;
            const id = snapshot.key;
            const data = snapshot.val();
            if (!id || !data) return;
            
            const message: StreamingMessage = { id, ...data };
            logger.debug("RTDB streaming message added:", { id: message.id, status: message.status, contentLength: message.content?.length });
            setStreamingMessage(message);
        };
        
        const handleChildChanged = (snapshot: { key: string | null; val: () => Omit<StreamingMessage, 'id'> | null }) => {
            if (unsubscribed) return;
            const id = snapshot.key;
            const data = snapshot.val();
            if (!id || !data) return;
            
            const message: StreamingMessage = { id, ...data };
            // Only update if this is the current streaming message or it's complete
            setStreamingMessage(prev => {
                if (!prev || prev.id === message.id || message.status === 'complete') {
                    return message;
                }
                return prev;
            });
        };
        
        const handleChildRemoved = () => {
            if (unsubscribed) return;
            setStreamingMessage(null);
        };
        
        onChildAdded(messagesRef, handleChildAdded);
        onChildChanged(messagesRef, handleChildChanged);
        onChildRemoved(messagesRef, handleChildRemoved);
        
        return () => {
            unsubscribed = true;
            off(messagesRef, 'child_added', handleChildAdded);
            off(messagesRef, 'child_changed', handleChildChanged);
            off(messagesRef, 'child_removed', handleChildRemoved);
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

        // If audio is currently playing, show up to and including the currently playing message
        if (isAudioPlaying && currentlyPlayingMsgId) {
            const currentlyPlayingIndex = mergedMessages.findIndex(msg => msg.id === currentlyPlayingMsgId);
            if (currentlyPlayingIndex !== -1) {
                return mergedMessages.slice(0, currentlyPlayingIndex + 1);
            }
        }

        // Find the first agent message that has TTS enabled but hasn't been played yet
        const firstUnplayedTTSMessageIndex = mergedMessages.findIndex(msg => {
            // Only consider agent messages
            if (msg.role !== 'agentA' && msg.role !== 'agentB') return false;
            
            // Check if this message has already been played
            if (playedMessageIds.has(msg.id)) return false;
            
            // Check if TTS is enabled for this agent
            const agentTTSSettings = conversationData?.ttsSettings?.[msg.role];
            const hasTTS = agentTTSSettings?.provider && agentTTSSettings.provider !== 'none';
            
            // This is an unplayed message with TTS
            return hasTTS;
        });

        // If we found an unplayed TTS message, show up to and including it
        // This allows the TTS system to pick it up for playback
        if (firstUnplayedTTSMessageIndex !== -1) {
            return mergedMessages.slice(0, firstUnplayedTTSMessageIndex + 1);
        }

        // If all TTS messages have been played (or no TTS messages exist), show all messages
        return mergedMessages;
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
        logger.debug('[TTS] Audio playback effect triggered');
        
        // Early return if audio is already playing - CRITICAL to prevent interruptions
        if (isAudioPlaying || isAudioPaused || isBrowserTTSActive) {
            logger.debug('[TTS] Effect skipped - audio already playing or paused');
            return;
        }

        if (!hasUserInteracted || !conversationData?.ttsSettings?.enabled || isStopped || conversationStatus === 'stopped') {
            logger.debug('[TTS] Effect skipped - preconditions not met');
            return;
        }

        // Additional guard: Don't start new playback if browser TTS is already speaking
        if (typeof window !== 'undefined' && window.speechSynthesis?.speaking) {
            logger.debug('[TTS] Effect skipped - speechSynthesis already speaking');
            return;
        }

        const nextMsg = visibleMessages.find(msg => {
            if (playedMessageIds.has(msg.id)) return false;
            if (msg.role !== 'agentA' && msg.role !== 'agentB') return false;
            if (msg.imageUrl && imageLoadStatus[msg.id] !== 'loaded' && imageLoadStatus[msg.id] !== 'error') return false;
            return true;
        });

        if (!nextMsg) return;

        logger.debug(`[TTS] Found next message to play: ${nextMsg.id.substring(0, 8)}..., streaming: ${nextMsg.isStreaming}, role: ${nextMsg.role}`);

        // If message is still streaming, store it for later playback
        if (nextMsg.isStreaming) {
            setPendingTtsMessage(nextMsg);
            setIsAudioReady(false);
            return;
        }

        // If we have a pending message but it's not the current one, clear it
        if (pendingTtsMessage && pendingTtsMessage.id !== nextMsg.id) {
            setPendingTtsMessage(null);
        }

        // Mark audio as ready when we have a complete message
        if (!isAudioReady) {
            setIsAudioReady(true);
        }

        const agentRole = nextMsg.role as 'agentA' | 'agentB';
        const ttsConfig = conversationData.ttsSettings?.[agentRole];

        if (ttsConfig?.provider === 'browser') {
            const voiceInfo = getVoiceById(ttsConfig.provider, ttsConfig.voice || '');
            let voice = window.speechSynthesis.getVoices().find(v => v.voiceURI === voiceInfo?.providerVoiceId);
            
            // If the selected voice is not found or not compatible, try to find a fallback
            if (!voice) {
                logger.warn(`Browser voice not found for ID: ${ttsConfig.voice}, trying fallback`);
                // Try to find a fallback voice based on the conversation language
                const fallbackVoice = findFallbackBrowserVoice(conversationData.language || 'en');
                if (fallbackVoice) {
                    voice = fallbackVoice;
                    logger.info(`Using fallback voice: ${fallbackVoice.name} (${fallbackVoice.lang})`);
                } else {
                    logger.error('No compatible browser voice found');
                    handleAudioEnd();
                    return;
                }
            }

            const cleanedContent = removeEmojis(removeMarkdown(nextMsg.content));
            
            // Split into paragraphs first for better auto-scroll
            const paragraphs = splitIntoParagraphs(cleanedContent);
            
            // Then split each paragraph into TTS-safe chunks if needed
            const MAX_TTS_LENGTH = 4000;
            const chunks: string[] = [];
            const paragraphIndices: number[] = []; // Track which paragraph each chunk belongs to
            
            paragraphs.forEach((paragraph, paragraphIndex) => {
                const paragraphChunks = splitIntoTTSChunks(paragraph, MAX_TTS_LENGTH);
                paragraphChunks.forEach(chunk => {
                    chunks.push(chunk);
                    paragraphIndices.push(paragraphIndex);
                });
            });
            
            if (chunks.length > 1) {
                logger.info(`[TTS] Message ${nextMsg.id.substring(0, 8)}... split into ${paragraphs.length} paragraphs, ${chunks.length} total chunks for browser TTS`);
            }
            
            // Store chunks and paragraph info in queue
            ttsChunkQueueRef.current = chunks;
            paragraphIndicesRef.current = paragraphIndices;
            currentChunkIndexRef.current = 0;
            currentParagraphIndexRef.current = 0;
            
            // Create utterance for first chunk
            const utterance = new SpeechSynthesisUtterance(chunks[0]);
            
            // Try to assign the voice, with fallback if it fails
            try {
                utterance.voice = voice;
            } catch (error) {
                logger.warn(`Failed to assign voice ${voice.name}, trying fallback:`, error);
                const fallbackVoice = findFallbackBrowserVoice(conversationData.language || 'en');
                if (fallbackVoice) {
                    utterance.voice = fallbackVoice;
                    logger.info(`Using fallback voice: ${fallbackVoice.name} (${fallbackVoice.lang})`);
                } else {
                    logger.error('No compatible fallback voice found');
                    handleAudioEnd();
                    return;
                }
            }
            utterance.onstart = () => {
                const chunkNum = currentChunkIndexRef.current + 1;
                const totalChunks = ttsChunkQueueRef.current.length;
                const currentChunk = ttsChunkQueueRef.current[currentChunkIndexRef.current];
                logger.info(`[TTS] Started playing message ${nextMsg.id.substring(0, 8)}... chunk ${chunkNum}/${totalChunks} (${currentChunk.length} chars)`);
                
                if (chunkNum === 1) {
                    // Only set these on the first chunk
                    setCurrentlyPlayingMsgId(nextMsg.id);
                    setIsAudioPlaying(true);
                    setIsBrowserTTSActive(true);
                    setPendingTtsMessage(null);
                    
                    // Reset paragraph index for new message
                    currentParagraphIndexRef.current = -1;
                }
                
                // Auto-scroll to paragraph when TTS starts (for every chunk)
                // Use requestAnimationFrame to ensure DOM is ready
                if (isTTSAutoScrollEnabled) {
                    requestAnimationFrame(() => {
                        const paragraphIndex = paragraphIndicesRef.current[currentChunkIndexRef.current] || 0;
                        const paragraphKey = `${nextMsg.id}-p${paragraphIndex}`;
                        
                        logger.info(`[TTS Auto-Scroll] Chunk ${chunkNum}/${totalChunks}, Paragraph ${paragraphIndex}, Last paragraph: ${currentParagraphIndexRef.current}`);
                        logger.info(`[TTS Auto-Scroll] Message ID: ${nextMsg.id.substring(0, 8)}..., Looking for key: ${paragraphKey}`);
                        
                        // Check if this is a new paragraph (different from last one)
                        const isNewParagraph = paragraphIndex !== currentParagraphIndexRef.current;
                        logger.info(`[TTS Auto-Scroll] Is new paragraph? ${isNewParagraph}`);
                        
                        if (isNewParagraph && paragraphRefsMap.current.has(paragraphKey)) {
                            const paragraphElement = paragraphRefsMap.current.get(paragraphKey);
                            const scrollContainer = scrollViewportRef.current?.closest('[data-radix-scroll-area-viewport]') as HTMLElement;
                            
                            if (paragraphElement && scrollContainer) {
                                logger.info(`[TTS Auto-Scroll] ✓ Scrolling to paragraph ${paragraphIndex} of message ${nextMsg.id.substring(0, 8)}...`);
                                
                                // Get the position of the paragraph relative to the scroll container
                                const containerRect = scrollContainer.getBoundingClientRect();
                                const paragraphRect = paragraphElement.getBoundingClientRect();
                                
                                // Calculate how much to scroll to put the paragraph at the top
                                // Use minimal padding (20px) for small screens
                                const currentScroll = scrollContainer.scrollTop;
                                const paragraphRelativeTop = paragraphRect.top - containerRect.top;
                                const targetScroll = currentScroll + paragraphRelativeTop - 20;
                                
                                logger.debug(`[TTS Auto-Scroll] Container height: ${containerRect.height}px, Current scroll: ${currentScroll}, Target: ${targetScroll}`);
                                
                                scrollContainer.scrollTo({
                                    top: Math.max(0, targetScroll),
                                    behavior: 'smooth'
                                });
                                
                                currentParagraphIndexRef.current = paragraphIndex;
                            } else {
                                logger.warn(`[TTS Auto-Scroll] ✗ Paragraph element or scroll container is null for ${paragraphKey}`);
                                if (!paragraphElement) logger.warn(`  - Missing paragraph element`);
                                if (!scrollContainer) logger.warn(`  - Missing scroll container`);
                            }
                        } else if (!isNewParagraph) {
                            logger.debug(`[TTS Auto-Scroll] Still on same paragraph ${paragraphIndex}, not scrolling`);
                        } else {
                            logger.warn(`[TTS Auto-Scroll] No ref found for paragraph ${paragraphKey}`);
                        }
                    });
                } else {
                    logger.debug(`[TTS Auto-Scroll] Auto-scroll is disabled`);
                }
            };
            utterance.onend = () => {
                currentChunkIndexRef.current++;
                const hasMoreChunks = currentChunkIndexRef.current < ttsChunkQueueRef.current.length;
                
                if (hasMoreChunks) {
                    // Play next chunk
                    const nextChunk = ttsChunkQueueRef.current[currentChunkIndexRef.current];
                    logger.info(`[TTS] Playing next chunk ${currentChunkIndexRef.current + 1}/${ttsChunkQueueRef.current.length}`);
                    
                    const nextUtterance = new SpeechSynthesisUtterance(nextChunk);
                    nextUtterance.voice = voice;
                    nextUtterance.onstart = utterance.onstart;
                    nextUtterance.onend = utterance.onend;
                    nextUtterance.onerror = utterance.onerror;
                    
                    utteranceRef.current = nextUtterance;
                    
                    try {
                        window.speechSynthesis.speak(nextUtterance);
                    } catch (err) {
                        logger.error('[TTS] Error speaking next chunk:', err);
                        setIsBrowserTTSActive(false);
                        handleAudioEnd();
                    }
                } else {
                    // All chunks complete
                    logger.info(`[TTS] Finished playing all ${ttsChunkQueueRef.current.length} chunks for message ${nextMsg.id.substring(0, 8)}...`);
                    ttsChunkQueueRef.current = [];
                    currentChunkIndexRef.current = 0;
                    setIsBrowserTTSActive(false);
                    handleAudioEnd();
                }
            };
            utterance.onerror = (event) => {
                // Ignore 'canceled' and 'interrupted' errors as they're expected during normal operation
                // Also ignore 'synthesis-failed' if it follows an interruption (common in Edge)
                if (event.error === 'canceled' || event.error === 'interrupted') {
                    logger.debug(`[TTS] Speech synthesis ${event.error} for message ${nextMsg.id.substring(0, 8)}... (expected)`);
                } else if (event.error === 'synthesis-failed') {
                    // Only show error if this is a genuine failure, not a cascade from interruption
                    logger.warn(`[TTS] Speech synthesis failed for message ${nextMsg.id.substring(0, 8)}... - may be due to rapid playback attempts`);
                    // Don't set TTS error for synthesis-failed as it's often a transient issue
                } else {
                    logger.error(`[TTS] Speech synthesis error for message ${nextMsg.id.substring(0, 8)}...:`, event.error);
                    setTtsError(`Speech synthesis failed: ${event.error}`);
                }
                setIsBrowserTTSActive(false);
                handleAudioEnd();
            };

            // Store the current utterance reference before speaking
            utteranceRef.current = utterance;
            
            // Final safety check before starting speech
            if (window.speechSynthesis.speaking) {
                logger.warn('[TTS] speechSynthesis.speaking is true despite guards - this should not happen');
                // Don't cancel here - let the guards prevent this situation
                return;
            }
            
            try {
                logger.debug(`[TTS] Calling speechSynthesis.speak() for message ${nextMsg.id.substring(0, 8)}...`);
                window.speechSynthesis.speak(utterance);
            } catch (err) {
                logger.error('[TTS] Error in speechSynthesis.speak():', err);
                handleAudioEnd();
            }

        } else if (nextMsg.audioUrl && audioPlayerRef.current) {
            logger.info(`[Audio] Starting playback for message ${nextMsg.id.substring(0, 8)}...`);
            audioPlayerRef.current.src = nextMsg.audioUrl;
            audioPlayerRef.current.play()
                .then(() => {
                    logger.info(`[Audio] Successfully started playing message ${nextMsg.id.substring(0, 8)}...`);
                    setCurrentlyPlayingMsgId(nextMsg.id);
                    setIsAudioPlaying(true);
                    setPendingTtsMessage(null); // Clear pending message when playback starts
                })
                .catch(err => {
                    logger.error(`[Audio] Playback failed for message ${nextMsg.id.substring(0, 8)}...:`, err);
                    handleAudioEnd();
                });
        }
    }, [visibleMessages, playedMessageIds, hasUserInteracted, isAudioPaused, isAudioPlaying, 
        conversationData, handleAudioEnd, imageLoadStatus, pendingTtsMessage, isAudioReady, isStopped, conversationStatus, isBrowserTTSActive, splitIntoTTSChunks]);

    // Add effect to handle pending messages when they become ready
    useEffect(() => {
        if (pendingTtsMessage && !pendingTtsMessage.isStreaming && isAudioReady) {
            // Small delay to ensure any previous TTS is fully cancelled
            const timer = setTimeout(() => {
                setHasUserInteracted(false);
                setTimeout(() => setHasUserInteracted(true), 50);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [pendingTtsMessage, pendingTtsMessage?.isStreaming, isAudioReady]);

    // --- Effect 6: Component Cleanup ---
    useEffect(() => {
        return () => {
            // Cleanup function that runs when component unmounts
            logger.info('ChatInterface: Component unmounting, cleaning up TTS and audio');
            
            // Clear chunk queue
            ttsChunkQueueRef.current = [];
            currentChunkIndexRef.current = 0;
            
            // Stop HTML5 audio
            if (audioPlayerRef.current) {
                audioPlayerRef.current.pause();
                audioPlayerRef.current.currentTime = 0;
            }
            
            // Stop browser TTS completely
            if (window.speechSynthesis) {
                try {
                    window.speechSynthesis.cancel();
                    // Force stop any remaining speech by canceling again
                    setTimeout(() => {
                        if (window.speechSynthesis) {
                            window.speechSynthesis.cancel();
                        }
                    }, 50);
                } catch (err) {
                    logger.error("Error during TTS cleanup on unmount:", err);
                }
            }
            
            // Clear utterance reference
            utteranceRef.current = null;
            
            // Remove fullscreen class from body
            document.body.classList.remove('chat-fullscreen');
        };
    }, []); // Empty dependency array - runs only on unmount

    // --- Effect 7: Handle Escape key for fullscreen ---
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isFullscreen) {
                setIsFullscreen(false);
                document.body.classList.remove('chat-fullscreen');
                logger.info('[Fullscreen] Exited via Escape key');
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isFullscreen]);

    // --- Render Logic ---

    if (error) {
        return (
             <Alert variant="destructive" className="w-full max-w-2xl mx-auto my-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription className="text-sm break-words whitespace-pre-wrap w-full min-w-0">{error}</AlertDescription>
              <div className="mt-4 flex flex-col items-start space-y-3 w-full col-span-full">
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
                          {showErrorDetails && <pre className="mt-1 text-xs whitespace-pre-wrap break-words overflow-auto max-h-32 rounded-md border bg-muted p-2 font-mono w-full min-w-0" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{technicalErrorDetails}</pre>}
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


    const isWaitingForMessage = pendingTtsMessage?.isStreaming && !isAudioPlaying;

    return (
        <div className={`flex flex-col w-full mx-auto bg-background overflow-hidden ${
            isFullscreen 
                ? 'fixed inset-0 z-50 rounded-none shadow-none border-0' 
                : 'h-[70vh] max-w-3xl p-4 rounded-lg shadow-md border'
        }`}>
            {/* Header Section */}
            <div className={`flex-shrink-0 flex justify-between items-center pb-2 mb-2 border-b ${isFullscreen ? 'max-w-3xl mx-auto w-full px-4 pt-4' : ''}`}>
                <h2 className="text-lg font-semibold">{t?.main?.aiConversation}</h2>
                {(isAudioPlaying || isAudioPaused || isWaitingForMessage) && currentlyPlayingMsgId && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground" role="status" aria-live="polite">
                        <Volume2 className={`h-4 w-4 ${isAudioPlaying ? 'animate-pulse text-primary' : 'text-muted-foreground'}`} aria-hidden="true"/>
                        <span>
                            {isWaitingForMessage ? 'Waiting for message...' : 
                             isAudioPaused ? t?.chatControls.audioStatus.paused : 
                             t?.chatControls.audioStatus.playing}
                        </span>
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
                    {isStopped ? t?.chatControls.stopped : (isStopping ? t?.chatControls.stopping : t?.chatControls.stopConversation)}
                </Button>
                <div id="stop-conversation-description" className="sr-only">
                    Click to stop the current AI conversation. This will prevent further messages from being generated.
                </div>
            </div>

            {/* Mobile TTS Warning Banner */}
            {showMobileTTSWarning && (
                <div className={`bg-orange-50 border-l-4 border-orange-400 p-4 mt-4 rounded-md ${isFullscreen ? 'max-w-3xl mx-auto' : 'mx-4'}`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-orange-700">
                                <strong>Browser TTS Not Supported:</strong> Text-to-speech does not work on this mobile browser.
                            </p>
                            <p className="text-xs text-orange-800 dark:text-orange-200 mt-1">
                                For audio playback on mobile, please use <strong>Firefox</strong>. Safari, Chrome, Edge, and Opera have unreliable or no TTS support on mobile devices.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* TTS Error Banner */}
            {ttsError && (
                <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-md ${isFullscreen ? 'max-w-3xl mx-auto' : 'mx-4'}`}>
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
                    const isUsingBrowserTTS = conversationData?.ttsSettings?.agentA?.provider === 'browser' || 
                                           conversationData?.ttsSettings?.agentB?.provider === 'browser';
                    return hasUnplayedAudio || isWaitingForSignal || isUsingBrowserTTS;
                })() && (
                <div className={`bg-blue-50 border-l-4 border-blue-400 p-4 mt-4 rounded-md ${isFullscreen ? 'max-w-3xl mx-auto' : 'mx-4'}`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                <strong>{t?.chatControls.audioStatus.ready.title}:</strong> {t?.chatControls.audioStatus.ready.description}
                            </p>
                            <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                                {t?.chatControls.audioStatus.ready.browserNote}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Scrollable Message Area */}
            <ScrollArea className="flex-grow min-h-0 mb-4 pr-4 -mr-4" style={{ contain: 'layout style paint' }}>
               <div className={`space-y-4 ${isFullscreen ? 'max-w-3xl mx-auto px-4' : ''}`} ref={scrollViewportRef}>
                    {visibleMessages.map((msg) => (
                        <div
                            key={msg.id}
                            ref={(el) => {
                                if (el && (msg.role === 'agentA' || msg.role === 'agentB')) {
                                    messageRefsMap.current.set(msg.id, el);
                                    logger.debug(`[TTS Auto-Scroll] Set ref for message ${msg.id.substring(0, 8)}...`);
                                } else if (!el && messageRefsMap.current.has(msg.id)) {
                                    messageRefsMap.current.delete(msg.id);
                                    logger.debug(`[TTS Auto-Scroll] Removed ref for message ${msg.id.substring(0, 8)}...`);
                                }
                            }}
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
      <div>
        {msg.content.split(/\n+/).map((paragraph, index) => {
          const paragraphKey = `${msg.id}-p${index}`;
          return (
            <div
              key={paragraphKey}
              ref={(el) => {
                if (el) {
                  paragraphRefsMap.current.set(paragraphKey, el as HTMLDivElement);
                  logger.debug(`[TTS Auto-Scroll] Set ref for paragraph ${paragraphKey}`);
                } else {
                  paragraphRefsMap.current.delete(paragraphKey);
                }
              }}
              className="mb-4"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {paragraph}
              </ReactMarkdown>
            </div>
          );
        })}
      </div>
    </>
  ) : (
    msg.content
  )}
                                {msg.isStreaming && (
                                  <span className="ml-1 animate-pulse" aria-hidden="true">▍</span>
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

            {/* Controls Footer - Always Visible */}
            <div className={`flex-shrink-0 pt-2 border-t mt-4 ${isFullscreen ? 'max-w-3xl mx-auto w-full px-4' : ''}`}>
                <div className="flex items-center gap-2 justify-center">
                    {/* Pause/Resume Button - Only enabled when audio is playing */}
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
                    ) : (
                        <Button 
                            variant="ghost" 
                            size="icon"
                            disabled
                            className="h-12 w-12 rounded-full opacity-50 cursor-not-allowed"
                            aria-label="No audio playing"
                        >
                            <Play className="h-6 w-6" />
                        </Button>
                    )}
                    
                    {/* Auto-scroll Toggle - Always enabled */}
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={toggleTTSAutoScroll}
                        className={`h-12 w-12 rounded-full ${isTTSAutoScrollEnabled ? 'text-primary' : 'text-muted-foreground'}`}
                        aria-label={isTTSAutoScrollEnabled ? t?.chatControls?.autoScroll?.disable : t?.chatControls?.autoScroll?.enable}
                        title={isTTSAutoScrollEnabled ? t?.chatControls?.autoScroll?.enabled : t?.chatControls?.autoScroll?.disabled}
                    >
                        <ScrollText className="h-6 w-6" />
                    </Button>
                    
                    {/* Fullscreen Toggle - Always enabled */}
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={toggleFullscreen}
                        className="h-12 w-12 rounded-full"
                        aria-label={isFullscreen ? t?.chatControls?.fullscreen?.exit : t?.chatControls?.fullscreen?.enter}
                        title={isFullscreen ? t?.chatControls?.fullscreen?.exitLabel : t?.chatControls?.fullscreen?.enterLabel}
                    >
                        {isFullscreen ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
                    </Button>
                </div>
            </div>

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